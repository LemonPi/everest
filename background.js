"use strict";
var App = {
	start: function(stream) {
		App.stream = stream;
		var listener;
		App.video.addEventListener('canplay', listener = function() {
			App.video.removeEventListener('canplay', listener);
			setTimeout(function() {
				App.video.play();
				//App.canvas.style.display = 'inline';
				//App.info.style.display = 'none';
				//App.canvas.width = App.video.videoWidth;
				//App.canvas.height = App.video.videoHeight;
				App.backCanvas.width = App.video.videoWidth / 4;
				App.backCanvas.height = App.video.videoHeight / 4;
				App.backContext = App.backCanvas.getContext('2d');
			
				var w = 300 / 4 * 0.8,
					h = 270 / 4 * 0.8;
			
				App.comp = [{
					x: (App.video.videoWidth / 4 - w) / 2,
					y: (App.video.videoHeight / 4 - h) / 2,
					width: w, 
					height: h,
				}];
				App.mywidth = -1;
			
				App.drawToCanvas();
			}, 500);
		}, true);
		
		var domURL = window.URL || window.webkitURL;
		App.video.src = domURL ? domURL.createObjectURL(stream) : stream;
	},
	denied: function() {
		//App.info.innerHTML = 'Camera access denied!<br>Please reload and try again.';
		console.log("Denied");
		window.open("popup.html");
	},
	error: function(e) {
		if (e) {
			console.error(e);
		}
		//App.info.innerHTML = 'Please go to about:flags in Google Chrome and enable the &quot;MediaStream&quot; flag.';
	},
	drawToCanvas: function() {
		if (!App.running) return;
		//requestAnimationFrame(App.drawToCanvas);
		setTimeout(App.drawToCanvas, 500);
		
		var video = App.video,
			ctx = App.context,
			backCtx = App.backContext,
			m = 4,
			w = 4,
			i,
			comp;
		
		//ctx.drawImage(video, 0, 0, App.canvas.width, App.canvas.height);
		
		backCtx.drawImage(video, 0, 0, App.backCanvas.width, App.backCanvas.height);
		
		comp = ccv.detect_objects(App.ccv = App.ccv || {
			canvas: App.backCanvas,
			cascade: cascade,
			interval: 4,
			min_neighbors: 1
		});
		
		if (comp.length) {
			App.comp = comp;
		}
		
		//for (i = App.comp.length; i--; ) {
		//	ctx.drawImage(App.glasses, (App.comp[i].x - w / 2) * m, (App.comp[i].y - w / 2) * m, (App.comp[i].width + w) * m, (App.comp[i].height + w) * m);
		//}
		if (App.comp.length) {
			if (App.mywidth == -1) App.mywidth = App.comp[0].width;
			var scale = 2 - (App.comp[0].width/App.mywidth) + (App.initZoom - 1);
			if (Math.abs(App.lastScale - scale) > 0.05) {
				//console.log(scale);
				//document.body.style.transform = scale < 1? "": "scale(" + scale + ")";
				try {
					chrome.tabs.setZoom(Math.max(App.initZoom, scale));
				} catch (e) {}
				App.lastScale = scale;
			}
		}
	}
};

App.running = false;
App.lastScale = 1;

App.init = function() {
	chrome.tabs.getZoom(function(zoom) {
		App.initZoom = zoom;
		App.init_real();
	});
}

App.init_real = function() {
	if (App.running) return;
	App.running = true;
	App.hasInit = true;
	App.video = document.createElement('video');
	App.backCanvas = document.createElement('canvas');
	//App.canvas = document.querySelector('#output');
	//App.canvas.style.display = 'none';
	//App.context = App.canvas.getContext('2d');
	//App.info = document.querySelector('#info');
	
	navigator.getUserMedia_ = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	try {
		navigator.getUserMedia_({
			video: true,
			audio: false
		}, App.start, App.denied);
	} catch (e) {
		try {
			navigator.getUserMedia_('video', App.start, App.denied);
		} catch (e) {
			App.error(e);
		}
	}
	
	App.video.loop = App.video.muted = true;
	App.video.load();
};

App.stop = function() {
	console.log("STOP IT");
	if (!App.running) return;
	App.running = false;
	if (App.stream) App.stream.stop();
}

chrome.commands.onCommand.addListener(function(command) {
	App.mywidth=App.comp[0].width;
});

chrome.browserAction.onClicked.addListener(function(tab) {
	if (App.running) {
		localStorage["enabled"] = false;
		window.location.reload();
	} else {
		localStorage["enabled"] = true;
		App.init();
	}
});

window.addEventListener("load", function() {
	if (localStorage["enabled"] == "true") {
		App.init();
	}
}, false);
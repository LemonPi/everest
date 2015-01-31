var App = {};

App.start = function() {
	chrome.extension.getBackgroundPage().location.reload();
	window.close();
}

App.denied = function() {
	console.log("Denied!");
}
App.init = function() {
	
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
			console.log(e);
		}
	}
};

App.init();
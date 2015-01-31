chrome.commands.onCommand.addListener(function(command) {
	console.log('Command:', command);
	try {
		chrome.tabs.getZoom(function(a) {chrome.tabs.setZoom(a + 0.2)});
	} catch (e) {
		console.log(e);
	}
});
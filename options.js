"use strict";
var jitter, jitterText, sample, sampleText;
function update() {
	jitterText.textContent = jitter.value + " percent";
	sampleText.textContent = sample.value + " milliseconds";
	localStorage["threshold"] = jitter.value;
	localStorage["cycletime"] = sample.value;
}
function loadHandler() {
	jitter = document.getElementById("jitter-tolerance");
	jitterText = document.getElementById("jitter-tolerance-label");
	sample = document.getElementById("sample-interval");
	sampleText = document.getElementById("sample-interval-label");
	jitter.onchange = update;
	sample.onchange = update;
	if (localStorage["threshold"]) jitter.value = localStorage["threshold"];
	if (localStorage["cycletime"]) sample.value = localStorage["cycletime"];
	update();
}
loadHandler();
"use strict";

var socket = io();
var game_area;
var selectedCanvas;

function startGame() {
	game_area = new gameArea();
	selectedCanvas = game_area;
}

// --- Events listeners --- //
socket.on('message', function(data) {
	console.log(data);
});
window.addEventListener('keydown', function(e) {
	selectedCanvas.keyDown(e);
});
window.addEventListener('keyup', function(e) {
	selectedCanvas.keyUp(e);
});
window.addEventListener('mousedown', function(e) {
	if (e.button == 0) {
		selectedCanvas.lMouseDown(e);
	}
});
window.addEventListener('mouseup', function(e) {
	if (e.button == 0) {
		selectedCanvas.lMouseUp(e);
	}
});
window.addEventListener('mousemove', function(e) {
	selectedCanvas.mouseMove(e);
});
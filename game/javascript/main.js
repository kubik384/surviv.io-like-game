"use strict";

var socket = io();
var selectedCanvas;

function request_data() {
	socket.emit('new_player');
}

// --- Events listeners --- //

socket.on('message', function(data) {
	console.log(data);
});
socket.on('game_state', function(game_state, myCharacterID) {
	selectedCanvas = new gameArea(game_state, myCharacterID);
	socket.on('game_update', function(game_state_update) {
		selectedCanvas.update_game(game_state_update);
	});
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
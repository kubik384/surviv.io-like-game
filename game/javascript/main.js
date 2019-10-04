"use strict";

var socket = io();
var selectedCanvas;
var latency;

//Requests game_state from server
function request_data() {
	socket.emit('new_player');
}
//On server respond with game_state data call start_game
socket.on('game_state', function(game_state, myCharacterID) {
	start_game(game_state, myCharacterID);
});

function start_game(game_state, myCharacterID) {
	selectedCanvas = new gameArea(game_state, myCharacterID);
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
	socket.on('game_update', selectedCanvas.update_game.bind(selectedCanvas));
	
	socket.on('message', function(data) {
		console.log(data);
	});

	socket.on('pong', function(ms) {
		latency = ms;
		console.log('Player ping: ' + latency);
	});
}
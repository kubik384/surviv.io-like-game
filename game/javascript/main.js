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
	var canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.insertBefore(canvas, document.body.childNodes[0]);

	selectedCanvas = new gameArea(canvas);
	selectedCanvas.addInterface();
	selectedCanvas.addPlayers(game_state.players);
	selectedCanvas.addBullets(game_state.bullets);
	selectedCanvas.addItems(game_state.items);
	selectedCanvas.startGame(myCharacterID);

	//Event handlers
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
		selectedCanvas.latencyText.text = 'Ping: ' + ms + 'ms';
	});
}
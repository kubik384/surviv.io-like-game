var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
//var gameBoard = new gameArea();
app.set('port', 8080);
app.use('/game', express.static(__dirname + '/game'));// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/game', 'index.html'));
});

// Starts the server.
server.listen(8080, function() {
	console.log('Starting server on port 8080');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
	socket.on('new_player', function() {
		//gameBoard.addPlayer(socket.id);
	});
	
	socket.on('player_input', function(input) {
	  	//gameBoard.updatePlayer(socket.id, input);
	});
});
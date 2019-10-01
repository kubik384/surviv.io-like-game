"use strict"

class game_object {
	constructor (x, y) {
		this.x = x;
		this.y = y;
	}

	setXY (x,y) {
		this.x = x;
		this.y = y;
	}
}

class tree extends game_object {
	constructor (x,y) {
		super(x,y);
	}
}

class barrel extends game_object {
	constructor (x,y) {
		super(x,y);
	}
}

class item extends game_object {
	constructor (x, y) {
		super(x, y);
	}

	update (ctx) {

	}

	// Checks if the passed x,y values are in range of the item (to be picked up)
	inRange (x,y) {
		var maxRange = 50;
		return ((Math.abs(x - this.x) < maxRange) && (Math.abs(y - this.y) < maxRange));
	}
}

class weapon extends item {
	constructor (x, y, damage, recoil, cooldown, angle) {
		super(x,y);
		this.damage = damage;
		this.recoil = recoil;
		this.frameCdLeft = 0;
		this.frameCd = cooldown;
		this.dir = angle;
	}

	update (ctx) {
		if (!this.isReady()) {
			this.frameCdLeft -= 1;
		}
	}

	setXY (x,y) {
		this.x = x;
		this.y = y;
	}

	pickUp (angle = 0) {
		this.dir = angle;
	}

	isReady () {
		return this.frameCdLeft < 1;
	}
}


class ak47 extends weapon {
	constructor (x, y, angle = 0) {
		super(x,y,10,3,6,angle);
	}

	use () {
		if (this.isReady()) {
			this.frameCdLeft += this.frameCd;
			var bulletCoords = rotate(this.x, this.y, this.x, this.components[0].height + this.y, this.dir - 180);
			return (new bullet(bulletCoords.x, bulletCoords.y, this.dir + Math.random() * this.recoil - Math.random() * this.recoil, 30, this.damage, 1.008, 30 + Math.random() * 10));
		}
		return null;
	}

	pickUp (angle = 0) {
		super.pickUp(angle);
	}
}

class um9 extends weapon {
	constructor (x, y, angle = 0) {
		super(x,y,10,4,5,angle);
	}

	use () {
		
	}

	pickUp (angle = 0) {
		super.pickUp(angle);
	}
}


class bullet extends game_object {
	constructor (x, y, dir, speed, dmg, slowdown, lifetime) {
		super(x,y);
		this.dmg = dmg;
		this.speed = speed
		this.vector = vecFromAngle(dir);
		this.slowdown = slowdown;
		this.lifetime = lifetime;
	}

	update () {
		this.setXY(this.x + this.vector.x * this.speed, this.y + this.vector.y * this.speed);
		this.speed /= this.slowdown;
		this.lifetime -= 1;
	}

	hasExpired  () {
		return (this.lifetime < 1);
	}
}

class player extends game_object {
	constructor (x, y) {
		super(x, y);
		this.inventory = [];
		this.weapons = [new ak47(x,y)];
		this.weapons[0].pickUp();
		this.ammo = [];
		this.health = 100;
		this.speed = 10;
		this.dir = 0;
		this._dir;
	}

	//Draws body and player's weapon
	update () {
		this.weapons[0].setXY(this.x,this.y);
		this.weapons[0].update();
	}
	set dir (angle) {
		angle = angle - (angle !== -180 ? -180 : 0);
		
		for (var i = 0; i < this.weapons.length; i++) {
			this.weapons[i].angle = angle;
		}
		this._dir = angle;
	}
	// Picks weapon and drops his old if he had one
	pickWeapon (weapon) {
		weapon.setXY(this.body.x, this.body.y);
		weapon.pickUp(this.dir);
		this.weapons[0] = weapon;
	}
	// Puts passed item into player's inventory
	pickItem (item) {
		this.inventory.push(item);
	}
	// Changes the player's x, y coordinates
	move (delta_x, delta_y) {
		this.x += delta_x;
		this.y += delta_y;
	}

	useWeapon () {
		if (this.weapons[0] !== null) {
			return this.weapons[0].use();
		}
		return null;
	}

	isWeaponReady () {
		if (this.weapons[0] !== null) {
			return this.weapons[0].isReady();
		}
		return false;
	}

	isAlive () {
		return (this.health > 0);
	}

	isHit (bullet) {
		return this.body.isIntersectingCircle(this.x, bullet.x, this.y, bullet.y, bullet.components[0]);
	}
}

class game_area {
	constructor () {
		this.interval = setInterval(this.update.bind(this), 1000/60);
		this.players = {};
		this.items = [];
		this.bullets = [];
	}

	update() {
		for (var playerID in this.players) {
			this.players[playerID].update();
		}
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].update();
		}
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update();
		}
	}

	addPlayer(playerID) {
		this.players[playerID] = new player(0,0);
	}

	processInput(playerID, input) {
		var player = this.players[playerID];
		var delta_x = 0;
		var delta_y = 0;
		if (input['KeyA']) {
			delta_x -= 1;
		}
		if (input['KeyW']) {
			delta_y -= 1;
		}
		if (input['KeyD']) {
			delta_x += 1;
		}
		if (input['KeyS']) {
			delta_y += 1;
		}
		player.move(delta_x*player.speed,delta_y*player.speed);
	}

	removePlayer(playerID) {
		delete this.players[playerID];
	}
}

function vecFromAngle(angle, length = 1) {
    angle = angle * Math.PI / 180;
    return {x:length * Math.sin(angle), y:length * Math.cos(angle)};
}

function angleFromVec(fromPoint, vec) {
	return Math.atan2(fromPoint.x - vec.x, fromPoint.y - vec.y) * (180 / Math.PI);
}

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle;
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
	var ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return {x:nx,y:ny};
}


var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var game_board = new game_area();
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
		game_board.addPlayer(socket.id);
	});
	
	socket.on('player_input', function(input) {
		  game_board.processInput(socket.id, input);
		  socket.emit('message', game_board.players[socket.id]);
		  io.sockets.emit('game_update', game_board.players);
	});

	socket.on('disconnect', function() {
		game_board.removePlayer(socket.id);
	});
});
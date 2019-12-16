"use strict"

class component {
	constructor (xOffset = 0, yOffset = 0) {
		this.xOffset = xOffset;
		this.yOffset = yOffset;
}

	setXYOffset (x,y) {
		this.xOffset = x;
		this.yOffset = y;
	}

	getXYOffset () {
		return [this.xOffset,this.yOffset];
	}
}

class shape extends component {
	constructor (xOffset, yOffset, angle = 0) {
		super(xOffset, yOffset);
		this.angle = angle;
	}
}

class circle extends shape {
	constructor (xOffset, yOffset, radius) {
		super(xOffset, yOffset);
		this.radius = radius;
	}

	circleIntersection (x1,x2,y1,y2,circle) {

	}

	isIntersectingCircle (x1,x2,y1,y2,circle) {
		x1 = x1 + this.xOffset;
		y1 = y1 + this.yOffset;
		x2 = x2 + circle.xOffset;
		y2 = y2 + circle.yOffset;
		return ((Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2)) < (Math.pow((this.radius + circle.radius),2)));
	}
}

class rectangle extends shape {
	constructor (xOffset, yOffset, width, height, angle = 0) {
		super(xOffset, yOffset, angle);
		this.width = width;
		this.height = height;
	}
}

class img extends component {
	constructor () {
	}

	draw () {
		ctx.drawImage(img, x, y);
	}
}

class game_object {
	constructor (x, y, components) {
		this.x = x;
		this.y = y;
		this.components = components;
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
	constructor (x, y, components) {
		super(x, y, components);
	}

	update (ctx) {

	}

	// Checks if the passed x,y values are in range of the item (to be picked up)
	inRange (x,y) {
		var maxRange = 50;
		return ((Math.abs(x - this.x) < maxRange) && (Math.abs(y - this.y) < maxRange));
	}

	set angle (angle) {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].angle = angle;
		}
	}
}

class weapon extends item {
	constructor (x, y, damage, recoil, cooldown, angle, components) {
		super(x,y,components);
		this.damage = damage;
		this.recoil = recoil;
		this.frameCdLeft = 0;
		this.frameCd = cooldown;
		this.angle = angle;
		this.dir;
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
		this.angle = angle;
	}

	isReady () {
		return this.frameCdLeft < 1;
	}
	
	set angle (angle) {
		super.angle = angle;
		this.dir = angle;
	}

	get angle () {
		return this.dir;
	}
}


class ak47 extends weapon {
	constructor (x, y, angle = 0) {
		super(x,y,10,3,6,angle,[new rectangle(-6,-20,12,-60,angle)]);
	}

	use () {
		this.frameCdLeft += this.frameCd;
		var bulletCoords = rotate(this.x, this.y, this.x, this.components[0].height + this.y, this.dir - 180);
		return (new bullet(bulletCoords.x, bulletCoords.y, this.angle + Math.random() * this.recoil - Math.random() * this.recoil, 30, this.damage, 1.008, 30 + Math.random() * 10, [new circle(0, 0, 7)]));
	}

	pickUp (angle = 0) {
		super.pickUp(angle);
	}
}

class um9 extends weapon {
	constructor (x, y, angle = 0) {
		super(x,y,10,4,5,angle,[new rectangle(-8,-20,16,-60,angle)]);
	}

	use () {
		
	}

	pickUp (angle = 0) {
		super.pickUp(angle);
	}
}


class bullet extends game_object {
	constructor (x, y, dir, speed, dmg, slowdown, lifetime, components) {
		super(x,y,components);
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
		super(x, y, [new circle(0, 0, 30), new circle(-24, -23, 10), new circle(24, -23, 10)]);
		this.body = this.components[0];
		this.lHand = this.components[1];
		this.rHand = this.components[2];
		this.inventory = [];
		this.weapons = [new ak47(x,y)];
		this.weapons[0].pickUp();
		this.ammo = [];
		this.health = 100;
		this.maxHealth = 100;
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
		this.lHand.angle = angle;
		this.rHand.angle = angle;
		
		for (var i = 0; i < this.weapons.length; i++) {
			this.weapons[i].angle = angle;
		}
		this._dir = angle;
	}

	get dir() {
		return this._dir;
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
		return this.weapons[0].use();
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
		this.players = {};
		this.items = {};
		this.bullets = [];
		this.newBullets = [];
		this.translationTable = {};
		this.processedInput = {};
		this.currPlayerID = 0;
		this.currItemID = 0;
		this.updateTimestamp = 0;
		this.numberOfUpdates = 0;
	}

	update() {
		var deadPlayers = [];
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].update();
		}

		for (var i = 0; i < this.bullets.length; i++) {
			if (!this.bullets[i].hasExpired()) {
				this.bullets[i].update();
				for (var playerID in this.players) {
					if (this.players[playerID].isHit(this.bullets[i])) {
						this.players[playerID].health -= (this.bullets[i].dmg);
						if (!this.players[playerID].isAlive()) {
							deadPlayers.push(playerID);
						}
						this.bullets.splice(i,1);
						break;
					}
				}
			} else {
				this.bullets.splice(i,1);
			}
		}

		for (var playerID in this.players) {
			this.players[playerID].update();
			this.processedInput[playerID] = false;
		}
		io.sockets.emit('game_update', {players: this.players, newBullets: this.newBullets});
		for (var i = 0; i < deadPlayers.length; i++) {
			for (var playerSID in this.translationTable) {
				if (this.translationTable[playerSID] === deadPlayers[i]) {
					this.removePlayer(playerSID);
				}
			}
		}
		this.newBullets = [];

		this.numberOfUpdates++;
		if (this.updateTimestamp === 0) {
			this.updateTimestamp = Date.now();
		} else {
			if (Date.now() - this.updateTimestamp >= 1000) {
				//console.log('Current FPS: ' + this.numberOfUpdates);
				this.updateTimestamp = 0;
				this.numberOfUpdates = 0;
			}
		}
		setTimeout(this.update.bind(this), 1000/60);
	}

	addPlayer(playerSID) {
		this.translationTable[playerSID] = this.currPlayerID.toString();
		this.processedInput[this.currPlayerID] = false;
		this.players[this.currPlayerID++] = new player(0,0);
	}

	processInput(playerSID, input) {
		if (typeof this.translationTable[playerSID] !== 'undefined' && !this.processedInput[this.translationTable[playerSID]] && typeof this.players[this.translationTable[playerSID]] !== 'undefined') {
			var player = this.players[this.translationTable[playerSID]];
			var delta_x = 0;
			var delta_y = 0;
			if (typeof input['KeyA'] !== 'undefined' && input['KeyA']) {
				delta_x -= 1;
			}
			if (typeof input['KeyW'] !== 'undefined' && input['KeyW']) {
				delta_y -= 1;
			}
			if (typeof input['KeyD'] !== 'undefined' && input['KeyD']) {
				delta_x += 1;
			}
			if (typeof input['KeyS'] !== 'undefined' && input['KeyS']) {
				delta_y += 1;
			}
			if (typeof input['Dir'] !== 'undefined') {
				player.dir = input['Dir'];
			}
			player.move(delta_x*player.speed,delta_y*player.speed);
			
			if (typeof input['lMBDown'] !== 'undefined' && input['lMBDown'] && player.isWeaponReady()) {
				var bullet = player.useWeapon();
				this.bullets.push(bullet);
				this.newBullets.push(bullet);
			}
			
			this.processedInput[this.translationTable] = true;
		}
	}

	removePlayer(playerSID) {
		delete this.players[this.translationTable[playerSID]];
		delete this.processedInput[this.translationTable[playerSID]];
		delete this.translationTable[playerSID];
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
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server, {pingInterval: 1500});
var game_board = new game_area();
game_board.update();
app.set('port', 8080);
app.use('/game', express.static(__dirname + '/game'));// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/game', 'index.html'));
});

// Starts the server
server.listen(8080, function() {
	console.log('Starting server on port 8080');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
	socket.on('new_player', function() {
		game_board.addPlayer(socket.id);
		socket.emit('game_state', {players: game_board.players, bullets: game_board.bullets}, (game_board.currPlayerID - 1).toString());
	}); 
	
	socket.on('player_input', function(input) {
		/*
		|  ----------------------------------- Working on (in this order) -----------------------------------|
		|	update rest of the player on server and make client only render                                  |
		|	make it possible to pick items/weapons and update ui accordingly                                 |
		|	replace dead player with some image indicating place of death                                    |
		|	make gameOver sign, clickable start over again, get rid of errors which occur after death        |
		|	make welcome screen                                                                              |
		|	on resize change canvas size and center character in, change also zoom                           |
		|	minimap, game boundries                                                                          |
		|	add sounds                                                                                       |
		|----------------------------------------------------------------------------------------------------|
		|--------------------------------------- Secondary objectives ---------------------------------------|
		|	remake (weapon) images into vector graphics?                                                     |
		|	add 0's before x and y to prevent the text moving each time order of magnitude is increased      |
		|	add fictitious force for each (movable) object                                                   |
		|	should unify weapon classes for example (in case I change in server_main file,                   |
		|	for example with the weapon size, so that it projects also into clients code), same for bullets, |
		|	default character movement speeds, constructor settings etc.                                     |
		|	fullscreen button	                                                                             |
		|   disable rendering outside drawing screen, add no rendered objects in debugOverlay                |
		|   optimize performance (clear only objects that change etc.)                                       |
		|	zoom code is absolutely terrible, also zoom in still buggs out                                   |
		|----------------------------------------------------------------------------------------------------|
		*/
		game_board.processInput(socket.id, input);
	});

	socket.on('disconnect', function() {
		game_board.removePlayer(socket.id);
	});
});
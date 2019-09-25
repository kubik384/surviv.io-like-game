var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/game', express.static(__dirname + '/game'));// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/game', 'index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
	io.on('connection', function(socket) {
});



var gameBoard = new gameArea();

io.on('new_player', function(socket) {
	gameBoard.addPlayer(socket.id);
	io.sockets.emit('new_player', socket.id);
});

io.on('player_input', function(socket, input) {
  gameBoard.updatePlayer(socket.id,input);
});

function gameArea() {
	this.interval = setInterval(this.update.bind(this), 1000/60);
	this.players = [];
	this.bullets = [];
	this.items = [new item(0, 0, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new ak47(400, 300), new um9(600, 600)];
}

gameArea.prototype.update = function() {
	for (var i = 0; i < this.items.length; i++) {
		this.items[i].update(this.context);
	}
	
	for (var i = 0; i < this.bullets.length; i++) {
		if (!this.bullets[i].hasExpired()) {
			this.bullets[i].update(this.context);
			for (var j = 0; j < this.players.length; j++) {
				if (this.players[j].isHit(this.bullets[i])){
					this.players[j].takeDamage(this.bullets[i].getDamage());
					this.bullets.splice(i,1);
					break;
				}
			}
		} else {
			this.bullets.splice(i,1);
		}
	}
	io.sockets.emit('game_update',this.players,this.bullets,this.items);
}

//Change fists to create a "zone" between both fists and check for intersection instead
gameArea.prototype.checkPlayerHit = function(bullet) {
	var pBody = this.player.getBody();
	for (var i = 1; i < this.players.length; i++) {
		if (circleCircleIntersection(fist.x + pBody.x, fist.y + pBody.y, handRadius, pBody.x, pBody.y, pBody.r)) {
			this.players[i].takeDamage(damage);
			this.objects.push(new bloodstain(fist.x + pBody.x, fist.y + pBody.y));
			return true;
		}
	}
	return false;
}

gameArea.prototype.addPlayer = function(player_id) {
	this.players[player_id] = new player(0,0);
}

gameArea.prototype.removePlayer = function(player_id) {
	this.players.splice(player_id,1);
}

gameArea.prototype.updatePlayer = function(player_id,input) {
	if (this.players[player_id].isAlive()) {
		// Character movement
		var delta_x = 0;
		var delta_y = 0;
		if (this.input['KeyA']) {
			delta_x -= 1;
		}
		if (this.input['KeyW']) {
			delta_y -= 1;
		}
		if (this.input['KeyD']) {
			delta_x += 1;
		}
		if (this.input['KeyS']) {
			delta_y += 1;
		}
		this.players[player_id].move(delta_x,delta_y);
		
		if (this.input['lMBDown'] && this.players[player_id].isWeaponReady()) {
			var bullet = this.players[player_id].useWeapon();
			if (bullet !== null) {
				this.bullets[this.bullets.length] = bullet;
			}
		}
	} else {
		this.removePlayer(player_id);
	}
}







function component(xOffset = 0, yOffset = 0) {
	this.xOffset = xOffset;
	this.yOffset = yOffset;
}

component.prototype.getXOffset = function() {
	return this.xOffset;
}

component.prototype.getYOffset = function() {
	return this.yOffset;
}

component.prototype.setXYOffset = function(x,y) {
	this.xOffset = x;
	this.yOffset = y;
}

component.prototype.getXYOffset = function() {
	return [this.xOffset,this.yOffset];
}

shape.prototype = Object.create(component.prototype);
function shape(xOffset, yOffset, fillColor, lineWidth, stroke = false, strokeColor = "rgb(255,255,255)", angle = 0) {
	component.call(this, xOffset, yOffset);
	this.fillColor = fillColor;
	this.lineWidth = lineWidth;
	this.stroke = stroke;
	this.strokeColor = strokeColor;
	this.angle = angle;
}

shape.prototype.setAngle = function(angle) {
	this.angle = angle;
}

circle.prototype = Object.create(shape.prototype);
function circle(xOffset, yOffset, radius, fillColor = "rgb(255,255,255)", lineWidth = 1, stroke = false, strokeColor = null, rotCenterPoint = 0) {
	shape.call(this, xOffset, yOffset, fillColor, lineWidth, stroke, strokeColor);
	this.radius = radius;
}

circle.prototype.isIntersectingCircle = function(x1,x2,y1,y2,circle) {
	x1 = x1 + this.xOffset;
	y1 = y1 + this.yOffset;
	x2 = x2 + circle.getXOffset();
	y2 = y2 + circle.getYOffset();
	return ((Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2)) < (Math.pow((this.radius + circle.getRadius()),2)));
}

circle.prototype.getRadius = function () {
	return this.radius;
}

rectangle.prototype = Object.create(shape.prototype);
function rectangle(xOffset, yOffset, width, height, fillColor, lineWidth, stroke = false, strokeColor = "rgb(255,255,255)", angle = 0) {
	shape.call(this, xOffset, yOffset, fillColor, lineWidth, stroke, strokeColor, angle);
	this.width = width;
	this.height = height;
}

rectangle.prototype.getWidth = function() {
	return this.width;
}

rectangle.prototype.getHeight = function() {
	return this.height;
}

img.prototype = Object.create(shape.prototype);
function img() {
	
}








item.prototype = Object.create(gameObject.prototype);
function item(x, y, components, name = "item") {
	gameObject.call(this, x, y, components);
	this.x = x;
	this.y = y;
	this.name = name;
}

item.prototype.update = function(ctx) {
	this.components[0].update(ctx,this.x,this.y);
}
// Checks if the passed x,y values are in range of the item (to be picked up)
item.prototype.inRange = function(x,y) {
	var maxRange = 50;
	return ((Math.abs(x - this.x) < maxRange) && (Math.abs(y - this.y) < maxRange));
}
// Returns the name of the item
item.prototype.getName = function () {
	return this.name;
}

item.prototype.setAngle = function(angle) {
	for (var i = 0; i < this.components.length; i++) {
		this.components[i].setAngle(angle);
	}
}







function gameObject(x, y, components) {
	this.x = x;
	this.y = y;
	this.components = components;
}

gameObject.prototype.getX = function () {
	return this.x;
}

gameObject.prototype.getY = function () {
	return this.y;
}

gameObject.prototype.setXY = function (x,y) {
	this.x = x;
	this.y = y;
}

gameObject.prototype.update = function (ctx) {
	for (var i = 0; i < this.components.length; i++) {
		this.components[i].update(ctx, this.x, this.y);
	}		
}

bloodstain.prototype = Object.create(gameObject.prototype);
function bloodstain(x,y) {
	gameObject.call(new img());
}

tree.prototype = Object.create(gameObject.prototype);
function tree(x,y) {
	gameObject.call(new circle(200, 200, Math.floor((Math.random()*10 + 10)), fillColor = "rgb(255,255,255)", lineWidth = 1, stroke = true, strokeColor = "rgb(139,69,19)"));
}

barrel.prototype = Object.create(gameObject.prototype);
function barrel(x,y) {
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






weapon.prototype = Object.create(item.prototype);
function weapon(x, y, damage, recoil, cooldown, angle, name, components) {
	item.call(this,x,y,components,name);
	this.damage = damage;
	this.recoil = recoil;
	this.frameCdLeft = 0;
	this.frameCd = cooldown;
	this.owner = null;
	this.setAngle(angle);
	this.dir = angle;
}

weapon.prototype.update = function (ctx) {
	if (this.owner === null) {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].update(ctx, this.x, this.y, {x:this.x, y:this.y});
		}
	} else {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].update(ctx, this.owner.getX(), this.owner.getY(), {x:this.owner.getX(), y:this.owner.getY()});
		}
	}
	if (!this.isReady()) {
		this.frameCdLeft -= 1;
	}
}

weapon.prototype.setXY = function(x,y) {
	this.x = x;
	this.y = y;
}

weapon.prototype.pickUp = function(lHand, rHand, lhX, lhY, rhX, rhY, newOwner, angle = 0) {
	if (lHand !== null) {
		lHand.setXYOffset(lhX, lhY);
	}
	if (rHand !== null) {
		rHand.setXYOffset(rhX, rhY);
	}
	this.owner = newOwner;
	this.setAngle(angle);
}

weapon.prototype.use = function() {
}

weapon.prototype.setAngle = function(angle) {
	item.prototype.setAngle.call(this,angle);
	this.dir = angle;
}

weapon.prototype.isReady = function() {
	return this.frameCdLeft < 1;
}

/*
fists.prototype = Object.create(weapon.prototype);
function fists(lHand, rHand, angle = 0) {
	lHand.xOffset = -24;
	lHand.yOffset = -23;
	rHand.xOffset = 24;
	rHand.yOffset = -23;
	weapon.call(this, x, y, 15, "Fists", 17, angle);
	this.lPunch = false;
	this.rPunch = false;
	this.hit = false;
}
*/


ak47.prototype = Object.create(weapon.prototype);
function ak47(x, y, angle = 0) {
	weapon.call(this,x,y,10,3,6,angle,"AK-47",[new rectangle(-6,-20,12,-60,"black",1,true,"black",angle)]);
}

ak47.prototype.use = function() {
	if (this.isReady()) {
		this.frameCdLeft += this.frameCd;
		var bulletCoords = rotate(this.owner.getX(), this.owner.getY(), this.owner.getX(), this.components[0].getHeight() + this.owner.getY(), this.dir - 180);
		return (new bullet(bulletCoords.x, bulletCoords.y, this.dir + Math.random() * this.recoil - Math.random() * this.recoil, 30, this.damage, 1.008, 30 + Math.random() * 10, [new circle(0, 0, 7, "black")]));
	} else {
		return null;
	}
}

ak47.prototype.pickUp = function(body, lHand = null, rHand = null, angle = 0) {
	weapon.prototype.pickUp.call(this, lHand, rHand, 8, -50, 0, -15, body, angle);
}

um9.prototype = Object.create(weapon.prototype);
function um9(x, y, angle = 0) {
	weapon.call(this,x,y,10,4,5,angle,"UM9",[new rectangle(-8,-20,16,-60,"black",1,true,"black",angle)]);
}

um9.prototype.use = function() {
	
}

um9.prototype.pickUp = function (body, lHand = null, rHand = null, angle = 0) {
	weapon.prototype.pickUp.call(this, lHand, rHand, 8, -50, 0, -15, body, angle);
}

bullet.prototype = Object.create(gameObject.prototype);
function bullet(x, y, dir, speed, dmg, slowdown, lifetime, components) {
	gameObject.call(this,x,y,components);
	this.dmg = dmg;
	this.speed = speed
	this.vector = vecFromAngle(dir);
	this.slowdown = slowdown;
	this.lifetime = lifetime;
}

bullet.prototype.update = function(ctx) {
	this.setXY(this.x + this.vector.x * this.speed, this.y + this.vector.y * this.speed);
	this.speed /= this.slowdown;
	this.lifetime -= 1;
	gameObject.prototype.update.call(this, ctx);
}

bullet.prototype.hasExpired = function () {
	return (this.lifetime < 1);
}

bullet.prototype.getDamage = function() {
	return this.dmg;
}

bullet.prototype.getComponent = function() {
	return this.components[0];
}





player.prototype = Object.create(gameObject.prototype);
function player(x, y) {
	this.id = id;
	this.body = new circle(0, 0, 30, "rgb(244, 217, 66)");
	this.lHand = new circle(-24, -23, 10, "rgb(244, 217, 66)");
	this.rHand = new circle(24, -23, 10, "rgb(244, 217, 66)");
	gameObject.call(this, x, y, [this.body, this.lHand, this.rHand]);
	this.inventory = [];
	this.weapons = [new ak47(x,y)];
	this.weapons[0].pickUp(this, this.lHand, this.rHand);
	this.ammo = [];
	this.health = 100;
	this.speed = 10;
	this.dir = 0;
}

//Draws body and player's weapon
player.prototype.update = function(ctx) {
	this.weapons[0].update(ctx);
}
player.prototype.changeDir = function(angle) {
	angle = angle - (angle !== -180 ? -180 : 0);
	this.lHand.setAngle(angle);
	this.rHand.setAngle(angle);
	
	for (var i = 0; i < this.weapons.length; i++) {
		this.weapons[i].setAngle(angle);
	}
	this.dir = angle;
}
// Picks weapon and drops his old if he had one
player.prototype.pickWeapon = function(weapon) {
	//weapon.setXY(this.body.x, this.body.y);
	weapon.pickUp(this, this.lHand, this.rHand, this.dir);
	this.weapons[0] = weapon;
	document.getElementById("ui-weapon").innerHTML = weapon.getName();
}
// Puts passed item into player's inventory
player.prototype.pickItem = function(item) {
	this.inventory.push(item);
	var itemDiv = document.createElement("div");
	var itemName = document.createTextNode(item.getName());
	itemDiv.appendChild(itemName);
	document.getElementById("ui-inventory").appendChild(itemDiv);
}
// Changes the player's x, y coordinates
player.prototype.move = function(delta_x, delta_y) {
	this.x += delta_x * this.speed;
	this.y += delta_y * this.speed;
}
player.prototype.getBody = function() {
	return this.body;
}

player.prototype.useWeapon = function() {
	if (this.weapons[0] !== null) {
		return this.weapons[0].use();
	}
	return null;
}

player.prototype.isWeaponReady = function() {
	if (this.weapons[0] !== null) {
		return this.weapons[0].isReady();
	}
	return false;
}

player.prototype.takeDamage = function(damage) {
	this.health -= damage;
}

player.prototype.isAlive = function() {
	return (this.health > 0);
}

player.prototype.getSpeed = function() {
	return this.speed;
}

player.prototype.getAngle = function() {
	return this.dir;
}

player.prototype.isHit = function(bullet) {
	return this.body.isIntersectingCircle(this.x, bullet.getX(), this.y, bullet.getY(), bullet.getComponent());
}
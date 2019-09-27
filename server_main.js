class gameArea {
	constructor() {
		this.interval = setInterval(function() {
			this.update();
		}.bind(this), 1000/60);
		this.players = [];
		this.bullets = [];
		this.items = [new item(0, 0, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new ak47(400, 300), new um9(600, 600)];
	}

	update () {
		//io.sockets.emit('game_update');
	}

	updatePlayer (player_id,input) {

	}

	addPlayer (player_id) {
		this.players[player_id] = {x:0,y:0};
	}
}


//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
class gameObject {
	constructor (x, y, components) {
		this.x = x;
		this.y = y;
		this.components = components;
	}

	getX () {
		return this.x;
	}

	getY () {
		return this.y;
	}

	setXY (x,y) {
		this.x = x;
		this.y = y;
	}

	update () {
			
	}

	draw (ctx) {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].draw(ctx, this.x, this.y);
		}	
	}
}

class bloodstain extends gameObject {
	constructor (x,y) {
		super(new img());
	}
}

class tree extends gameObject {
	constructor (x,y) {
		super(new circle(200, 200, Math.floor((Math.random()*10 + 10)), fillColor = "rgb(255,255,255)", lineWidth = 1, stroke = true, strokeColor = "rgb(139,69,19)"));
	}
}


/////////////////////////////////////////////
/////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
class player extends gameObject {
	constructor (x, y) {
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

	update (ctx) {
		this.weapons[0].update();	
	}
	draw (ctx) {
		this.lHand.draw(ctx, this.x, this.y, {x:this.body.getXOffset() + this.x,y:this.body.getYOffset() + this.y});
		this.rHand.draw(ctx, this.x, this.y, {x:this.body.getXOffset() + this.x,y:this.body.getYOffset() + this.y});
		this.weapons[0].draw(ctx);
		this.body.draw(ctx, this.x, this.y);
	}
	changeDir (angle) {
		angle = angle - (angle !== -180 ? -180 : 0);
		this.lHand.setAngle(angle);
		this.rHand.setAngle(angle);
		
		for (var i = 0; i < this.weapons.length; i++) {
			this.weapons[i].setAngle(angle);
		}
		this.dir = angle;
	}
	// Picks weapon and drops his old if he had one
	pickWeapon (weapon) {
		//weapon.setPosition(this.body.x, this.body.y);
		weapon.pickUp(this, this.lHand, this.rHand, this.dir);
		this.weapons[0] = weapon;
		document.getElementById("ui-weapon").innerHTML = weapon.getName();
	}
	// Puts passed item into player's inventory
	pickItem (item) {
		this.inventory.push(item);
		var itemDiv = document.createElement("div");
		var itemName = document.createTextNode(item.getName());
		itemDiv.appendChild(itemName);
		document.getElementById("ui-inventory").appendChild(itemDiv);
	}
	// Changes the player's x, y coordinates
	move (delta_x, delta_y) {
		this.x += delta_x;
		this.y += delta_y;
	}
	getBody () {
		return this.body;
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

	takeDamage (damage) {
		this.health -= damage;
	}

	isAlive () {
		return (this.health > 0);
	}

	getSpeed () {
		return this.speed;
	}

	getAngle () {
		return this.dir;
	}

	isHit (bullet) {
		return circle.isIntersectingCircle(this.x + this.body.getXOffset(), bullet.getX() + bullet.getXOffset(), this.y + this.body.getYOffset(), bullet.getY() + bullet.getYOffset(), this.body.getRadius(), bullet.getRadius());
	}
}

///////////////////////////////////////////////
///////////////////////////////////////////////

class component {
	constructor(xOffset = 0, yOffset = 0) {
		this.xOffset = xOffset;
		this.yOffset = yOffset;
	}

	get XOffset () {
		return this._xOffset;
	}

	get YOffset () {
		return this._yOffset;
	}

	setXYOffset (x,y) {
		this._xOffset = x;
		this._yOffset = y;
	}

	getXYOffset () {
		return [this._xOffset,this._yOffset];
	}

	update () {
		
	}
}

class shape extends component {
	constructor (xOffset, yOffset, fillColor, lineWidth, stroke = false, strokeColor = "rgb(255,255,255)", angle = 0) {
		super(xOffset, yOffset);
		this.fillColor = fillColor;
		this.lineWidth = lineWidth;
		this.stroke = stroke;
		this.strokeColor = strokeColor;
		this._angle = angle;
	}

	set angle (angle) {
		this._angle = angle;
	}

	get angle () {
		return this._angle;
	}
}

class circle extends shape {
	constructor (xOffset, yOffset, radius, fillColor = "rgb(255,255,255)", lineWidth = 1, stroke = false, strokeColor = null, rotCenterPoint = 0) {
		super(xOffset, yOffset, fillColor, lineWidth, stroke, strokeColor);
		this._radius = radius;
	}

	static circleIntersection (x1,x2,y1,y2,circle) {

	}

	static isIntersectingCircle (x1,x2,y1,y2,r1,r2) {
		return ((Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2)) < (Math.pow((r1 + r2),2)));
	}

	set radius (r) {
		this._radius = r;
	}

	get radius () {
		return this._radius;
	}

	draw (ctx, x, y, rotCenterPoint = {x:0,y:0}) {
		if (this.angle != 0) {
			ctx.save();
			ctx.translate(rotCenterPoint.x, rotCenterPoint.y);
			if (this.angle < 0) {
				ctx.rotate((this.angle + ((Math.abs(this.angle) - 90) * 2)) * Math.PI/180);
			} else {
				ctx.rotate((this.angle - ((Math.abs(this.angle) - 90) * 2)) * Math.PI/180);
			}
			ctx.translate(-rotCenterPoint.x, -rotCenterPoint.y);
		}
		ctx.beginPath();
		ctx.arc(x + this.xOffset, y + this.yOffset, this.radius, 0, 2 * Math.PI);
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillColor;
		ctx.fill();
		if (this.stroke) {
			ctx.strokeStyle = this.strokeColor;
			ctx.stroke();
		}
		if (this.angle != 0) {
			ctx.restore();
		}
	}
}

class rectangle extends shape {
	constructor(xOffset, yOffset, width, height, fillColor, lineWidth, stroke = false, strokeColor = "rgb(255,255,255)", angle = 0) {
		super(xOffset, yOffset, fillColor, lineWidth, stroke, strokeColor, angle);
		this._width = width;
		this._height = height;
	}

	draw (ctx, x, y, rotCenterPoint = {x:0,y:0}) {
		if (this.angle != 0) {
			ctx.save();
			ctx.translate(rotCenterPoint.x, rotCenterPoint.y);
			if (this.angle < 0) {
				ctx.rotate((this.angle + ((Math.abs(this.angle) - 90) * 2)) * Math.PI/180);
			} else
			{
				ctx.rotate((this.angle - ((Math.abs(this.angle) - 90) * 2)) * Math.PI/180);
			}
			ctx.translate(-rotCenterPoint.x, -rotCenterPoint.y);
		}
		ctx.beginPath();
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillColor;
		ctx.rect(x + this.xOffset, y + this.yOffset, this.width, this.height); 
		ctx.fill();
		if (this.stroke) {
			ctx.strokeStyle = this.strokeColor;
			ctx.stroke();
		}
		if (this.angle != 0) {
			ctx.restore();
		}
	}
	
	set width (value) {
		this._width = value;
	}

	get width () {
		return this._width;
	}

	set height (value) {
		this._height = value;
	}

	get height () {
		return this._height;
	}
}

class img extends shape {
	constructor () {
		
	}

	static draw (ctx,img,x,y) {
		ctx.drawImage(img, x, y);
	}
}

//////////////////////////////////////////
//////////////////////////////////////////
class item extends gameObject {
	constructor (x, y, components, name = "item") {
		super(x, y, components);
		this._name = name;
	}

	draw (ctx) {
		this.components[0].draw(ctx,this.x,this.y);
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


/////////////////////////////////////////////////
////////////////////////////////////////////////
class weapon extends item {
	constructor (x, y, damage, recoil, cooldown, angle, name, components) {
		super(x,y,components,name);
		this.damage = damage;
		this.recoil = recoil;
		this.frameCdLeft = 0;
		this.frameCd = cooldown;
		this.owner = null;
		this._dir;
		this.dir = angle;
	}

	draw (ctx) {
		if (this.owner === null) {
			for (var i = 0; i < this._components.length; i++) {
				this.components[i].draw(ctx, this.x, this.y, {x:this.x, y:this.y});
			}
		} else {
			for (var i = 0; i < this._components.length; i++) {
				this.components[i].draw(ctx, this.owner.getX(), this.owner.getY(), {x:this.owner.getX(), y:this.owner.getY()});
			}
		}
	}

	set dir (angle) {
		this.angle = angle;
		this._dir = angle;
	}

	get dir () {
		return this._dir;
	}

	update () {
		if (!this.isReady()) {
			this.frameCdLeft -= 1;
		}
	}

	setPosition(x,y) {
		this.x = x;
		this.y = y;
	}

	pickUp (lHand, rHand, lhX, lhY, rhX, rhY, newOwner, angle = 0) {
		if (lHand !== null) {
			lHand.setXYOffset(lhX, lhY);
		}
		if (rHand !== null) {
			rHand.setXYOffset(rhX, rhY);
		}
		this.owner = newOwner;
		this.dir = angle;
	}

	use () {

	}

	isReady () {
		return this.frameCdLeft < 1;
	}
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


class ak47 extends weapon {
	constructor (x, y, angle = 0) {
		super(x,y,10,3,6,angle,"AK-47",[new rectangle(-6,-20,12,-60,"black",1,true,"black",angle)]);
	}

	use () {
		if (this.isReady()) {
			this.frameCdLeft += this.frameCd;
			var bulletCoords = rotate(this.owner.x, this._owner.y, this.owner.x, this.components[0].height + this.owner.y(), this.dir - 180);
			return (new bullet(bulletCoords.x, bulletCoords.y, this.dir + Math.random() * this.recoil - Math.random() * this.recoil, 30, this.damage, 1.008, 30 + Math.random() * 10, [new circle(0, 0, 7, "black")]));
		} else {
			return null;
		}
	}

	pickUp (body, lHand = null, rHand = null, angle = 0) {
		super.pickUp(lHand, rHand, 8, -50, 0, -15, body, angle);
	}
}

class um9 extends weapon {
	constructor (x, y, angle = 0) {
		super(x,y,10,4,5,angle,"UM9",[new rectangle(-8,-20,16,-60,"black",1,true,"black",angle)]);
	}

	use () {
		
	}

	pickUp (body, lHand = null, rHand = null, angle = 0) {
		super.pickUp(lHand, rHand, 8, -50, 0, -15, body, angle);
	}
}

class barrel extends gameObject {
	constructor (x,y) {

	}
}

class bullet extends gameObject {
	constructor (x, y, dir, speed, dmg, slowdown, lifetime, components) {
		super(x,y,components);
		this.dmg = dmg;
		this.speed = speed
		this.vector = vecFromAngle(dir);
		this.slowdown = slowdown;
		this.lifetime = lifetime;
	}

	draw (ctx) {
		this.setXY(this.x + this.vector.x * this.speed, this.y + this.vector.y * this.speed);
		this.speed /= this.slowdown;
		this.lifetime -= 1;
		super.draw(ctx);
	}

	update () {
		this.setXY(this.x + this.vector.x * this.speed, this.y + this.vector.y * this.speed);
		this.speed /= this.slowdown;
		this.lifetime -= 1;
		super.update();
	}

	hasExpired () {
		return (this.lifetime < 1);
	}

	getDamage () {
		return this.dmg;
	}

	getComponent () {
		return this.components[0];
	}
}


////////////////////////////////////////////////
////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var gameBoard = new gameArea();
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
	socket.on('create_character', function(x,y) {
		gameBoard.addPlayer(socket.id);
		var character = {x:0,y:0};
		socket.emit('created_character', character);
	});
	
	socket.on('player_input', function(input) {
	  gameBoard.updatePlayer(socket.id, input);
	});
});
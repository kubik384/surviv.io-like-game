"use strict";

class weapon extends item {
	constructor (x, y, damage, recoil, cooldown, angle, name, components) {
		item.call(this,x,y,components,name);
		this._damage = damage;
		this._recoil = recoil;
		this._frameCdLeft = 0;
		this._frameCd = cooldown;
		this._owner = null;
		this._dir = angle;
	}

	draw (ctx) {
		if (this.owner === null) {
			for (var i = 0; i < this.components.length; i++) {
				this.components[i].draw(ctx, this.x, this.y, {x:this.x, y:this.y});
			}
		} else {
			for (var i = 0; i < this.components.length; i++) {
				this.components[i].draw(ctx, this.owner.getX(), this.owner.getY(), {x:this.owner.getX(), y:this.owner.getY()});
			}
		}
	}

	update () {
		if (!this.isReady()) {
			this.frameCdLeft -= 1;
		}
	}

	set x (value) {
		this._x = value;
		
	}

	set y (value) {
		this._y = value;
	}

	set dir (value) {
		item.prototype.setAngle.call(this,dir);
		this._dir = value;
	}

	setPosition(x,y) {
		this._x = x;
		this._y = y;
	}

	pickUp (lHand, rHand, lhX, lhY, rhX, rhY, newOwner, angle = 0) {
		if (lHand !== null) {
			lHand.setXYOffset(lhX, lhY);
		}
		if (rHand !== null) {
			rHand.setXYOffset(rhX, rhY);
		}
		this.owner = newOwner;
		this.setAngle(angle);
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

barrel.prototype = Object.create(gameObject.prototype);
function barrel(x,y) {
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

bullet.prototype.draw = function(ctx) {
	this.setXY(this.x + this.vector.x * this.speed, this.y + this.vector.y * this.speed);
	this.speed /= this.slowdown;
	this.lifetime -= 1;
	gameObject.prototype.draw.call(this, ctx);
}

bullet.prototype.update = function() {
	this.setXY(this.x + this.vector.x * this.speed, this.y + this.vector.y * this.speed);
	this.speed /= this.slowdown;
	this.lifetime -= 1;
	gameObject.prototype.update.call(this);
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
"use strict";

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
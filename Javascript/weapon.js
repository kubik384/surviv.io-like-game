"use strict";

weapon.prototype = Object.create(item.prototype);
function weapon(x, y, damage, components, cooldown, angle = 0, name) {
	item.call(this,x,y,name,components);
	this.damage = damage;
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
}

weapon.prototype.ready = function () {
	if (this.frameCdLeft == 0) {
		this.frameCdLeft = this.frameCd;
		return true;
	}
	return false;
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
	weapon.call(this,x,y,10,"AK-47",4,angle, [new rectangle(-6,-20,12,-60,"black",1,true,"black",angle)]);
}

ak47.prototype.use = function() {
	this.return (new bullet(this.owner.getX(), this.owner.getY(), this.dir, 20, this.damage, 1, 6, [new circle(0, 0, 30, "rgb(244, 217, 66)")]));
}

ak47.prototype.pickUp = function(body, lHand = null, rHand = null, angle = 0) {
	weapon.prototype.pickUp.call(this, lHand, rHand, 8, -50, 0, -15, body, angle);
}

um9.prototype = Object.create(weapon.prototype);
function um9(x, y, angle = 0) {
	weapon.call(this,x,y,10,"UM9",4,angle, [new rectangle(-8,-20,16,-60,"black",1,true,"black",angle)]);
}

um9.prototype.use = function() {
	
}

um9.prototype.pickUp = function (body, lHand = null, rHand = null, angle = 0) {
	weapon.prototype.pickUp.call(this, lHand, rHand, 8, -50, 0, -15, body, angle);
}

bullet.prototype = Object.create(gameObject.prototype);
function bullet(x, y, dir, speed, dmg, slowdown, lifetime, components) {
	gameObject.call(this,x,y,components);
	this.speed = speed
	this.vector = [dir * Math.PI/180, dir * Math.PI/180];
	this.slowdown = slowdown;
	this.lifetime = lifetime;
}

bullet.prototype.update = function() {
	this.setXY(this.x + this.vector[0] * speed, this.y + this.vector[1] * speed);
	this.speed -= slowdown;
	this.lifetime -= 1;
}

bullet.prototype.hasExpired = function () {
	return (this.lifetime > 0);
}
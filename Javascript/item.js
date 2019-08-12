"use strict";

item.prototype = Object.create(game_object.prototype);
function item(x, y, components, name = "item") {
	game_object.call(this, x, y, components);
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

weapon.prototype = Object.create(item.prototype);
function weapon(x, y, damage, components, cooldown, angle = 0, name) {
	item.call(this,x,y,name,components);
	this.damage = damage;
	this.frameCdLeft = 0;
	this.frameCd = cooldown;
	this.owner = null;
	this.setAngle(angle);
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
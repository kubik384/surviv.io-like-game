"use strict";

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
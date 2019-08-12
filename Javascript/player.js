"use strict";

player.prototype = Object.create(gameObject.prototype);
function player(x, y) {
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
	this.lHand.update(ctx, this.x, this.y, {x:this.body.getXOffset() + this.x,y:this.body.getYOffset() + this.y});
	this.rHand.update(ctx, this.x, this.y, {x:this.body.getXOffset() + this.x,y:this.body.getYOffset() + this.y});
	this.weapons[0].update(ctx);
	this.body.update(ctx, this.x, this.y);
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
	this.x += delta_x;
	this.y += delta_y;
}
player.prototype.getBody = function() {
	return this.body;
}

player.prototype.attack = function() {
	if (this.weapons[0] !== null) {
		this.weapons[0].attack();
	}
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
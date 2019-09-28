"use strict";

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
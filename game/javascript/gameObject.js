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

gameObject.prototype.update = function() {
		
}

gameObject.prototype.draw = function(ctx) {
	for (var i = 0; i < this.components.length; i++) {
		this.components[i].draw(ctx, this.x, this.y);
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
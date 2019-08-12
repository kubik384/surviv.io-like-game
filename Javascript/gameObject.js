"use strict";

function game_object(x, y, components) {
	this.x = x;
	this.y = y;
	this.components = components;
}

game_object.prototype.getX = function () {
	return this.x;
}

game_object.prototype.getY = function () {
	return this.y;
}

game_object.prototype.setXY = function (x,y) {
	this.x = x;
	this.y = y;
}

game_object.prototype.update = function () {
	//-- Virtual function --//
}

bloodstain.prototype = Object.create(game_object.prototype);
function bloodstain(x,y) {
	game_object.call(new img());
}

tree.prototype = Object.create(game_object.prototype);
function tree(x,y) {
	game_object.call(new circle(200, 200, Math.floor((Math.random()*10 + 10)), fillColor = "rgb(255,255,255)", lineWidth = 1, stroke = true, strokeColor = "rgb(139,69,19)"));
}

barrel.prototype = Object.create(game_object.prototype);
function barrel(x,y) {
}
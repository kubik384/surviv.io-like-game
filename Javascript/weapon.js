"use strict";

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

ak47.prototype.attack = function() {
}

ak47.prototype.pickUp = function(body, lHand = null, rHand = null, angle = 0) {
	weapon.prototype.pickUp.call(this, lHand, rHand, 8, -50, 0, -15, body, angle);
}

um9.prototype = Object.create(weapon.prototype);
function um9(x, y, angle = 0) {
	weapon.call(this,x,y,10,"UM9",4,angle, [new rectangle(-8,-20,16,-60,"black",1,true,"black",angle)]);
}

um9.prototype.attack = function() {
}

um9.prototype.pickUp = function (body, lHand = null, rHand = null, angle = 0) {
	weapon.prototype.pickUp.call(this, lHand, rHand, 8, -50, 0, -15, body, angle);
}
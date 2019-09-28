"use strict";

class item extends gameObject {
	constructor (x, y, components, name = "item") {
		super(x, y, components);
		this.x = x;
		this.y = y;
		this.name = name;
	}

	update (ctx) {
		this.components[0].update(ctx,this.x,this.y);
	}
	// Checks if the passed x,y values are in range of the item (to be picked up)
	inRange (x,y) {
		var maxRange = 50;
		return ((Math.abs(x - this.x) < maxRange) && (Math.abs(y - this.y) < maxRange));
	}
	// Returns the name of the item
	getName  () {
		return this.name;
	}

	setAngle (angle) {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].setAngle(angle);
		}
	}
}
"use strict";

class item extends gameObject {
	constructor (x, y, components, name = "item") {
		super(x, y, components);
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

	set angle (angle) {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].angle = angle;
		}
	}
}
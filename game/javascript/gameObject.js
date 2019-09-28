"use strict";

class gameObject {
	constructor (x, y, components) {
		this.x = x;
		this.y = y;
		this.components = components;
	}

	setXY (x,y) {
		this.x = x;
		this.y = y;
	}

	update (ctx) {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].update(ctx, this.x, this.y);
		}		
	}
}

class bloodstain extends gameObject {
	constructor (x,y) {
		super(new img());
	}
}

class tree extends gameObject {
	constructor (x,y) {
		super(new circle(200, 200, Math.floor((Math.random()*10 + 10)), fillColor = "rgb(255,255,255)", lineWidth = 1, stroke = true, strokeColor = "rgb(139,69,19)"));
	}
}

class barrel extends gameObject {
	constructor (x,y) {
	}
}
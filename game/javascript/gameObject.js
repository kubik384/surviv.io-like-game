"use strict";

class gameObject {
	constructor (x, y, components) {
		this.x = x;
		this.y = y;
		this.components = components;
	}

	getX () {
		return this.x;
	}

	getY () {
		return this.y;
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

class bullet extends gameObject {
	constructor (x, y, dir, speed, dmg, slowdown, lifetime, components) {
		super(x,y,components);
		this.dmg = dmg;
		this.speed = speed
		this.vector = vecFromAngle(dir);
		this.slowdown = slowdown;
		this.lifetime = lifetime;
	}

	update (ctx) {
		this.setXY(this.x + this.vector.x * this.speed, this.y + this.vector.y * this.speed);
		this.speed /= this.slowdown;
		this.lifetime -= 1;
		update.call(this, ctx);
	}

	hasExpired  () {
		return (this.lifetime < 1);
	}

	getDamage () {
		return this.dmg;
	}

	getComponent () {
		return this.components[0];
	}
}
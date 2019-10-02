"use strict";

class weapon extends item {
	constructor (x, y, damage, recoil, cooldown, angle, name, components) {
		super(x,y,components,name);
		this.damage = damage;
		this.recoil = recoil;
		this.frameCdLeft = 0;
		this.frameCd = cooldown;
		this.angle = angle;
		this.dir;
	}

	update (ctx) {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].update(ctx, this.x, this.y, {x:this.x, y:this.y});
		}
		if (!this.isReady()) {
			this.frameCdLeft -= 1;
		}
	}

	setXY (x,y) {
		this.x = x;
		this.y = y;
	}

	pickUp (lHand, rHand, lhX, lhY, rhX, rhY, angle = 0) {
		if (lHand !== null) {
			lHand.setXYOffset(lhX, lhY);
		}
		if (rHand !== null) {
			rHand.setXYOffset(rhX, rhY);
		}
		this.angle = angle;
	}

	use () {
	}

	set angle (angle) {
		super.angle = angle;
		this.dir = angle;
	}

	isReady () {
		return this.frameCdLeft < 1;
	}
}

class ak47 extends weapon {
	constructor (x, y, angle = 0) {
		super(x,y,10,3,6,angle,"AK-47",[new rectangle(-6,-20,12,-60,"black",1,true,"black",angle)]);
	}

	use () {
		this.frameCdLeft += this.frameCd;
		var bulletCoords = rotate(this.x, this.y, this.x, this.components[0].height + this.y, this.dir - 180);
		return (new bullet(bulletCoords.x, bulletCoords.y, this.dir + Math.random() * this.recoil - Math.random() * this.recoil, 30, this.damage, 1.008, 30 + Math.random() * 10, [new circle(0, 0, 7, "black")]));
	}

	pickUp (lHand = null, rHand = null, angle = 0) {
		super.pickUp(lHand, rHand, 8, -50, 0, -15, angle);
	}
}

class um9 extends weapon {
	constructor (x, y, angle = 0) {
		super(x,y,10,4,5,angle,"UM9",[new rectangle(-8,-20,16,-60,"black",1,true,"black",angle)]);
	}

	use () {
		
	}

	pickUp (lHand = null, rHand = null, angle = 0) {
		super.pickUp(lHand, rHand, 8, -50, 0, -15, angle);
	}
}


class bullet extends gameObject {
	constructor (x, y, vector, speed, dmg, slowdown, lifetime, components) {
		super(x,y,components);
		this.dmg = dmg;
		this.speed = speed
		this.vector = vector;
		this.slowdown = slowdown;
		this.lifetime = lifetime;
	}

	update (ctx) {
		this.setXY(this.x + this.vector.x * this.speed, this.y + this.vector.y * this.speed);
		this.speed /= this.slowdown;
		this.lifetime -= 1;
		super.update(ctx);
	}

	hasExpired  () {
		return (this.lifetime < 1);
	}
}
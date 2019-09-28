"use strict";

class player extends gameObject {
	constructor (x, y) {
		super(x, y, [new circle(0, 0, 30, "rgb(244, 217, 66)"), new circle(-24, -23, 10, "rgb(244, 217, 66)"), new circle(24, -23, 10, "rgb(244, 217, 66)")]);
		this.body = this.components[0];
		this.lHand = this.components[1];
		this.rHand = this.components[2];
		this.inventory = [];
		this.weapons = [new ak47(x,y)];
		this.weapons[0].pickUp(this.lHand, this.rHand);
		this.ammo = [];
		this.health = 100;
		this.speed = 10;
		this.dir = 0;
	}

	//Draws body and player's weapon
	update (ctx) {
		this.lHand.update(ctx, this.x, this.y, {x:this.body.getXOffset() + this.x,y:this.body.getYOffset() + this.y});
		this.rHand.update(ctx, this.x, this.y, {x:this.body.getXOffset() + this.x,y:this.body.getYOffset() + this.y});
		this.weapons[0].setXY(this.x,this.y);
		this.weapons[0].update(ctx);
		this.body.update(ctx, this.x, this.y);
	}
	changeDir (angle) {
		angle = angle - (angle !== -180 ? -180 : 0);
		this.lHand.setAngle(angle);
		this.rHand.setAngle(angle);
		
		for (var i = 0; i < this.weapons.length; i++) {
			this.weapons[i].setAngle(angle);
		}
		this.dir = angle;
	}
	// Picks weapon and drops his old if he had one
	pickWeapon (weapon) {
		//weapon.setXY(this.body.x, this.body.y);
		weapon.pickUp(this, this.lHand, this.rHand, this.dir);
		this.weapons[0] = weapon;
		document.getElementById("ui-weapon").innerHTML = weapon.getName();
	}
	// Puts passed item into player's inventory
	pickItem (item) {
		this.inventory.push(item);
		var itemDiv = document.createElement("div");
		var itemName = document.createTextNode(item.getName());
		itemDiv.appendChild(itemName);
		document.getElementById("ui-inventory").appendChild(itemDiv);
	}
	// Changes the player's x, y coordinates
	move (delta_x, delta_y) {
		this.x += delta_x;
		this.y += delta_y;
	}
	getBody () {
		return this.body;
	}

	useWeapon () {
		if (this.weapons[0] !== null) {
			return this.weapons[0].use();
		}
		return null;
	}

	isWeaponReady () {
		if (this.weapons[0] !== null) {
			return this.weapons[0].isReady();
		}
		return false;
	}

	takeDamage (damage) {
		this.health -= damage;
	}

	isAlive () {
		return (this.health > 0);
	}

	getSpeed () {
		return this.speed;
	}

	getAngle () {
		return this.dir;
	}

	isHit (bullet) {
		return this.body.isIntersectingCircle(this.x, bullet.getX(), this.y, bullet.getY(), bullet.getComponent());
	}
}
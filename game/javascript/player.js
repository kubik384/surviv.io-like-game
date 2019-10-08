"use strict";

class player extends gameObject {
	constructor (x, y) {
		super(x, y, [new circle(0, 0, 30, "rgb(248, 197, 116)"), new circle(-24, -23, 10, "rgb(248, 197, 116)"), new circle(24, -23, 10, "rgb(248, 197, 116)")]);
		this.body = this.components[0];
		this.lHand = this.components[1];
		this.rHand = this.components[2];
		this.inventory = [];
		this.weapons = [new ak47(x,y)];
		this.weapons[0].pickUp(this.lHand, this.rHand);
		this.ammo = [];
		this.health = 100;
		this.maxHealth = 100;
		this.speed = 10;
		this.dir = 0;
		this._dir;
	}

	//Draws body and player's weapon
	update (ctx) {
		this.lHand.update(ctx, this.x, this.y, {x:this.body.xOffset + this.x,y:this.body.yOffset + this.y});
		this.rHand.update(ctx, this.x, this.y, {x:this.body.xOffset + this.x,y:this.body.yOffset + this.y});
		this.weapons[0].setXY(this.x,this.y);
		this.weapons[0].update(ctx);
		this.body.update(ctx, this.x, this.y);
	}
	set dir (angle) {
		this.lHand.angle = angle;
		this.rHand.angle = angle;
		
		for (var i = 0; i < this.weapons.length; i++) {
			this.weapons[i].angle = angle;
		}
		this._dir = angle;
	}
	get dir() {
		return this._dir;
	}
	// Picks weapon and drops his old if he had one
	pickWeapon (weapon) {
		weapon.setXY(this.body.x, this.body.y);
		weapon.pickUp(this.lHand, this.rHand, this.dir);
		this.weapons[0] = weapon;
		document.getElementById("ui-weapon").innerHTML = weapon.name;
	}
	// Puts passed item into player's inventory
	pickItem (item) {
		this.inventory.push(item);
		var itemDiv = document.createElement("div");
		var itemName = document.createTextNode(item.name);
		itemDiv.appendChild(itemName);
		document.getElementById("ui-inventory").appendChild(itemDiv);
	}
	// Changes the player's x, y coordinates
	move (delta_x, delta_y) {
		this.x += delta_x;
		this.y += delta_y;
	}

	useWeapon () {
		return this.weapons[0].use();
	}

	isWeaponReady () {
		if (this.weapons[0] !== null) {
			return this.weapons[0].isReady();
		}
		return false;
	}

	isAlive () {
		return (this.health > 0);
	}

	isHit (bullet) {
		return this.body.isIntersectingCircle(this.x, bullet.x, this.y, bullet.y, bullet.components[0]);
	}
}
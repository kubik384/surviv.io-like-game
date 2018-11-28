"use strict";

// --- Events listeners --- //
window.addEventListener('keydown', function(e) {
	game_area.pressed[e.code] = true;
})
window.addEventListener('keyup', function(e) {
	game_area.pressed[e.code] = false;
})
window.addEventListener('mousedown', function(e) {
	if (e.button == 0) {
		game_area.player.attack();
	}
})

function drawCircle(ctx, x, y, radius, color, stroke = false, lineWidth = 1) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
		if (stroke) {
			ctx.lineWidth = lineWidth;
			ctx.stroke();
		}
}
//------------ Player constructor ------------//
function player(x, y) {
	this.x = x;
	this.y = y;
	this.selectedWeapon = 0;
	this.inventory = [];
	this.weapons = [new weapon(x, y, 15, "Hand", true)];
	this.ammo = [];
}

//Draws body and player's weapon
player.prototype.update = function(ctx) {
	drawCircle(ctx, this.x, this.y, 30, "rgb(244, 217, 66)");
	this.weapons[this.selectedWeapon].update(ctx);
}
// Picks weapon and drops his old if he had one
player.prototype.pickweapon = function(weapon) {
	var droppedWeapon = this.weapons[this.selectedWeapon];
	droppedWeapon.picked = false;
	weapon.x = this.x;
	weapon.y = this.y;
	weapon.picked = true;
	this.weapons[this.selectedWeapon] = weapon;
	document.getElementById("ui-weapon").innerHTML = weapon.getName();
	return droppedWeapon;
}
// Puts passed item into player's inventory
player.prototype.pickItem = function(item) {
	this.inventory.push(item);
	var itemDiv = document.createElement("div");
	var itemName = document.createTextNode(item.getName());
	itemDiv.appendChild(itemName);
	document.getElementById("ui-inventory").appendChild(itemDiv);
}
// Changes the player's x, y coordinates
player.prototype.move = function(delta_x, delta_y) {
	this.x += delta_x;
	this.y += delta_y;
	this.weapons[this.selectedWeapon].x += delta_x;
	this.weapons[this.selectedWeapon].y += delta_y;
}
player.prototype.getX = function() {
	return this.x;
}
player.prototype.getY = function() {
	return this.y
}

//------------ item constructor + inheritance --------------//
function item(x, y, name="item") {
	this.x = x;
	this.y = y;
	this.name = name;
}

item.prototype.update = function(ctx) {
	drawCircle(ctx, this.x, this.y, 20, "rgb(255, 255, 255)", true);
}
// Checks if the passed x,y values are in range of the item (to be picked up)
item.prototype.inRange = function(x, y) {
	var maxRange = 50;
	return ((Math.abs(x - this.x) < maxRange) && (Math.abs(y - this.y) < maxRange));
}
// Returns the name of the item
item.prototype.getName = function () {
	return this.name;
}

function weapon(x, y, damage, name, picked = false) {
	item.call(this,x,y,name);
	this.damage = damage;
	this.picked = picked;
}

weapon.prototype = Object.create(item.prototype);
weapon.prototype.update = function (ctx) {
	drawCircle(ctx, this.x - 24, this.y - 23, 10, "rgb(244, 217, 66)", true, 3);
	drawCircle(ctx, this.x + 24, this.y - 23, 10, "rgb(244, 217, 66)", true, 3);
}
//---------------------- gameArea --------------------------//
function gameArea() {
	this.canvas = document.createElement("canvas");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.xOffset = 0;
	this.yOffset = 0;
	document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	this.interval = setInterval(this.update.bind(this), 20);
	this.context = this.canvas.getContext("2d");
	this.player = new player(Math.floor(this.canvas.width/2), Math.floor(this.canvas.height/2));
	this.pressed = {'KeyW' : false, 'KeyA' : false, 'KeyS' : false, 'KeyD' : false, 'KeyF': false};
	this.playerSpeed = 5;
	this.pickedItem = false;
	this.items = [];//new item(50, 100), new item(50, 100), new item(50, 100), new item(50, 100), new weapon(400, 300, 20, "AK-47"), new weapon(600, 600, 20, "UM9")
}

gameArea.prototype.clear = function() {
	this.context.clearRect(this.xOffset, this.yOffset, this.canvas.width, this.canvas.height);
}

gameArea.prototype.update = function() {
	this.clear();
	for(var i = 0; i < this.items.length; i++) {
		this.items[i].update(this.context);
	}
	// Character movement
	var delta_x = 0;
	var delta_y = 0;
	if (this.pressed['KeyA']) {
		delta_x -= 1 * this.playerSpeed;
	}
	if (this.pressed['KeyW']) {
		delta_y -= 1 * this.playerSpeed;
	}
	if (this.pressed['KeyD']) {
		delta_x += 1 * this.playerSpeed;
	}
	if (this.pressed['KeyS']) {
		delta_y += 0.5 * this.playerSpeed;
	}
	this.player.move(delta_x, delta_y);
	this.xOffset += delta_x;
	this.yOffset += delta_y;
	this.context.translate(-delta_x, -delta_y);
	//--------------------------------------//
	this.player.update(this.context);
	
	// Shows pickup ui if near any item and pick it up if 'F' is pressed	
	var itemInRange = false; 
	for(i = 0; i < this.items.length; i++) {
		if (this.items[i].inRange(this.player.getX(), this.player.getY())) {
			if (this.pressed['KeyF'] && !this.pickedItem) {
				// Player picks the weapon
				if (this.items[i] instanceof weapon) {
					var droppedweapon = this.player.pickweapon(this.items.splice(i,1)[0]);
					this.items.push(droppedweapon);
				// Puts the item into the player's inventory
				} else {
					var itemPick = this.items.splice(i,1)[0];
					this.player.pickItem(itemPick);
				}
				this.pickedItem = true;
			} else {
				if (!this.pressed['KeyF'] && this.pickeditem) {
					this.pickeditem = false;
				}
				document.getElementById("pick-item").innerHTML = this.items[i].getName();
				document.getElementById("ui-lower").style.display = "block";
				itemInRange = true;
			}
		break;
		}
	}
	if (itemInRange) {
		document.getElementById("ui-lower").style.display = "block";
	} else if (document.getElementById("ui-lower").style.display == "block") {
		document.getElementById("ui-lower").style.display = "none";
	}
}


/*
this.update = function(ctx) {
		this.lPunch = false;
		this.rPunch = false;
		this.punchFrame = 0;
		if (this.rPunch) {
			this.punchFrame += 1;
			if (this.punchFrame < 9) {
				this.rightHand.x -= 3;
				this.rightHand.y -= 3;
			} else if (this.punchFrame < 17) {
				this.rightHand.x += 3;
				this.rightHand.y += 3;
			} else {
				this.rPunch = false;
				this.punchFrame = 0;
			}
		} else if (this.lPunch) {
			this.punchFrame += 1;
			if (this.punchFrame < 9) {
				this.leftHand.x += 3;
				this.leftHand.y -= 3;
			} else if (this.punchFrame < 17) {
				this.leftHand.x -= 3;
				this.leftHand.y += 3;
			} else {
				this.lPunch = false;
				this.punchFrame = 0;
			}
		}
*/
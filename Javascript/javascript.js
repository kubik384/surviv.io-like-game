"use strict";

/*----------------- Constants -------------------*/

/*-------------------------------------------------*/

var game_area;
var selectedCanvas;

function startGame() {
	game_area = new gameArea();
	selectedCanvas = game_area;
}

// --- Events listeners --- //
window.addEventListener('keydown', function(e) {
	selectedCanvas.pressed[e.code] = true;
})
window.addEventListener('keyup', function(e) {
	selectedCanvas.pressed[e.code] = false;
})
window.addEventListener('mousedown', function(e) {
	if (e.button == 0) {
		selectedCanvas.player.attack();
	}
})
window.addEventListener('mousemove', function(e) {
	selectedCanvas.player.changeDir(Math.atan2(Math.floor(game_area.canvas.width/2) - e.pageX, Math.floor(game_area.canvas.height/2) - e.pageY) * (180 / Math.PI));
})


function drawCircle(ctx, x, y, radius, fillColor, stroke = false, strokeColor = "black", lineWidth = 1) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.lineWidth = lineWidth;
	ctx.fillStyle = fillColor;
	ctx.fill();
	if (stroke) {
		ctx.strokeStyle = strokeColor;
		ctx.stroke();
	}
}

function drawRect(ctx, x, y, width, height, fillColor, angle = 0, centerpoint = {x : 0, y : 0}, stroke = false, strokeColor = "black", lineWidth = 1) {
	if (angle != 0) {
		ctx.save();
		ctx.translate(centerpoint.x, centerpoint.y);
		if (angle < 0) {
			ctx.rotate((angle + ((Math.abs(angle) - 90) * 2)) * Math.PI/180);
		} else
		{
			ctx.rotate((angle - ((Math.abs(angle) - 90) * 2)) * Math.PI/180);
		}
	}
	ctx.beginPath();
	ctx.lineWidth = lineWidth;
	ctx.fillStyle = fillColor;
	if (angle != 0) {
		ctx.rect(-width/2, -height + (centerpoint.y - y), width, height); 
	} else {
		ctx.rect(x, y, width, height); 
	}
	ctx.fill();
	if (stroke) {
		ctx.strokeStyle = strokeColor;
		ctx.stroke();
	}
	if (angle != 0) {
		ctx.restore();
	}
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
	this.playerSpeed = 15;
	this.pickedItem = false;
	this.items = [new item(50, 100), new item(50, 100), new item(50, 100), new item(50, 100), new weapon(400, 300, 20, "AK-47"), new weapon(600, 600, 20, "UM9")];
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
		delta_y += 1 * this.playerSpeed;
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
		if (this.items[i].inRange(this.player.getCoords())) {
			if (this.pressed['KeyF'] && !this.pickedItem) {
				// Player picks the weapon
				if (this.items[i] instanceof weapon) {
					var droppedweapon = this.player.pickWeapon(this.items.splice(i,1)[0]);
					this.items.push(droppedweapon);
				// Puts the item into the player's inventory
				} else {
					var itemPick = this.items.splice(i,1)[0];
					this.player.pickItem(itemPick);
				}
				this.pickedItem = true;
			} else {
				if (!this.pressed['KeyF'] && this.pickedItem) {
					this.pickedItem = false;
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

//------------ Player constructor ------------//
function player(x, y) {
	this.x = x;
	this.y = y;
	this.inventory = [];
	this.weapons = [new weapon(x, y, 15, "Hands", true)];
	this.ammo = [];
}

//Draws body and player's weapon
player.prototype.update = function(ctx) {
	drawCircle(ctx, this.x, this.y, 30, "rgb(244, 217, 66)");
	for (var i = 0; i < this.weapons.length; i++) {
		this.weapons[i].update(ctx);
	}
}
player.prototype.changeDir = function(angle) {
	this.weapons[0].changeAngle(angle);
	if (this.weapons[0].name == "Hands" && this.weapons[0].attacking) {
		//Reset		
	}
}
// Picks weapon and drops his old if he had one
player.prototype.pickWeapon = function(weapon) {
	var droppedWeapon = this.weapons[0];
	droppedWeapon.picked = false;
	weapon.x = this.x;
	weapon.y = this.y;
	weapon.picked = true;
	this.weapons[0] = weapon;
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
	this.weapons[0].x += delta_x;
	this.weapons[0].y += delta_y;
}
player.prototype.getCoords = function() {
	return {x : this.x, y : this.y};
}

player.prototype.attack = function() {
	this.weapons[0].attack();
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
item.prototype.inRange = function(coords) {
	var maxRange = 50;
	return ((Math.abs(coords.x - this.x) < maxRange) && (Math.abs(coords.y - this.y) < maxRange));
}
// Returns the name of the item
item.prototype.getName = function () {
	return this.name;
}

function weapon(x, y, damage, name, picked = false) {
	item.call(this,x,y,name);
	this.damage = damage;
	this.picked = picked;
	//For rectangles which create the shape of a weapon
	this.wShape = [];
	this.angle = 0;
	this.attacking = false;
	
	if (name == "Hands") {
		//l/r hand offset
		this.lHO = {x : -24, y : -23};
		this.rHO = {x : 24, y : -23};
	} else if (name == "AK-47") {
		this.lHO = {x : -8, y : -50};
		this.rHO = {x : 0, y : -15};
		this.wShape.push({x : -6, y : -20, width : 12, height : -60, fillColor : "black", stroke : true, strokeColor: "black", lineWidth : 1});
	} else if (name == "UM9") {
		this.lHO = {x : -8, y : -50};
		this.rHO = {x : 0, y : -15};
		this.wShape.push({x : -8, y : -20, width : 16, height : -60, fillColor : "black", stroke : true, strokeColor: "black", lineWidth : 1});
	}
}

weapon.prototype = Object.create(item.prototype);
weapon.prototype.update = function (ctx) {
	for (var i = 0; i < this.wShape.length; i++) {
		drawRect(ctx, this.x + this.wShape[i].x, this.y + this.wShape[i].y, this.wShape[i].width, this.wShape[i].height, this.wShape[i].fillColor, this.angle, {x : this.x, y : this.y}, this.wShape[i].stroke, this.wShape[i].strokeColor, this.wShape[i].lineWidth);
	}
	drawCircle(ctx, this.x + this.lHO.x, this.y + this.lHO.y, 10, "rgb(244, 217, 66)", true, "black", 3);
	drawCircle(ctx, this.x + this.rHO.x, this.y + this.rHO.y, 10, "rgb(244, 217, 66)", true, "black", 3);
	
	if (this.attacking) {
		if (this.getName() == "Hands") {
			var radAngle = (this.angle) * (Math.PI / 180);
			if (this.rPunch) {
				this.punchFrame += 1;
				if (this.punchFrame < 9) {
					this.rHO.x += - 3 * Math.cos(radAngle) - 3 * Math.sin(radAngle);
					this.rHO.y -= 3 * Math.cos(radAngle) - 3 * Math.sin(radAngle);
				} else if (this.punchFrame < 17) {
					this.rHO.x -= - 3 * Math.cos(radAngle) - 3 * Math.sin(radAngle);
					this.rHO.y += 3 * Math.cos(radAngle) - 3 * Math.sin(radAngle);
				} else {
					this.rPunch = false;
					this.attacking = false;
				}
			} else if (this.lPunch) {
				this.punchFrame += 1;
				if (this.punchFrame < 9) {
					this.lHO.x += 3 * Math.cos(radAngle) - 3 * Math.sin(radAngle);
					this.lHO.y -= 3 * Math.cos(radAngle) + 3 * Math.sin(radAngle);
				} else if (this.punchFrame < 17) {
					this.lHO.x -= 3 * Math.cos(radAngle) - 3 * Math.sin(radAngle);
					this.lHO.y += 3 * Math.cos(radAngle) + 3 * Math.sin(radAngle);
				} else {
					this.lPunch = false;
					this.attacking = false;
				}
			}
		} else if ("AK-47") {
		} else if ("UM9") {
		}
	}
}

weapon.prototype.changeAngle = function (angle) {
	var radAngle = (this.angle - angle) * (Math.PI / 180);
	var lX = this.lHO.x * Math.cos(radAngle) - this.lHO.y * Math.sin(radAngle);
	var lY = this.lHO.y * Math.cos(radAngle) + this.lHO.x * Math.sin(radAngle);
	this.lHO.x = lX;
	this.lHO.y = lY;
	var rX = this.rHO.x * Math.cos(radAngle) - this.rHO.y * Math.sin(radAngle);
	var rY = this.rHO.y * Math.cos(radAngle) + this.rHO.x * Math.sin(radAngle);	
	this.rHO.x = rX;
	this.rHO.y = rY;
	this.angle = angle;
	while(this.angle > 360) {
		this.angle -= 360;
	}
}
	
weapon.prototype.attack = function () {
	if (!this.attacking) {
		this.attacking = true;
		if (this.name == "Hands") {
			if (Math.floor(Math.random() * 2 + 1) == 1) {
				this.rPunch = true;
			} else {
				this.lPunch = true;
			}
			this.punchFrame = 0;
		} else if (this.name == "AK-47") {
			
		} else if (this.name == "UM9") {
			
		}
	}
}
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
	this.weapons = [new Weapon(x, y, 15, "Hand", true)];
	this.ammo = [];
	//Draws body and weapon
	this.update = function(ctx) {
		drawCircle(ctx, this.x, this.y, 30, "rgb(244, 217, 66)");
		this.weapons[this.selectedWeapon].update(ctx);
	}
	// Puts passed item into player's inventory
	this.pickItem = function(item) {
		this.inventory.push(item);
		var itemDiv = document.createElement("div");
		var itemName = document.createTextNode(item.getName());
		itemDiv.appendChild(itemName);
		document.getElementById("ui-inventory").appendChild(itemDiv);
	}
	// Picks weapon and drops his old if he had one
	this.pickWeapon = function(weapon) {
		var droppedWeapon = this.weapons[this.selectedWeapon];
		droppedWeapon.picked = false;
		weapon.x = this.x;
		weapon.y = this.y;
		weapon.picked = true;
		this.weapons[this.selectedWeapon] = weapon;
		document.getElementById("ui-weapon").innerHTML = weapon.getName();
		return droppedWeapon;
	}
	// Changes the player's x, y coordinates
	this.move = function(delta_x, delta_y) {
		this.x += delta_x;
		this.y += delta_y;
		this.weapons[this.selectedWeapon].x += delta_x;
		this.weapons[this.selectedWeapon].y += delta_y;
	}
	this.getX = function() {
		return this.x;
	}
	this.getY = function() {
		return this.y
	}
}
//------------ Item constructor + inheritance --------------//
function Item(x, y, name="Item") {
	this.x = x;
	this.y = y;
	this.name = name;
	this.update = function(ctx) {
		drawCircle(ctx, this.x, this.y, 20, "rgb(255, 255, 255)", true);
	}
	// Checks if the passed x,y values are in range of the item (to be picked up)
	this.inRange = function(x, y) {
		var maxRange = 50;
		return ((Math.abs(x - this.x) < maxRange) && (Math.abs(y - this.y) < maxRange));
	}
	// Returns the name of the item
	this.getName = function () {
		return this.name;
	}
}

function Weapon(x, y, damage, name, picked = false) {
	Item.call(x,y,name);
	this.damage = damage;
	this.picked = picked;
	this.update = function (ctx) {
		drawCircle(ctx, this.item.x - 24, this.item.y - 23, 10, "rgb(244, 217, 66)", true, 3);
		drawCircle(ctx, this.x + 24, this.y - 23, 10, "rgb(244, 217, 66)", true, 3);
	}
}
Weapon.prototype = new Item();
//---------------------- gameArea --------------------------//
var gameArea = {
	canvas : document.createElement("canvas"),
	// Inicialization function
	init : function () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.xOffset = 0;
		this.yOffset = 0;
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		interval : setInterval(this.update, 20);
		this.context = this.canvas.getContext("2d");
		this.player = new player(Math.floor(this.canvas.width/2), Math.floor(this.canvas.height/2));
		this.pressed = {'KeyW' : false, 'KeyA' : false, 'KeyS' : false, 'KeyD' : false, 'KeyF': false};
		this.playerSpeed = 5;
		this.pickedItem = false;
		this.items = [new Item(50, 100), new Item(50, 100), new Item(50, 100), new Item(50, 100), new Weapon(400, 300, 20, "AK-47"), new Weapon(600, 600, 20, "UM9")];
		
		// --- Events listeners --- //
		window.addEventListener('keydown', function(e) {
			gameArea.pressed[e.code] = true;
		})
		window.addEventListener('keyup', function(e) {
			gameArea.pressed[e.code] = false;
		})
		window.addEventListener('mousedown', function(e) {
			if (e.button == 0) {
				gameArea.player.attack();
			}
		})
	},
	clear : function() {
		this.context.clearRect(this.xOffset, this.yOffset, this.canvas.width, this.canvas.height);
	},
	//------------- Update --------------//
	update : function() {
		gameArea.clear();
		for(i = 0; i < gameArea.items.length; i++) {
			gameArea.items[i].update(gameArea.context);
		}
		// Character movement
		var delta_x = 0;
		var delta_y = 0;
		if (gameArea.pressed['KeyA']) {
			delta_x -= 1 * gameArea.playerSpeed;
		}
		if (gameArea.pressed['KeyW']) {
			delta_y -= 1 * gameArea.playerSpeed;
		}
		if (gameArea.pressed['KeyD']) {
			delta_x += 1 * gameArea.playerSpeed;
		}
		if (gameArea.pressed['KeyS']) {
			delta_y += 0.5 * gameArea.playerSpeed;
		}
		gameArea.player.move(delta_x, delta_y);
		gameArea.xOffset += delta_x;
		gameArea.yOffset += delta_y;
		gameArea.context.translate(-delta_x, -delta_y);
		//--------------------------------------//
		gameArea.player.update(gameArea.context);
		
		// Shows pickup ui if near any item and pick it up if 'F' is pressed	
		var itemInRange = false; 
		for(i = 0; i < gameArea.items.length; i++) {
			if (gameArea.items[i].inRange(gameArea.player.getX(), gameArea.player.getY())) {
				if (gameArea.pressed['KeyF'] && !gameArea.pickedItem) {
					// Player picks the weapon
					if (gameArea.items[i] instanceof Weapon) {
						var droppedWeapon = gameArea.player.pickWeapon(gameArea.items.splice(i,1)[0]);
						gameArea.items.push(droppedWeapon);
					// Puts the item into the player's inventory
					} else {
						var pickedItem = gameArea.items.splice(i,1)[0];
						gameArea.player.pickItem(pickedItem);
					}
					gameArea.pickedItem = true;
				} else {
					if (!gameArea.pressed['KeyF'] && gameArea.pickedItem) {
						gameArea.pickedItem = false;
					}
					document.getElementById("pick-item").innerHTML = gameArea.items[i].getName();
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
function circle(x, y, radius, color, stroke = false, lineWidth = 1) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.stroke = stroke;
	this.draw = function(xOffset = 0, yOffset = 0) {
		var ctx = gameArea.context;
		ctx.beginPath();
		ctx.arc(this.x + xOffset, this.y + yOffset, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
		if (stroke) {
			ctx.lineWidth = lineWidth;
			ctx.stroke();
		}		
	}
}
//------------ Player constructor ------------//
function player(x, y) {
	this.body = new circle(x, y, 30, "rgb(244, 217, 66)");
	this.leftHand = new circle(x - 24, y - 23, 10, "rgb(244, 217, 66)", true, 3);
	this.rightHand = new circle(x + 24, y - 23, 10, "rgb(244, 217, 66)", true, 3);
	this.inventory = [];
	this.weapon = new Weapon(x, y, 15, "Hand");
	this.update = function() {
		this.body.draw();
		this.leftHand.draw();
		this.rightHand.draw();
	}
	this.pickWeapon = function(weapon) {
		if(this.weapon.name != "Hand") {
			this.weapon = weapon;
		} else {
			gameArea.items.push(this.player.weapon);
			this.player.weapon = weapon;
		}
	}
	this.attack = function() {
		this.weapon.attack();
	}
}
//------------ Item constructom + polyporphism --------------//
function Item(x,y) {
	this.circle = new circle(x, y, 20, "rgb(255, 255, 255)", true);
	this.name = "Item";
	this.update = function(xOffset, yOffset) {
		this.circle.draw(xOffset, yOffset);
	}
	this.inRange = function(x,y) {
		var maxRange = 50;
		return ((Math.abs(x - this.circle.x) < maxRange) && (Math.abs(y - this.circle.y) < maxRange));
	}
}

function Weapon(x, y, damage, name) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.circle = new circle(x, y, 20, "rgb(255, 255, 255)", true);
	this.damage = damage;
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
		this.items = [new Item(50, 100), new Item(50, 100), new Item(50, 100), new Item(50, 100), new Weapon(400, 300, 20, "AK-47")];
		
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
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	//------------- Update --------------//
	update : function() {
		gameArea.clear();
		
		for(i = 0; i < gameArea.items.length; i++) {
			gameArea.items[i].update(gameArea.xOffset, gameArea.yOffset);
		}
		
		// Shows pickup ui if near any item and pick it up if 'F' is pressed	
		var itemInRange = false;
		for(i = 0; i < gameArea.items.length; i++) {
			if (gameArea.items[i].inRange(gameArea.player.body.x - gameArea.xOffset, gameArea.player.body.y - gameArea.yOffset)) {
				if (gameArea.pressed['KeyF'] && !gameArea.pickedItem) {
					// Puts the item into the player's weapon slot
					if (gameArea.items[i] instanceof Weapon) {
						gameArea.player.weapon = gameArea.items.splice(i,1)[0];
						document.getElementById("ui-weapon").innerHTML = gameArea.player.weapon.name;
					// Puts the item into the player's inventory
					} else {
						var pickedItem = gameArea.items.splice(i,1)[0];
						gameArea.player.inventory.push(pickedItem);
						var itemDiv = document.createElement("div");
						var itemName = document.createTextNode(pickedItem.name);
						itemDiv.appendChild(itemName);
						document.getElementById("ui-inventory").appendChild(itemDiv);
					}
					gameArea.pickedItem = true;
				} else {
					if (!gameArea.pressed['KeyF'] && gameArea.pickedItem) {
						gameArea.pickedItem = false;
					}
					document.getElementById("pick-item").innerHTML = gameArea.items[i].name;
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
		
		// Character movement
		var delta_x = 0;
		var delta_y = 0;
		if (gameArea.pressed['KeyA']) {
			delta_x += 1 * gameArea.playerSpeed;
		}
		if (gameArea.pressed['KeyW']) {
			delta_y += 1 * gameArea.playerSpeed;
		}
		if (gameArea.pressed['KeyD']) {
			delta_x -= 1 * gameArea.playerSpeed;
		}
		if (gameArea.pressed['KeyS']) {
			delta_y -= 1 * gameArea.playerSpeed;
		}
		gameArea.xOffset += delta_x;
		gameArea.yOffset += delta_y;
		//--------------------------------------//
		gameArea.player.update();
	}
}


/*
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
"use strict";

function gameArea() {
	this.canvas = document.createElement("canvas");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.xOffset = 0;
	this.yOffset = 0;
	document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	this.interval = setInterval(this.update.bind(this), 1000/60);
	this.context = this.canvas.getContext("2d");
	this.inRangeItemIndex = -1;
	this.pickItem = false;
	this.pressed = {'KeyW':false, 'KeyA':false, 'KeyS':false, 'KeyD':false, 'KeyF':false, 'lMBDown':false};
	this.players = [new player(this.canvas.width/2,this.canvas.height/2), new player (200, 200)];
	this.bullets = [];
	this.items = [new item(0, 0, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new ak47(400, 300), new um9(600, 600)];
	this.myCharacter = this.players[0];
}

gameArea.prototype.clear = function() {
	this.context.clearRect(this.xOffset, this.yOffset, this.canvas.width, this.canvas.height);
}

gameArea.prototype.update = function() {
	this.clear();		
	
	if (this.pickItem) {
		if (this.items[this.inRangeItemIndex] instanceof weapon) {
			this.myCharacter.pickWeapon(this.items.splice(this.inRangeItemIndex,1)[0]);
		} else {
			var itemPick = this.items.splice(this.inRangeItemIndex,1)[0];
			this.myCharacter.pickItem(itemPick);
		}
		this.pickItem = false;
	}
	
	if (this.myCharacter.isAlive()) {
		// Character movement
		var delta_x = 0;
		var delta_y = 0;
		if (this.pressed['KeyA']) {
			delta_x -= 1;
		}
		if (this.pressed['KeyW']) {
			delta_y -= 1;
		}
		if (this.pressed['KeyD']) {
			delta_x += 1;
		}
		if (this.pressed['KeyS']) {
			delta_y += 1;
		}
		var pSpeed = this.myCharacter.getSpeed();
		delta_x *= pSpeed;
		delta_y *= pSpeed;
		this.myCharacter.move(delta_x,delta_y);
		this.moveScreenBy(delta_x,delta_y);
		
		if (this.pressed['lMBDown'] && this.myCharacter.isWeaponReady()) {
			var bullet = this.myCharacter.useWeapon();
			if (bullet !== null) {
				this.bullets[this.bullets.length] = bullet;
			}
		}
	}
		

	if (this.myCharacter.isAlive()) {
		// Shows pickup ui if near any item and pick it up if 'F' is pressed
		this.inRangeItemIndex = -1;
		for(i = 0; i < this.items.length; i++) {	
			if (this.items[i].inRange(this.myCharacter.getX(), this.myCharacter.getY())) {
				document.getElementById("pick-item").innerHTML = this.items[i].getName();
				document.getElementById("ui-lower").style.display = "block";
				this.inRangeItemIndex = i;
				break;
			}
		}
		if (this.inRangeItemIndex != -1) {
			document.getElementById("ui-lower").style.display = "block";
		} else if (document.getElementById("ui-lower").style.display == "block") {
			document.getElementById("ui-lower").style.display = "none";
		}
	}

	for (var i = 0; i < this.players.length; i++) {
		if (this.players[i].isAlive()) {
			this.players[i].update(this.context);
		} else {
			this.players.splice(i,1);
		}
	}
	for (var i = 0; i < this.items.length; i++) {
		this.items[i].update(this.context);
	}
	for (var i = 0; i < this.bullets.length; i++) {
		if (!this.bullets[i].hasExpired()) {
			this.bullets[i].update(this.context);
			for (var j = 0; j < this.players.length; j++) {
				if (this.players[j].isHit(this.bullets[i])){
					this.players[j].takeDamage(this.bullets[i].getDamage());
					this.bullets.splice(i,1);
					break;
				}
			}
		} else {
			this.bullets.splice(i,1);
		}
	}

	//this.sendInputChanges();
}

//Change fists to create a "zone" between both fists and check for intersection instead
gameArea.prototype.checkPlayerHit = function(bullet) {
	var pBody = this.player.getBody();
	for (var i = 1; i < this.players.length; i++) {
		if (circleCircleIntersection(fist.x + pBody.x, fist.y + pBody.y, handRadius, pBody.x, pBody.y, pBody.r)) {
			this.players[i].takeDamage(damage);
			this.objects.push(new bloodstain(fist.x + pBody.x, fist.y + pBody.y));
			return true;
		}
	}
	return false;
}

gameArea.prototype.moveScreenBy = function(x,y) {
	this.xOffset += x;
	this.yOffset += y;
	this.context.translate(-x,-y);
}

gameArea.prototype.keyUp = function(e) {
	this.pressed[e.code] = false;
	//this.myCharacter.setInput(e.code,false);
}
gameArea.prototype.keyDown = function(e) {
	this.pressed[e.code] = true;
	//this.myCharacter.setInput(e.code,true);
}
gameArea.prototype.lMouseDown = function(e) {
	this.pressed['lMBDown'] = true;
	//this.myCharacter.setInput('lMBDown',true);
}
gameArea.prototype.lMouseUp = function(e) {
	this.pressed['lMBDown'] = false;
	//this.myCharacter.setInput('lMBDown',false);
}

gameArea.prototype.mouseMove = function(e) {
	this.myCharacter.changeDir(angleFromVec({x:this.myCharacter.getX() + this.myCharacter.getBody().getXOffset(), y:this.myCharacter.getY() + this.myCharacter.getBody().getYOffset()}, {x:this.xOffset + e.pageX, y:this.yOffset + e.pageY}));
}

gameArea.prototype.sendInputChanges = function() {
	//socket.emit('input_changes', this.myCharacter.getInput());
}

gameArea.prototype.updateGame = function(players,bullets,items) {
	this.players = players;
	this.bullets = bullets;
	this.items = items;
}
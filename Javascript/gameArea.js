"use strict";

function gameArea() {
	this.canvas = document.createElement("canvas");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.xOffset = 0;
	this.yOffset = 0;
	document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	this.interval = setInterval(this.update.bind(this), 20);
	this.context = this.canvas.getContext("2d");
	this.inRangeItemIndex = -1;
	this.pickItem = false;
	this.pressed = {'KeyW':false, 'KeyA':false, 'KeyS':false, 'KeyD':false, 'KeyF':false, 'lMBDown':false};
	this.objects = [new player (200, 200), new item(0, 0, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new ak47(400, 300), new um9(600, 600)];
	this.myPlayer = new player(this.canvas.width/2,this.canvas.height/2);
}

gameArea.prototype.clear = function() {
	this.context.clearRect(this.xOffset, this.yOffset, this.canvas.width, this.canvas.height);
}

gameArea.prototype.update = function() {
	this.clear();
	
	if (this.pickItem) {
		if (this.objects[this.inRangeItemIndex] instanceof weapon) {
			this.myPlayer.pickWeapon(this.objects.splice(this.inRangeItemIndex,1)[0]);
		} else {
			var itemPick = this.objects.splice(this.inRangeItemIndex,1)[0];
			this.myPlayer.pickItem(itemPick);
		}
		this.pickItem = false;
	}
	
	if (this.myPlayer.isAlive()) {
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
		var pSpeed = this.myPlayer.getSpeed();
		delta_x *= pSpeed;
		delta_y *= pSpeed;
		this.myPlayer.move(delta_x,delta_y);
		this.moveScreenBy(delta_x,delta_y);
		
		if (this.lMBDown) {
			this.myPlayer.attack();
		}
		
		// Shows pickup ui if near any item and pick it up if 'F' is pressed
		this.inRangeItemIndex = -1;
		for(i = 0; i < this.objects.length; i++) {
			if (this.objects[i] instanceof item) {	
				if (this.objects[i].inRange(this.myPlayer.getX(), this.myPlayer.getY())) {
					document.getElementById("pick-item").innerHTML = this.objects[i].getName();
					document.getElementById("ui-lower").style.display = "block";
					this.inRangeItemIndex = i;
					break;
				}
			}
		}
		if (this.inRangeItemIndex != -1) {
			document.getElementById("ui-lower").style.display = "block";
		} else if (document.getElementById("ui-lower").style.display == "block") {
			document.getElementById("ui-lower").style.display = "none";
		}
		this.myPlayer.update(this.context);
	}
	for (var i = 0; i < this.objects.length; i++) {
		this.objects[i].update(this.context);
	}
}

//Change fists to create a "zone" between both fists and check for intersection instead
gameArea.prototype.checkPlayerHit = function(fist, damage) {
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
}
gameArea.prototype.keyDown = function(e) {
	this.pressed[e.code] = true;
	if (e.code === 'KeyF' && this.inRangeItemIndex != -1) {
		this.pickItem = true;
	}
}
gameArea.prototype.lMouseDown = function(e) {
	this.pressed['lMBDown'] = true;
}
gameArea.prototype.lMouseUp = function(e) {
	this.pressed['lMBDown'] = false;
}

gameArea.prototype.mouseMove = function(e) {
	this.myPlayer.changeDir(Math.atan2(this.myPlayer.getX() + this.myPlayer.getBody().getXOffset() - this.xOffset - e.pageX, this.myPlayer.getY() + this.myPlayer.getBody().getYOffset() - this.yOffset - e.pageY) * (180 / Math.PI));
}
"use strict";

function gameArea() {
	this.canvas = document.createElement("canvas");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.xOffset = this.canvas.width/2;
	this.yOffset = this.canvas.height/2;
	document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	this.interval = setInterval(this.update.bind(this), 1000/60);
	this.context = this.canvas.getContext("2d");
	this.inRangeItemIndex = -1;
	this.pickItem = false;
	this.pressed = {'KeyW':false, 'KeyA':false, 'KeyS':false, 'KeyD':false, 'KeyF':false, 'lMBDown':false};
	this.players = []
	this.bullets = []
	this.items = []
	this.myCharacter = this.players[0];
}

gameArea.prototype.clear = function() {
	this.context.clearRect(this.xOffset, this.yOffset, this.canvas.width, this.canvas.height);
}

gameArea.prototype.update = function() {
	this.clear();		

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

	this.sendInputChanges();
}

gameArea.prototype.moveScreenBy = function(x,y) {
	this.xOffset += x;
	this.yOffset += y;
	this.context.translate(-x,-y);
}

gameArea.prototype.keyUp = function(e) {
	this.myCharacter.setInput(e.code,false);
}
gameArea.prototype.keyDown = function(e) {
	this.myCharacter.setInput(e.code,true);
	if (e.code === 'KeyF' && this.inRangeItemIndex != -1) {
		this.pickItem = true;
	}
}
gameArea.prototype.lMouseDown = function(e) {
	this.myCharacter.setInput('lMBDown',true);
}
gameArea.prototype.lMouseUp = function(e) {
	this.myCharacter.setInput('lMBDown',false);
}

gameArea.prototype.mouseMove = function(e) {
	this.myCharacter.changeDir(angleFromVec({x:this.myCharacter.getX() + this.myCharacter.getBody().getXOffset(), y:this.myCharacter.getY() + this.myCharacter.getBody().getYOffset()}, {x:this.xOffset + e.pageX, y:this.yOffset + e.pageY}));
}

gameArea.prototype.sendInputChanges = function() {
	socket.emit('input_changes', this.myCharacter.getInput());
}

gameArea.prototype.updateGame = function(players,bullets,items) {
	this.players = players;
	this.bullets = bullets;
	this.items = items;
}
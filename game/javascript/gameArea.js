"use strict";

class gameArea{
	constructor () {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.context = this.canvas.getContext("2d");
		this._xOffset = 0;
		this._yOffset = 0;
		this.xOffset = -this.canvas.width/2;
		this.yOffset = -this.canvas.height/2;
		this.interval = setInterval(this.update.bind(this), 1000/60);
		this.inRangeItemIndex = -1;
		this.pickItem = false;
		this.pressed = {'KeyW':false, 'KeyA':false, 'KeyS':false, 'KeyD':false, 'KeyF':false, 'lMBDown':false};
		this.players = [new player(0,0), new player (200, 200)];
		this.bullets = [];
		this.items = [new item(0, 0, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new ak47(400, 300), new um9(600, 600)];
		this.myCharacter = this.players[0];
	}


	static clear (ctx,xOffset,yOffset,canvasWidth,canvasHeight) {
		ctx.clearRect(xOffset, yOffset, canvasWidth, canvasHeight);
	}

	update () {
		gameArea.clear(this.context,this.xOffset,this.yOffset,this.canvas.width,this.canvas.height);		
		
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
			var pSpeed = this.myCharacter.speed;
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
				if (this.items[i].inRange(this.myCharacter.x, this.myCharacter.y)) {
					document.getElementById("pick-item").innerHTML = this.items[i].name;
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
						this.players[j].health -= (this.bullets[i].dmg);
						this.bullets.splice(i,1);
						break;
					}
				}
			} else {
				this.bullets.splice(i,1);
			}
		}

		this.sendInput();
	}

	moveScreenBy (x,y) {
		this.xOffset += x;
		this.yOffset += y;
	}

	set xOffset(value) {
		this.context.translate(this._xOffset - value,0);
		this._xOffset = value;
		
	}

	get xOffset() {
		return this._xOffset;
	}

	set yOffset(value) {
		this.context.translate(0,this._yOffset - value);
		this._yOffset = value;
	}

	get yOffset() {
		return this._yOffset;
	}

	keyUp (e) {
		this.pressed[e.code] = false;
	}
	keyDown (e) {
		this.pressed[e.code] = true;
	}
	lMouseDown (e) {
		this.pressed['lMBDown'] = true;
	}
	lMouseUp (e) {
		this.pressed['lMBDown'] = false;
	}

	mouseMove (e) {
		this.myCharacter.dir = angleFromVec({x:this.myCharacter.x + this.myCharacter.body.xOffset, y:this.myCharacter.y + this.myCharacter.body.yOffset}, {x:this.xOffset + e.pageX, y:this.yOffset + e.pageY});
	}

	sendInput () {
		socket.emit('player_input', this.pressed);
	}

	updateGame (players) {
		console.log(players);
	}
}
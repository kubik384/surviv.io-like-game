"use strict";

class gameArea {
	constructor() {
		this._canvas = document.createElement("canvas");
		this._canvas.width = window.innerWidth;
		this._canvas.height = window.innerHeight;
		this._xOffset = 0;
		this._yOffset = 0;
		document.body.insertBefore(this._canvas, document.body.childNodes[0]);
		this._interval = setInterval(this._update.bind(this), 1000/60);
		this._context = this.canvas.getContext("2d");
		this._inRangeItemIndex = -1;
		this._pickItem = false;
		this._pressed = {'KeyW':false, 'KeyA':false, 'KeyS':false, 'KeyD':false, 'KeyF':false, 'lMBDown':false};
		this._players = [];
		this._bullets = [];
		this._items = [];
		socket.emit('create_character', this._canvas.width/2, this._canvas.height/2);
	}


	static clear (ctx, xOffset, yOffset, canvasWidth, canvasHeight) {
		ctx.clearRect(xOffset, yOffset, canvasWidth, canvasHeight);
	}

	update () {
		gameArea.clear(this._context, this._xOffset, this._yOffset, this._canvas.width, this._canvas.height);
		socket.emit('player_input', this._pressed);

		if (this._pickItem) {
			if (this._items[this._inRangeItemIndex] instanceof weapon) {
				this._myCharacter.pickWeapon(this._items.splice(this._inRangeItemIndex,1)[0]);
			} else {
				var itemPick = this._items.splice(this._inRangeItemIndex,1)[0];
				this._myCharacter.pickItem(itemPick);
			}
			this._pickItem = false;
		}
		
		if (this._myCharacter.isAlive()) {
			// Character movement
			var delta_x = 0;
			var delta_y = 0;
			if (this._pressed['KeyA']) {
				delta_x -= 1;
			}
			if (this._pressed['KeyW']) {
				delta_y -= 1;
			}
			if (this._pressed['KeyD']) {
				delta_x += 1;
			}
			if (this._pressed['KeyS']) {
				delta_y += 1;
			}
			var pSpeed = this.myCharacter.getSpeed();
			delta_x *= pSpeed;
			delta_y *= pSpeed;
			this._myCharacter.move(delta_x,delta_y);
			this.moveScreenBy(delta_x,delta_y);
			
			if (this._pressed['lMBDown'] && this._myCharacter.isWeaponReady()) {
				var bullet = this._myCharacter.useWeapon();
				if (bullet !== null) {
					this.bullets[this._bullets.length] = bullet;
				}
			}
		}
			

		if (this._myCharacter.isAlive()) {
			// Shows pickup ui if near any item and pick it up if 'F' is pressed
			this._inRangeItemIndex = -1;
			for(i = 0; i < this._items.length; i++) {	
				if (this._items[i].inRange(this._myCharacter.getX(), this._myCharacter.getY())) {
					document.getElementById("pick-item").innerHTML = this._items[i].getName();
					document.getElementById("ui-lower").style.display = "block";
					this._inRangeItemIndex = i;
					break;
				}
			}
			if (this._inRangeItemIndex != -1) {
				document.getElementById("ui-lower").style.display = "block";
			} else if (document.getElementById("ui-lower").style.display == "block") {
				document.getElementById("ui-lower").style.display = "none";
			}
		}

		for (var i = 0; i < this._players.length; i++) {
			if (this._players[i].isAlive()) {
				this._players[i].draw(this._context);
				this._players[i].update();
			} else {
				this._players.splice(i,1);
			}
		}
		for (var i = 0; i < this._items.length; i++) {
			this._items[i].draw(this._context);
		}
		for (var i = 0; i < this._bullets.length; i++) {
			if (!this._bullets[i].hasExpired()) {
				this._bullets[i].update();
				this._bullets[i].draw(this._context);
				for (var j = 0; j < this._players.length; j++) {
					if (this._players[j].isHit(this._bullets[i])){
						this._players[j].takeDamage(this._bullets[i].getDamage());
						this._bullets.splice(i,1);
						break;
					}
				}
			} else {
				this._bullets.splice(i,1);
			}
		}

		//this.sendInputChanges();
	}

	moveScreenBy (x,y) {
		this._xOffset += x;
		this._yOffset += y;
		this._context.translate(-x,-y);
	}

	keyUp (e) {
		this._pressed[e.code] = false;
		//this.myCharacter.setInput(e.code,false);
	}
	keyDown (e) {
		this._pressed[e.code] = true;
		//this.myCharacter.setInput(e.code,true);
	}
	lMouseDown (e) {
		this._pressed['lMBDown'] = true;
		//this.myCharacter.setInput('lMBDown',true);
	}
	lMouseUp (e) {
		this._pressed['lMBDown'] = false;
		//this.myCharacter.setInput('lMBDown',false);
	}

	mouseMove (e) {
		this._myCharacter.changeDir(angleFromVec({x:this._myCharacter.getX() + this._myCharacter.getBody().getXOffset(), y:this._myCharacter.getY() + this._myCharacter.getBody().getYOffset()}, {x:this._xOffset + e.pageX, y:this._yOffset + e.pageY}));
	}

	static sendInputChanges (input) {
		//socket.emit('input_changes', this.myCharacter.getInput());
	}

	updateGame (players,bullets,items) {
		this._players = players;
		this._bullets = bullets;
		this._items = items;
	}

	addCharacter (myCharacter) {
		this._players[0] = myCharacter;
		this._myCharacter = this._players[0];
	}
}
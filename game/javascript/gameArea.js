"use strict";

class gameArea{
	constructor (game_state, myCharacterID) {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.context = this.canvas.getContext("2d");
		this.myCharacterID = myCharacterID;
		this._xOffset = 0;
		this._yOffset = 0;
		this.xOffset = -this.canvas.width/2;
		this.yOffset = -this.canvas.height/2;
		this.inRangeItemIndex = -1;
		this.pickItem = false;
		this.players = {};
		for (var playerID in game_state.players) {
			this.players[playerID] = new player(game_state.players[playerID].x, game_state.players[playerID].y);
		}

		this.bullets = {};
		for (var bulletID in game_state.bullets) {
			this.bullets[bulletID] = new bullet(serverBullet.x, serverBullet.y, serverBullet.vector, serverBullet.speed, serverBullet.dmg, serverBullet.slowdown, serverBullet.lifetime, [new circle(0, 0, 7, "black")]);
		}
		this.input = {'KeyW':false, 'KeyA':false, 'KeyS':false, 'KeyD':false, 'KeyF':false, 'lMBDown':false, 'Dir':this.players[this.myCharacterID].dir};
		this.items = [new item(0, 0, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new ak47(400, 300), new um9(600, 600)];
		this.interval = setInterval(this.update.bind(this), 1000/60);
	}


	static clear (ctx,xOffset,yOffset,canvasWidth,canvasHeight) {
		ctx.clearRect(xOffset, yOffset, canvasWidth, canvasHeight);
	}

	update () {
		gameArea.clear(this.context,this.xOffset,this.yOffset,this.canvas.width,this.canvas.height);					
		if (this.players[this.myCharacterID].isAlive()) {
			// Shows pickup ui if near any item and pick it up if 'F' is input
			this.inRangeItemIndex = -1;
			for(i = 0; i < this.items.length; i++) {	
				if (this.items[i].inRange(this.players[this.myCharacterID].x, this.players[this.myCharacterID].y)) {
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

		for (var playerID in this.players) {
			if (this.players[playerID].isAlive()) {
				this.players[playerID].update(this.context);
			} else {
				delete this.players[playerID];
			}
		}
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].update(this.context);
		}
		for (var bulletID in this.bullets) {
			var bullet = this.bullets[bulletID];
			if (!bullet.hasExpired()) {
				bullet.update(this.context);
				for (var playerID in this.players) {
					if (this.players[playerID].isHit(bullet)){
						this.players[playerID].health -= (bullet.dmg);
						delete this.bullets[bulletID];
						break;
					}
				}
			} else {
				delete this.bullets[bulletID];
			}
		}

		this.processInput();
		this.sendInput();
	}

	processInput() {
		if (this.pickItem) {
			if (this.items[this.inRangeItemIndex] instanceof weapon) {
				this.players[this.myCharacterID].pickWeapon(this.items.splice(this.inRangeItemIndex,1)[0]);
			} else {
				var itemPick = this.items.splice(this.inRangeItemIndex,1)[0];
				this.players[this.myCharacterID].pickItem(itemPick);
			}
			this.pickItem = false;
		}
		
		if (this.players[this.myCharacterID].isAlive()) {
			// Character movement
			var delta_x = 0;
			var delta_y = 0;
			if (this.input['KeyA']) {
				delta_x -= 1;
			}
			if (this.input['KeyW']) {
				delta_y -= 1;
			}
			if (this.input['KeyD']) {
				delta_x += 1;
			}
			if (this.input['KeyS']) {
				delta_y += 1;
			}
			var pSpeed = this.players[this.myCharacterID].speed;
			delta_x *= pSpeed;
			delta_y *= pSpeed;
			this.players[this.myCharacterID].move(delta_x,delta_y);
			this.moveScreenBy(delta_x,delta_y);
			/*
			if (this.input['lMBDown'] && this.players[this.myCharacterID].isWeaponReady()) {
				var bullet = this.players[this.myCharacterID].useWeapon();
				if (bullet !== null) {
					this.bullets.push(bullet);
				}
			}
			*/
		}
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
		this.input[e.code] = false;
	}
	keyDown (e) {
		this.input[e.code] = true;
	}
	lMouseDown (e) {
		this.input['lMBDown'] = true;
	}
	lMouseUp (e) {
		this.input['lMBDown'] = false;
	}

	mouseMove (e) {
		this.players[this.myCharacterID].dir = angleFromVec({x:this.players[this.myCharacterID].x + this.players[this.myCharacterID].body.xOffset, y:this.players[this.myCharacterID].y + this.players[this.myCharacterID].body.yOffset}, {x:this.xOffset + e.pageX, y:this.yOffset + e.pageY});
		this.players[this.myCharacterID].dir -= (this.players[this.myCharacterID].dir !== -180 ? -180 : 0);
		this.input['Dir'] = this.players[this.myCharacterID].dir;
	}

	sendInput () {
		socket.emit('player_input', this.input);
	}

	update_game (game_state_update) {
		for (var playerID in game_state_update.players) {
			var serverPlayer = game_state_update.players[playerID];
			
			if (this.players[playerID] === undefined) {
				this.players[playerID] = new player(serverPlayer.x,serverPlayer.y);
				this.players[playerID].dir = serverPlayer._dir;
			} else {
				this.players[playerID].x = serverPlayer.x;
				this.players[playerID].y = serverPlayer.y;
				this.players[playerID].dir = serverPlayer._dir;
			}
		}

		for (var playerID in this.players) {
			if (game_state_update.players[playerID] === undefined) {
				delete this.players[playerID];
			}
		}

		for (var bulletID in game_state_update.bullets) {
			var serverBullet = game_state_update.bullets[bulletID];
			
			if (this.bullets[bulletID] === undefined) {
				this.bullets[bulletID] = new bullet(serverBullet.x, serverBullet.y, serverBullet.vector, serverBullet.speed, serverBullet.dmg, serverBullet.slowdown, serverBullet.lifetime, [new circle(0, 0, 7, "black")]);
			}
		}

		for (var bulletID in this.bullets) {
			if (game_state_update.bullets[bulletID] === undefined) {
				delete this.bullets[bulletID];
			}
		}
	}
}
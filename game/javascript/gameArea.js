"use strict";

class gameArea{
	constructor (canvas, game_state, myCharacterID) {
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
		this._xOffset = 0;
		this._yOffset = 0;
		this.inRangeItemIndex = -1;
		this.pickItem = false;
		this.input = {};
		this.players = {};
		this.items = {};
		this.bullets = [];
		this.userInterface;
		this.myCharacter;
		this.gameUpdateInterval;
	}

	set xOffset(value) {
		this.context.translate(this._xOffset - value, 0);
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

	addInterface() {
		this.userInterface = new userInterface([new interface_text(5, 20, 'Ping: checking', '20px Arial', 'left', "rgb(0,0,0)"), new rectangle(this.canvas.width/2 - 200, this.canvas.height - 100, 400, 30, 'rgb(255,255,255)', 1), new rectangle(this.canvas.width/2 + 200, this.canvas.height - 100, 0, 30, 'rgb(255,0,0)', 1), new rectangle(this.canvas.width/2 + 200, this.canvas.height - 100, 0, 30, 'rgb(0,0,0)', 1)]);
	}

	addPlayers(players) {
		for (var playerID in players) {
			this.players[playerID] = new player(players[playerID].x, players[playerID].y);
		}
	}

	addBullets(bullets) {
		for (var i = 0; i < bullets.length; i++) {
			this.bullets.push(new bullets[i](bullets[i].x, bullets[i].y, bullets[i].vector, bullets[i].speed, bullets[i].dmg, bullets[i].slowdown, bullets[i].lifetime, [new circle(0, 0, 7, "black")]));
		}
	}

	addItems(items) {
		this.items = [new item(0, 0, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new ak47(400, 300), new um9(600, 600)];
	}

	startGame(myCharacterID) {
		this.myCharacter = this.players[myCharacterID];
		this.centerScreenOnPlayer();
		this.dir['Dir'] = this.myCharacter.dir;
		
		this.gameUpdateInterval = setInterval(this.update.bind(this), 1000/60);
	}

	moveScreenBy (x,y) {
		this.xOffset += x;
		this.yOffset += y;
	}

	centerScreenOnPlayer () {
		this.xOffset = this.myCharacter.x - this.canvas.width/2;
		this.yOffset = this.myCharacter.y - this.canvas.height/2;
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
		for (var i = 0; i < this.bullets.length; i++) {
			var bullet = this.bullets[i];
			if (!bullet.hasExpired()) {
				bullet.update(this.context);
				for (var playerID in this.players) {
					if (this.players[playerID].isHit(bullet)){
						this.players[playerID].health -= (bullet.dmg);
						this.bullets.splice(i,1);
						if (playerID == this.myCharacterID) {
							this.hpBar.width -= bullet.dmg * 4;
							this.removedHPBar.width += bullet.dmg * 4;
							this.removedHPBar.xOffset -= bullet.dmg * 4;
							this.removedHPTimestamp = Date.now();
						}
						break;
					}
				}
			} else {
				this.bullets.splice(i,1);
			}
		}

		if (this.removedHPTimestamp !== 0 && Date.now() - this.removedHPTimestamp> 2000) {
			this.missingHPBar.width += this.removedHPBar.width;
			this.missingHPBar.xOffset = this.removedHPBar.xOffset;
			this.removedHPBar.width = 0;
			this.removedHPTimestamp = 0;
		}

		this.latencyText.update(this.context, this.xOffset, this.yOffset);
		this.removedHPBar.update(this.context, this.xOffset, this.yOffset);
		this.missingHPBar.update(this.context, this.xOffset, this.yOffset);
		this.hpBar.update(this.context, this.xOffset, this.yOffset);

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
			if (typeof this.input['KeyA'] !== 'undefined' && this.input['KeyA']) {
				delta_x -= 1;
			}
			if (typeof this.input['KeyW'] !== 'undefined' && this.input['KeyW']) {
				delta_y -= 1;
			}
			if (typeof this.input['KeyD'] !== 'undefined' && this.input['KeyD']) {
				delta_x += 1;
			}
			if (typeof this.input['KeyS'] !== 'undefined' && this.input['KeyS']) {
				delta_y += 1;
			}
			var pSpeed = this.players[this.myCharacterID].speed;
			delta_x *= pSpeed;
			delta_y *= pSpeed;
			this.players[this.myCharacterID].move(delta_x,delta_y);
			this.moveScreenBy(delta_x,delta_y);
		}
	}

	sendInput () {
		socket.emit('player_input', this.input);
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

	update_game (game_update) {
		for (var playerID in game_update.players) {
			var serverPlayer = game_update.players[playerID];
			var clientPlayer = this.players[playerID];
			
			if (typeof clientPlayer === 'undefined') {
				this.players[playerID] = new player(serverPlayer.x,serverPlayer.y);
				this.players[playerID].dir = serverPlayer._dir;
			} else {
				clientPlayer.x = serverPlayer.x;
				clientPlayer.y = serverPlayer.y;
				clientPlayer.dir = serverPlayer._dir;
			}
		}

		for (var playerID in this.players) {
			if (typeof game_update.players[playerID] === 'undefined') {
				delete this.players[playerID];
			}
		}

		if (game_update.players[this.myCharacterID] !== 'undefined') {
			this.xOffset = game_update.players[this.myCharacterID].x - this.canvas.width/2;
			this.yOffset = game_update.players[this.myCharacterID].y - this.canvas.height/2;
		}

		for (var i = 0; i < game_update.newBullets.length; i++) {
			var serverBullet = game_update.newBullets[i];
			this.bullets.push(new bullet(serverBullet.x, serverBullet.y, serverBullet.vector, serverBullet.speed, serverBullet.dmg, serverBullet.slowdown, serverBullet.lifetime, [new circle(0, 0, 7, "black")]));
		}
	}

	static clear (ctx,xOffset,yOffset,canvasWidth,canvasHeight) {
		ctx.clearRect(xOffset, yOffset, canvasWidth, canvasHeight);
	}
}
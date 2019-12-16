"use strict";

class gameArea{
	constructor (canvas) {
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
		this._xOffset = 0;
		this._yOffset = 0;
		this.zoomXOffsetAdjustment = 0;
		this.zoomYOffsetAdjustment = 0;
		this.inRangeItemIndex = -1;
		this.pickItem = false;
		this.input = {};
		this.players = {};
		this.items = {};
		this.bullets = [];
		this.userInterface;
		this.myCharacter;
		this.myCharacterID;
		this.numberOfUpdates = 0;
		this.updateTimestamp = 0;
		this.zoom = 1;
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
		this.userInterface = new userInterface();
	}

	addPlayers(players, myCharacterID) {
		for (var playerID in players) {
			this.players[playerID] = new player(players[playerID].x, players[playerID].y);
		}
		this.myCharacter = this.players[myCharacterID];
		this.myCharacterID = myCharacterID;
		this.centerScreenOnPlayer();
		this.input['Dir'] = this.myCharacter.dir;
	}

	addBullets(bullets) {
		for (var i = 0; i < bullets.length; i++) {
			this.bullets.push(new bullet(bullets[i].x, bullets[i].y, bullets[i].vector, bullets[i].speed, bullets[i].dmg, bullets[i].slowdown, bullets[i].lifetime, [new circle(0, 0, 7, "black")]));
		}
	}

	addItems(items) {
		this.items = [new item(0, 0, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new item(50, 100, [new circle(0,0, 10, "black", 1, true, "rgb(255,255,255)")]), new ak47(400, 300), new um9(600, 600)];
	}

	startGame() {
		this.update();
	}

	update () {
		gameArea.clear(this.context,this.xOffset,this.yOffset,this.canvas.width,this.canvas.height, this.zoom);
		this.updateItems();
		this.updateBullets();
		this.updatePlayers();
		this.checkItemsInRange();
		this.sendInput();
		this.numberOfUpdates++;
		if (this.updateTimestamp === 0) {
			this.updateTimestamp = Date.now();
		} else {
			if (Date.now() - this.updateTimestamp >= 1000) {
				this.userInterface.debugOverlay.updateFps(this.numberOfUpdates);
				this.updateTimestamp = 0;
				this.numberOfUpdates = 0;
			}
		}
		setTimeout(this.update.bind(this), 1000/60);
	}

	checkItemsInRange() {
		if (this.myCharacter.isAlive()) {
			this.inRangeItemIndex = -1;
			for(var i = 0; i < this.items.length; i++) {	
				if (this.items[i].inRange(this.myCharacter.x, this.myCharacter.y)) {
					this.inRangeItemIndex = i;
					break;
				}
			}
			if (this.inRangeItemIndex != -1) {
				if (this.userInterface.pickItemShown) {
					this.userInterface.showPickItem();
				}
			} else if (this.userInterface.pickItemShown) {
				this.userInterface.hidePickItem();
			}
		}
	}

	updatePlayers() {
		for (var playerID in this.players) {
			this.players[playerID].update(this.context);
		}
	}

	updateItems() {
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].update(this.context);
		}
	}

	updateBullets() {
		for (var i = 0; i < this.bullets.length; i++) {
			var bullet = this.bullets[i];
			if (!bullet.hasExpired()) {
				bullet.update(this.context);
				for (var playerID in this.players) {
					if (this.players[playerID].isHit(bullet)) {
						this.bullets.splice(i,1);
						break;
					}
				}
			} else {
				this.bullets.splice(i,1);
			}
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
		this.myCharacter.dir = angleFromVec({x:this.myCharacter.x + this.myCharacter.body.xOffset, y:this.myCharacter.y + this.myCharacter.body.yOffset}, {x:this.xOffset - this.zoomXOffsetAdjustment + e.pageX, y:this.yOffset - this.zoomYOffsetAdjustment + e.pageY});
		this.myCharacter.dir -= (this.myCharacter.dir !== -180 ? -180 : 0);
		this.input['Dir'] = this.myCharacter.dir;
	}

	sync_data (game_update) {
			this.playerSync(game_update.players);
			this.itemSync(game_update.items);
			this.bulletSync(game_update.newBullets);
	}

	playerSync(serverPlayers) {
		if (typeof serverPlayers !== 'undefined') {
			for (var playerID in serverPlayers) {
				var serverPlayer = serverPlayers[playerID];
				var clientPlayer = this.players[playerID];
				
				//Add new players
				if (typeof clientPlayer === 'undefined') {
					this.players[playerID] = new player(serverPlayer.x,serverPlayer.y);
				}
				//Update certain properties of existing player
				if (playerID === this.myCharacterID) { 
					this.syncMyCharacter(serverPlayers[playerID]);
				}
				this.syncSinglePlayer(this.players[playerID], serverPlayers[playerID]);
			}
			//Delete removed players
			for (var playerID in this.players) {
				if (typeof serverPlayers[playerID] === 'undefined') {
					if (playerID === this.myCharacterID) {
						//gameover text
						this.userInterface.HPBar.update(0, -this.myCharacter.health, this.myCharacter.maxHealth);
						delete this.players[playerID];
					} else {
						delete this.players[playerID];
					}
				}
			}
		}
		this.centerScreenOnPlayer();
	}

	itemSync(items) {
		if (typeof items !== 'undefined') {
			
		}
	}
	
	bulletSync(newBullets) {
		if (typeof newBullets !== 'undefined') {
			for (var i = 0; i < newBullets.length; i++) {
				var serverBullet = newBullets[i];
				this.bullets.push(new bullet(serverBullet.x, serverBullet.y, serverBullet.vector, serverBullet.speed, serverBullet.dmg, serverBullet.slowdown, serverBullet.lifetime, [new circle(0, 0, 7, "black")]));
			}
		}
	}

	syncSinglePlayer(clientPlayer, serverPlayer) {
		for (var attribute in clientPlayer) {
			if (clientPlayer[attribute] !== serverPlayer[attribute] && (attribute === 'x' || attribute === 'y' || attribute === 'health')) {
				clientPlayer[attribute] = serverPlayer[attribute];
			}
		}
		if (clientPlayer.dir !== serverPlayer.dir) {
			clientPlayer.dir = serverPlayer._dir;
		}
	}

	syncMyCharacter(serverMyCharacter) {
		for (var attribute in serverMyCharacter) {
			if (this.myCharacter[attribute] !== serverMyCharacter[attribute] && (attribute === 'x' || attribute === 'y')) {
				this.myCharacter[attribute] = serverMyCharacter[attribute];
			}
			this.userInterface.debugOverlay.updateCoords(this.myCharacter.x, this.myCharacter.y);
		}
		if (serverMyCharacter.health !== this.myCharacter.health) {
			this.userInterface.HPBar.update(serverMyCharacter.health, serverMyCharacter.health - this.myCharacter.health, this.myCharacter.maxHealth);
			this.myCharacter.health = serverMyCharacter.health;
		}
		if (this.myCharacter.dir !== serverMyCharacter.dir) {
			this.myCharacter.dir = serverMyCharacter._dir;
		}
	}

	zoomIn() {
		this.zoom *= 1.25;
		this.zoomXOffsetAdjustment += this.myCharacter.x * 0.2;
		this.zoomYOffsetAdjustment += this.myCharacter.y * 0.2;
		this.context.scale(1.25, 1.25);
	}

	zoomOut() {
		this.zoom *= 0.8;
		this.zoomXOffsetAdjustment -= this.myCharacter.x * 0.25;
		this.zoomYOffsetAdjustment -= this.myCharacter.y * 0.25;
		this.context.scale(0.8, 0.8);
	}

	centerScreenOnPlayer () {
		this.xOffset = this.myCharacter.x + this.zoomXOffsetAdjustment - this.canvas.width/2;
		this.yOffset = this.myCharacter.y + this.zoomYOffsetAdjustment - this.canvas.height/2;
	}

	static clear (ctx,xOffset,yOffset,canvasWidth,canvasHeight,zoom) {
		ctx.clearRect(xOffset - (canvasWidth / zoom - canvasWidth)/2, yOffset - (canvasHeight / zoom - canvasHeight)/2, canvasWidth / zoom, canvasHeight / zoom);
	}
}
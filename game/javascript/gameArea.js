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

	addPlayers(players, myCharacterID) {
		for (var playerID in players) {
			this.players[playerID] = new player(players[playerID].x, players[playerID].y);
		}
		this.myCharacter = this.players[myCharacterID];
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
		this.gameUpdateInterval = setInterval(this.update.bind(this), 1000/60);
	}

	update () {
		gameArea.clear(this.context,this.xOffset,this.yOffset,this.canvas.width,this.canvas.height);
		this.processInput();
		this.updatePlayers();
		this.updateItems();
		this.updateBullets();
		this.checkItemsInRange();
		this.updateUserInterface();
		this.sendInput();
	}

	processInput() {
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
			var pSpeed = this.myCharacter.speed;
			delta_x *= pSpeed;
			delta_y *= pSpeed;
			this.myCharacter.move(delta_x,delta_y);
			this.moveScreenBy(delta_x,delta_y);
		}
	}

	checkItemsInRange() {
		if (this.myCharacter.isAlive()) {
			this.inRangeItemIndex = -1;
			for(var i = 0; i < this.items.length; i++) {	
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
	}

	updatePlayers() {
		for (var playerID in this.players) {
			if (this.players[playerID].isAlive()) {
				this.players[playerID].update(this.context);
			} else {
				delete this.players[playerID];
			}
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
						this.players[playerID].health -= (bullet.dmg);
						this.bullets.splice(i,1);
						break;
					}
				}
			} else {
				this.bullets.splice(i,1);
			}
		}
	}

	updateUserInterface() {
		
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
		this.myCharacter.dir = angleFromVec({x:this.myCharacter.x + this.myCharacter.body.xOffset, y:this.myCharacter.y + this.myCharacter.body.yOffset}, {x:this.xOffset + e.pageX, y:this.yOffset + e.pageY});
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
				//Update certain properties of existing players
				if (playerID === this.myCharacterID) {
					this.syncMyCharacter(serverPlayers[playerID]);
				} else {
					this.syncSinglePlayer(this.players[playerID], serverPlayers[playerID]);
				}
			}
			//Delete removed players
			for (var playerID in this.players) {
				if (typeof serverPlayers[playerID] === 'undefined') {
					if (playerID === this.myCharacterID) {
						//gameover text
						delete this.players[playerID]
					} else {
						delete this.players[playerID];
					}
				}
			}
		}
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
		clientPlayer.dir = serverPlayer._dir;
	}
	
	syncMyCharacter(serverMyCharacter) {
		if (this.myCharacter.health !== serverMyCharacter.health) {
			//update interface
			this.myCharacter.health = serverMyCharacter.health;
		}
		
		for (var attribute in this.myCharacter) {
			if (this.myCharacter[attribute] !== serverMyCharacter[attribute] && (attribute === 'x' || attribute === 'y')) {
				this.myCharacter[attribute] = serverMyCharacter[attribute];
			}
		}
		this.centerScreenOnPlayer();
	}
	
	moveScreenBy (x,y) {
		this.xOffset += x;
		this.yOffset += y;
	}

	centerScreenOnPlayer () {
		this.xOffset = this.myCharacter.x - this.canvas.width/2;
		this.yOffset = this.myCharacter.y - this.canvas.height/2;
	}

	static clear (ctx,xOffset,yOffset,canvasWidth,canvasHeight) {
		ctx.clearRect(xOffset, yOffset, canvasWidth, canvasHeight);
	}
}
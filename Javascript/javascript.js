function circle(x, y, radius, color, stroke = false) {
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
			ctx.stroke();
		}		
	}
}

function player(x, y) {
	this.body = new circle(x, y, 30, "rgb(244, 217, 66)");
	this.leftHand = new circle(x - 24, y - 23, 10, "rgb(244, 217, 66)", true);
	this.rightHand = new circle(x + 24, y - 23, 10, "rgb(244, 217, 66)", true);
	this.punch = false;
	this.punchFrame = 0;
	this.update = function() {
		if (this.punch) {
			this.punchFrame += 1;
			if (this.punchFrame < 9) {
				this.rightHand.x -= 3;
				this.rightHand.y -= 3;
			} else if (this.punchFrame < 17) {
				this.rightHand.x += 3;
				this.rightHand.y += 3;
			} else {
				this.punch = false;
				this.punchFrame = 0;
			}
		}
		this.body.draw();
		this.leftHand.draw();
		this.rightHand.draw();
	}
}

function item(x,y) {
	this.circle = new circle(x, y, 20, "rgb(255, 255, 255)", true);
	this.update = function(xOffset, yOffset) {
		this.circle.draw(xOffset, yOffset);
	}
	this.inRange = function(x,y) {
		var maxRange = 10;
		return ((Math.abs(this.x - x) < maxRange) && (Math.abs(this.y - y) < maxRange));
	}
}

var gameArea = {
	canvas : document.createElement("canvas"),
	init : function () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.background = new Image();
		this.background.src = "Images/background.png";
		this.xOffset = 0;
		this.yOffset = 0;
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		interval : setInterval(this.update, 20);
		this.context = this.canvas.getContext("2d");
		this.player = new player(Math.floor(this.canvas.width/2), Math.floor(this.canvas.height/2));
		this.pressed = {'KeyW' : false, 'KeyA' : false, 'KeyS' : false, 'KeyD' : false};
		this.speed = 5;
		this.items = [new item(50, 100), new item(400, 300)];
		window.addEventListener('keydown', function(e) {
			gameArea.pressed[e.code] = true;
		})
		window.addEventListener('keyup', function(e) {
			gameArea.pressed[e.code] = false;
		})
		window.addEventListener('mousedown', function(e) {
			gameArea.player.punch = true;
		})
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	drawBg : function () {
		this.context.drawImage(this.background, this.xOffset, this.yOffset);
	},
	update : function() {
		gameArea.clear();
		gameArea.drawBg();
		for(i = 0; i < gameArea.items.length; i++) {
			gameArea.items[i].update(gameArea.xOffset, gameArea.yOffset);
		}
		
		// Character movement //
		var delta_x = 0;
		var delta_y = 0;
		if (gameArea.pressed['KeyA']) {
			delta_x += 1 * gameArea.speed;
		}
		if (gameArea.pressed['KeyW']) {
			delta_y += 1 * gameArea.speed;
		}
		if (gameArea.pressed['KeyD']) {
			delta_x -= 1 * gameArea.speed;
		}
		if (gameArea.pressed['KeyS']) {
			delta_y -= 1 * gameArea.speed;
		}
		gameArea.xOffset += delta_x;
		gameArea.yOffset += delta_y;
		//--------------------------------------//
		gameArea.player.update();
	}
}
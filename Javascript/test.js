var player;
var myObstacles = [];
var score;

function startGame() {
	gameArea.start();
	player = new rect(10, 120, 30, 30, "red");
	score = new txt("30px", "Consolas", "black", 280, 40, "text");
}

function rect(x, y, width, height, color, type) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.update = function() {
		var ctx = gameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	this.clicked = function() {
		var clicked = true;
		var myTop = this.y;
		var myBottom = this.y + this.height;
		var myLeft = this.x;
		var myRight = this.x + this.width;
		if ((myTop > gameArea.y) || (myBottom < gameArea.y) || (myLeft > gameArea.x) || (myRight < gameArea.x)) {
			clicked = false;
		}
		return clicked;
	}
	this.crashWith = function (rect) {
		var myTop = this.y;
		var myBottom = this.y + this.height;
		var myLeft = this.x;
		var myRight = this.x + this.width;
		
		var otherTop = rect.y;
		var otherBottom = rect.y + rect.height;
		var otherLeft = rect.x;
		var otherRight = rect.x + rect.width;
		
		var crash = true;
		if ((myBottom < otherTop) || (myTop > otherBottom) || (myLeft > otherRight) || (myRight < otherLeft)) {
			crash = false;
		}
		return crash;
	}
}

function txt(size, font, color, x, y, txt) {
	this.size = size;
	this.font = font;
	this.color = color;
	this.x = x;
	this.y = y;
	this.txt = txt;
	this.update = function() {
		var ctx = gameArea.context;
		ctx.font = this.size + " " + this.font;
		ctx.fillStyle = color;
		ctx.fillText(this.txt, this.x, this.y);
	}
}

function updateGameArea() {
	var x, y;
	for (i = 0; i < myObstacles.length; i += 1) {
        if (player.crashWith(myObstacles[i])) {
            gameArea.stop();
            return;
        } 
    }
	gameArea.clear();
	gameArea.frameNo += 1;
	if (gameArea.frameNo == 1 || everyinterval(150)) {
		x = gameArea.canvas.width;
		y = gameArea.canvas.height;
		minHeight = 20;
        maxHeight = 100;
		height = Math.floor(Math.random()*(maxHeight - minHeight + 1) + minHeight);
		minGap = 50;
		maxGap = 100;
		gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
		myObstacles.push(new rect(x, 0, 10, height, "green"));
        myObstacles.push(new rect(x, height + gap, 10, y - height - gap, "green"));
    }
	for (i = 0; i < myObstacles.length; i += 1) {
		obstacleRight = myObstacles[i].x + myObstacles[i].width;
		if (obstacleRight < 0) {
			myObstacles.splice(i, 1);
		}
		myObstacles[i].x -= 1;
        myObstacles[i].update();
	}
	if (gameArea.keys["ArrowUp"]) {
		player.y -= 1;
	}
	if (gameArea.keys["ArrowDown"]) {
		player.y += 1;
	}
	if (gameArea.keys["ArrowLeft"]) {
		player.x -= 1;
	}
	if (gameArea.keys["ArrowRight"]) {
		player.x += 1;
	}
	score.txt = "Score: " + gameArea.frameNo;
	player.update();
	score.update();
}

var gameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 480;
		this.canvas.height = 270;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
		this.frameNo = 0;
		this.keys = {"ArrowUp" : false, "ArrowDown" : false, "ArrowLeft" : false, "ArrowRight" : false}
		window.addEventListener('keydown', function (e) {
			gameArea.keys[e.code] = true;
		})
		window.addEventListener('keyup', function (e) {
			gameArea.keys[e.code] = false;
		})
	},
	clear : function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function () {
		clearInterval(this.interval);
	}
}

function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
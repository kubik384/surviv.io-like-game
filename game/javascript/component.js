"use strict";

class component {
	constructor (xOffset = 0, yOffset = 0) {
		this.xOffset = xOffset;
		this.yOffset = yOffset;
}

	setXYOffset (x,y) {
		this.xOffset = x;
		this.yOffset = y;
	}

	getXYOffset () {
		return [this.xOffset,this.yOffset];
	}
}

class shape extends component {
	constructor (xOffset, yOffset, fillColor, lineWidth, stroke = false, strokeColor = "rgb(255,255,255)", angle = 0) {
		super(xOffset, yOffset);
		this.fillColor = fillColor;
		this.lineWidth = lineWidth;
		this.stroke = stroke;
		this.strokeColor = strokeColor;
		this.angle = angle;
	}
}

class circle extends shape {
	constructor (xOffset, yOffset, radius, fillColor = "rgb(255,255,255)", lineWidth = 1, stroke = false, strokeColor = null) {
		super(xOffset, yOffset, fillColor, lineWidth, stroke, strokeColor);
		this.radius = radius;
	}

	circleIntersection (x1,x2,y1,y2,circle) {

	}

	isIntersectingCircle (x1,x2,y1,y2,circle) {
		x1 = x1 + this.xOffset;
		y1 = y1 + this.yOffset;
		x2 = x2 + circle.xOffset;
		y2 = y2 + circle.yOffset;
		return ((Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2)) < (Math.pow((this.radius + circle.radius),2)));
	}

	update (ctx, x, y, rotCenterPoint = {x:0,y:0}) {
		if (this.angle != 0) {
			ctx.save();
			ctx.translate(rotCenterPoint.x, rotCenterPoint.y);
			if (this.angle < 0) {
				ctx.rotate((this.angle + ((Math.abs(this.angle) - 90) * 2)) * Math.PI/180);
			} else {
				ctx.rotate((this.angle - ((Math.abs(this.angle) - 90) * 2)) * Math.PI/180);
			}
			ctx.translate(-rotCenterPoint.x, -rotCenterPoint.y);
		}
		ctx.beginPath();
		ctx.arc(x + this.xOffset, y + this.yOffset, this.radius, 0, 2 * Math.PI);
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillColor;
		ctx.fill();
		if (this.stroke) {
			ctx.strokeStyle = this.strokeColor;
			ctx.stroke();
		}
		if (this.angle != 0) {
			ctx.restore();
		}
	}
}

class rectangle extends shape {
	constructor (xOffset, yOffset, width, height, fillColor, lineWidth, stroke = false, strokeColor = "rgb(255,255,255)", angle = 0) {
		super(xOffset, yOffset, fillColor, lineWidth, stroke, strokeColor, angle);
		this.width = width;
		this.height = height;
	}

	update (ctx, x, y, rotCenterPoint = {x:0,y:0}) {
		if (this.angle != 0) {
			ctx.save();
			ctx.translate(rotCenterPoint.x, rotCenterPoint.y);
			if (this.angle < 0) {
				ctx.rotate((this.angle + ((Math.abs(this.angle) - 90) * 2)) * Math.PI/180);
			} else
			{
				ctx.rotate((this.angle - ((Math.abs(this.angle) - 90) * 2)) * Math.PI/180);
			}
			ctx.translate(-rotCenterPoint.x, -rotCenterPoint.y);
		}
		ctx.beginPath();
		ctx.rect(x + this.xOffset, y + this.yOffset, this.width, this.height); 
		ctx.fillStyle = this.fillColor;	
		ctx.fill();
		if (this.stroke) {
			ctx.lineWidth = this.lineWidth;
			ctx.strokeStyle = this.strokeColor;
			ctx.stroke();
		}
		if (this.angle != 0) {
			ctx.restore();
		}
	}
}

class interface_text extends component {
	constructor(xOffset, yOffset, text, font = "20px Arial", textAlign = 'center', fillStyle = "rgb(255,255,255)", stroke = false, strokeColor = "rgb(255,255,255)", angle = 0) {
		super(xOffset, yOffset);
		this.text = text;
		this.font = font;
		this.textAlign = textAlign;
		this.fillStyle = fillStyle;
		this.stroke = stroke;
		this.strokeColor = strokeColor;
		this.angle = angle;
	}

	update(ctx, x, y, rotCenterPoint = {x:0,y:0}) {
		if (this.angle != 0) {
			ctx.save();
			ctx.translate(rotCenterPoint.x, rotCenterPoint.y);
			if (this.angle < 0) {
				ctx.rotate((this.angle + ((Math.abs(this.angle) - 90) * 2)) * Math.PI/180);
			} else
			{
				ctx.rotate((this.angle - ((Math.abs(this.angle) - 90) * 2)) * Math.PI/180);
			}
			ctx.translate(-rotCenterPoint.x, -rotCenterPoint.y);
		}
		ctx.font = this.font;
		ctx.textAlign = this.textAlign;
		if (this.stroke) {
			ctx.strokeStyle = this.strokeColor;
			ctx.strokeText(this.text, x + this.xOffset, y + this.yOffset);
		} else {
			ctx.fillStyle = this.fillStyle;
			ctx.fillText(this.text, x + this.xOffset, y + this.yOffset);
		}
		if (this.angle != 0) {
			ctx.restore();
		}
	}
}

class img extends component {
	constructor () {
	}

	draw () {
		ctx.drawImage(img, x, y);
	}
}
"use strict";

function component(xOffset = 0, yOffset = 0) {
	this.xOffset = xOffset;
	this.yOffset = yOffset;
}

component.prototype.getXOffset = function() {
	return this.xOffset;
}

component.prototype.getYOffset = function() {
	return this.yOffset;
}

component.prototype.setXYOffset = function(x,y) {
	this.xOffset = x;
	this.yOffset = y;
}

component.prototype.getXYOffset = function() {
	return [this.xOffset,this.yOffset];
}

shape.prototype = Object.create(component.prototype);
function shape(xOffset, yOffset, fillColor, lineWidth, stroke = false, strokeColor = "rgb(255,255,255)", angle = 0) {
	component.call(this, xOffset, yOffset);
	this.fillColor = fillColor;
	this.lineWidth = lineWidth;
	this.stroke = stroke;
	this.strokeColor = strokeColor;
	this.angle = angle;
}

shape.prototype.setAngle = function(angle) {
	this.angle = angle;
}

circle.prototype = Object.create(shape.prototype);
function circle(xOffset, yOffset, radius, fillColor = "rgb(255,255,255)", lineWidth = 1, stroke = false, strokeColor = null, rotCenterPoint = 0) {
	shape.call(this, xOffset, yOffset, fillColor, lineWidth, stroke, strokeColor);
	this.radius = radius;
}

circle.prototype.circleIntersection = function(x1,x2,y1,y2,circle) {

}

circle.prototype.isIntersectingCircle = function(x1,x2,y1,y2,circle) {
	x1 = x1 + this.xOffset;
	y1 = y1 + this.yOffset;
	x2 = x2 + circle.getXOffset();
	y2 = y2 + circle.getYOffset();
	return ((Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2)) < (Math.pow((this.radius + circle.getRadius()),2)));
}

circle.prototype.getRadius = function () {
	return this.radius;
}

circle.prototype.update = function(ctx, x, y, rotCenterPoint = {x:0,y:0}) {
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

rectangle.prototype = Object.create(shape.prototype);
function rectangle(xOffset, yOffset, width, height, fillColor, lineWidth, stroke = false, strokeColor = "rgb(255,255,255)", angle = 0) {
	shape.call(this, xOffset, yOffset, fillColor, lineWidth, stroke, strokeColor, angle);
	this.width = width;
	this.height = height;
}

rectangle.prototype.update = function(ctx, x, y, rotCenterPoint = {x:0,y:0}) {
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
	ctx.lineWidth = this.lineWidth;
	ctx.fillStyle = this.fillColor;
	ctx.rect(x + this.xOffset, y + this.yOffset, this.width, this.height); 
	ctx.fill();
	if (this.stroke) {
		ctx.strokeStyle = this.strokeColor;
		ctx.stroke();
	}
	if (this.angle != 0) {
		ctx.restore();
	}
}

rectangle.prototype.getWidth = function() {
	return this.width;
}

rectangle.prototype.getHeight = function() {
	return this.height;
}
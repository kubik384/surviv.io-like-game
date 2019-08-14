function vecFromAngle(angle, length = 1) {
    angle = angle * Math.PI / 180;
    return {x:length * Math.sin(angle), y:length * Math.cos(angle)};
}

function angleFromVec(fromPoint, vec) {
	return Math.atan2(fromPoint.x - vec.x, fromPoint.y - vec.y) * (180 / Math.PI);
}

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle;
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
	var ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return {x:nx,y:ny};
}
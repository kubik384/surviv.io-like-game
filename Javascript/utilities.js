function vecFromAngle(angle, length = 1) {
    angle = angle * Math.PI / 180;
    return {x:length * Math.sin(angle), y:length * Math.cos(angle)};
}

function angleFromVec(startingPoint, vec) {
	return Math.atan2(startingPoint.x - vec.x, startingPoint.y - vec.y) * (180 / Math.PI);
}
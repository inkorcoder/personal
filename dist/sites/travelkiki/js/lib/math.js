// Converts from degrees to radians.
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
};

Math.easing = {
	// no easing, no acceleration
	linear: function (t) { return t },
	// accelerating from zero velocity
	easeInQuad: function (t) { return t*t },
	// decelerating to zero velocity
	easeOutQuad: function (t) { return t*(2-t) },
	// acceleration until halfway, then deceleration
	easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
	// accelerating from zero velocity 
	easeInCubic: function (t) { return t*t*t },
	// decelerating to zero velocity 
	easeOutCubic: function (t) { return (--t)*t*t+1 },
	// acceleration until halfway, then deceleration 
	easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
	// accelerating from zero velocity 
	easeInQuart: function (t) { return t*t*t*t },
	// decelerating to zero velocity 
	easeOutQuart: function (t) { return 1-(--t)*t*t*t },
	// acceleration until halfway, then deceleration
	easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
	// accelerating from zero velocity
	easeInQuint: function (t) { return t*t*t*t*t },
	// decelerating to zero velocity
	easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
	// acceleration until halfway, then deceleration 
	easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

// lerp
Math.lerp = function(point1, point2, t){
	return [
		point1[0] + (point2[0] - point1[0]) * t,
		point1[1] + (point2[1] - point1[1]) * t
	]
}

// clamp
Math.clamp = function(value, min, max){
	return value > max ? max : value < min ? min : value;
}


// normal
Math.getNormal = function(vectorA, vectorB){
	var x = vectorB[0] - vectorA[0];
	var y = vectorB[1] - vectorA[1];
	var length = Math.sqrt(x * x + y * y);
	var vector = [-y/length, x/length];
	// var angle = Math.getAngleFromVector(vector)-Math.PI/2;
	return vector;
};

Math.getNormal2 = function(vectorA, vectorB){
	var x = vectorB[0] - vectorA[0];
	var y = vectorB[1] - vectorA[1];
	var length = Math.sqrt(x * x + y * y);
	var vector = [y/length, -x/length];
	// var angle = Math.getAngleFromVector(vector)-Math.PI/2;
	return vector;
};

// angle
Math.getAngleFromVector = function(vector) {
	return Math.atan2(vector[1], vector[0]);
};

// get angle from path
Math.getAngleFromPath = function(vectorA, vectorB) {
	return Math.getAngleFromVector([
		vectorB[0] - vectorA[0],
		vectorB[1] - vectorA[1]
	]);
};
// middle of path
Math.getCenterOfPath = function(vectorA, vectorB){
	var vector = [
		vectorA[0] + (vectorB[0] - vectorA[0]) / 2,
		vectorA[1] + (vectorB[1] - vectorA[1]) / 2
	];
	return vector;
};

// length
Math.getLengthOfPath = function(vectorA, vectorB){
	var x = vectorB[0] - vectorA[0],
			y = vectorB[1] - vectorA[1];
	return Math.sqrt(x * x + y * y);
};

// max
Math.maxVector = function(vectorA, vectorB){
	return [
		Math.max(vectorA[0], vectorB[0]),
		Math.max(vectorA[1], vectorB[1])
	];
};

// min
Math.minVector = function(vectorA, vectorB){
	return [
		Math.min(vectorA[0], vectorB[0]),
		Math.min(vectorA[1], vectorB[1])
	];
};

Math.getNormalFromVectors = function(vectorA, vectorB){
	var center = Math.getCenterOfPath(vectorA, vectorB),
			x = (vectorA[0] + vectorB[0]) / 2,
			y = (vectorA[1] + vectorB[1]) / 2,
			length = Math.sqrt(x*x + y*y),
			angle = Math.atan2(y, x);
	// console.log(angle);
	return [x/length, y/length];
};

Math.formatTime = function(time){
	time = parseInt(time);
	return time > 9 ? time : "0"+time;
};

Math.createPolyline = function(vectorA, vectorB, arcOffset){
	var segments = 20,
			path = [],
			arc = arcOffset || -0.1 + Math.random() * 0.2;

	for (var i = 0; i <= segments; i++){
		var progress = i/segments,
				segment = Math.lerp(vectorA, vectorB, progress);
		// segment[0] += Math.sin(i/segments)*10*Math.PI;
		segment[0] += (Math.sin(progress*(Math.PI)) * (5 * arc));
		// console.log(segment);
		// segment[1] -= (Math.sin(progress*(Math.PI)) * (5 * arc));
		path.push(segment);
	}
	// console.log(path)

	return path;
};

Math.getLength = function(a, b){
	var a = a < 0 ? a*-1 : a;
	var b = b < 0 ? b*-1 : b;
	return a + b;
};
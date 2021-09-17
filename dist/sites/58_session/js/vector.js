function degreesToRadians(degrees){
	return degrees * (Math.PI / 180);
}
function radiansToDegrees(radians){
	return radians * (180 / Math.PI);
}
function lerp(a, b, t){
	return a + ((b - a) * t);
}
Array.prototype.end = function(end){
	return this[this.length - (end || 0) - 1]
};

function Vector(x, y) {

	this.x = x || 0;
	this.y = y || 0;

	this.velocity = 0;

	this.add = function(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	}

	this.subtract = function(vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	}

	this.multiply = function(multiplier) {
		return new Vector(this.x * multiplier, this.y * multiplier);
	}

	this.divide = function(divider) {
		return new Vector(this.x / divider, this.y / divider);
	}

	this.getLength = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	this.getAngle = function() {
		return Math.atan2(this.y, this.x);
	}

	this.scale = function(x, y) {
		x = x || 1;
		y = y || 1;
		this.x *= x;
		this.y *= y;
		return this;
	}

	this.distanceTo = function(vector) {
		return vector.subtract(this).getLength();
	}

	this.clone = function() {
		return new Vector(this.x, this.y);
	}

	this.abs = function() {
		if (this.x < 0) this.x *= -1;
		if (this.y < 0) this.y *= -1;
		return this;
	}

	this.fill = function(value) {
		return new Vector(this.x || value, this.y || value);
	}

	this.floor = function(){
		return new Vector(Math.floor(this.x), Math.floor(this.y));
	}

	this.setLength = function(length) {
		let angle = this.getAngle();
		this.x = length * Math.cos(angle);
		this.y = length * Math.sin(angle);
		return this;
	}

	this.setAngle = function(angle) {
		let length = this.getLength();
		this.x = length * Math.cos(angle);
		this.y = length * Math.sin(angle);
		return this;
	}

	this.getMiddleWith = function(vector){
		return this.clone().add(vector).divide(2);
	}
}
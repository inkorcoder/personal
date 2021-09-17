if (!window.requestAnimationFrame){

	window.requestAnimationFrame = (function(){
		return (
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback, element ) {
				window.setTimeout( callback, 1000 / 60 );
			})
	})();

}

$(document).ready(function(){

	var canvas = $('#thanks-canvas')[0],
	parent = $('#thanks-canvas').parent(),
	context = canvas.getContext('2d'),
	width = 0,
	height = 0,
	playing = true,
	points = [],
	hovered = false,
	lineWidth = 5,
	pointsLength = 3,
	speed = 1,
	offset = 15,
	dotColor = $(canvas).attr('data-dot-color') || "#ddd",
	lineColor = $(canvas).attr('data-line-color') || "#444",
	bgColor = $(canvas).attr('data-bg-color') || "#444";

	function updateRects(){
		width = canvas.width = parent.outerWidth() * 2;
		height = canvas.height = parent.outerHeight() * 2;
	};
	updateRects();

	var Vector = function(x, y){
		this.x = x || 0;
		this.y = y || 0;

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
		this.setAngle = function(angle) {
			var length = this.getLength(),
			x = Math.sin(angle) * length,
			y = Math.cos(angle) * length;
			this.x = x;
			this.y = y;
			return this;
		}
		this.getAngle = function() {
			return Math.atan2(this.y, this.x);
		}
		this.setLength = function(length) {
			var angle = this.getAngle(),
			x = Math.sin(angle) * length,
			y = Math.cos(angle) * length;
			this.x = x;
			this.y = y;
			return this;
		}
		this.getLength = function() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
		this.clone = function(){
			return new Vector(this.x, this.y);
		}
		this.distanceTo = function(vector){
			var x = vector.x - this.x,
			y = vector.y - this.y;
			return Math.sqrt(x*x + y*y);
		}
	}

	var Point = function(x, y, r){
		this.pos = new Vector(x || 0, y || 0);
		this._pos = new Vector(x || 0, y || 0);
		this.dir = new Vector();
		this.angle = (Math.PI*2)*Math.random();
		this.movementDir = (Math.random() - 0.5);
		this.r = r || 5;

		this.render = function(ctx, middle){
			if (!ctx) console.error('There is no context for Point');
			if (middle){
				ctx.beginPath();
				ctx.fillStyle = bgColor;
				ctx.strokeStyle = lineColor;
				ctx.lineWidth = 2;
				ctx.arc(this.pos.x, this.pos.y, this.r+4, 0, Math.PI*2);
				ctx.fill();
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.fillStyle = lineColor;
			ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
			ctx.fill();
		};
	};

	var mouse = new Vector();

	for (var i = 0; i < pointsLength; i++){
		points.push(new Point(56 + (width-112) * i / (pointsLength+1) + (width-112) / (pointsLength+1), height/2));
	}

	function drawBezierCurve(A, B){
		context.beginPath();
		var mid = new Vector(A.x + (B.x - A.x) / 2, A.y + (B.y - A.y) / 2);
		context.moveTo(A.x, A.y);
		context.bezierCurveTo(mid.x, A.y, mid.x, B.y, B.x, B.y);
		context.stroke();
	};

	var count = 0;

	function animate(){

		context.clearRect(0, 0, width, height);

		context.lineJoin = "round";
		context.lineCap = "round";

		var start = new Vector(46 + Math.sin(count/10 * speed) * -1 * offset, height/2),
				end = new Vector(width-46 - Math.sin(count/10 * speed) * -1 * offset, height/2);

		context.strokeStyle = dotColor;
		context.fillStyle = dotColor;
		context.lineWidth = lineWidth+2;
		context.beginPath();
		context.arc(start.x, start.y, 12, 0, Math.PI*2);
		context.stroke();
		context.beginPath();
		context.arc(end.x, end.y, 12, 0, Math.PI*2);
		context.stroke();

		context.strokeStyle = lineColor;
		context.fillStyle = lineColor;

		for (var i = 0; i < points.length; i++){
			if (points.length >= 1) {
				var A = points[i-1] ? points[i-1].pos : start,
						B = points[i].pos;
				drawBezierCurve(A, B);
			}
			if (points.length >= 1 && i === points.length - 1){
				var A = points[i].pos,
						B = end;
				drawBezierCurve(A, B);
			}
			// if (Math.abs(i % 2) == 1){
			// 	points[i].pos.y = points[i]._pos.y + Math.cos(count/10 * speed) * 20;
			// }
		}
		for (var i = 0; i < points.length; i++){
			if (i % 2 === 0){
				points[i].pos.y = points[i]._pos.y + (Math.sin(count/10 * speed) - 1) * offset;
				points[i].render(context, true);
			}
		}


		if (playing){
			requestAnimationFrame(animate);
			count++;
		}
	};
	animate();

	$(window).resize(function() {
		waitForFinalEvent(function() {
			updateRects();
			// animate();
		}, 300, "canvas-offers");
	});

});
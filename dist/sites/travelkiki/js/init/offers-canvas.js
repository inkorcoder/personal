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

		this.render = function(ctx){
			if (!ctx) console.error('There is no context for Point');
			ctx.beginPath();
			ctx.fillStyle = "#3d3f48";
			ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
			ctx.fill();
		};
	};


	$('.offers-animation').each(function(i, element) {
		var canvas = element;

		var parent = $(element).parent(),
		context = canvas.getContext('2d'),
		width = 0,
		height = 0,
		playing = false,
		points = [],
		hovered = false;

		function updateRects(){
			width = canvas.width = parent.outerWidth() * 2;
			height = canvas.height = parent.outerHeight() * 2;
		};
		updateRects();

		function isValid(vector){
			for (var i = 0; i < points.length; i++){
				if (vector.distanceTo(points[i].pos) < 30){
					return false;
				}
			}
			return true;
		};

		for (var i = 0; i < 100; i++){
			var x = Math.random() * width,
			y = Math.random() * height;
			if (isValid(new Vector(x, y))){
				points.push(new Point(x, y, 3 + Math.random() * 5));
			}
		}

		var mouse = new Vector();

		parent.mouseenter(function(){
			hovered = true;
			if (!playing){
				playing = true;
				animate();
			}
		});

		parent.mousemove(function(e){
			var rect = parent[0].getBoundingClientRect();
			mouse.x = -((e.clientX - rect.left) / parent.width() - 0.5) * 2;
			mouse.y = -((e.clientY - rect.top) / parent.height() - 0.5) * 2;
			if (!playing){
				playing = true;
				animate();
			}
		});

		parent.mouseleave(function(){
			hovered = false;
			if (playing){
				setTimeout(function(){
					playing = false;
				}, 500);
			}
			mouse.x = 0;
			mouse.y = 0;
		});

		var bias = 0.95;
		var curvePoint = new Vector(0, height/2);

		function animate(){

			context.clearRect(0, 0, width, height);
			for (var i = 0; i < points.length; i++){
				var p = points[i];
				var newPoint = p._pos.add(mouse.clone().multiply(p.r * 5)).add(new Vector(p.r, p.r).setAngle(p.angle));
				p.angle += (p.movementDir / 10);
				p.pos = p.pos.clone().multiply(bias).add(newPoint.multiply(1-bias));
			// p.pos = p._pos.add(newPoint);
			p.render(context);
		}

		context.fillStyle = "#34363E";
		context.beginPath();
		context.moveTo(0, 0);
		var newCurvePoint = new Vector((1+mouse.x*-1) * 30, (0.5+mouse.y*-1) * height);
		curvePoint.x = curvePoint.multiply(bias).x + newCurvePoint.multiply(1-bias).x;
		curvePoint.y = curvePoint.multiply(bias).y + newCurvePoint.multiply(1-bias).y;
		context.quadraticCurveTo(20 + curvePoint.x, curvePoint.y, 0, height);
		context.fill();

		if (playing){
			requestAnimationFrame(animate);
		}
	};
	animate();

	$(window).resize(function() {
		waitForFinalEvent(function() {
			updateRects();
			animate();
		}, 300, "canvas-offers");
	});
});

	// var canvas = $('#offers-animation')[0];


});
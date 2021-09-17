var ProgressBar;

ProgressBar = function(canvas, time, callback, end) {
	var h, obj, r, w;
	obj = {
		value: 0,
		active: false,
		callback: null,
		end: null,
		time: time || 1000,
		isPlaying: false
	};
	obj.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	w = canvas.width = Math.max(canvas.getBoundingClientRect().width, 50.1);
	h = canvas.height = Math.max(canvas.getBoundingClientRect().height, 50.1);
	r = Math.max(1, (Math.min(w, h) / 2) - 15);
	obj.set = function(val) {
		obj.value = val;
		obj.render();
	};
	(obj.render = function() {
		var ctx;
		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, w, h);
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,.2)";
		ctx.lineWidth = 20;
		// ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
		// ctx.stroke();
		// ctx.beginPath();
		ctx.strokeStyle = "#FFBB00";
		ctx.arc(w / 2, h / 2, r, -Math.PI/2, -Math.PI/2-Math.PI * (2 * (1 - obj.value)));
		ctx.stroke();
	})();
	obj.start = function() {
		var deltaTime, nowTime, precent, step, thenTime;
		precent = 0;
		nowTime = deltaTime = null;
		thenTime = new Date().getTime();
		obj.isPlaying = true;
		step = function(timestamp) {
			nowTime = new Date().getTime();
			deltaTime = nowTime - thenTime;
			thenTime = nowTime;
			if (precent < 1) {
				obj.set(precent);
				precent += deltaTime / obj.time;
				if (callback) {
					callback(precent);
				} else if (obj.callback) {
					obj.callback(precent);
				}
				requestAnimationFrame(step);
			} else {
				obj.set(1);
				precent = 0;
				obj.isPlaying = false;
				if (end || obj.end) {
					setTimeout(function() {
						if (end) {
							return end();
						} else if (obj.end) {
							return obj.end();
						}
					}, 10);
				}
			}
		};
		requestAnimationFrame(step);
	};
	obj.stop = function() {
		obj.active = false;
	};
	canvas.progressBar = obj;
	return obj;
};

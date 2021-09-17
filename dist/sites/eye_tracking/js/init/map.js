

$(document).ready(function(){

	function drawCircle(ctx, pos, r, color){
		if (!ctx) return;
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, r || 2, 0, Math.PI*2);
		ctx.fill();
	}

	function getHUE(t){
		return {
			start: 'hsla('+(220*(1-t))+',100%,50%,.5)',
			end: 'hsla('+(220*(1-t))+',100%,50%,0)',
		}
	}

	function getNearest(a, b){
		return -Math.floor(b / 2) + Math.ceil(a / b) * b;
	}

	function HeatMap(selector){

		this.canvas = $(selector)[0];
		if (!this.canvas) {
			console.warn("There is no canvas!");
			return;
		}

		this.step = 0.2;
		this.steps = {};
		this.max = 0;

		this.ctx = this.canvas.getContext("2d");
		this.data = [];
		this.size = new Vector();
		this.heatingPoints = [];

		this.updateRects = function(){
			var parent = $(this.canvas).parent()[0],
					bbox = parent.getBoundingClientRect();
			this.size.x = this.canvas.width = bbox.width;
			this.size.y = this.canvas.height = bbox.height;
		}
		this.updateRects();


		this.generateHeatMap = function(){
			this.steps = {};
			this.max = 0;
			var step = Math.floor(this.size.x * this.step);
			// for (var x = 0; x < this.size.x; x += step){
			// 	for (var y = 0; y < this.size.y; y += step){
			// 		drawCircle(this.ctx, new Vector(x, y));
			// 	}
			// }

			for (var i = 0; i < this.data.length; i++){
				var d = this.data[i];
				var half = step / 2;
				var p = d.position.clone().scale(this.size.x, this.size.y);
				var x = getNearest(p.x, step);
				var y = getNearest(p.y, step);
				if (!this.steps.hasOwnProperty(x+"_"+y)){
					this.steps[x+"_"+y] = 0;
				}
				// drawCircle(this.ctx, new Vector(x, y));
				this.steps[x+"_"+y]++;
				if (this.max < this.steps[x+"_"+y]){
					this.max = this.steps[x+"_"+y];
				}
			}
			// console.log(steps);
		};

		this.render = function(){
			// this.ctx.clearRect(0, 0, this.size.x, this.size.y);
			this.ctx.beginPath();
			this.ctx.fillStyle = getHUE(0).start;
			this.ctx.rect(0, 0, this.size.x, this.size.y);
			this.ctx.fill();
			for (var key in this.steps){
				var value = this.steps[key],
						x = parseInt(key.split("_")[0]),
						y = parseInt(key.split("_")[1]),
						color = getHUE(value / this.max);


				var offset = this.step * this.size.x;
				this.ctx.beginPath();
				var gradient = this.ctx.createRadialGradient(x,y,0, x,y,offset);
				gradient.addColorStop(0, color.start);
				gradient.addColorStop(1, color.end);
				this.ctx.fillStyle = gradient;
				this.ctx.arc(x, y, offset, 0, Math.PI*2);
				this.ctx.fill();
			}
		};

	}

	var map = new HeatMap('[data-heat-map]');
	map.step = 0.1;
	map.data = window.viewProgressUsers[0].data;
	// window.viewProgressUsers
	console.log(map);
	map.generateHeatMap();

	map.render();

	$(window).resize(function(){
		waitForFinalEvent(function(){
			map.generateHeatMap();
			map.updateRects();
			map.render();
		}, 300, "heat-map");
	});


});
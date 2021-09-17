function imageColor(img, options){
	var t1 = performance.now();

	var canvas = document.createElement("canvas");
	var width = canvas.width = img.width,
			height = canvas.height = img.height,
			ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);

	function getPixel(x, y){
		return ctx.getImageData(x, y, 1, 1);
	}

	var color = {r: 0, g: 0, b: 0, a: 0};
	var total = 0;

	for (var x = 0; x < width; x += (options.step || 1)){
		for (var y = 0; y < height; y += (options.step || 1)){
			var pixel = getPixel(x,y).data;
			color.r += pixel[0];
			color.g += pixel[1];
			color.b += pixel[2];
			color.a += pixel[3];
			total++;
		}
	}

	for (var channel in color){
		color[channel] = Math.round(color[channel] / total);
	}

	var t2 = performance.now();
	if (options.callback){
		options.callback({
			// ctx: ctx,
			// canvas: canvas,
			time: (t2-t1).toFixed(2),
			color: color,
			total: total,
			colorRgb: "rgb("+color.r+","+color.g+","+color.b+")",
			middle: Math.round((color.r + color.g + color.b) / 3),
			palette: ((color.r + color.g + color.b) / 3) < 127 ? "dark" : "light"
		});
	}
}

$(document).ready(function(){
	if ($('#getColor').length){
		imageColor($('#getColor')[0], {
			step: Math.floor($('#getColor').width() / 10),
			callback: function(data){
				// console.log(data);
				// $('body').css("background-color", data.colorRgb);
			}
		});
	}
});
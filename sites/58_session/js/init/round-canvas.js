function drawRound(id, persent, useDarkTheme) {
	var pixelRatio = window.devicePixelRatio || 1;
	var canvas = document.getElementById(id);

	if (canvas !== null) {
		var ctx = canvas.getContext('2d');

		var width = 0;
		var height = 0;

		var lineWidth = 3;

		setCanvasSize(canvas, pixelRatio);

		var i = persent;

		var strokeColor = $(canvas).data('stroke');

		ctx.beginPath()
		ctx.lineWidth = lineWidth*pixelRatio;
		ctx.arc(canvas.width/2, canvas.height/2, canvas.height/2 - (lineWidth * pixelRatio / 2), -Math.PI/2, -Math.PI * (2 * (1 - i))-Math.PI/2);


		ctx.strokeStyle = strokeColor;
		ctx.stroke()

		if (i >= 1) {
			ctx.fillStyle = strokeColor;
			ctx.strokeStyle = strokeColor;
			ctx.stroke();
			$(canvas).parent().addClass('filled');
		} else {
			$(canvas).parent().removeClass('filled');
		}
	}
}

var setCanvasSize = function(canvas, pixelRatio) {
	width = $(canvas).parent().outerWidth() * pixelRatio;
	height = $(canvas).parent().outerHeight() * pixelRatio;
	canvas.width = width;
	canvas.height = height;
}

function drawRadialIndicator(){
	var totalHeight = $('body')[0].scrollHeight - $(window).height();
	var scrollTop = $(window).scrollTop();
	drawRound('roundCanvas', scrollTop / (totalHeight - 100));
}
drawRadialIndicator();


$(window).scroll(function(){
	drawRadialIndicator();
});

$(window).resize(function() {
	drawRadialIndicator();
});


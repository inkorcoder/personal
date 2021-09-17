console.log('loadedTicket')
// var useDarkTheme = get it from page;
$(document).ready(function() {
	// console.log(useDarkTheme);

	accessToken = 'pk.eyJ1IjoiaW5rb3IiLCJhIjoiY2pseXY2NTR2MHBnNTNrcGp6ODJ1aWhqaCJ9.ONGw5heXge3ivv1xOxAXvg';
	var points = [{
		position: [50.3365752,30.8815552],
		title: "KBP Kiev",
		price: Math.floor(Math.random() * 1000)
	},{
		position: [47.4336435,19.2535279],
		title: "BUD Budapest",
		price: Math.floor(Math.random() * 1000)
	},{
		position: [41.7998868,12.2440497],
		title: "FCO Roma",
		price: Math.floor(Math.random() * 1000)
	},{
		position: [52.5588327,13.2862487],
		title: "TXL Berlin",
		price: Math.floor(Math.random() * 1000)
	},{
		position: [55.9736482,37.4103143],
		title: "SVO Moscow",
		price: Math.floor(Math.random() * 1000)
	},{
		position: [53.3584608,-2.2766053],
		title: "MAN Manchester",
		price: Math.floor(Math.random() * 1000)
	}];

	var variants = [
	{a: points[2], b: points[3], c: points[1]},
	{a: points[1], b: points[3], c: points[2]},
	{a: points[0], b: points[2], c: points[1]},
	{a: points[1], b: points[4], c: points[3]},
	{a: points[1], b: points[2], c: points[3]}
	];

	function createImageString(){

		var href = '';
		var colors = [];
		var pointImageRed = '';

		if(!useDarkTheme){
			href = 'https://api.mapbox.com/styles/v1/m1sa/cjkntwiak1h8l2spjxmjajomg/static/'; //light map
			colors = ['EDA2C1', 'EDA2C1', '2E48E8'];
			pointImageRed ='http%3A%2F%2Fdev.divisory.com%2F5%2Ftravel%2Fdist%2Fimg%2Fpoint-red.png';
		} else {
			href = 'https://api.mapbox.com/styles/v1/m1sa/cjpiabvcr0f8v2rozc8rm66kt/static/'; //dark map
			colors = ['4F5458', '4F5458', 'ffffff'];
			pointImageRed ='http%3A%2F%2Fdev.divisory.com%2F5%2Ftravel%2Fdist%2Fimg%2Fpoint-grey.png';
		}

		var pointImage = "http%3A%2F%2Fdev.divisory.com%2F1%2Ftravel%2Fdist%2Fimg%2Fpoint.png",
		randomPath = variants[Math.floor(Math.random()*variants.length)],
		cityA = randomPath.a,
		cityB = randomPath.b,
		cityC = randomPath.c,
		pointA = cityA.position,
		pointB = cityB.position,
		pointC = cityC.position,
		bounds = [
		[pointA[1], pointB[1], pointC[1]].min(),
		[pointA[0], pointB[0], pointC[0]].min(),
		[pointA[1], pointB[1], pointC[1]].max(),
		[pointA[0], pointB[0], pointC[0]].max()
		],
		size = [600, 400],
		vp = geoViewport.viewport(bounds, size),
		length = Math.getLengthOfPath(pointA, pointB),

		line = polyline.encode(
			Math.createPolyline(pointA, pointB, length/100)
			);
		line2 = polyline.encode(
			Math.createPolyline(pointB, pointC, -length/100)
			);
		line3 = polyline.encode(
			Math.createPolyline(pointC, pointA, -length/100)
			);

		return (
			href+
			'url-'+pointImage+'('+pointA[1]+','+pointA[0]+'),'+
			'url-'+pointImage+'('+pointB[1]+','+pointB[0]+'),'+
			'path-3+' + colors[0] +'-1('+line2+'),path-3+' + colors[1] +'-1('+line3+'),path-5+' + colors[2] +'-1('+line+'),'+
			'url-'+pointImageRed+'('+pointC[1]+','+pointC[0]+')/'+
			vp.center.join(',')+','+(Math.max(1, vp.zoom-1.5))+',0,0/'+size.join('x')+
			'?access_token='+accessToken
			);
	}

	function animate(){
		$('#loadedTicket .ticket').not('.active').each(function(i, ticket){
			var top = $(ticket).position().top,
			width = $(ticket).outerWidth(),
			height = $(ticket).outerHeight();

			$(ticket).find('.map-wrapper img').attr('src', createImageString());
			setTimeout(function(){
				$(ticket).addClass('active');
			}, i * 100)
		});
	}

	animate();
});


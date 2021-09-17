mapboxgl.accessToken = 'pk.eyJ1IjoiaW5rb3IiLCJhIjoiY2pseXY2NTR2MHBnNTNrcGp6ODJ1aWhqaCJ9.ONGw5heXge3ivv1xOxAXvg';
// console.log(themeMarker);  //get it from page;

var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/m1sa/cjkntwiak1h8l2spjxmjajomg', //light
		center: [10, 45],
		zoom: 0,
		light: {
			anchor: "viewport",
			color: "white",
			intensity: .1
		}
	});
// map.setRenderWorldCopies(false);

// map.setMinZoom(0);

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
},{
	position: [38.9531162,-77.4587275],
	title: "IAD Washington",
	price: Math.floor(Math.random() * 1000)
},{
	position: [25.795865,-80.2892344],
	title: "MIA Miami",
	price: Math.floor(Math.random() * 1000)
},{
	position: [49.1966913,-123.183701],
	title: "YVR Vancouver",
	price: Math.floor(Math.random() * 1000)
},{
	position: [43.0542394,74.4673192],
	title: "FRU Manas",
	price: Math.floor(Math.random() * 1000)
},{
	position: [19.0895595,72.8634257],
	title: "BOM Mumbai",
	price: Math.floor(Math.random() * 1000)
},{
	position: [40.0710046,116.5878245],
	title: "PEK Pekin",
	price: Math.floor(Math.random() * 1000)
},{
	position: [35.5493932,139.7776499],
	title: "HND Tokyo",
	price: Math.floor(Math.random() * 1000)
},{
	position: [1.3644202,103.9893421],
	title: "SIN Singapore",
	price: Math.floor(Math.random() * 1000)
},{
	position: [56.7447746,60.8007598],
	title: "SVX Koltsovo",
	price: Math.floor(Math.random() * 1000)
},{
	position: [49.670833,73.3322554],
	title: "KGF Sary-Arka",
	price: Math.floor(Math.random() * 1000)
},{
	position: [60.3210416,24.9506717],
	title: "HEL Helsinki",
	price: Math.floor(Math.random() * 1000)
},{
	position: [43.4450151,39.9416763],
	title: "AER Sochi",
	price: Math.floor(Math.random() * 1000)
},{
	position: [-23.6273246,-46.6587729],
	title: "CGH Congonhas",
	price: Math.floor(Math.random() * 1000)
},{
	position: [42.7925942,141.6682899],
	title: "CTS New Chitose",
	price: Math.floor(Math.random() * 1000)
},{
	position: [-37.6690123,144.8388386],
	title: "MEL Melbourne",
	price: Math.floor(Math.random() * 1000)
},{
	position: [-6.1275282,106.6515171],
	title: "CGK Soekarno-Hatta",
	price: Math.floor(Math.random() * 1000)
},{
	position: [8.9800689,38.7967432],
	title: "ADD Addis Ababa Bole",
	price: Math.floor(Math.random() * 1000)
}];

points.forEach(function(p){
	p.position[1] = p.position[1] < -90 ? 270 + (90 + p.position[1]) : p.position[1];
});
// console.log(points)

// stupid thing, we need to reverse X and Y, because it's should be reversed here
map.on('load', function () {

	points.forEach(function(point){
		point.position = point.position.reverse();
	});

});


map.on('load', function(){

	// _a = Math.floor(Math.random()*points.length),
	// _b = Math.floor(Math.random()*points.length),
	// _c = Math.floor(Math.random()*points.length);
	// var a = points[_a],
	// 		b = points[_b];

	// var cities = [
	// 	points[_a],
	// 	points[_b],
	// 	points[_c],
	// ];
	// var path = cities.map(function(city){
	// 	return city.position;
	// });
	// x = path.flat(0).min();
	// y = path.flat(1).min();
	// X = path.flat(0).max();
	// Y = path.flat(1).max();
	// maps.bound(map, [x,y], [X,Y]);
	// map.once('moveend', function() {
	// 	var path2 = path.slice().reverse(),
	// 			cities2 = cities.slice().reverse();
	// 	path2.splice(1,1);
	// 	cities2.splice(1,1);

	// 	maps.drawMultiPath(map, path2, 500, cities2, 'primary');
	// 	setTimeout(function(){
	// 		maps.drawMultiPath(map, path, 500, cities, 'red', true);
	// 	}, 1000);
	// });


	// setTimeout(function(){
	// 	maps.clear(map);
	// }, 4000);

});
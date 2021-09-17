mapboxgl.accessToken = 'pk.eyJ1IjoiaW5rb3IiLCJhIjoiY2pseXY2NTR2MHBnNTNrcGp6ODJ1aWhqaCJ9.ONGw5heXge3ivv1xOxAXvg';
var map = new mapboxgl.Map({
		container: 'map',
		// inkor/cjm09fiiw784r2rppn2itgscr
		style: 'mapbox://styles/m1sa/cjkntwiak1h8l2spjxmjajomg',
		center: [-0.151208, 51.4990177],
		zoom: 7.5,
		"light": {
			"anchor": "viewport",
			"color": "white",
			"intensity": .1
		}
	});

map.scrollZoom.disable();
map.touchZoomRotate.disable();
map.dragRotate.disable();
map.dragPan.disable();
map.boxZoom.disable();
map.scrollZoom.disable();

var points = [{
	position: [51.8804654,-0.3948868],
	title: "Luton",
	dist: Math.floor(Math.random() * 100)
},{
	position: [51.8860181,0.2366774],
	title: "Stansted",
	dist: Math.floor(Math.random() * 100)
},{
	position: [51.4699941,-0.4546602],
	title: "Heathrow",
	dist: Math.floor(Math.random() * 100)
},{
	position: [51.1536621,-0.1842516],
	title: "Gatwick",
	dist: Math.floor(Math.random() * 100)
}];


// displaying markers
map.on('load', function () {

	// other masrkers

	var markers = [];
	var anim;
	var details = $('.city-map .city-detail');

	points.forEach(function(point, index){
		var marker = new maps.createMarker('marker airport', "<span class=\"point\"></span><i class=\"icon icon-airlines\"></i><span class=\"title\">"+point.title+"</span><span class=\"dist\">"+point.dist+"km</span>", 'top-left', [-2,-10]);
		marker.setPosition(point.position.reverse()).setMap(map);
		marker.showPoint().showContent();
		markers.push(marker);
		$(marker.node).mouseover(function(){
			if (anim && map.getLayer(anim.id)){
				map.removeLayer(anim.id);
				maps.lines[anim.id] = null;
				anim = null;
				markers.forEach(function(m){
					$(m.node).removeClass('active');
				});
			}
			anim = maps.animatePath(map, points[index].position, [-0.151208, 51.4990177], 500);
			anim.run();
			$(marker.node).addClass('active');
			details.removeClass('active').eq(index).addClass('active');
		}).mouseout(function(){
			map.removeLayer(anim.id);
			maps.lines[anim.id] = null;
			details.removeClass('active').eq(index);
			$(marker.node).removeClass('active');
		})
		// 		for (id in maps.lines){
		// 	map.removeLayer(id);
		// }
	});

	anim = maps.animatePath(map, points[0].position, [-0.151208, 51.4990177], 500);
	anim.run();
	details.removeClass('active').eq(0).addClass('active');
	$(markers[0].node).addClass('active');

	// home place
	var marker = new maps.createMarker('marker home', "<span class=\"point\"></span><span class=\"title\">London</span>", 'top-left', [-2,-10]);
	marker.setPosition([-0.151208, 51.4990177]).setMap(map);
	marker.showPoint().showContent();
	markers.push(marker);


});
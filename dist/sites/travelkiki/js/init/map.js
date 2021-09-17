/*this variables just for example*/
var fromCityCoordinates = [37.9356467,23.9484156].reverse(), // Athens
		toCityCoordinates = [47.4336435,19.2535279].reverse(); // Budapest


var ZOOM_RATIO = 11;
mapboxgl.accessToken = 'pk.eyJ1IjoiaW5rb3IiLCJhIjoiY2pseXY2NTR2MHBnNTNrcGp6ODJ1aWhqaCJ9.ONGw5heXge3ivv1xOxAXvg';
var map = new mapboxgl.Map({
	container: 'map',
	// inkor/cjm09fiiw784r2rppn2itgscr
	// style: 'mapbox://styles/m1sa/cjpiabvcr0f8v2rozc8rm66kt', //dark
	style: 'mapbox://styles/m1sa/cjkntwiak1h8l2spjxmjajomg', //light
	center: fromCityCoordinates,
	zoom: ZOOM_RATIO,
	"light": {
		"anchor": "viewport",
		"color": "white",
		"intensity": .1
	}
});


map.on('load', function () {

	var fromMarker,
			toMarker;

	// map.flyTo({
	// 	center: toCityCoordinates,
	// 	zoom: ZOOM_RATIO,
	// 	bearing: 0,
	// 	speed: 10,
	// 	curve: 1,
	// 	easing: function (t) { return t; }
	// });

	// home place
	var marker = new maps.createMarker('marker home', "<span class=\"point\"></span><span class=\"temperature\"><i class=\"icon icon-weather-sun\"></i>25º</span><span class=\"title\"><span>Greece</span>Athenes</span>", 'top-left', [-2,-10]);
	marker.setPosition(fromCityCoordinates).setMap(map);
	marker.showPoint().showContent();
	// markers.push(marker);

});


map.on('load', function(){

	$('.main-map .map').addClass('initialized');

});

// this is also example, to show how it works. Just paste your actual coordinates
function flyToCity(coordiates, name, country, showMarker){
	map.flyTo({
		center: coordiates,
		zoom: ZOOM_RATIO,
		bearing: 0,
		speed: 2,
		curve: 1,
		easing: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
	});
	if (showMarker){
		var marker = new maps.createMarker('marker home', "<span class=\"point\"></span><span class=\"temperature\"><i class=\"icon icon-weather-sun\"></i>25º</span><span class=\"title\"><span>"+country+"</span>"+name+"</span>", 'top-left', [-2,-16]);
		marker.setPosition(coordiates).setMap(map);
		marker.showPoint().showContent();
	}
}

$(document).ready(function(){

	// change:from, change:to
	$('#newSearchEngine').on("change:to", function(event, data){
		if (data.selected){ // if we have an airport
			flyToCity(toCityCoordinates, "Budapest", "Belgium", true);
		} else {
			flyToCity(fromCityCoordinates, "Athens", "Greece");
		}
	});

});
var maps = {
	markers: {
		// marker: {},
		// weather: {}
	},
	lines: {

	}
};

maps.createMarker = function(className, markup, origin, offset){

	this.node = document.createElement('div');
	this.node.className = className;
	this.node.innerHTML = markup;

	this.marker = new mapboxgl.Marker({
		element: this.node,
		anchor: origin || 'center',
		offset: offset || [0, 0]
	});

	this.setPosition = function(position){
		if (this.removed) return;
		this.marker.setLngLat(position);
		// if (className === 'weather'){
		// console.log(maps.markers)
		if (maps.markers[className+"_"+position[0].toString()]){
			this.remove();
			return this;
		}
		maps.markers[className+"_"+position[0].toString()] = this;
		// }
		return this;
	};

	this.setMap = function(map){
		if (this.removed) return;
		this.marker.addTo(map);
		return this;
	};

	this.showPoint = function(){
		var $this = $(this.node);
		setTimeout(function(){
			$this.addClass('point-showing');
		}, 1)
		return this;
	};

	this.hidePoint = function(){
		var $this = $(this.node);
		setTimeout(function(){
			$this.removeClass('point-showing');
		}, 1)
		return this;
	};

	this.showContent = function(){
		$(this.node).addClass('content-showing');
		return this;
	};

	this.hideContent = function(){
		$(this.node).removeClass('content-showing');
		return this;
	};

	this.remove = function(){
		this.removed = true;
		this.marker.remove();
	}

};


// animate path
maps.animatePath = function(map, start, end, duration, onEnd, lastCalled, isLast, color){

	var colors = [];

	if(typeof useDarkTheme !== 'undefined' && !useDarkTheme){
		colors = ['#EB2C5A', '#2E48E8']; //second, primary
		console.log(useDarkTheme);
	} else {
		colors = ['#8F969D', '#ffffff']; //second, primary
	}

	color = color || 'primary';

	var _start = start.slice();
	var _end = end.slice();

	start = _start.slice();
	end = _end.slice();
	// console.log(start[0], end[0])
	// if ((Math.getLength(_start[0], _end[0]) > 180) && (_end[0] < _start[0])){
	// 	end[0] = 180+(180 - Math.abs(_end[0]));
	// }
	// if ((Math.getLength(_start[0], _end[0]) > 180) && (_end[0] > _start[0])){
	// 	// end[0] = -180-Math.abs(_end[0]);
	// }
	// if (Math.getLength(start[0], end[0]) > 180 && end[0] > start[0]){
	// 	end[0] = -Math.abs(end[0]);
	// }
	// if (Math.getLength(start[0], end[0]) > 180 && end[0] > start[0]){
	// 	start[0] = 180+(180 - Math.abs(start[0]));
	// }
	// if (end[0] < 0){
	// 	end[0] = 180+(180 - Math.abs(end[0]));
	// }
	// if ((end[0] < 0) && (start[0] > 0) && (Math.abs(end[0]) + Math.abs(start[0]) > 180)){
	// 	end[0] = 180+(180 - Math.abs(end[0]));
	// }
	// if ((end[0] < 0) && (start[0] > 0) && (Math.abs(end[0]) + Math.abs(start[0]) > 180)){
	// 	end[0] = 180+(180 - Math.abs(end[0]));
	// }
	// console.log(end[0])
	var id = (Math.random() * 1000000).toFixed(0).toString();

	var _x = end[0] - start[0];
	var _y = end[1] - start[1];
	var totalLength = Math.sqrt(_x*_x + _y*_y);

	var geojson = {
		"type": "FeatureCollection",
		"features": [{
			"type": "Feature",
			"geometry": {
				"type": "LineString",
				"coordinates": [
				start
				]
			}
		}]
	};

	maps.lines['line-animation-'+id+'-'+color] = true;
	map.addLayer({
		'id': 'line-animation-'+id+'-'+color,
		'type': 'line',
		'source': {
			'type': 'geojson',
			'data': geojson
		},
		'layout': {
			'line-cap': 'round',
			'line-join': 'round'
		},
		'paint': {
			'line-color': color === 'red' ? colors[0] : colors[1], //second, primary
			'line-width': color === 'red' ? 2 : 4,
			'line-opacity': 1
		}
	});

	var currentTime = 0,
	progress = 0,
	oldTime = new Date().getTime(),
	startTime = new Date().getTime(),
	lineOffset = 5,
	arc = -0.1 + Math.random() * 0.2;

	function update(){
		var newTime = new Date().getTime(),
		delta = newTime - oldTime;

		// start
		if (currentTime === 0){
			currentTime = 0.000001;
			// $(planeMarker.node).addClass('fly-up');
			// console.log(planeMarker.node)
			console.log('line ['+id+'] started.')
		}

		// progress
		if (currentTime < duration){
			currentTime += delta;
			progress = Math.min(currentTime / duration, 1);

			// plane
			var currentPoint = Math.lerp(start, end, progress);
			currentPoint[0] += (Math.sin(progress*(Math.PI)) * (totalLength * arc));
			currentPoint[1] -= (Math.sin(progress*(Math.PI)) * (totalLength * arc));

			geojson.features[0].geometry.coordinates.push(currentPoint);
			map.getSource('line-animation-'+id+'-'+color).setData(geojson);

			// end of animation, 1 will be for sure, because of Math.min()
			if (progress === 1){
				geojson.features[0].geometry.coordinates = [];
				// endMarker.showPoint();
				if (onEnd) {
					onEnd();
				}
				console.log('line ['+id+'] finished.');
			}
		}

		oldTime = newTime;
		requestAnimationFrame(update);
	}


	return {
		id: 'line-animation-'+id+'-'+color,
		color: color,
		run: function(){
			if (progress > 0){
				console.warn('You cannot call run, because it has been called already');
				return;
			}
			update();
		}
	}
}

maps.animateMultiPath = function(map, paths, duration, onChange, onStart, onEnd, color){

	var step = 0;
	var start = paths[step].slice();
	var end = paths[step+1].slice();
	var lastAnimation;
	var primaryId, secondaryId;

	// if ((Math.getLength(start[0], end[0]) > 180) && (end[0] < start[0])){
	// 	end[0] = 180+(180 - Math.abs(end[0]));
	// }
	//  else if ((Math.getLength(start[0], end[0]) > 180) && (end[0] > start[0])){
	// 	end[0] = -180-(180 - Math.abs(end[0]));
	// }

	function drawPart(start, end){
		if (step >= paths.length-1){
			return;
		}
		lastAnimation = maps.animatePath(map, start, end, duration, function(){
			step++;
			start = paths[step];
			end = paths[step+1];
			drawPart(start, end);

			if (paths[step-1] && paths[step+1] && onChange){
				onChange(step-1, step+1);
			}
			if (step >= paths.length-1 && onEnd){
				onEnd();
			}

		}, lastAnimation, step >= paths.length-2, color);
		setTimeout(function(){
			lastAnimation.run();
		}, 1)
	}
	drawPart(start, end);
	if (onStart){
		onStart();
	}
};

maps.getWeather = function(city, callback){
	$.ajax({
		method: "GET",
		url: "http://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID=4b2a78506f9ea61c408b16a2765ff6b1",
		success: function(data){
			callback.call(null, data);
		},
		error: function(){
			callback.call(null);
			console.log('error for '+city);
		}
	})
};

maps.bound = function(map, a, b, padding){
	var minX = Math.min(a[0], b[0]),
	minY = Math.min(a[1], b[1]),
	maxX = Math.max(a[0], b[0]),
	maxY = Math.max(a[1], b[1]),
	a = [minX, minY],
	b = [maxX, maxY];

	// if (minX < -90 && maxX > 90){
	// 	diff = (180 - Math.abs(minX)) + (180 - maxX);
	// 	a = [maxX, minY];
	// 	b = [maxX + diff, maxY];
	// 	// console.log(a, b)
	// }
	// console.log(minX, maxX)
	// console.log(minY, maxY)
	map.fitBounds(new mapboxgl.LngLatBounds(a, b), {
		padding: {
			top: padding && padding.top || 100,
			bottom: padding && padding.bottom || 100,
			left: padding && padding.left || 200,
			right: padding && padding.right || 200
		},
		duration: 1000
	})
};

maps.showWeather = function(city, map, origin, position){
	var name = city.title.replace(/[A-Z]{3}/g, '').trim();
	maps.getWeather(name, function(res){
		if (res){
			var template = 
			"<span class=\"temperature\">"+
			"<span class=\"image\"><span><i class=\"icon icon-weather-"+maps.getWeatherCode(res.weather[0].id)+"\"></i></span></span>"+
			"<span class=\"deg\"><span>"+(res.main.temp - 273.15).toFixed(0)+"&deg;</span></span>"+
			"</span>"+
			"<span class=\"name "+origin+"\"><span>"+name+"</span></span>"+
			"<span class=\"caption\"><span>Arrival, August 6, Sa</span></span>";
		} else {
			var template = 
			"<span class=\"name "+origin+"\"><span>"+name+"</span></span>"+
			"<span class=\"caption\"><span>Weather couldn't be loaded</span></span>";
		}
		var marker = new maps.createMarker('weather', template, origin);
		$(marker.node).addClass(origin);
		marker.setPosition(city.position);
		marker.setMap(map);
		setTimeout(function(){
			marker.showContent();
		}, 100);
	})
};

maps.getOrigin = function(a, b, rotated){
	console.log(rotated)
	var origins = [
	"left", "bottom-left", "bottom", "bottom-right",
	"right", "top-right", "top", "top-left",
	"left"
	];
	var part = 360 / 8;
	vector = {
		x: b[0] - a[0],
		y: b[1] - a[1]
	}
	angle = Math.degrees(Math.atan2(vector.y, vector.x));
	index = Math.round(angle / part);
	// negative one
	if (index < 0) {
		index = 4 + (4 - Math.abs(index));
	}
	// console.log(angle)
	return origins[index];
};

maps.getWeatherCode = function(code){
	var state = '';

	if (code === 800){
		state = 'sun';

	} else if (code >= 500 && code <= 504){
		state = 'sun-clouds';

	} else if (code >= 801 && code <= 802){
		state = 'cloud';

	} else if (code >= 803 && code <= 804){
		state = 'clouds';

	} else if ((code >= 512 && code <= 531) || (code >= 300 && code <= 321)){
		state = 'rain';

	} else if (code >= 505 && code <= 511){
		state = 'heavy-rain';

	} else if (code >= 200 && code <= 232){
		state = 'thunder';

	} else if (code >= 701 && code <= 721){
		state = 'wind';

	} else if (code >= 600 && code <= 622){
		state = 'snow';

	} else if (code >= 700 && code <= 781){
		state = 'mist';
	}
	// console.log(code)
	return state;
};

maps.getNormalPosition = function(a, b){
	var length = Math.getLengthOfPath(a, b) / 10;
	var normal = Math.getNormal(a, b)
	var center = Math.getCenterOfPath(a, b);
	return [center[0] + normal[1]*length, center[1] + normal[0]*length];
}

maps.drawLine = function(map, a, b, color){
	var geojson = {
		"type": "FeatureCollection",
		"features": [{
			"type": "Feature",
			"geometry": {
				"type": "LineString",
				"coordinates": [a, b]
			}
		}]
	};

	var id = Math.random()*1000;
	maps.lines['line-'+id] = true;
	map.addLayer({
		'id': 'line-'+id,
		'type': 'line',
		'source': {
			'type': 'geojson',
			'data': geojson
		},
		'layout': {
			'line-cap': 'round',
			'line-join': 'round'
		},
		'paint': {
			'line-color': color || '#2E48E8',
			'line-width': 1,
			'line-opacity': 1
		}
	});
};


maps.drawMultiPath = function(map, path, duration, cities, color, skipFarthest, onEnd){

	maps.animateMultiPath(map, path, duration || 1000, function(indexA, indexB){
		// console.log(cities[indexA], cities[indexB])
		// console.log('Maps Utils :: Clearing the map - #'+$(container).attr('id')+' ...');
		var normal = Math.getNormalFromVectors(path[indexA], path[indexB]);
		center = Math.getCenterOfPath(path[indexA], path[indexB]);
		angle = Math.getAngleFromPath(center, path[indexB]);
		// mainAngle = Math.getAngleFromPath(cities[0].position, cities[cities.length-1].position);
		// console.log(angle, mainAngle)
		var position = [
		path[indexA+1],
		[path[indexA+1][0]+normal[0]*30, path[indexA+1][1]+normal[1]*30]
		];

		// console.log(cities, path);

		/* stop point weather*/
		maps.showWeather(
			cities[indexA+1], map,
			maps.getOrigin(center, path[indexA+1]),
			position[1]
			);



		// if (skipFarthest) return;
		// new maps.createMarker('point-marker '+(indexB < path.length-1 ? (color !== 'red' ? 'primary' : 'danger') : ''), "<span class=\"point\"></span>").setPosition(cities[indexB].position).setMap(map).showPoint();
	}, function(){
		maps.showWeather(cities[0], map, maps.getOrigin(path[1], path[0]));
		if (skipFarthest){
			new maps.createMarker('point-marker '+(color !== 'red' ? 'primary' : 'danger'), "<span class=\"point\"></span>").setPosition(cities[1].position).setMap(map).showPoint();
		} else {
			new maps.createMarker('point-marker', "<span class=\"point\"></span>").setPosition(cities[0].position).setMap(map).showPoint();
			new maps.createMarker('point-marker', "<span class=\"point\"></span>").setPosition(cities[1].position).setMap(map).showPoint();
		}
	}, function(){
		maps.showWeather(cities[cities.length-1], map, maps.getOrigin(path[path.length-2], path[path.length-1]));
		if (onEnd) {
			onEnd();
		}
	}, color);

};


maps.clear = function(map){
	var container = map.getContainer();
	console.log('Maps Utils :: Clearing the map - #'+$(container).attr('id')+' ...');
	for (id in maps.lines){
		map.removeLayer(id);
	}
	for (key in maps.markers){
		maps.markers[key].remove();
	}
	maps.lines = {};
	maps.markers = {};
}



maps.getStopPoint = function(array, cityA, cityB){
	var a = array[cityA],
	b = array[cityB],
	c = null,
	center = Math.getCenterOfPath(a.position, b.position),
	closestLength = 360;

	// console.log(center)
	for (var i = 0; i < array.length; i++){
		var pos = array[i].position;
		if (pos !== a.position && pos !== b.position){
			if (Math.getLengthOfPath(center, pos) < closestLength){
				closestLength = Math.getLengthOfPath(center, pos);
				c = array[i];
			}
		} else {
			console.log('skip double');
		}
	}
	return c;
	// console.log(array, cityA, cityB);
};

maps.switchLayer = function(map, marker) {

	if (!marker) {
		mapStyle = 'cjkntwiak1h8l2spjxmjajomg';
	} else {
		mapStyle = 'cjpiabvcr0f8v2rozc8rm66kt';
	}

	map.setStyle('mapbox://styles/m1sa/' + mapStyle);
};
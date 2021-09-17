$(document).ready(function() {
	// console.log(useDarkTheme);

	var popup = $('.ticket-popup'),
	wrapped = true,
	timeout = 500,
	lastScrollPosition = 0;

	popup.on('click', '.close-popup', function(){
		wrap();
		$('.ticket.showing').removeClass('showing');
	});

	function unwrap(){
		wrapped = false;
		lastScrollPosition = $(document).scrollTop();
		$('html,body, .main-header, .form-section').css('width', $(document).width()+'px');
		popup.addClass('transitioned');
		setTimeout(function(){
			$('html, body').addClass('overlayed');
		}, 500);
		setTimeout(function(){
			popup.addClass('unwrapped');
			processMap();
		}, 200);
	};

	function wrap(){
		wrapped = true;
		$('html, body').removeClass('overlayed');
		$('html,body').scrollTop(lastScrollPosition);
		popup.removeClass('unwrapped');
		setTimeout(function(){
			popup.removeClass('transitioned');
			$('html,body, .main-header, .form-section').css('width', '');
			processMap();
			setTimeout(function(){

			}, 500);
		}, timeout);
	};

	function processMap(){
		// opened
		if (!wrapped){

			map.once('resize', function() {
				popup.find('.map-wrapper').addClass('active');

				setTimeout(function(){
					drawPaths();
				}, 200);
			});

			setTimeout(function(){
				map.resize();
			}, timeout);

		// hidden
	} else {
		popup.find('.map-wrapper').removeClass('active');
		maps.clear(map);
	}
};

function drawPaths(){
	_a = Math.floor(Math.random()*points.length),
	_b = Math.floor(Math.random()*points.length),
	_c = points.getUnusedIndex(_a);

	// console.clear();

	// console.log(useDarkTheme);

	// var colors = [];

	// if(!useDarkTheme){
	// 	colors = ['EDA2C1', 'EDA2C1', '2E48E8'];
	// } else {
	// 	colors = ['4F5458', '4F5458', 'ffffff'];
	// }

	var cities = [
	points[_a],
			// points[_b],
			maps.getStopPoint(points, _a, _c),
			points[_c]
			// points.search('title', 'washi'),
			// points.search('title', 'melbo'),
			// points.search('title', 'tokyo'),
			];
			console.log(cities.map(function(city){
				return city.title+"\t["+city.position[0]+"]";
			}).join('\n'), '\n\n')
			var path = cities.map(function(city){
				return city.position;
			});
			x = path.flat(0).min();
			y = path.flat(1).min();
			X = path.flat(0).max();
			Y = path.flat(1).max();
			var padding = $(document).width() > 768 ? 200 : 100;
			maps.bound(map, [x,y], [X,Y], {
				top: padding, bottom: padding,
				left: padding, right: padding
			});
			map.once('moveend', function() {
				var path2 = path.slice().reverse(),
				cities2 = cities.slice().reverse();
				path2.splice(1,1);
				cities2.splice(1,1);

			// TO
			maps.drawMultiPath(map, path2, 750, cities2, 'primary', false, function(){
				// BACK
				maps.drawMultiPath(map, path, 750, cities, 'red', true, function(){

					// test version, z-index changing
					var primary = null,
					secondary = [];
					for (var key in maps.lines) {
						if (key.match(/primary/gim)){
							primary = key;
						} else {
							secondary.push(key);
						}
					}

					secondary.forEach(function(key){
						map.moveLayer(key, primary);
					})

				});
			});

		});

		}

		$('body').on('click', '.ticket', function(e){
			e.preventDefault();
			// e.stopPropagation();
		});
		$('body').on('mousedown', '.ticket', function(e){

			// console.log(e.target);

			maps.switchLayer(map, useDarkTheme);

			e.preventDefault();
			// e.stopPropagation();
			var $this = this;
			setTimeout(function(){

				$('.ticket.showing').removeClass('showing');
				$($this).addClass('showing');

				var bbox = $($this)[0].getBoundingClientRect();

				popup.css({
					top: bbox.top+'px',
					left: bbox.left+'px',
					width: bbox.width+'px',
					height: bbox.height+'px'
				})

				if (!useDarkTheme){
					popup.removeClass('darken-theme');
				} else {
					popup.addClass('darken-theme');
				}
				setTimeout(unwrap, 10);

			}, $('.s-engine.collapsed').length ? 0 : 100);

		});
});
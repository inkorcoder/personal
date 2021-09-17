// var useDarkTheme = from map-ticket.js;
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
		// line = polyline.encode([
		// 	[pointA[0],pointA[1]], [pointB[0],pointB[1]]
		// 	]);
		line = polyline.encode(
			Math.createPolyline(pointA, pointB, length/100)
			);
		line2 = polyline.encode(
			Math.createPolyline(pointB, pointC, -length/100)
			);
		line3 = polyline.encode(
			Math.createPolyline(pointC, pointA, -length/100)
			);

		// console.log(cityA, cityB)

		// console.log(polyline.encode([
		// 	[pointA[1],pointA[0]], [pointB[1],pointB[0]]
		// ]));

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
		$('#ticketsList .ticket').not('.active').each(function(i, ticket){
			var top = $(ticket).position().top,
			width = $(ticket).outerWidth(),
			height = $(ticket).outerHeight(),
			fake = $('<div class="ticket-fake"></div>');
			fake.appendTo('#ticketsList');
			fake.css({
				top: top + 27,
				// width: width,
				height: height
			})
			$(ticket).find('.map-wrapper img').attr('src', createImageString())
			setTimeout(function(){
				fake.addClass('faded');
				$(ticket).addClass('active');
				setTimeout(function(){
					fake.remove();
				}, 300);
			}, i * 100)
		});
	}

	companyData = {
		"logo": "temp/logo1-light.svg",
		"alt": "logo",
		"description": "Results offer you see on Travelkki is the final price. We removed all hidden services and checkmarks. All is fair, as on nudist beaches of Franc",
		"flights": [
		{
			"cost": "342&euro;",
			"from": "Athens",
			"to": "Berlin"
		},
		{
			"cost": "220&euro;",
			"from": "Thessaloniki",
			"to": "London"
		},
		{
			"cost": "340&euro;",
			"from": "Thessaloniki",
			"to": "Paris"
		},
		{
			"cost": "410&euro;",
			"from": "Athens",
			"to": "Paris"
		},
		{
			"cost": "342&euro;",
			"from": "Thessaloniki",
			"to": "Stuttgart"
		}
		]
	}

	function darkLoading() {
		console.log('Darken onload');
		$.ajax({
			method: 'GET',
			url: 'temp/tickets-dark.html',
			success: function(res){
					// console.log(res)
					// console.log(companyData);
					var tickets = $(res+res+res);
					var id = (Math.random()*100000).toFixed();
					var sub = $(`
						<div class="subscribing darken-theme" id="subscribing_${id}">
							<div class="content">
								<div class="subscribing-alert">
									<div class="row middle-xs">
										<div class="col-xs-9 col-ms-4 col-sm-3">
											<div class="message">
												<div class="bell">
													<img src="img/bell-gray.svg" alt="" />
												</div>
												Create a Price Alert!
											</div>
										</div>
										<div class="col-xs-3 ms-show col-sm-2">
											<div class="static">
												KBP <span class="dividing">― <i class="icon icon-plane"></i> ―</span> KBP
											</div>
										</div>
										<div class="col-xs-3 ms-show col-sm-2">
											<div class="static">
												JUL 16 <span class="dividing">―</span> AUG 5
											</div>
										</div>
										<div class="col-xs-3 col-ms-2 col-sm-5 align-right">
											<div class="checkbox round">
												<input type="checkbox" id="subscribeToggle_${id}" data-toggle-class="#subscribing_${id}|active">
												<label for="subscribeToggle_${id}">
													<span></span>
												</label>
											</div>
										</div>
									</div>
									<label class="fake-label" for="subscribeToggle_${id}">&nbsp;</label>
								</div>
								<div class="subscribing-form darken">
									<form action="#" class="validate-form" data-revert>
										<div class="preloader top">
											<span style="width:0"></span>
										</div>
										<div class="form-group">
											<input type="text" class="input email" data-validate="email" placeholder="Type your email">
											<div class="error">Please enter a valid email!</div>
											<button type="submit" class="btn faded">
												<img src="img/icons/send-grey.svg" alt="">
												<img src="img/icons/send-error.svg" alt="">
											</button>
										</div>
										<div class="success success-fadein">
											<div class="container">
												<i class="icon icon-checked"></i>
												Your email was sent successfully!
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
						`)
					// console.log(tickets.wrap('<li>'))
					tickets.appendTo('#ticketsList')
					sub.insertAfter(tickets.eq(3));
					$('#ticketsList > .ticket').wrap('<li></li>');
					isLoading = false;
					console.log('Loaded!');
					setTimeout(function(){
						sub.find('.validate-form').on('submit', function(event) {
							window.validateForm.call(this, event);
						});
						animate();
						$('.fake-tickets').removeClass('active');
					}, 100)
				}
			})
	}

	function lightLoading() {
		console.log('Lighten onload');
		$.ajax({
			method: 'GET',
			url: 'temp/tickets.html',
			success: function(res){


					// console.log(res)
					var tickets = $(res+res+res);
					var id = (Math.random()*100000).toFixed();
					var sub = $(`
							<div class="subscribing" id="subscribing_${id}">
							<div class="content">
								<div class="subscribing-alert">
									<div class="row middle-xs">
										<div class="col-xs-9 col-ms-4 col-sm-3">
											<div class="message">
												<div class="bell">
													<img src="img/bell.svg" alt="" />
												</div>
												Create a Price Alert!
											</div>
										</div>
										<div class="col-xs-3 ms-show col-sm-2">
											<div class="static">
												KBP <span class="dividing">― <i class="icon icon-plane"></i> ―</span> KBP
											</div>
										</div>
										<div class="col-xs-3 ms-show col-sm-2">
											<div class="static">
												JUL 16 <span class="dividing">―</span> AUG 5
											</div>
										</div>
										<div class="col-xs-3 col-ms-2 col-sm-5 align-right">
											<div class="checkbox round primary">
												<input type="checkbox" id="subscribeToggle_${id}" data-toggle-class="#subscribing_${id}|active">
												<label for="subscribeToggle_${id}">
													<span></span>
												</label>
											</div>
										</div>
									</div>
									<label class="fake-label" for="subscribeToggle_${id}">&nbsp;</label>
								</div>
								<div class="subscribing-form">
									<form action="#" class="validate-form" data-revert>
										<div class="preloader top">
											<span style="width:0"></span>
										</div>
										<div class="form-group">
											<input type="text" class="input email" data-validate="email" placeholder="Type your email">
											<div class="error">Please enter a valid email!</div>
											<button type="submit" class="btn faded">
												<img src="img/icons/send.svg" alt="">
												<img src="img/icons/send-error.svg" alt="">
											</button>
										</div>
										<div class="success success-fadein">
											<div class="container">
												<i class="icon icon-checked"></i>
												Your email was sent successfully!
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
						`)
					// console.log(tickets.wrap('<li>'))
					tickets.appendTo('#ticketsList');
					tickets.addClass('transitioned');
					sub.insertAfter(tickets.eq(3));
					$('#ticketsList > .ticket').wrap('<li></li>');
					isLoading = false;
					console.log('Loaded!');
					setTimeout(function(){
						sub.find('.validate-form').on('submit', function(event) {
							window.validateForm.call(this, event);
						});
						animate();
						$('.fake-tickets').removeClass('active');
						SEARCH_ENGINE.postloading = true;
					}, 100);
					setTimeout(function(){
						tickets.removeClass('transitioned');
						SEARCH_ENGINE.preloading = false;
						SEARCH_ENGINE.postloading = false;
					}, 500);
				}
			})
	}

	var isLoading = false;
	var scrollLoad = true;

	function load(){
		isLoading = true;
		pageLoaded = false;
		SEARCH_ENGINE.preloading = true;

		if(useDarkTheme) {
			setTimeout(function(){
				darkLoading();
			},300);
		} else {
			setTimeout(function(){
				lightLoading();
			},300);
		}
		$('#app').removeClass('animate');
	}

	var pageLoaded = false;

	function pageLoad (){

		if(!pageLoaded){
			console.log('Page Loading start...');

			setTimeout(function(){
				pageLoaded = true;
				$('#preloaderTicket').addClass('hidden');
				$('#ticketMain').addClass('visible');

				load();
			}, 100);
		}
	};

	pageLoad();

	var lastScroll = $(window).scrollTop();
	var scrollStage = "waiting";

	$(window).scroll(function(e) {
		if (e.deltaY > 0) return;
		var currentScroll = $(window).scrollTop();
		if (currentScroll + $(window).height() > $(document).innerHeight() - 100 && !isLoading && scrollLoad){
			$('.fake-tickets').addClass('active');
			// load();
		} else {
			$('.fake-tickets').removeClass('active');
		}
	});


	$('#offers').on('change', function(){
		var checkbox = $(this);
		scrollLoad = false;

		$('#ticketsList').children().remove();
		$('#preloaderTicket').removeClass('hidden');
		$('#ticketMain').removeClass('visible').addClass('hidden');
		$('.offers-description').remove();

		setTimeout(function(){
			$('#app').addClass('animate');
		}, 500);

		$('html,body').animate({
			scrollTop: 0
		}, 200);

		if(checkbox.prop('checked') === true){
			useDarkTheme = true;
			$('#offersBtn').addClass('active');
			$('#app').addClass('darken-theme');
			$('.mobile-filter').addClass('darken-theme');

			var flightsTemplate = '';
			for (var i = 0; i <= companyData.flights.length - 1; i++){
				template = `
					<li class="item">
						<div class="inner">
							<div class="col">
								<span class="price">${companyData.flights[i].cost}</span>
								<span class="from">${companyData.flights[i].from}</span>
							</div>
							<div class="col"></div>
							<div class="col">
								<span class="to">${companyData.flights[i].to}</span>
							</div>
						</div>
					</li>
				`
				flightsTemplate += template
			}

			var companyTemplate = $(`
				<div class="offers-description">
					<div class="row">
						<div class="col-xs-12 col-sm-5">
							<figure class="logo-cover">
								<img src="${companyData.logo}" alt="${companyData.alt}">
							</figure>
							<div class="paragraph">
								${companyData.description}
							</div>
						</div>
						<div class="col-xs-12 col-sm-7">
							<div class="title">Flights</div>
							<div class="list-cover">
								<ul class="flights-list clear">
								`
								+
									flightsTemplate
								+
								`
								</ul>
							</div>
						</div>
					</div>
				</div>
				`)
			companyTemplate.insertBefore($('.tickets-wrapper')[0]);

		} else {
			useDarkTheme = false;
			$('#offersBtn').removeClass('active');
			$('#app').removeClass('darken-theme');
			$('.mobile-filter').removeClass('darken-theme');
		}

		setTimeout(function(){
			pageLoaded = true;
			$('#preloaderTicket').addClass('hidden');
			$('#ticketMain').addClass('visible').removeClass('hidden');
			load();
			scrollLoad = true;
		}, 3500);
	});

	$('.fake-tickets').click(function(){
		load();
	});
});


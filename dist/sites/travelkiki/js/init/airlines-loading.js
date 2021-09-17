$(document).ready(function(){

	var lastScroll = $(window).scrollTop();
	var scrollStage = "waiting";

	var isLoading = false;

	function load() {
		$.ajax({
			method: 'GET',
			url: 'temp/airlines.html',
			success: function(res){
				var cities = $(res+res);
				isLoading = false;
				console.log('airlines loaded')
				setTimeout(function() {
					$(cities).insertBefore($('#cities-container .city-fake'));
				}, 500);
			}
		});
	}

	$(window).scroll(function(e) {
		if (e.deltaY > 0) return;
		var currentScroll = $(window).scrollTop();
		if (currentScroll + $(window).height() > $(document).outerHeight() - 300 && !isLoading){
			isLoading = true;
			console.log('Loading new airlines...')
			setTimeout(function() {
				load();
			}, 1500)
		};

	});


	$('.letters-filter a').on('mousedown touchend', function(e) {
		e.preventDefault();

		if (!e.type === 'touchend'){
			$(this).parent().addClass('active').siblings().removeClass('active')
		}
		$('#cities-container .city-card, #cities-container .lined-title').remove();
		$('html, body').animate({
			scrollTop: $('.hero .filter-nav').offset().top+100
		}, 300);
		setTimeout(function() {
			load();
		}, 310)
	});

});
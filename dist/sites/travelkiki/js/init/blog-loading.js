$(document).ready(function(){

	var lastScroll = $(window).scrollTop();
	var scrollStage = "waiting";

	var isLoading = false;

	function load() {
		$.ajax({
			method: 'GET',
			url: 'temp/blog.html',
			success: function(res){
				var blog = $(res);
				isLoading = false;
				console.log('blog loaded')
				$('[data-load-indicator] span').css('width', "100%");
				setTimeout(function() {
					$(blog).appendTo($('#blog-container'));
					$('[data-load-indicator]').addClass('no-transition');
					$('[data-load-indicator] span').css('width', "0%");
				}, 500);
			}
		});
	}

	$(window).scroll(function(e) {
		if (e.deltaY > 0) return;
		var currentScroll = $(window).scrollTop();
		if (currentScroll + $(window).height() > $(document).outerHeight() - 300 && !isLoading){
			isLoading = true;
			console.log('Loading new cities...');
			$('[data-load-indicator]').removeClass('no-transition')
			setTimeout(function(){
				$('[data-load-indicator] span').css('width', "50%");
			}, 10)
			setTimeout(function() {
				load();
			}, 1500)
		};

	});

	load();

});
(function(){

	function setHeaderAlpha(){
		var top = $(document).scrollTop();
		var alpha = Math.clamp(top / ($('.header-banner .page-title').offset().top - 100), 0, 1);
		$('.header-banner .page-title').css('opacity', (1-alpha));
	}
	setHeaderAlpha();

	$(window).scroll(function(){
		setHeaderAlpha();
	});


})();
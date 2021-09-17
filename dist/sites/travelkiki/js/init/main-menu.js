$(document).ready(function() {

	var open = false;

	function getClass() {
		return open ? "fading-in" : "";
	}

	function setClass() {
		$('.main-menu').removeClass('fading-in fading-out');
		$('.main-menu').addClass(getClass());

		if (open){
			if ($(window).width() <= 768) $('body').addClass('overlayed');
			$('[data-main-menu-toggler]').addClass('active');
		} else {
			if ($(window).width() <= 768) $('body').removeClass('overlayed');
			$('[data-main-menu-toggler]').removeClass('active');
		}
	}

	$('[data-main-menu-toggler]').click(function(event) {

		open = !open;
		setClass();

	});

	$('body').click(function(event) {
		if (open && !$(event.target).closest('[data-main-menu-toggler], .main-menu').length){
			open = false;
			setClass();
		}
	});

});
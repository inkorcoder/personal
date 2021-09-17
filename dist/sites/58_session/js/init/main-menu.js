$('[data-menu]').click(function(e) {
	$(this).toggleClass('active');
	$($(this).data('menu')).toggleClass('active');
	$('.main-header').toggleClass('opened');
	if ($(this).hasClass('active')) {
		$('body,html').css('width', $('body').width() + 'px').addClass('overlayed');
	} else {
		$('body,html').css('width', '').removeClass('overlayed');
	}
});




$(document).ready(function() {
	$('[data-dropdown]').each(function(i, elem) {
		$('.anchor', elem).click(function(e) {
			e.preventDefault();
			$(this).closest('[data-dropdown]').toggleClass('active');
			if ($(this).closest('[data-dropdown]').hasClass('active')) {
				$(this).closest('[data-dropdown]').find('.scrolled').perfectScrollbar('update');
			}
		});
		$('[data-dismiss]', elem).click(function(){
			$(elem).removeClass('active');
		});
		$('body').mousedown(function(e) {
			if ($(e.target).closest(elem).length === 0) {
				$(elem).removeClass('active');
			}
		});
	});

	$(window).scroll(function(e) {
		if ($(window).width() > 768){
			$('[data-dropdown]').removeClass('active');
		}
	});

});

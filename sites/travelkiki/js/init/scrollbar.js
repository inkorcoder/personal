$(document).ready(function() {

	if ($(document).width() <= 768){
		return;
	}

	$('.scrolled').not('[data-ms-disabled]').perfectScrollbar({
		suppressScrollX: true,
		wheelPropagation: false
	});

	if ($(window).width() > 992) {
		$('.scrolled').not('[data-ms-disabled]').perfectScrollbar({
			suppressScrollX: true,
			wheelPropagation: false
		});
	}

	$(window).resize(function() {
		waitForFinalEvent(function() {
			if ($(window).width() > 992) {
				$('.scrolled[data-ms-disabled]').perfectScrollbar();
				$('.scrolled').perfectScrollbar('update');
			} else {
				$('.scrolled[data-ms-disabled]').perfectScrollbar('destroy');
			}
		}, 300, 'scrolled');
	});
});
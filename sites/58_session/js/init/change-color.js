$(document).on('click', '[data-color-toggle]', function(e){
	parent = $(this).data('color-toggle');
	$(parent).data('dark-color', !$(parent).data('dark-color'));
	$('#themeFake').css('opacity', '1');

	var x = e.clientX;
	var y = e.clientY;

	if ($(parent).data('dark-color')) {
		$('#themeFake').css({
			left: x + 'px',
			top: y + 'px'
		}).addClass('active');
		$('#roundCanvas').data('stroke', '#ffd158');
	} else {
		$('#themeFake').removeClass('active');
		$('#roundCanvas').data('stroke', '#3b3d46');
	}

	setTimeout(function(){
		$(parent).attr('data-dark-color', $(parent).data('dark-color'));
		$('#themeFake').css('opacity', '0');
		drawRadialIndicator();

		if ($(parent).data('dark-color')) {
			$('#headerBanner').css('background-image', 'url(' + $('#headerBanner').data('dark') + ')');
		} else {
			$('#headerBanner').css('background-image', 'url(' + $('#headerBanner').data('light') + ')');
		}
	}, 350);

});
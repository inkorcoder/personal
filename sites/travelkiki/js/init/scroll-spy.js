$(document).ready(function() {

	function spy(){
		var top = $(document).scrollTop(),
		foundedSpying = null,
		foundedSpyed = null,
		hash = location.hash;
		$('[data-spying]').removeClass('active');
		$('[data-spyed]').removeClass('active').each(function(i, spyed){
			var offset = $(spyed).offset().top;
			if (top + $(window).height()/2 > offset){
				foundedSpyed = $(spyed);
				foundedSpying = $('a[href*="'+$(spyed).attr('id')+'"]').closest('[data-spying]');
				// location.hash = $(spyed).attr('id');
				// history.pushState(null, null, location.pathname +"#"+ $(spyed).attr('id'));
				return;
			}
		});

		if($('[data-spying]').data('spying') == 'link-spy' && foundedSpyed) {
			foundedSpying = $('a[href="#' + foundedSpyed.attr('id') + '"]');
		}
		// console.log(foundedSpyed)
		// $('[data-spying]').removeClass('active).each(function(i, spying){
		// 	var foundedHash = $(spying).find('a[href]').attr('href')
		// 	if (!foundedSpying && foundedHash === hash){
		// 		foundedSpying = spying;
		// 		return;
		// 	}
		// });
		// console.log(foundedSpying)
		if (foundedSpying){
			if($('[data-spying]').data('spying') == 'link-spy') {
				$('[data-spying]').find('a').removeClass('active');
			}
			foundedSpying.addClass('active');

		}
		if (foundedSpyed){
			foundedSpyed.addClass('active');
		}
	};

	spy();

	$(document).scroll(function(){
		spy();
	});

	$('[data-spying] a[href]').click(function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: $($(this).attr('href')).offset().top-($(window).width() < 768 ? 100 : 160)
		}, 200);
	});

});
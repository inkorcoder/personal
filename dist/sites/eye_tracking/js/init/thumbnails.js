$(document).ready(function(){

	function checkSelectedImage(){
		var hash = location.hash.replace(/\#/gim, '');
		$('.thumbnails-list a').removeClass('active');
		$('.thumbnails-list [href*="'+hash+'"]').addClass('active');
	}

	checkSelectedImage();

	$(window).on('hashchange', function(){
		checkSelectedImage();
	});

});
$(window).scroll(function(){
	totalHeight = $(document).height();
	scrollPosition = $(window).scrollTop() + $(window).height();
	scrollTop = $(window).scrollTop();

	// footer
	footerPosition(totalHeight, scrollPosition);

	// header
	headerPosition(scrollTop);
});

var footerPosition = function(totalHeight, scrollPosition) {
	var footerHeight = $('#mainFooter').outerHeight();

	if (scrollPosition >= totalHeight - footerHeight) {
		$('#pageFooter').addClass('to-top');
	} else {
		$('#pageFooter').removeClass('to-top');
	}
}

footerPosition($(document).height(), $(window).scrollTop() + $(window).height());


var headerPosition = function(scrollTop) {
	var offsetTop = $('#headerBanner').outerHeight();
	if (scrollTop >= offsetTop) {
		$('#innerHeader').addClass('opened');
	} else {
		$('#innerHeader').removeClass('opened');
	}
}

headerPosition($(window).scrollTop());
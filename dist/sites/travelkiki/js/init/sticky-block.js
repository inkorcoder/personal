function stickOnScroll(blocks){
	blocks.each(function(i, block){
		topOffeset = $(block).parent('.sticky-parent').position().top;
		leftOffset = $(block).parent('.sticky-parent').offset().left;
		blockWidth = $(block).parent('.sticky-parent').width();

		blockTop = $(block).parent('.sticky-parent').offset().top;
		scrollPosition = $(document).scrollTop() + topOffeset;

		style = {
			top: topOffeset + $('#newSearchEngine').outerHeight(),
			width: blockWidth,
			left: leftOffset + 20
		}

		if (scrollPosition >= blockTop - $('#newSearchEngine').outerHeight()) {
			$(block).addClass('fixed');
			$(block).css(style);

			// if (scrollPosition + 20 >= $(block).parent('.sticky-parent').outerHeight() + $('#app').outerHeight()) {
			// 	$(block).addClass('bottom');
			// 	$(block).css({
			// 		top: 'auto',
			// 		left: 0
			// 	});
			// } else {
			// 	$(block).removeClass('bottom');
			// }

		} else {
			$(block).removeClass('fixed');
			$(block).css({
				top: 'auto',
				width: 'auto',
				left: 0
			});
		}
	});
}

stickOnScroll($('[data-sticky]'));

$(document).scroll(function() {
	stickOnScroll($('[data-sticky]'));
});

$(window).resize(function() {
	stickOnScroll($('[data-sticky]'));
});
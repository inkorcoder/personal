Math.clamp = function(value, min, max){
	return value < min ? min : value > max ? max : value;
}

function stickOnScroll(blocks){
	$('[data-sticky]').each(function(i, block){
		// if (i >= 1) return;
		var bbox = $(block).closest('.page-inner')[0].getBoundingClientRect();
		var bottomSide = $(window).outerHeight();
		var isInViewport = bbox.top < bottomSide && bbox.top+bbox.height > bottomSide;
		var isInMiddle = bbox.top < $(window).outerHeight()/2 && bbox.top+bbox.height > $(window).outerHeight()/2;
		var maxTranslate = bbox.height - $(block).outerHeight()-200;
		var translate = bbox.top * -1;
		if (isInViewport){
			$(block).closest('.page-inner').addClass('in-viewport');
		} else {
			$(block).closest('.page-inner').removeClass('in-viewport');
		}
		if (isInMiddle){
			$(block).closest('.page-inner').addClass('in-middle');
		} else {
			$(block).closest('.page-inner').removeClass('in-middle');
		}

		$(block).removeClass('fixed-to-top');

		if (translate > 0){
			$(block).addClass('fixed-to-top');
		} else if (translate < maxTranslate && translate > 0){
			$(block).css({
				transform: "translateY("+(Math.floor(translate))+"px)"
			});
		}

		var parent = $(block).closest('.page-inner');
		var scrollTop = parent.offset().top-$(document).scrollTop();
		var scrollProgress = ($(window).outerHeight() - scrollTop - $(window).outerHeight()/2) / parent.outerHeight();
		var scrollProgress2 = ($(window).outerHeight() - scrollTop) / parent.outerHeight();
		// console.log(scrollProgress);
		if (scrollProgress2 > 1){
			$(block).addClass('move-up');
		} else {
			$(block).removeClass('move-up');
		}
		$(block).closest('.page-inner').attr('data-scrolled', Math.clamp(scrollProgress, -1, 1));

	});

	$('[data-sticky]').eq(0).closest('.page-inner').addClass('in-viewport in-middle');
}

stickOnScroll();

$(document).on('scroll', function() {
	stickOnScroll();
});


$(window).resize(function() {
	stickOnScroll();
});
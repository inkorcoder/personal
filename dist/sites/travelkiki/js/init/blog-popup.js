$(document).ready(function() {
	var figures = $('.blog-images-popup .figures');
	var wrapper = $('.blog-images-popup .wrapper');
	$('.blog-article .figures').click(function(e){
		e.preventDefault();
		figures.removeClass('active');
		var top = $(this).offset().top - $(document).scrollTop(),
				left = $(this).offset().left,
				width = $(this).outerWidth(),
				height = $(this).outerHeight();
		// console.log(top, left, width, height)
		figures.css({
			top: (top-100)+'px',
			left: (left + 60 - figures.closest('.container').offset().left)+'px',
			width: (width)+'px'
		});
		$('.blog-images-popup .title').text(figures.find('img').eq(0).attr('alt'));
		setTimeout(function(){
			$('.blog-images-popup').addClass('active');
		}, 10);
		setTimeout(function(){
			figures.addClass('active');
		}, 20);
	});
	$('.blog-images-popup [data-close]').click(function(e){
		e.preventDefault();
		wrapper.scrollLeft(0);
		$('.blog-images-popup').removeClass('active');
	});
	wrapper.mousewheel(function(e){
		e.preventDefault();
		// console.log(e.deltaY)
		// wrapper.stop(true, true).animate({
		// 	scrollLeft: wrapper.scrollLeft() + (e.deltaY * 200 * -1)
		// }, 200, 'easeOutQuad');
		wrapper.scrollLeft(wrapper.scrollLeft() + (e.deltaY * 200 * -1));
	});
	wrapper.scroll(function(){
		figures.find('img').each(function(i, img){
			var start = $(img).offset().left,
					end = $(img).offset().left + $(img).outerWidth(),
					middle = wrapper.outerWidth() / 2;
			if (start < middle && end > middle){
				$('.blog-images-popup .title').text($(img).attr('alt'));
			}
		});
	})
});
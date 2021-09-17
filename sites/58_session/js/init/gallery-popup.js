$(document).ready(function() {
	var figures = null;
	var wrapper = null;
	var translation = 0;
	var startPos = 0;
	var dragging = false;
	var wasDragged = false;
	var offset = 0;

	$(document).on('click', '.page-gallery .figures', function(e){
		var popup = $(this).closest('.page-inner').find('.blog-images-popup');
		var wrapper = popup.find('.wrapper');
		var figures = popup.find('.figures');

		e.preventDefault();
		figures.removeClass('active');

		var top = $(this).offset().top - $(document).scrollTop(),
		left = $(this).offset().left,
		width = $(this).outerWidth(),
		height = $(this).height();

		figures.css({
			left: (left + 60 - figures.closest('.container').offset().left)+'px',
			width: (width)+'px'
		});
		popup.css('top', $(this).position().top+"px").css('height', height+'px');
		setTimeout(function(){
			popup.addClass('active');
		}, 10);
		setTimeout(function(){
			figures.addClass('active');
		}, 20);
		wrapper.on('mousedown', function(e){
			e.preventDefault();
			startPos = e.clientX;
			offset = wrapper.scrollLeft();
			dragging = true;
			wasDragged = false;
		});
		$(document).on('mousemove', function(e){
			if (!dragging) return;
			wasDragged = true;
			translation = e.clientX - startPos;
			wrapper.scrollLeft(offset-translation);
		});
	});
	$(document).on('click', '.blog-images-popup [data-close]', function(e){
		var wrapper = $('.blog-images-popup .wrapper');
		e.preventDefault();
		wrapper.scrollLeft(0);
		$('.blog-images-popup').removeClass('active');
	});
	$(document).on('mouseup', function(e){
		dragging = false;
		if (!wasDragged){
			var wrapper = $('.blog-images-popup .wrapper');
			e.preventDefault();
			wrapper.scrollLeft(0);
			$('.blog-images-popup').removeClass('active');
		}
	});
	$(document).on('click', function(e){
		if (!$(e.target).closest('.blog-images-popup').length){
			var wrapper = $('.blog-images-popup .wrapper');
			wrapper.scrollLeft(0);
			$('.blog-images-popup').removeClass('active');
		}
	})

	// $(document).on('mousewheel', '.blog-images-popup .wrapper', function(e){
	// 	var wrapper = $('.blog-images-popup .wrapper');
	// 	e.preventDefault();
	// 	wrapper.scrollLeft(wrapper.scrollLeft() + (e.deltaY * 200 * -1));
	// });
});
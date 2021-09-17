$(document).ready(function(){

	var pressed = false;
	var fakePressed = false;
	var start = 0;
	var current = 0;
	var list = $('.letters-filter li');
	var wrapper = $('.letters-filter-wrapper');
	var ul = $('.letters-filter');
	var hint = wrapper.find('.hint');
	var margin = .25;
	var divider = 10;
	var loop = null;
	var lastElement = null;
	var requestAnimationFrame = (
		window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame
	);

	function onMove(e){
		if (!e.originalEvent){
			console.warn('no e.originalEvent!');
			return;
		}
		if (!e.originalEvent.touches || !e.originalEvent.touches.length){
			console.warn('no touches on event!');
			return;
		}
		current = e.originalEvent.touches[0].clientX;

	}

	function getElement(x){
		var element = null;
		list.each(function(i, li){
			if ($(li).offset().left < x && $(li).offset().left+$(li).outerWidth() > x && !element){
				element = $(li);
				return element;
			}
		});
		return element;
	}

	function getOffset(position){
		var width = wrapper.outerWidth(),
				edgeLeft = width*margin,
				edgeRight = width*(1-margin);
		// console.log(width, edgeLeft, edgeRight)
		if (position < edgeLeft){
			return (position - edgeLeft) / divider;
		} else if (position > edgeRight) {
			return (position - edgeRight) / divider;
		} else {
			return 0;
		}
	}

	function translateWrapper(translateBy){
		var currentScrollLeft = ul.scrollLeft();
		ul.scrollLeft(currentScrollLeft + translateBy);
	}

	function render(){
		if (!pressed) return;
		requestAnimationFrame(render);

		element = getElement(current);
		offset = getOffset(current);
		if (element){
			element.addClass('active').siblings().removeClass('active');
			translateWrapper(offset);
			var text = element.find('[data-title]').attr('data-title');
			if (lastElement !== element){
				// console.log(element.attr('data-first'))
				hint.addClass('active');
				hint.css('left', element.offset().left);
				element.attr('data-first') ? hint.addClass('beginning') : hint.removeClass('beginning');
				hint.html(element.attr('data-first') ? "Featured" : text);
				lastElement = element;
			}
			// console.log(offset)
		}
	}

	$('.letters-filter-wrapper').on('touchstart', function(e){
		e.preventDefault();
		if (!e.originalEvent){
			console.warn('no e.originalEvent!');
			return;
		}
		if (!e.originalEvent.touches || !e.originalEvent.touches.length){
			console.warn('no touches on event!');
			return;
		}
		current = e.originalEvent.touches[0].clientX;

		// console.log(current);
		pressed = true;
		fakePressed = true;
		wrapper.addClass('fake-active');
		waitForFinalEvent(function(){
			if (!pressed) return;
			render();
			wrapper.addClass('active');
			$(document).on('touchmove', onMove);
		}, 300, 'filter-tap');
	});

	$(document).on('touchend touchcancel', function(e){
		// if (e.cancelable) {
		// 	e.preventDefault();
		// }
		// console.log(e);
		pressed = false;
		fakePressed = true;
		hint.removeClass('active');
		var left = list.filter('.active').position().left + ul.scrollLeft() - 10;
		wrapper.removeClass('fake-active active');
		setTimeout(function(){
			ul.scrollLeft(left);
		}, 110);
		$(document).on('touchmove', onMove);
	});

	function scrollToLetter(letter, premium){
		var founded = null;
		if (premium){
			founded = list.eq(0);
		} else {
			list.each(function(i, li){
				if ($(li).find('[data-title="'+letter+'"]').length){
					founded = $(li);
					return;
				}
			});
		}
		if (founded){
			founded.addClass('active').siblings().removeClass('active');
			var left = list.filter('.active').position().left + ul.scrollLeft() - 10;
			ul.scrollLeft(left);
		}
	}

	var selected = null;
	var lastSelected = null;

	$(window).scroll(function(){
		var navOffset = $('.letters-filter-wrapper').offset().top;
		$('.city-card').each(function(i, card){
			var offset = $(card).offset().top,
					height = $(card).outerHeight();
			if (navOffset > offset && navOffset < offset + height && selected !== card){
				selected = card;
			}
		});
		// console.log($(selected))
		if (selected && lastSelected !== selected){
			lastSelected = selected;
			scrollToLetter($(selected).find('.title').text()[0].toLowerCase(), $(selected).attr('class').match(/(primary|info|danger)/gim) ? true : false);
		}
	});

});
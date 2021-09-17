$(document).ready(function() {
	var setFooterHeight, teleport, waitForFinalEvent;
	waitForFinalEvent = (function() {
		var timers;
		timers = {};
		return function(callback, ms, uniqueId) {
			if (!uniqueId) {
				uniqueId = 'Don\'t call this twice without a uniqueId';
			}
			if (timers[uniqueId]) {
				clearTimeout(timers[uniqueId]);
			}
			timers[uniqueId] = setTimeout(callback, ms);
		};
	})();

	/*teleport */
	(teleport = function() {
		$('[data-tablet]').each(function(i, elem) {
			var parent;
			if ($(document).width() <= 992) {
				$(elem).appendTo($($(elem).data('tablet')));
			} else {
				parent = $($(elem).data('desktop'));
				$(elem).appendTo(parent);
			}
		});
		$('[data-mobile]').each(function(i, elem) {
			var parent;
			if ($(document).width() <= 768) {
				$(elem).appendTo($($(elem).data('mobile')));
			} else {
				parent = $($(elem).data('desktop'));
				$(elem).appendTo(parent);
			}
		});
	})();

	/*scrollto */
	$('[data-scrollto]').click(function(e) {
		e.preventDefault();
		$('html,body').animate({
			scrollTop: $($(this).data('scrollto')).offset().top
		}, 500);
	});
	setFooterHeight = function() {
		var footerHeight;
		footerHeight = $('.main-footer').outerHeight();
		$('main').css({
			paddingBottom: footerHeight + 'px'
		});
		$('.main-footer').css({
			marginTop: -footerHeight + 'px'
		});
	};
	setFooterHeight();
	$(window).resize(function() {
		waitForFinalEvent((function() {
			setFooterHeight();
			teleport();
		}), 200, '');
	});
	$(window).scroll(function() {
		var top = $(document).scrollTop();
		if (top >= 150){
			$('.filter').addClass('fixed');
		} else {
			$('.filter').removeClass('fixed');
		}
	});
	if ($(".product [data-zoom-image]").length && $.fn.elevateZoom){
		$(".product [data-zoom-image]").elevateZoom({
			// zoomType : "inner",
			// cursor: "crosshair"
		});
	}
	$('.product-graph').each(function(i, graph){

		var max = parseFloat($(graph).attr('data-max') || "10"),
				width = 500,
				height = 500,
				segmentWidth = 25,
				space = 5,
				tooltip = $('<div class="tooltip"></div>');
		tooltip.insertAfter($(graph))
		$('path', graph).each(function(i, path){
			var value = $(path).data('value') || 0,
					text = $(path).data('tooltip') || "",
					startRadius = ((10-i) / 10) * (width / 2) - space*i;
			$(path).attr('d', describeSector(250, 250, startRadius, startRadius-segmentWidth, 0, 353 * (value / max)))
			$(path).mouseover(function(){
				tooltip.html(text).addClass('active');
				$(graph).parent().find('.value').html(value.toFixed(1));
			});
			$(path).mouseout(function(){
				tooltip.html("").removeClass('active');
				$(graph).parent().find('.value').html($(graph).parent().find('.value').data('default') || '');
			});
			$(path).mousemove(function(e){
				var x = e.pageX - $(graph).position().left,
						y = e.pageY - $(graph).position().top;
				tooltip.css({
					top: y, left: x
				});
			});
		});
	});

	if ($('.product-fake .product').length == 0){
		$('.product').clone().appendTo($('.product-fake .container'))
	}

	$(window).scroll(function() {
		var top = $(document).scrollTop(),
				height = $('.product').outerHeight() + $('.product').offset().top - 100;
		if (top >= height){
			$('.product-fake').addClass('active');
		} else {
			$('.product-fake').removeClass('active');
		}
	});
});

$(document).ready(function() {
	var setFooterHeight, teleport;
	window.waitForFinalEvent = (function() {
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

	var lastWindowWidth = 0;

	/*teleport */
	(teleport = function() {
		if ($(window).width() === lastWindowWidth){
			return;
		} else {
			lastWindowWidth = $(window).width();
		}
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

	if ($('.blog-carousel').length && $.fn.owlCarousel){
		$('.blog-carousel .carousel').owlCarousel({
			autoWidth: true,
			items: 4,
			onInitialized: function(){
				$(this.$stage).find('.owl-item').each(function(i, item){
					// console.log(item)
					if ($(item).find('.item').hasClass('large')){
						$(item).addClass('large')
					}
					if ($(item).find('.item').hasClass('small')){
						$(item).addClass('small')
					}
				});
			}
		})
	}

	if ($('.weather-carousel').length && $.fn.owlCarousel){
		var owl = $('.weather-carousel .carousel').owlCarousel({
			items: 6,
			autoWidth: true,
			responsive: {
				0: {items: 3},
				480: {items: 4},
				768: {items: 4},
				992: {items: 5},
				1200: {items: 6}
			},
			onInitialized: function(){
				$('.weather-carousel').addClass('initialized');
				$('.weather-carousel').find('.owl-item').click(function(){
					console.log($(this).index())
					owl.trigger('to.owl.carousel', $(this).index())
				});
			}
		})
	}

	if ($('#bookLoading').length){
		var bookLoadingProgress = new ProgressBar($('#bookLoading')[0], 49500, function(){});
		setTimeout(function(){
			bookLoadingProgress.start();
		}, 500)
	}
	if ($(window).width() > 480){
		$('.book-carousel .carousel [data-more]').remove();
	}
	$('#bookLoading').addClass('active');
	if ($('.book-carousel').length && $.fn.owlCarousel){
		$('.book-carousel .carousel').owlCarousel({
			items: 1,
			loop: false,
			autoplay: true,
			mouseDrag: false,
			// autoplayHoverPause: true,
			autoplayTimeout: 50000,
			autoplaySpeed: 500,
			responsive: {
				480: {
					loop: true
				}
			},
			onTranslate: function(event){
				$('#bookLoading').removeClass('active');
				if ($('#bookLoading').length){
					bookLoadingProgress.stop();
				}
			},
			onDrag: function(event){
				$('#bookLoading').removeClass('active');
				if ($('#bookLoading').length){
					bookLoadingProgress.stop();
				}
			},
			onTranslated: function(event){
				// setTimeout(function(){
					if ($(window).width() > 480 || event.item.index < event.item.count-1){
						$('#bookLoading').addClass('active');
						bookLoadingProgress.start();
					}
				// }, 500)
			}
		});
		$('.book-carousel .carousel [data-more]').parent().attr('data-more-button', "");
	}


	// $('#date-range').focus(function(){
	// 	$('.calendar').addClass('active');
	// })
	// $('#date-range').blur(function(){
	// 	$('.calendar').removeClass('active');
	// })

	// $('#date-range').dateRangePicker({
	// 	container: '#date-range-parent'
	// })

	// var setBodyClass = function(){
	// 	var hash = window.location.hash,
	// 			route = 'main';
	// 	formSection.collapsed = false;
	// 	$('.form-section, .main-header').removeClass('collapsed');
	// 	if (hash.match(/tickets/gim)){
	// 		route = 'tickets';
	// 		formSection.collapsed = true;
	// 		$('.form-section, .main-header').addClass('collapsed');
	// 	}
	// 	$('body').attr('data-route', route);
	// };
	// setBodyClass();

	// var setSortingClass = function(){
	// 	$('.sorting a[href]').removeClass('active');
	// 	if (!location.hash.match(/(cheapest|shortest)/gim)){
	// 		$('.sorting a[href="#tickets"]').addClass('active');
	// 	}
	// 	if (location.hash.match(/(cheapest)/gim)){
	// 		$('.sorting a[href*="cheapest"]').addClass('active');
	// 	}
	// 	if (location.hash.match(/(shortest)/gim)){
	// 		$('.sorting a[href*="shortest"]').addClass('active');
	// 	}
	// };
	// setSortingClass();

	// $(window).on('hashchange', function(){
	// 	setBodyClass();
	// 	setSortingClass();
	// });

	// $('.main-header .btn-back').click(function(){
	// 	location.hash = "";
	// 	setTimeout(function(){
	// 		if (map) map.resize();
	// 	}, 510)
	// });


	$('[data-range-time]').each(function(i, div){
		if (typeof noUiSlider == 'undefined'){
			return;
		}
		var isSingle = $(div).attr('data-value') && !$(div).attr('data-values');
		var options = {
			start: $(div).attr('data-start') || 0,
			end: $(div).attr('data-end') || 99,
			step: $(div).attr('data-step') || 1,
			value: $(div).attr('data-value'),
			values: ($(div).attr('data-values') || ",").split(',')
		};
		// console.log(options);
		var slider = noUiSlider.create(div, {
			start: !isSingle ? options.values : options.value,
			connect: !isSingle ? true : [true, false],
			step: 1,
			margin: 2,
			range: {
				'min': parseInt(options.start),
				'max': parseInt(options.end)
			}
		});
		var inputA = $($(div).attr('data-range-time').split(',')[0]),
		inputB = $($(div).attr('data-range-time').split(',')[1]),
		labelA = $($(div).attr('data-range-labels').split(',')[0]),
		labelB = $($(div).attr('data-range-labels').split(',')[1]);
		function change(input){
			var e = document.createEvent('HTMLEvents');
			e.initEvent('input', true, true);
			input[0].dispatchEvent(e);
		}
		var setValues = function(){
			value = slider.get();
			if (!isSingle){
				value[0] = Math.formatTime(value[0]);
				value[1] = Math.formatTime(value[1]);
				inputA.val(value[0]);
				inputB.val(value[1]);
				change(inputA);
				change(inputB);
				labelA.html(value[0]);
				labelB.html(value[1]);
			} else {
				value = parseInt(value);
				inputA.val(value);
				change(inputA);
				labelA.html(value);
			}
		}
		slider.on('slide', function(event){
			setValues();
		});
		slider.on('set', function(event){
			setValues();
		});
		setValues();
		div.noUiSlider = slider;
	});

	$("form").on('reset', function(){
		$(this).find('[data-range-time]').each(function(i, div){
			if (div.noUiSlider){
				div.noUiSlider.reset();
			}
		});
	})

	// questions / answers


	var setEqualHeight = function(){
		var finalHeight = 0;

		$('.answers-list > li:not(.closer)').each(function(i, item){
			var itemHeight = $(item).outerHeight() + 100;

			if (itemHeight > finalHeight) {
				finalHeight = itemHeight;
			}
		});
		$('.answers-list').height(finalHeight);
	}
	if (window.innerWidth >= 768) {
		setEqualHeight();
	}

	$(window).resize(function() {
		if (window.innerWidth >= 768) {
			setEqualHeight();
		}
	});

	$('.questions-list > li').mouseover(function(e){
		if ($(document).width() <= 768){
			return;
		}
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		$('.answers-list > li').removeClass('active');
		$('.answers-list > li').eq($(this).index()).addClass('active');
	});
	$('.questions-list > li').click(function(e){
		if ($(document).width() > 768){
			return;
		}
		$('.answers-list > li').removeClass('opened');
		$('.answers-list > li').eq($(this).index()).addClass('opened');
		$('body').addClass('overlayed');
	});
	$('.answers-list .closer').click(function(e){
		e.preventDefault();
		$('.answers-list > li').removeClass('opened');
		$('body').removeClass('overlayed');
	});

	// 
	setInterval(function(){
		var number = parseInt($('.users-counter [data-counter]').text());
		var newNnumber = Math.round(1 - Math.random()*1.5);
		if (newNnumber > 0){
			$('.users-counter [data-counter]').html(number+1)
			$('.users-counter').addClass('smiled');
		} else {
			$('.users-counter [data-counter]').html(number-1)
			$('.users-counter').removeClass('smiled');
		}
		// console.log(newNnumber)
	}, 1000);


	// footer form

	$('.main-footer .information').click(function(e){
		e.preventDefault();
		if ($(document).width() > 768){
			$('main, .main-footer').toggleClass('offseted');
			$('.scroll-top').toggleClass('to-top');
		}
		$('.subscribe-form').toggleClass('active');
		if ($('.subscribe-form').hasClass('active')){
			$('.subscribe-form .input').focus();
		}
		// if ($('.main-footer .subscribe-form').hasClass('active')){
		// 	setTimeout(function(){
		// 		$('html, body').animate({
		// 			scrollTop: $('.main-footer').offset().top
		// 		}, 1000);
		// 		$('.main-footer .subscribe-form .input').focus();
		// 	});
		// } else {
		// 	setTimeout(function(){
		// 		$('html, body').animate({
		// 			scrollTop: $(document).height() - $(window).height() - 0.001
		// 		}, 100);
		// 	});
		// }
		// console.log($('html, body').scrollTop())
	});

	$('body').on('keydown keyup input change', '.subscribe-form .input, .subscribing .input', function(e){
		if ($(this).val().trim().length === 0){
			$($(e.target).closest('.form-group')).find('.btn').addClass('faded');
		} else {
			$($(e.target).closest('.form-group')).find('.btn').removeClass('faded');
		}
	});

	function checkMobileEntryState(){
		if ($(document).scrollTop() > $(document).height()-1500){
			$('.mobile-entry').addClass('hidden');
		} else {
			$('.mobile-entry').removeClass('hidden');
		}
	}
	checkMobileEntryState();

	$(document).scroll(function() {

		checkMobileEntryState();
		if ($('.subscribe-form').hasClass('active')){
			// $('.main-footer .information').click();
			$('main, .main-footer').removeClass('offseted');
			$('.subscribe-form').removeClass('active');
		}
	});

	// $('#date-range').Calendar({
	// 	container: '#calendarWrapper',
	// 	render: 'head,sidebar,body'
	// });

	// subscribing form


	// search
	$('.main-header').mouseover(function() {
		$('.form-section .static').addClass('hover');
	}).mouseout(function() {
		$('.form-section .static').removeClass('hover');
	})

	// $('.main-header .form-toggler').click(function(){
	// 	$('.form-section, .main-header').toggleClass('collapsed');
	// 	if ($('.form-section, .main-header').hasClass('collapsed')){
	// 		$('main').removeClass('filter-enable').addClass('filter-disable');
	// 	} else {
	// 		$('main').removeClass('filter-disable').addClass('filter-enable');
	// 	}
	// });

	$('.form-section .filter form').submit(function(e){
		e.preventDefault();
		var form = this;
		$('.form-section, .main-header').addClass('collapsed');
		$('main').removeClass('filter-enable').addClass('filter-disable');
		setTimeout(function(){
			$(form).trigger('custom.submit');
		}, 500);
	});

	// small ticket unwrap

	$('body').on('mousedown', '.small-ticket', function(e){
		e.preventDefault();
		$(this).toggleClass('expanded');
	});


	// mobile entry submit
	$('.mobile-entry, .mobile-filter, .filter-static-data').click(function(e){
		e.preventDefault();
		$('.form-section').attr('data-mode', $(this).hasClass('mobile-filter') && !$(this).hasClass('primary') ? "filter" : "search");
		$('.form-section').addClass('open');
		$('html,body').addClass('overlayed');
	})
	$('.form-section .close-form').click(function(e){
		e.preventDefault();
		$('.form-section').removeClass('open');
		$('html,body').removeClass('overlayed');
	})

	$('[data-toggle-checkbox]').each(function(i, toggler){
		// $(toggler).click(function(e){
		// 	e.preventDefault();
		// 	$($(this).attr('data-toggle-checkbox')).toggleClass('open');
		// });
		// $($(this).attr('data-toggle-checkbox')).find('input').click(function(){
		// 	$(toggler).html($('[for="'+$(this).attr('id')+'"]').html())
		// })
	});

	if ($(window).width() <= 768){
		$('.main-map').css('height', window.innerHeight);
		$('.subscribe-form .input').focus(function(){
			setTimeout(function(){
				$(document).scrollTop($('.subscribe-form').offset().top);
			}, 500);
		});
	}

	/*
		NAVIGATION ON "CITIES" PAGE
		*/
		if ($('.filter-nav').length){
			$('.filter-nav').clone().appendTo($('#nav-copy'));
			$(window).scroll(function(){
				var top = $(document).scrollTop();
				if (top > $('.hero .filter-nav').offset().top){
					$('.fixed-nav, .letters-filter').addClass('active');
				} else {
					$('.fixed-nav, .letters-filter').removeClass('active');
				}
			});
		} else if ($('.fixed-nav').length){
			$(window).scroll(function(){
				var top = $(document).scrollTop();
				if (top > 500){
					$('.fixed-nav').addClass('active');
				} else {
					$('.fixed-nav').removeClass('active');
				}
			});
		}
		if ($('.fixed-form').length){
			$(window).scroll(function(){
				var top = $(document).scrollTop();
				if (top > 300){
					$('.fixed-form').addClass('top');
				} else {
					$('.fixed-form').removeClass('top');
				}
				if (top > 350){
					$('.fixed-form').addClass('active-top');
				} else {
					$('.fixed-form').removeClass('active-top');
				}
			});
		}
	// or blodg nav
	$('.blog-nav').clone().prependTo($('#nav-copy'));

	/*
		scroll top
		*/
		$('.scroll-top').click(function(e) {
			e.preventDefault();
			$('html,body').animate({
				scrollTop: 0
			}, 500)
		});
		$(window).scroll(function(){
			var top = $(document).scrollTop();
			if (top > $(window).height()){
				$('.scroll-top').addClass('active');
			} else {
				$('.scroll-top').removeClass('active');
			}
		});


	/*
		SHOW \ HIDE COPY LINK PANEL
		*/
		function checkTogglersState(){
			if ($('body').hasClass('copy-offset')){
				$('[data-toggle-copy]').addClass('active');
			} else {
				$('[data-toggle-copy]').removeClass('active');
			}
		}
		$('[data-toggle-copy]').on('mousedown touchstart', function(e){
			e.preventDefault();
		// if ($(document).scrollTop() > 0){
		// 	$('html, body').animate({
		// 		scrollTop: 0
		// 	}, 300);
		// 	setTimeout(function() {
		// 		$('body').toggleClass('copy-offset');
		// 	}, 310);
		// } else {
		// }
		$('body').toggleClass('copy-offset');
		checkTogglersState();
	});
	// $('[data-tooltip-copied]').click(function(){
	// 	setTimeout(function(){
	// 		$('body').removeClass('copy-offset');
	// 		checkTogglersState();
	// 	}, 1000);
	// });

	$(window).scroll(function(){
		if ($('body').hasClass('copy-offset')){
			$('body').removeClass('copy-offset');
			checkTogglersState();
		}
	});


	/*
		SCROLLABLE PROGRESS
		*/
		$('.scrollable').scroll(function(){
			var top = $(this).scrollTop(),
			precent = top / (this.scrollHeight - this.clientHeight) * 100,
			activatedIndex = 0,
			section = $(this).closest('.section'),
			images = section.find('.images-slider li'),
			dots = section.find('.images-dots li'),
			tabs = section.find('[data-tab]');
			section.find('.scrollable-progress span').css({
				width: precent+'%'
			});
			section.find('[data-activate]').each(function(i, div){
				if ($(div).position().top < 100){
					activatedIndex = i;
					return;
				}
			});
			images.removeClass('active').eq(activatedIndex).addClass('active');
			tabs.removeClass('active').filter('[data-tab="'+activatedIndex+'"]').addClass('active');
			dots.removeClass('active').eq(activatedIndex).addClass('active');
		});


	/*
		FILTER NAVIGATION AUTO PADDING
		*/
		function setHeroFilterPadding(){
			var parent = $('.hero .filter-nav ul'),
			child = parent.find('> li').eq(0),
			parentWidth = parent.outerWidth(),
			childWidth = child.outerWidth();
			parent.css('padding-left', $(document).width() <= 768 ? (parentWidth/2 - childWidth/2)+'px' : "0px");
		};
		setHeroFilterPadding();


		$('.graph').each(function(i, graph){

			var max = parseFloat($(graph).attr('data-max') || "10"),
			width = 500,
			height = 500,
			segmentWidth = 25,
			space = 10,
			valueBlock = $(graph).parent().find('.value'),
			mobileIndex = 1,
			mobileTotal = $('path', graph).length;

			function showTooltipByIndex(indx, value){
				if (indx > 0){
					valueBlock.html(value.toFixed(1));
				} else {
					valueBlock.html($(graph).parent().find('.value').data('default') || '');
				}
				$('.tooltip-block').removeClass('active');
				$('.tooltip-block[data-tooltip-id="'+indx+'"]').addClass('active');
			}

			$('path', graph).each(function(i, path){
				var value = $(path).data('value') || 0,
				text = $(path).data('tooltip') || "",
				startRadius = ((10-i) / 10) * (width / 2) - space*i;
				$(path).attr('d', describeSector(250, 250, startRadius, startRadius-segmentWidth, 0, 353 * (value / max)));

				$(path).mouseover(function(){
					showTooltipByIndex(($(path).data('tooltip') || 0), value);
				});

				$(path).mouseout(function(){
					$('.tooltip-block').removeClass('active');
					$('.tooltip-block[data-tooltip-id="0"]').addClass('active');
					valueBlock.html($(graph).parent().find('.value').data('default') || '');
				});
			});
			$(graph).closest('.graph-wrapper').on('touchstart', function(e){
				e.preventDefault();
				$(graph).attr('data-mobile-state', mobileIndex);
				var value = $('path[data-tooltip="'+mobileIndex+'"]', graph).data('value') || 0;
				$('path', graph).removeClass('active');
				$('path[data-tooltip="'+mobileIndex+'"]', graph).addClass('active');
				showTooltipByIndex(mobileIndex, value);
				console.log(mobileIndex)
				mobileIndex++;
				if (mobileIndex > mobileTotal){
					mobileIndex = 0;
				}
			});
		});


		/*mobile viewport*/
		$(window).scroll(function(){
			if ($(window).width() > 768){
				return;
			}
			var top = $(document).scrollTop() + $(window).height()/2;
			$('[data-mobile-inviewport].in-viewport').removeClass('in-viewport');
			$('[data-mobile-inviewport]').each(function(i, block){
				if (top > $(block).offset().top && top < $(block).offset().top + $(block).outerHeight()){
					$(block).addClass('in-viewport');
					return;
				}
			});
		});

		/* blog nav toggle */
		$('[data-toggle-blog]').click(function(e){
			var nav = $(this).closest('[class*="col-"]').find('.blog-nav'),
			isOpened = nav.hasClass('active'),
			row = $(this).closest('.fixed-nav');
			nav.toggleClass('active');
			$(this).toggleClass('active');
		// console.log(row)
		// data-share-col
		// data-toggler-col
		if (isOpened){
			row.find('[data-share-col]').addClass('col-sm-7 col-md-9').removeClass('col-sm-3 col-md-2');
			row.find('[data-toggler-col]').addClass('col-sm-2 col-md-1').removeClass('col-sm-7 col-md-9');
		} else {
			row.find('[data-share-col]').removeClass('col-sm-7 col-md-9').addClass('col-sm-2 col-md-1');
			row.find('[data-toggler-col]').removeClass('col-sm-2 col-md-1').addClass('col-sm-7 col-md-9');
		}
	});

		$('.calendar .body .scrolled').scroll(function(){
			var items = $(this).find('li')
			var month = $('.calendar').find('.months-list')

			items.each(function(i, item){
				if ($(item).position().top <= 350) {
					month.find('li .month').each(function(i, monthName){
						if ($(monthName).text().trim() === $(item).find('caption > .month').text().trim()) {
							$('.calendar').find('.months-list').find('li').removeClass('visible');
							$(monthName).parent('li').addClass('visible');
							$(monthName).parent('li').prev('li').addClass('visible');
						}
					})
				}
			})
		});

		$(window).resize(function() {
			waitForFinalEvent((function() {
				setFooterHeight();
				teleport();
				setHeroFilterPadding();
			}), 200, '');
		});
	});

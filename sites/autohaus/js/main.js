$(document).ready(function() {
  var detailSlider, setFooterHeight, teleport, waitForFinalEvent;
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
  window.toggleMainMenuState = function() {
    var isOpened;
    isOpened = $('.menu-toggler').hasClass('active');
    if (isOpened) {
      $('.menu').addClass('active');
      $('.main-header').addClass('menu-opened');
    } else {
      $('.menu').removeClass('active');
      $('.main-header').removeClass('menu-opened');
    }
  };
  window.hideMenu = function() {
    $('.menu-toggler').removeClass('active');
    toggleMainMenuState();
  };
  $('.menu-toggler').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
    toggleMainMenuState();
  });
  $('body').click(function(e) {
    if ($(e.target).closest('.menu, .menu-toggler').length === 0) {
      hideMenu();
    }
  });
  $('.slider-wrapper .slider').owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: ['<i class="icon icon-chevron-left"></i>', '<i class="icon icon-chevron-right"></i>']
  });
  $('.text-slider-wrapper .text-slider').owlCarousel({
    items: 1,
    loop: true,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true
  });
  $('.carousel-wrapper .carousel').each(function(i, carousel) {
    var _carousel, chechNavState, navs;
    navs = $(carousel).attr('data-navs');
    if (navs) {
      navs = navs.split(',');
      navs = {
        prev: $(navs[0]),
        next: $(navs[1])
      };
    }
    chechNavState = function(e) {
      if (!navs) {
        return;
      }
      if (e.item.index === 0) {
        navs.prev.addClass('hidden');
      } else {
        navs.prev.removeClass('hidden');
      }
      if (e.item.index === e.item.count - this.settings.items) {
        navs.next.addClass('hidden');
      } else {
        navs.next.removeClass('hidden');
      }
    };
    _carousel = $(carousel).owlCarousel({
      items: 3,
      loop: false,
      nav: false,
      dots: true,
      autoplay: false,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      onRefresh: function() {
        return $(carousel).addClass('hidden');
      },
      onRefreshed: function() {
        return $(carousel).removeClass('hidden');
      },
      responsive: {
        0: {
          items: 1
        },
        480: {
          items: 2
        },
        992: {
          items: 3
        }
      },
      onInitialized: function(e) {
        chechNavState.call(this, e);
      },
      onTranslate: function(e) {
        chechNavState.call(this, e);
      }
    });
    if (navs) {
      navs.prev.click(function(e) {
        return _carousel.trigger('prev.owl.carousel');
      });
      navs.next.click(function(e) {
        return _carousel.trigger('next.owl.carousel');
      });
    }
  });
  $(document).scroll(function() {
    var top;
    top = $(window).scrollTop();
    if (top > 0) {
      $('.main-header').addClass('filled');
    } else {
      $('.main-header').removeClass('filled');
    }
  });
  detailSlider = $('.detail-slider .slider').owlCarousel({
    items: 1,
    loop: false,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    onTranslate: function(e) {
      var index, offset, total;
      total = e.item.count;
      index = e.item.index;
      offset = -100 / total;
      $('.detail-thumbnails li').removeClass('active').eq(index).addClass('active');
      $('.detail-thumbnails ul').css({
        "-webkit-transform": "translateY(" + (offset * Math.max(0, index - 4)) + "%)",
        "-moz-transform": "translateY(" + (offset * Math.max(0, index - 4)) + "%)",
        "-ms-transform": "translateY(" + (offset * Math.max(0, index - 4)) + "%)",
        "transform": "translateY(" + (offset * Math.max(0, index - 4)) + "%)"
      });
    }
  });
  $('.detail-thumbnails li').hover(function(e) {
    detailSlider.trigger('to.owl.carousel', $(this).index());
  });
  $('.collapser .footer .btn').click(function(e) {
    e.preventDefault();
    $(this).closest('.collapser').toggleClass('expanded');
  });
  $(window).resize(function() {
    waitForFinalEvent((function() {
      setFooterHeight();
      teleport();
    }), 200, '');
  });
});

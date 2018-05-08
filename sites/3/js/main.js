$(document).ready(function() {
  var checkScrollBars, removeClasses, setFooterHeight, setHeaderType, teleport, toggleClasses, toggleMainMenu, waitForFinalEvent;
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
  $(document).scroll(function() {
    return setHeaderType();
  });
  (setHeaderType = function() {
    var top;
    if ($(document).width() <= 992) {
      return;
    }
    top = $(document).scrollTop();
    if (top >= $('.main-header .menu-section').offset().top) {
      $('.main-header').addClass('fixed');
    } else {
      $('.main-header').removeClass('fixed');
    }
  })();
  $('.main-slider').owlCarousel({
    items: 1,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    loop: true
  });

  /*scrollto */
  $('[data-scrollto]').click(function(e) {
    e.preventDefault();
    $('html,body').animate({
      scrollTop: $($(this).data('scrollto')).offset().top
    }, 500);
  });

  /*dropdown */
  $('[data-dropdown]').each(function(i, elem) {
    $('.anchor', elem).click(function(e) {
      e.preventDefault();
      $(this).closest('[data-dropdown]').toggleClass('active');
    });
  });
  $('body').click(function(e) {
    if ($(e.target).closest('[data-dropdown]').length === 0) {
      $('[data-dropdown]').removeClass('active');
    }
    setTimeout(function() {
      if ($(e.target).closest('[data-dropdown]').hasClass('active')) {
        $(e.target).closest('[data-dropdown]').addClass('animated');
      } else {
        $(e.target).closest('[data-dropdown]').removeClass('animated');
      }
    }, 50);
  });
  $('body').on('click', '.fader, .dropdown-menu [data-dismiss], .dropdown-menu [data-call]', function(e) {
    $('[data-dropdown]').removeClass('active');
  });

  /*toggleclass */
  toggleClasses = ',';
  removeClasses = function(node) {
    var togglers;
    togglers = node ? $('[data-toggleclass]').not(node) : $('[data-toggleclass]');
    togglers.each(function(i, elem) {
      $(elem).removeClass('active');
      if ($(elem).data('toggleclass')) {
        $($(elem).data('toggleclass')).removeClass('active');
      }
    });
  };
  $('[data-toggleclass]').each(function(i, elem) {
    if ($(elem).data('toggleclass')) {
      toggleClasses += ' ' + $(elem).data('toggleclass');
    }
    $('.anchor', elem).click(function(e) {
      var toggled;
      e.preventDefault();
      removeClasses(elem);
      toggled = $(elem).data('toggleclass') ? $($(elem).data('toggleclass')) : false;
      $(this).closest('[data-toggleclass]').toggleClass('active');
      if (!toggled) {
        return;
      }
      if ($(this).closest('[data-toggleclass]').hasClass('active')) {
        toggled.addClass('active');
      } else {
        toggled.removeClass('active');
      }
    });
  });
  $('body').on('click', function(e) {
    if ($(e.target).closest('[data-toggleclass]' + toggleClasses).length === 0) {
      removeClasses();
    }
  });
  $('.input').each(function(i, input) {
    $(input).focus(function() {
      $(input).addClass('active');
    }).blur(function() {
      if ($(input).val().trim().replace(/(\+|\-|_|\(|\)| |\s)/gim, '').length === 0) {
        $(input).removeClass('active');
        $(input).val('');
      }
    });
  });
  $('select').each(function(i, select) {
    $(select).select2({
      minimumResultsForSearch: -1,
      dropdownParent: $(select).parent()
    });
    return $(select).on('select2:select', function(opt) {
      $(select).val(opt.params.data.id || opt.params.data.text).trigger('change');
    });
  });

  /*scrollbars */
  (checkScrollBars = function() {
    if ($(document).width() > 992) {
      $('.scrolled').perfectScrollbar();
    } else {
      $('.scrolled').perfectScrollbar('destroy');
    }
  })();

  /*
  			main nav toggle
   */
  toggleMainMenu = function() {
    var isActive;
    isActive = $('.toggle-menu').hasClass('active');
    if (isActive) {
      $('html,body').addClass('overlayed');
      $('.mobile-menu').addClass('active');
    } else {
      $('.mobile-menu').removeClass('active');
      setTimeout(function() {
        return $('html,body').removeClass('overlayed');
      }, 300);
    }
  };
  $('.toggle-menu').click(function(e) {
    e.preventDefault();
    $('.toggle-menu').addClass('active');
    toggleMainMenu();
  });
  $('.menu-close').click(function(e) {
    e.preventDefault();
    $('.toggle-menu').removeClass('active');
    toggleMainMenu();
  });
  $('.mobile-menu').on('click', '.arrow', function(e) {
    e.preventDefault();
    $('.mobile-menu').addClass('offseted').scrollTop(0);
    $('.arrow, .dropmenu').removeClass('active');
    $(this).addClass('active');
    $(this).closest('[data-dropmenu]').find('.dropmenu').addClass('active');
  });
  $('.menu-return').click(function(e) {
    e.preventDefault();
    $('.mobile-menu').removeClass('offseted');
  });
  $('.map-places-list li').click(function(e) {
    $(this).closest('[data-toggleclass]').find('.anchor span').html($(this).find('.title').text());
    $(this).closest('[data-toggleclass]').removeClass('active');
  });

  /*carousel */
  $('.carousel').each(function(i, carousel) {
    var items;
    items = $(carousel).attr('data-items');
    items = !items ? items = [4, 3, 2, 1] : items.split(',');
    return $(carousel).owlCarousel({
      nav: false,
      dots: true,
      responsive: {
        0: {
          items: items[4] || 1
        },
        480: {
          items: items[3] || 2
        },
        768: {
          items: items[2] || 3
        },
        992: {
          items: items[1] || 4
        },
        1200: {
          items: items[0] || 4
        }
      },
      onInitialized: function() {
        $(carousel).addClass('owl-carousel');
      }
    });
  });
  $(window).resize(function() {
    waitForFinalEvent((function() {
      setFooterHeight();
      teleport();
      checkScrollBars();
    }), 200, '');
  });
});

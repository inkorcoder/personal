var isNumberKey;

isNumberKey = function(evt) {
  var charCode;
  charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
};

$(document).ready(function() {
  var counters, featureCarousel, phoneCarousel, setFooterHeight, teleport, waitForFinalEvent;
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
  });
  $(window).scroll(function() {
    var counter, j, len, top;
    top = $(document).scrollTop();
    if (top > $('.map-bg').offset().top - $(window).outerHeight() / 2) {
      for (j = 0, len = counters.length; j < len; j++) {
        counter = counters[j];
        counter.start();
      }
    }
    if ($(document).width() <= 992) {
      return;
    }
    $('[class*="bg-lines"]').each(function(i, bg) {
      var y;
      y = $(bg).closest('.section').offset().top - top;
      $(bg).css({
        transform: 'translateY(' + (-y / 5) + 'px)'
      });
    });
  });
  phoneCarousel = $('.phone-carousel .owl-carousel').owlCarousel({
    singleItem: true,
    afterMove: function() {
      $('#phoneNav1 li').removeClass('active').eq(this.currentItem).addClass('active');
      $('#phoneNav2 li').removeClass('active').eq(this.currentItem).addClass('active');
    }
  }).data('owl-carousel');
  $('#phoneNav1 li, #phoneNav2 li').click(function(e) {
    e.preventDefault();
    phoneCarousel.goTo($(this).index());
  });
  featureCarousel = $('.feature-carousel .owl-carousel').owlCarousel({
    singleItem: true,
    afterMove: function() {
      $('#featureNav1 li').removeClass('active').eq(this.currentItem).addClass('active');
      $('#featureNav2 li').removeClass('active').eq(this.currentItem).addClass('active');
    }
  }).data('owl-carousel');
  $('#featureNav1 li, #featureNav2 li').click(function(e) {
    e.preventDefault();
    featureCarousel.goTo($(this).index());
  });
  $('.reviews').owlCarousel({
    navigation: true,
    pagination: false,
    items: 3,
    itemsDesktop: [1199, 3],
    itemsDesktopSmall: [992, 2],
    itemsTablet: [768, 1],
    itemsMobile: [360, 1]
  });
  counters = [];
  $('[data-countto]').each(function(i, count) {
    var options;
    options = {
      useEasing: true,
      useGrouping: true,
      separator: ' ',
      decimal: '.'
    };
    counters.push(new CountUp($(count).find('dd')[0], 0, $(count).data('countto'), 0, 5, options));
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
  $(window).resize(function() {
    waitForFinalEvent((function() {
      setFooterHeight();
      teleport();
      $('.point-block').removeClass('active');
    }), 200, '');
  });
  $('.plus-btn').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
    $('.equipment').removeClass('active').eq($(this).hasClass('active') ? 1 : 0).addClass('active');
  });
  $('.equipment .point-block').click(function(e) {
    e.preventDefault();
    $('.point-block').not(this).removeClass('active');
    $(this).toggleClass('active');
  });
  $('body').on('click', function(e) {
    if ($(e.target).closest('.point-block').length === 0) {
      $('.point-block').removeClass('active');
    }
  });
  $(window).scroll(function() {
    $('.point-block').removeClass('active');
  });
  $('.tabs-dots li').click(function(e) {
    e.preventDefault();
    $(this).parent().siblings('.tab-nav').find('li').eq($(this).index()).click();
  });
});

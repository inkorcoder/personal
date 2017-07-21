var cutBody, errorsDictionary, uncutBody;

errorsDictionary = {

  /*имя */
  nameLength: '<span>Имя</span> не может быть короче двух символов!',
  nameIsEmpty: 'Введите пожалуйста <span>Имя</span>!',

  /*номер */
  phoneIsEmpty: 'Введите пожалуйста <span>номер телефона</span>!',
  phoneLength: 'Введите <span>номер телефона</span> полностью!',

  /*имейл */
  emailIsEmpty: 'Введите пожалуйста <span>email</span>!',
  emailValid: 'Неправильно введен <span>email</span>! <br> <span>email</span> должен соответствовать шабону: <span>username@example.com</span>',

  /*текст */
  textIsEmpty: 'Введите пожалуйста <span>текст сообщения</span>!',
  textLength: '<span>текст сообщения</span> не может быть короче 20 символов!'
};

cutBody = function() {
  $('body').css('width', $('body').width() + 'px');
  $('html,body').addClass('overlayed');
};

uncutBody = function() {
  $('body').css('width', '');
  $('html,body').removeClass('overlayed');
};

$(document).ready(function() {

  /*
  			helpers, actual window width \ height
   */
  var checkFooterHeight, checkHeaderClass, checkPricesHeight, preloaderInput, setCommentsScrolledHeight, setMenuHeight, waitForFinalEvent, windowHeight, windowWidth;
  windowWidth = function() {
    var w;
    w = 0;
    if (window.innerWidth > window.outerWidth) {
      w = window.outerWidth;
    } else {
      w = window.innerWidth;
    }
    return Math.max(w, $(window).width());
  };
  windowHeight = function() {
    var w;
    w = 0;
    if (window.innerHeight > window.outerHeight) {
      w = window.outerHeight;
    } else {
      w = window.innerHeight;
    }
    return Math.max(w, $(window).height());
  };

  /*
  			wait for final event funciton
   */
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
  if (windowWidth() > 992 && $.fn.perfectScrollbar) {
    $('.scrolled-block').perfectScrollbar();
    $('.wrapper').perfectScrollbar();
  }
  $('.rating li:not(.text)').click(function(e) {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });
  $('.progress').each(function(i, canvas) {
    var progressBar, time;
    time = parseInt($(canvas).data('time'));
    if (!time) {
      time = 500;
    }
    progressBar = new ProgressBar(canvas, time);
  });
  (setMenuHeight = function() {
    var height;
    height = $('.hero-section').outerHeight();
    $('.hero-section .main-nav').css('height', height + 'px');
  })();
  window.checkImagesRatio = function(context) {
    var galleries;
    galleries = (context ? $('img', context) : $('.gallery-item > .image img, .gallery-item > .image figure img'));
    galleries.each(function(i, image) {
      var imageRatio, parentRatio;
      parentRatio = $(image).parent().outerWidth() / $(image).parent().outerHeight();
      imageRatio = $(image).outerWidth() / $(image).outerHeight();
      if (parentRatio > imageRatio) {
        $(image).addClass('vertical');
      } else {
        $(image).removeClass('vertical');
      }
    });
  };
  checkImagesRatio();
  window.packeryGrids = [];
  if ($.fn.packery) {
    $('.gallery-wrapper, .news-wrapper').each(function(i, grid) {
      var packeryGrid;
      packeryGrid = $(grid).packery({
        itemSelector: '.item',
        gutter: 0,
        percentPosition: true
      });
      packeryGrid.on('layoutComplete', checkImagesRatio);
      window.packeryGrids.push(packeryGrid);
      setTimeout(function() {
        $(grid).addClass('initialized');
      }, 100);
    });
  }
  if ($.fn.owlCarousel) {
    $(".images-gallery").each(function(i, gallery) {
      var $gallery;
      $gallery = $(gallery).owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000 + 500 * i,
        autoplayHoverPause: true,
        smartSpeed: 500,
        nav: false,
        dots: true,
        onInitialized: function() {
          checkImagesRatio(gallery);
        }
      });
    });
    lightbox.option({
      resizeDuration: 400,
      wrapAround: true,
      albumLabel: "%1 из %2"
    });
    $('.primary-slider .slider').each(function(i, _slider) {
      var slider, thumbs;
      thumbs = $('[data-toggled="' + $(_slider).closest('[data-toggled]').data('toggled') + '"]').find('.thumbnails-list');
      slider = $(_slider).owlCarousel({
        items: 1,
        loop: $(_slider).data('loop') ? true : false,
        smartSpeed: 500,
        nav: true,
        autoplay: $(_slider).data('autoplay') ? true : false,
        autoplayTimeout: $(_slider).data('autoplay') ? parseInt($(_slider).data('autoplay')) : false,
        dots: true,
        onInitialized: function() {
          checkImagesRatio(_slider);
          setTimeout(function() {
            $(slider).parent().addClass('initialized');
          }, 500);
        },
        onTranslate: function(d) {
          thumbs.find('.item').removeClass('active').eq(this._current).addClass('active');
        }
      });
      thumbs.on('click', '.item', function(e) {
        e.preventDefault();
        slider.trigger('to.owl.carousel', $(this).parent().index());
      });
    });
    $('.portfolio-carousel .carousel').owlCarousel({
      items: 6,
      loop: false,
      smartSpeed: 500,
      nav: true,
      dots: false,
      responsive: {
        0: {
          items: 1
        },
        480: {
          items: 2
        },
        640: {
          items: 3
        },
        992: {
          items: 3
        },
        1280: {
          items: 4
        },
        1440: {
          items: 5
        },
        1600: {
          items: 6
        }
      },
      onInitialized: function() {
        $('.portfolio-carousel').addClass('initialized');
        checkImagesRatio($('.portfolio-carousel')[0]);
      }
    });
    $('.thumbnails-list').each(function(i, list) {
      $(list).owlCarousel({
        items: 6,
        loop: false,
        smartSpeed: 500,
        mouseDrag: false,
        nav: true,
        dots: false,
        responsive: {
          0: {
            items: 2
          },
          480: {
            items: 3
          },
          640: {
            items: 4
          },
          992: {
            items: 5
          },
          1280: {
            items: 6
          },
          1440: {
            items: 7
          },
          1600: {
            items: 8
          }
        }
      });
    });
  }
  $('body').on('click', '.filter-section .anchor:not(.disabled)', function(e) {
    $('.filter-section .dropdown.active').not($(this).closest('.dropdown')).removeClass('active');
    $(this).closest('.dropdown').toggleClass('active');
  });
  $('body').on('click', function(e) {
    if ($(e.target).closest('.filter-section .dropdown.active .anchor').length === 0) {
      $('.filter-section .dropdown').removeClass('active');
    }
  });
  (checkFooterHeight = function() {
    var height;
    height = $('.footer').outerHeight();
    $('main').css({
      paddingBottom: height + 'px'
    });
    $('.footer').css({
      marginTop: -height + 'px'
    });
  })();

  /*
  			portfolio
   */
  (setCommentsScrolledHeight = function() {
    var height, parentHeight;
    height = $('.sidebar .sidebar-footer').outerHeight();
    parentHeight = $('.sidebar .scrolled-block').parent().outerHeight();
    $('.sidebar .scrolled-block').each(function(i, block) {
      $(block).css('height', ($(block).hasClass('portfolio-caption') ? parentHeight : parentHeight - height) + 'px');
    });
    if ($.fn.perfectScrollbar) {
      $('.sidebar .scrolled-block').perfectScrollbar('update');
    }
  })();

  /*
  			resize
   */
  $(window).resize(function() {
    setMenuHeight();
    waitForFinalEvent((function() {
      checkFooterHeight();
      checkImagesRatio();
      if (windowWidth() > 768) {
        $('.scrolled-block').perfectScrollbar();
        $('.scrolled-block').perfectScrollbar('update');
      } else {
        $('.scrolled-block').perfectScrollbar('destroy');
      }
      if (windowWidth() > 992) {
        $('.sidebar .scrolled-block').perfectScrollbar();
      } else {
        $('.sidebar .scrolled-block').perfectScrollbar('destroy');
      }
      setCommentsScrolledHeight();
      checkImagesRatio($('.primary-slider .slider')[0]);
      $('.primary-slider.no-dots .slider').each(function(i, slider) {
        checkImagesRatio(slider);
      });
      checkPricesHeight();
    }), 300, '');
  });

  /*
  			scroll
   */
  (checkHeaderClass = function() {
    var top;
    top = $(document).scrollTop();
    if (top > 0) {
      $('.main-header.typical').addClass('fixed');
    } else {
      $('.main-header.typical').removeClass('fixed');
    }
  })();
  $(document).scroll(function() {
    checkHeaderClass();
    if (windowWidth() > 992) {
      setCommentsScrolledHeight();
    }
  });

  /*
  			likes
   */
  $('.show-likes-btn').click(function(e) {
    var $this;
    $this = $(this);
    $this.addClass('run-animation');
    setTimeout(function() {
      $this.addClass('faded');
      return $this.removeClass('run-animation');
    }, 1000);
  });
  $('.portfolio-carousel').each(function(i, carousel) {
    $(carousel).on('mouseover', function() {
      $(carousel).addClass('notransition');
    }).on('mousemove', function(e) {
      var x;
      x = (e.pageX - $(carousel).offset().left) / $(carousel).outerWidth();
      $('.owl-prev', carousel).css('opacity', 1 - x);
      $('.owl-next', carousel).css('opacity', x);
    }).on('mouseout', function() {
      $(carousel).removeClass('notransition');
      $('.owl-prev', carousel).css('opacity', 0);
      $('.owl-next', carousel).css('opacity', 0);
    });
  });

  /*
  			toggler
   */
  $('[data-toggle]').click(function(e) {
    var active, inactive;
    e.preventDefault();
    if ($(this).hasClass('active')) {
      return;
    }
    active = $('[data-toggled="' + $(this).data('toggle').split(',')[0] + '"]');
    inactive = $('[data-toggled="' + $(this).data('toggle').split(',')[1] + '"]');
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    active.removeClass('hidden');
    active.addClass('faded');
    inactive.addClass('hidden');
    setTimeout(function() {
      checkImagesRatio(active.find('.slider')[0]);
      return active.removeClass('faded');
    }, 500);
  });
  $('.footer-tabs li').click(function(e) {
    e.preventDefault();
    $(this).siblings().find('.btn').removeClass('active');
    $(this).find('.btn').addClass('active');
    if ($(this).index() === 0) {
      $('.sidebar-footer .tabs').addClass('offseted');
    } else {
      $('.sidebar-footer .tabs').removeClass('offseted');
    }
  });

  /*
  			price
   */
  $('.prices-section').on('click', '.show-form-btn', function(e) {
    e.preventDefault();
    $(this).siblings('.typical-form').addClass('active');
  }).on('click', '.hide-form-btn', function(e) {
    e.preventDefault();
    $(this).closest('.typical-form').removeClass('active');
  });
  $('.prices-section .tab .price-list li').hover(function(e) {
    var index;
    index = $(this).index();
    $(this).closest('.tab').find('.price-list').each(function(i, list) {
      $('li', list).eq(index).addClass('active');
    });
  }, function(e) {
    var index;
    index = $(this).index();
    $(this).closest('.tab').find('.price-list').each(function(i, list) {
      $('li', list).eq(index).removeClass('active');
    });
  });
  $(".mini-model").keydown(function(e) {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {
      return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
  $('.tabs-anchor').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('active');
  });
  $('.tabs-list li, .prices-list .menu a').click(function() {
    $('.tabs-anchor').removeClass('active');
    if ($(document).width() <= 992) {
      $('html,body').animate({
        scrollTop: 0
      }, 300);
    }
  });
  (checkPricesHeight = function() {
    if (window.location.hash === '#' || window.location.hash === '') {
      $('#priceSection').css('height', '');
    } else {
      if (windowWidth() < 992) {
        $('#priceSection').css('height', $('.prices-section .tab.active').height() + 'px');
      } else {
        $('#priceSection').css('height', '');
      }
    }
  })();
  $(window).on('hashchange', function() {
    checkPricesHeight();
  });
  preloaderInput = false;
  $(document).keydown(function(e) {
    preloaderInput = true;
  });
  $(document).keyup(function(e) {
    preloaderInput = false;
  });
  setTimeout(function() {
    var bsodText;
    if (preloaderInput) {
      bsodText = "A problem has been detected and Windows has been shut down to prevent damage to your computer. <span class='br'></span> The problem seems to be caused by the following file: xNtKrnl.exe <span class='br'></span> SYSTEM_THREAD_EXCEPTION_NOT_HANDLED <span class='br'></span> If this is the first time you've seen this stop error screen, restart your computer. If this screen appears again, follow these steps: <span class='br'></span> Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for any Windows updates you might need. <span class='br'></span> If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing. If you need to use safe mode to remove or disable components, restart your computer, press F8 to select Advanced Startup Options, and then select Safe Mode. <span class='br'></span> Technical Information: <span class='br'></span> *** STOP: 0x1000007e (0xffffffffc0000005, 0xfffff80002e55151, 0xfffff880009a99d8, 0xfffff880009a9230) <span class='br'></span> *** xNtKrnl.exe - Address 0xfffff80002e55151 base at 0xfffff80002e0d000 DateStamp 0x4ce7951a";
      return $('body > .preloader').addClass('error').html(bsodText);
    } else {
      $('body > .preloader').fadeOut(600);
      $('html,body').removeClass('preloading');
      return setTimeout(function() {
        return $('body > .preloader, #preloaderScript, canvas:not(.progress)').remove();
      }, 1000);
    }
  }, 3000);
});

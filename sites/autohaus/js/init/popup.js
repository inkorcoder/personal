$(function() {
  var CallPopup, hidePopups;
  $('[data-call]').click(function(e) {
    var called;
    e.preventDefault();
    called = $($(this).data('call'));
    if (!called.hasClass('active')) {
      $('html,body').css('width', $('body').width() + 'px').addClass('overlayed');
      called.show().addClass('showed');
      setTimeout(function() {
        called.addClass('active');
        if (called.data('onopen') && window[called.data('onopen')]) {
          return window[called.data('onopen')](called);
        }
      }, 100);
    }
  });
  CallPopup = function(selector) {
    var called;
    called = $(selector);
    if (!called.hasClass('active')) {
      $('html,body').css('width', $('body').width() + 'px').addClass('overlayed');
      called.show().addClass('showed');
      setTimeout(function() {
        called.addClass('active');
        if (called.data('onopen') && window[called.data('onopen')]) {
          return window[called.data('onopen')](called);
        }
      }, 100);
    }
  };
  $('[data-dismiss]').click(function(e) {
    var called;
    e.preventDefault();
    called = $($(this).data('dismiss'));
    $('html,body').css('width', '').removeClass('overlayed');
    called.removeClass('active');
    setTimeout(function() {
      called.hide().removeClass('showed');
      if (called.data('onclose') && window[called.data('onclose')]) {
        return window[called.data('onclose')](called);
      }
    }, 300);
  });
  hidePopups = function() {
    $('.popup').each(function(i, popup) {
      var called;
      called = $(popup);
      $('html,body').css('width', '').removeClass('overlayed');
      called.removeClass('active');
      setTimeout(function() {
        called.hide().removeClass('showed');
        if (called.data('onclose') && window[called.data('onclose')]) {
          return window[called.data('onclose')](called);
        }
      }, 300);
    });
  };
  $('.popup-close').click(function(e) {
    e.preventDefault();
    hidePopups();
  });
  $('.popup').click(function(e) {
    if ($(e.target).closest('.inner').length === 0) {
      e.preventDefault();
      hidePopups();
    }
  });
});

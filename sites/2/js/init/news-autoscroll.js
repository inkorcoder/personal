$(window).scroll(function() {
  if ($('.news-wrapper').length === 0) {
    return;
  }
  if ($(document).scrollTop() > $('.news-wrapper').height() - 500) {
    if ($('.news-wrapper').data('scroll-callback') && window[$('.news-wrapper').data('scroll-callback')]) {
      window[$('.news-wrapper').data('scroll-callback')]();
    }
  }
});

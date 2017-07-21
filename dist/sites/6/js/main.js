var OPTIONS;

OPTIONS = {};

$(document).ready(function() {
  var rangeSlider;
  window.last = 50;
  rangeSlider = document.getElementById('range-slider');
  noUiSlider.create(rangeSlider, {
    start: [60],
    step: 2,
    range: {
      'min': [10],
      'max': [100]
    }
  });
  window.range = rangeSlider.noUiSlider;
  window.range.on('slide', function(var1, var2, val) {
    if (window.last !== val) {
      setSliderScale(val, window.last);
      return window.last = val;
    }
  });
  $('#scaleSelect > a').click(function(e) {
    e.preventDefault();
    return $(this).parent().toggleClass('active');
  });
  $('#scaleSelect .dropdown a').click(function(e) {
    e.preventDefault();
    $('#scaleSelect > a').html($(this).html());
    return setScale(parseInt($(this).html()));
  });
  $('body').click(function(e) {
    if ($(e.target).closest('#scaleSelect > a').length === 0) {
      return $('#scaleSelect').removeClass('active');
    }
  });
  $('.categories-list ul li').click(function(e) {
    var currentIndex;
    e.preventDefault();
    currentIndex = $(this).parent().index();
    $(this).parent().siblings().find('li').removeClass('active');
    $(this).addClass('active');
    $('[data-category]').addClass('disabled');
    return $('[data-category="' + currentIndex + '"]').removeClass('disabled');
  });
  $('.categories-list ul').owlCarousel({
    items: 3,
    navigation: true,
    navigationText: ["◄", "►"],
    pagination: false,
    afterInit: function() {
      return $('.categories-list ul li').eq(0).click();
    }
  });
  $('.aside-toggler').click(function(e) {
    e.preventDefault();
    return $('.sidebar').toggleClass('active');
  });
  $('.scroll-pane').jScrollPane({
    autoReinitialise: true
  });
});

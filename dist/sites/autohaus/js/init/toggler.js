$('[data-toggle]').mousedown(function(e) {
  var active, array, passive;
  e.preventDefault();
  if (!$(this).data('toggle')) {
    return;
  }
  if ($(this).data('toggle').match(/\,/gim)) {
    array = $(this).data('toggle').split(',');
    active = $(array[0]);
    passive = $(array[1]);
    active.toggleClass('active');
    passive.removeClass('active');
    if (active[0].nodeName.toLowerCase() === 'form' && active.hasClass('active')) {
      setTimeout(function() {
        return active.find('.input').eq(0).focus();
      }, 600);
    }
  } else {
    $($(this).data('toggle')).toggleClass('active');
  }
});

$('.user-form .form-close').click(function(e) {
  $(this).closest('.user-form').removeClass('active');
});

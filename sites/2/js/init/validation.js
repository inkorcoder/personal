$(function() {
  var isValidEmail;
  $('form:not(.typical-form) input, form:not(.typical-form) textarea').on('keyup keydown change', function() {
    var errors, i, input;
    input = this;
    i = 0;
    errors = [false];
    if ($(input).hasClass('email') && !isValidEmail($(input).val().trim())) {
      errors[i] = true;
      $(input).parents('.form-group').addClass('error');
    } else if ($(input).data('mask') && ($(input).val().trim().replace(/_/gim, '').length < $(input).data('mask').length)) {
      errors[i] = true;
      $(input).parents('.form-group').addClass('error');
    } else if ($(input).val().trim() === "") {
      errors[i] = true;
      $(input).parents('.form-group').addClass('error');
    } else {
      errors[i] = false;
      $(input).parents('.form-group').removeClass('error');
    }
  });
  isValidEmail = function(email) {
    var re;
    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  $('form:not(.typical-form)').on('submit', function(e) {
    var error, errors, isFormScrolled, j, len, scrollTarget;
    errors = [false, false];
    isFormScrolled = false;
    scrollTarget = $(this).parents('.popup').length !== 0 ? $('.popup') : $('html, body');
    $('input:not(.ignored), textarea:not(.ignored)', this).each(function(i, input) {
      if ($(input).hasClass('email') && !isValidEmail($(input).val().trim())) {
        errors[i] = true;
        $(input).parents('.form-group').addClass('error');
      } else if ($(input).val().trim() === "") {
        errors[i] = true;
        $(input).parents('.form-group').addClass('error');
      } else {
        errors[i] = false;
        $(input).parents('.form-group').removeClass('error');
      }
    });
    for (j = 0, len = errors.length; j < len; j++) {
      error = errors[j];
      if (error) {
        e.preventDefault();
      }
    }
  });
  $('.file-input').each(function(i, input) {
    $('input', input).on('change', function() {
      return $('label', input).html(this.files[0].name);
    });
  });
});

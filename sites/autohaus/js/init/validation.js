$(function() {
  var isValidEmail;
  $('.validate-form input:not(.ignored), .validate-form textarea:not(.ignored)').on('keyup keydown change', function() {
    var emailMessage, errors, i, input;
    input = this;
    i = 0;
    errors = [false];
    $(input).siblings('.icon-success').removeClass('active');
    emailMessage = Validator($(input));
    if ($(input).hasClass('email') && emailMessage) {
      $(input).closest('.form-group').find('.alert').html(emailMessage);
      errors[i] = true;
      $(input).siblings('.icon-error').addClass('active');
      $(input).parents('.form-group').addClass('error');
    } else if ($(input).data('mask') && ($(input).val().trim().replace(/_/gim, '').length < $(input).data('mask').length)) {
      errors[i] = true;
      $(input).siblings('.icon-error').addClass('active');
      $(input).parents('.form-group').addClass('error');
    } else if ($(input).data('minlength') && $(input).val().trim().length < $(input).data('minlength')) {
      errors[i] = true;
      $(input).siblings('.icon-error').addClass('active');
      $(input).parents('.form-group').addClass('error');
    } else if ($(input).val().trim() === "") {
      errors[i] = true;
      $(input).siblings('.icon-error').addClass('active');
      $(input).parents('.form-group').addClass('error');
    } else {
      errors[i] = false;
      $(input).siblings('.icon-error').removeClass('active');
      $(input).siblings('.icon-success').addClass('active');
      $(input).parents('.form-group').removeClass('error');
    }
  });
  isValidEmail = function(email) {
    var re;
    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  $('.validate-form').on('submit', function(e) {
    var error, errors, hasErrors, isFormScrolled, j, len, scrollTarget;
    errors = [false, false];
    isFormScrolled = false;
    scrollTarget = $(this).parents('.popup').length !== 0 ? $('.popup') : $('html, body');
    $('input:not(.ignored), textarea:not(.ignored)', this).each(function(i, input) {
      var emailMessage;
      $(input).siblings('.icon-success').removeClass('active');
      emailMessage = Validator($(input));
      if ($(input).hasClass('email') && emailMessage) {
        $(input).closest('.form-group').find('.alert').html(emailMessage);
        errors[i] = true;
        $(input).siblings('.icon-error').addClass('active');
        $(input).parents('.form-group').addClass('error');
      } else if ($(input).data('minlength') && $(input).val().trim().length < $(input).data('minlength')) {
        errors[i] = true;
        $(input).siblings('.icon-error').addClass('active');
        $(input).parents('.form-group').addClass('error');
      } else if ($(input).val().trim() === "") {
        errors[i] = true;
        $(input).siblings('.icon-error').addClass('active');
        $(input).parents('.form-group').addClass('error');
      } else {
        errors[i] = false;
        $(input).siblings('.icon-error').removeClass('active');
        $(input).siblings('.icon-success').addClass('active');
        $(input).parents('.form-group').removeClass('error');
      }
    });
    hasErrors = false;
    for (j = 0, len = errors.length; j < len; j++) {
      error = errors[j];
      if (error) {
        hasErrors = true;
        e.preventDefault();
        return;
      }
    }
    if (!hasErrors) {
      $('.success-fadeout', this).addClass('active');
      $('.success-fadein', this).fadeIn();
    }
  });
  $('.file-input').each(function(i, input) {
    $('input', input).on('change', function() {
      return $('label', input).html(this.files[0].name);
    });
  });
  $('.input').on('focus keyup blur change', function() {
    if ($(this).val().trim().length !== 0) {
      $(this).addClass('labeled');
    } else {
      $(this).removeClass('labeled');
    }
  });
});

window.addEventListener('load', function() {
  var isValidEmail;
  $('.validate-form .input').on('keyup keydown keypress blur', function(e) {
    var errors, i, input;
    input = e.target;
    i = 0;
    errors = [];
    $(input).closest('.form-group').removeClass('success');
    if ($(input).hasClass('email') && !isValidEmail($(input).val().trim())) {
      errors[i] = true;
      $(input).closest('.form-group').addClass('error');
    } else if ($(input).data('mask') && ($(input).val().trim().replace(/_/gim, '').length < $(input).data('mask').length)) {
      errors[i] = true;
      $(input).closest('.form-group').addClass('error');
    } else if ($(input).data('minlength') && $(input).val().trim().length < $(input).data('minlength')) {
      errors[i] = true;
      $(input).closest('.form-group').addClass('error');
    } else if ($(input).val().trim() === "") {
      errors[i] = true;
      $(input).closest('.form-group').addClass('error');
    } else {
      errors[i] = false;
      $(input).closest('.form-group').removeClass('error');
      $(input).closest('.form-group').addClass('success');
    }
  });
  isValidEmail = function(email) {
    var re;
    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  $('.validate-form').on('submit', function(e) {
    var error, errors, hasErrors, isFormScrolled, j, len;
    errors = [];
    isFormScrolled = false;
    $('.input', e.target).each(function(i, input) {
      $(input).closest('.form-group').removeClass('success');
      if ($(input).hasClass('email') && !isValidEmail($(input).val().trim())) {
        errors[i] = true;
        return $(input).closest('.form-group').addClass('error');
      } else if ($(input).data('mask') && ($(input).val().trim().replace(/_/gim, '').length < $(input).data('mask').length)) {
        errors[i] = true;
        return $(input).closest('.form-group').addClass('error');
      } else if ($(input).data('minlength') && $(input).val().trim().length < $(input).data('minlength')) {
        errors[i] = true;
        return $(input).closest('.form-group').addClass('error');
      } else if ($(input).val().trim() === "") {
        errors[i] = true;
        return $(input).closest('.form-group').addClass('error');
      } else {
        errors[i] = false;
        $(input).closest('.form-group').removeClass('error');
        return $(input).closest('.form-group').addClass('success');
      }
    });
    hasErrors = false;
    for (j = 0, len = errors.length; j < len; j++) {
      error = errors[j];
      if (error) {
        hasErrors = true;
      }
    }
    if (hasErrors) {
      e.preventDefault();
    }
  });
});

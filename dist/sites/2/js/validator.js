var Validator;

Validator = function(input) {
  var error, validEmail, validateEmail, validateName, validatePhone, validateText;
  error = false;
  validEmail = function(email) {
    var re;
    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  validateName = function() {
    var max, min;
    min = parseInt(input.data('minlength'));
    max = parseInt(input.attr('maxlength'));
    if (input.val().trim() === '') {
      error = errorsDictionary.nameIsEmpty;
    } else if (input.val().trim().length < min) {
      error = errorsDictionary.nameLength;
    }
  };
  validatePhone = function() {
    var mask, max, min, value;
    value = input.val().trim().replace(/(\+|_|-|\s| )/gim, '');
    mask = input.data('mask').replace(/(\+|_|-|\s| )/gim, '');
    min = parseInt(input.data('minlength'));
    max = parseInt(input.val().trim());
    if (value === '') {
      error = errorsDictionary.phoneIsEmpty;
    } else if (value.length < mask.length) {
      error = errorsDictionary.phoneLength;
    }
  };
  validateEmail = function() {
    var value;
    value = input.val().trim();
    if (value === '') {
      error = errorsDictionary.emailIsEmpty;
    } else if (!validEmail(value)) {
      error = errorsDictionary.emailValid;
    }
  };
  validateText = function() {
    var min, value;
    min = parseInt(input.data('minlength'));
    value = input.val().trim();
    if (value === '') {
      error = errorsDictionary.textIsEmpty;
    } else if (value.length < min) {
      error = errorsDictionary.textLength;
    }
  };
  switch (input.data('validate')) {
    case 'name':
      validateName();
      break;
    case 'phone':
      validatePhone();
      break;
    case 'email':
      validateEmail();
      break;
    case 'text':
      validateText();
      break;
  }
  return error;
};

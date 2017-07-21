$(document).ready(function() {
  var dropDisabledClass;
  dropDisabledClass = function(plus, minus) {
    minus.removeClass('disabled');
    return plus.removeClass('disabled');
  };
  $('body').on('keydown', '.size input', function(e) {
    if (!isNumberKey(e)) {
      e.preventDefault();
    }
  });
  $('body').on('blur', '.size input', function(e) {
    if ($(this).val().trim() === '') {
      $(this).val(0).trigger('change');
    }
  });
  $('body').on('click', '.size .plus', function(e) {
    var calc, count, input, max, min, minus, plus;
    calc = $(this).closest('.size')[0];
    input = $('input', calc);
    plus = $('.plus', calc);
    minus = $('.minus', calc);
    max = $(calc).data('max' || 99);
    min = $(calc).data('min' || 1);
    count = parseInt(input.val().trim());
    dropDisabledClass(plus, minus);
    if (count < max) {
      count++;
    }
    if (count === max) {
      plus.addClass('disabled');
    }
    input.val(count).trigger('change');
  });
  $('body').on('click', '.size .minus', function(e) {
    var calc, count, input, max, min, minus, plus;
    calc = $(this).closest('.size')[0];
    input = $('input', calc);
    plus = $('.plus', calc);
    minus = $('.minus', calc);
    max = $(calc).data('max' || 99);
    min = $(calc).data('min' || 1);
    count = parseInt(input.val().trim());
    dropDisabledClass(plus, minus);
    if (count > min) {
      count--;
    }
    if (count === min) {
      minus.addClass('disabled');
    }
    input.val(count).trigger('change');
  });
});

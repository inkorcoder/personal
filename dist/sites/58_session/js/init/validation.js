$(function() {
	var isValidEmail;
	$('.validate-form:not([data-skip-input]) input:not(.ignored), .validate-form:not([data-skip-input]) textarea:not(.ignored)').on('keyup keydown change', function() {
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
	window.validateForm = function(e) {
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
		// if we have preloader
		if ($('.preloader', this).length){
			e.preventDefault();
			$('.preloader', this).addClass('active');
			var $this = this;
			setTimeout(function(){
				if (!hasErrors) {
					$('.success-fadeout', $this).addClass('faded');
					$('.success-fadein', $this).addClass('active');
				}
				if (window[$($this).attr('data-callback')]){
					window[$($this).attr('data-callback')].call($this, e);
				}
			}, 500);
			setTimeout(function(){
				$('.preloader', $this).removeClass('active');
				// $('.input', $this).val('').change();
				// $('.success-fadein', $this).removeClass('active');
				if ($($this).hasClass('subscribe-form')){
					setTimeout(function(){
						$('main, .main-footer').removeClass('offseted');
						$('.subscribe-form').removeClass('active');
					}, 500);
				}
			}, 4000)
			if ($($this)[0].hasAttribute('data-revert')){
				setTimeout(function() {
					$('.success-fadein', $this).removeClass('active');
					$($this).find('input').val('');
					$($this).closest('.subscribing').find('input[type="checkbox"]').click();
				}, 4000);
			}
			return;
		}

		if (!hasErrors) {
			$('.success-fadeout', this).addClass('faded');
			$('.success-fadein', this).addClass('active');
		}
		if (window[$(this).attr('data-callback')]){
			e.preventDefault();
			window[$(this).attr('data-callback')].call(this, e);
		}

	}
	$('.validate-form').on('submit', function(event) {
		window.validateForm.call(this, event);
	});
	$('.file-input').each(function(i, input) {
		$('input', input).on('change', function() {
			return $('label', input).html(this.files[0].name);
		});
	});
	$('.input').on('focus keyup blur change', function() {
		if ($(this).val().trim().length !== 0) {
			$(this).addClass('filled');
		} else {
			$(this).removeClass('filled');
		}
	});
	setTimeout(function() {
		$('.input').each(function(i, input) {
			if ($(input).val().trim().length !== 0) {
				return $(input).addClass('filled');
			} else {
				return $(input).removeClass('filled');
			}
		});
	}, 300);
});

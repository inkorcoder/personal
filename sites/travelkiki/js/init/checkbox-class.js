$(function() {
	$('body').on('click', '[data-toggle-class]', function(e) {
		var checkbox = $(e.target).closest('[data-toggle-class]')[0];
		var target = $($(checkbox).attr('data-toggle-class').split('|')[0]),
				className = $(checkbox).attr('data-toggle-class').split('|')[1];
				// console.log($(checkbox).attr('data-toggle-class'))
		if ($(checkbox).prop('checked')){
			target.addClass(className);
			if ($(e.target).closest('.subscribing').length){
				setTimeout(function() {
					$(e.target).closest('.subscribing').find('.form-group input').focus();
				}, 100);
				if ($(document).width() <= 768){
					setTimeout(function() {
						$('html, body').animate({
							scrollTop: $(e.target).closest('.subscribing').find('.form-group input').offset().top - 200
						}, 500)
					}, 500);
				}
			}
		} else {
			target.removeClass(className);
			if ($(e.target).closest('.subscribing').length){
				$(e.target).closest('.subscribing').find('.form-group input').blur();
			}
		}
	});
});

var CallPopup, HidePopups;
$(function() {
	$('[data-call]').click(function(e) {
		var called;
		e.preventDefault();
		called = $($(this).data('call'));
		if (!called.hasClass('active')) {
			$('html,body').addClass('overlayed');
			called.addClass('showed');
			setTimeout(function() {
				called.addClass('active');
				called.trigger("popup:onopen", called);
			}, 10);
		}
	});
	CallPopup = function(selector) {
		var called;
		called = $(selector);
		if (!called.hasClass('active')) {
			$('html,body').addClass('overlayed');
			called.addClass('showed');
			setTimeout(function() {
				called.addClass('active');
				called.trigger("popup:onopen", called);
			}, 10);
		}
	};
	$('[data-dismiss]').click(function(e) {
		var called;
		e.preventDefault();
		called = $($(this).data('dismiss'));
		$('html,body').removeClass('overlayed');
		called.removeClass('active');
		setTimeout(function() {
			called.removeClass('showed');
			called.trigger("popup:onclose", called);
		}, 100);
	});
	HidePopups = function() {
		$('.popup').each(function(i, popup) {
			var called;
			called = $(popup);
			$('html,body').removeClass('overlayed');
			called.removeClass('active');
			setTimeout(function() {
				called.removeClass('showed');
				called.trigger("popup:onclose", called);
			}, 100);
		});
	};
	$('.close-popup').click(function(e) {
		e.preventDefault();
		HidePopups();
	});
	$('.popup').click(function(e) {
		if ($(e.target).closest('.inner').length === 0) {
			e.preventDefault();
			HidePopups();
		}
	});
});

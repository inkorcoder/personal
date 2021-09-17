$(document).ready(function() {
	$('[data-expand]').each(function(i, elem) {
		$($(elem).attr('data-expand')).click(function(e) {
			e.preventDefault();
			$(elem).toggleClass('hidden');
			$(this).toggleClass('active');
			if ($(e.target).closest('.form-hero').length){
				console.log('d')
			}
		});
	});
});

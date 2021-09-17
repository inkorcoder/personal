$(document).ready(function() {

	function copy(id) {
		if (!id){
			console.warn('No element Id for copying!');
			return;
		}
		var input = document.getElementById(id);
		if (!input){
			console.warn('No element with that Id!');
			return;
		}
		input.select();
		document.execCommand("copy");
	}

	$('[data-copy-link]').click(function(e){
		e.preventDefault();
		copy($(this).attr('data-copy-link'));
		var tooltip = $(this).closest('[data-tooltip-copied]');
		if (tooltip.length){
			tooltip.attr('data-tooltip', tooltip.attr('data-tooltip-copied'));
		}
	});


});
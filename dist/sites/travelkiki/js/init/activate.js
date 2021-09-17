$(document).ready(function() {
	$('[data-activate]').each(function(i, checkbox){
		var container = $($(checkbox).attr('data-activate'));
		function setOutput(){
			var output = "",
					checked = $('input[type="checkbox"]:checked', container);
			checked.each(function(i, input){
				output += $('[for="'+$(input).attr('id')+'"]').text();
				output += i < checked.length-1 ? "," : "";
			});
			if (checked.length > 2){
				output = output.split(',').length;
			} else if (checked.length > 0 && checked.length <= 2){
				output = output.split(',');
			} else {
				output = 'none';
			}
			$($(checkbox).attr('data-output')).text(output.toString().replace(/\,/gim, ', '));
		}
		$(checkbox).on('click', function(){
			$('input[type="checkbox"]', container).prop('checked', $(this).prop('checked'))
			setOutput();
		});
		$('input[type="checkbox"]', container).not(checkbox).click(function(){
			$(checkbox).prop('checked', $('input[type="checkbox"]:checked', container).not(checkbox).length === $('input[type="checkbox"]', container).not(checkbox).length);
			setOutput();
		});
	});
});
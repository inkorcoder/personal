$(document).ready(function(){

	$('.input-range').each(function(i, range){
		var output = $($(range).attr('data-output'));
		var mask = output.data('mask');

		function setResult(){
			output.html(
				mask.replace(
					new RegExp(/(%v)/, "gim"), $('input', range).val()
				)
			);
		}
		setResult();

		$('input', range).on('input change', function(){
			setResult();
		});
	});

});
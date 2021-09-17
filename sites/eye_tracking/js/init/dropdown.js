$(document).ready(function(){

	$('.dropdown').each(function(dropdownIndex, dropdownElement){

		$('.anchor', dropdownElement).click(function(e){
			$(dropdownElement).toggleClass('open');
		});
		$('body').click(function(e){
			if ($(e.target).closest(dropdownElement).length === 0){
				$(dropdownElement).removeClass('open');
			}
		});

	});

});
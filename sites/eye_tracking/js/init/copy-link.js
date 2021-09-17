$(document).ready(function(){

	$('body').on('click', '[data-copy-link]', function(e){
		var temp = $('<input>').val($(this).attr('data-copy-link')).appendTo($('body')).select();
		document.execCommand('copy');
		temp.remove();
		setTimeout(function(){
			$(e.target).closest('.dropdown').removeClass('open');
		}, 1000);
	});

});
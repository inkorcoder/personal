$(document).ready(function(){

	$('.table').each(function(dropdownIndex, dropdownElement){

		$('[data-select-all]').click(function(){
			var columnIndex = $(this).closest('th, td').index();
			$(this).closest('.table').find('tbody tr:not(.faded) td:nth-child('+(columnIndex+1)+') .checkbox input')
				.prop("checked", $(this).prop('checked')).change();
		});

	});

	$('[data-show-control]').on('click change input', function(e){
		var table = $(this).closest('table');
		var checkedLength = table.find('tr:not(.faded) [data-show-control]:checked').not('[data-select-all]').length;
		var allLength = table.find('tr:not(.faded) [data-show-control]').not('[data-select-all]').length;
		var target = $($(this).attr('data-show-control'));
		target.find('.count').html(checkedLength);
		if (checkedLength){
			target.removeClass('hidden');
		} else {
			target.addClass('hidden');
		}
		if (!$(e.target).closest('[data-select-all]').length){
			table.find('[data-select-all]').prop('checked', checkedLength == allLength );
		}
	});

});
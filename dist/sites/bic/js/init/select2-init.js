// .selectbox class should be on <select>s inside of filter
window.initializeSelects = function(){

	$('.selectbox').each(function(i, select){

		var parent = $(select).parent();

		$(select).select2({
			dropdownParent: parent,
			placeholder: "Type",
			allowClear: true,
			tags: true
		});

		$(select).on('select2:select', function() {
			$(select).trigger('change');
		});

		$(select).on('change', function() {
			if ($(this).val()){
				parent.addClass('filled');
				parent.find('label').addClass('active');
			} else {
				parent.removeClass('filled');
				parent.find('label').removeClass('active');
			}
		});

	});

};


$(document).ready(function() {

	// just call it
	initializeSelects();

	// reset
	$('.filter button[type="reset"]').click(function(){
		$('.filter .selectbox').val('').trigger('change');
	});

});
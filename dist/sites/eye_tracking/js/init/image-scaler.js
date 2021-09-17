$(document).ready(function(){

	$('.image-scaler').each(function(i, scaler){

		var plus = $('.plus', scaler);
		var minus = $('.minus', scaler);
		var image = $('.image', scaler);
		var scale = $(scaler).data('scale') || 40;
		var layers = $('[data-heat-map], [data-blind-map]', scaler);

		function setImageScale(){
			image.css('width', scale+"%");
			image.attr('data-scale', scale/100);
		}
		setImageScale();

		plus.click(function(){
			scale = Math.min(scale+20, 100);
			setImageScale();
		});
		minus.click(function(){
			scale = Math.max(scale-20, 20);
			setImageScale();
		});

		$('#opacityRange').on('input change blur', function(){
			layers.css('opacity', alpha);
		});

		$('#layersViewToggler a').click(function(e){
			e.preventDefault();
			var block = $(this).attr('href').replace(/\#/, '');
			$(this).closest('ul').find('li').removeClass('active');
			$(this).closest('li').addClass('active');
			image.attr('data-view', block);
			$(this).closest('.dropdown').removeClass('open');
		});
	});


});
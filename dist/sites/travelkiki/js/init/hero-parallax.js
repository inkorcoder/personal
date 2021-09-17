$(document).ready(function() {
	if (!$('.hero, .form-hero, .s-engine').length) return;

	$('.hero, .form-hero, .s-engine').each(function(i, hero){
		console.log(hero);
		var ratio = parseFloat($(hero).data('parallax-ratio') || 1);
		$(document).scroll(function(){
			var top = $(document).scrollTop();
			$('.background', hero).css('transform', 'translateY('+(top / 2 * ratio)+'px)');
		});
	});
});
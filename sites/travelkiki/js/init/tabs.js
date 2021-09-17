/*tabs */
var setActiveTab;

setActiveTab = function(content, indx) {
	content.find('.tab-content').removeClass('active').eq(indx).addClass('active');

	var topOffset = 0;

	if (window.innerWidth >= 768) {
		topOffset = $('.form-section.active-top').outerHeight();
	}
	$('html,body').animate({
		scrollTop: content.find('.tab-content').eq(indx).offset().top - topOffset- 50
	}, 200);
};

$('[data-tabs]').each(function(i, nav) {
	$(nav).find('.tab-item').click(function(e) {
		e.preventDefault();
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		setActiveTab($($(nav).data('tabs')), $(this).index());
		$('[data-tabs]').removeClass('active');
	});
});

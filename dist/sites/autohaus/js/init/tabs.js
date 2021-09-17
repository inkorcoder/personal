var setActiveTab;

setActiveTab = function(content, indx) {
  content.each(function(i, cont) {
    $('> .content', cont).removeClass('active').eq(indx).addClass('active');
  });
};

$('body').on('click', '[data-tabs] li', function(e) {
  var nav;
  nav = $(this).closest('[data-tabs]')[0];
  if ($(this).hasClass('disabled')) {
    return;
  }
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  setActiveTab($($(nav).data('tabs')), $(this).index());
});

$('[data-set-tab]').click(function(e) {
  var data, index, selector;
  data = $(this).attr('data-set-tab');
  if (!data) {
    return;
  }
  index = data.split('|')[0];
  selector = data.split('|')[1];
  setActiveTab($(selector), index);
});

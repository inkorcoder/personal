Vue.filter('tabs', function(items, curr) {
  var i, item, len, res;
  res = [];
  for (i = 0, len = items.length; i < len; i++) {
    item = items[i];
    if (item.tab.toString() === curr.toString()) {
      res.push(item);
    }
  }
  this.$set('filtered', res.length);
  return res;
});
$('[data-toggle-hash]').each(function(i, section) {
  var instance;
  instance = new Vue({
    el: section,
    data: {
      currentHash: location.hash || ''
    },
    methods: {}
  });
  $(window).on('hashchange', function() {
    instance.currentHash = location.hash;
  });
});

$('[data-toggle-hash-local]').each(function(i, section) {
  var instance;
  instance = new Vue({
    el: section,
    data: {
      currentHash: $(section).data('toggle-hash-local') || ''
    },
    methods: {
      setLocalHash: function(hash, e) {
        e.preventDefault();
        this.$data.currentHash = hash;
      }
    }
  });
});

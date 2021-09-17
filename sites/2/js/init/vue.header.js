var header;

header = new Vue({
  el: '#header',
  data: {
    isMenuOpened: false,
    isSearchOpened: $('#header').hasClass('has-search')
  },
  methods: {
    openMenu: function() {
      this.$data.isMenuOpened = true;
      this.$data.isSearchOpened = false;
    },
    closeMenu: function() {
      this.$data.isMenuOpened = false;
      this.$data.isSearchOpened = false;
    },
    openSearch: function() {
      this.$data.isSearchOpened = !this.$data.isSearchOpened;
      this.$data.isMenuOpened = false;
    },
    closeSearch: function() {
      this.$data.isSearchOpened = false;
      this.$data.isMenuOpened = false;
    },
    showCallPopup: function() {
      callPopup.isOpened = true;
      cutBody();
      setTimeout(function() {
        return callPopup.isActive = true;
      }, 20);
    },
    showMessagePopup: function() {
      messagePopup.isOpened = true;
      cutBody();
      setTimeout(function() {
        return messagePopup.isActive = true;
      }, 20);
    }
  }
});

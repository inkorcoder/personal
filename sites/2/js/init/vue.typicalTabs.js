$(document).ready(function() {
  var setPointers, waitForFinalEvent;
  (setPointers = function() {
    var classes;
    classes = {
      0: 'no-offset',
      1: 'offset-1',
      2: 'offset-2',
      3: 'offset-3',
      4: 'offset-4'
    };
    $('.tabs-anchors').each(function(i, tabs) {
      var childWdth, parentWidth;
      parentWidth = $(tabs).outerWidth();
      childWdth = parentWidth / $('li', tabs).length;
      $('.pointer', tabs).css({
        left: (($('.active', tabs).index() * childWdth) / parentWidth * 100) + '%',
        width: childWdth + 'px'
      });
      $(tabs).siblings('.typical-tabs-content').removeClass('offset-1 offset-2 offset-3 offset-4 offset-5').addClass(classes[$('.active', tabs).index()]);
    });
  })();
  waitForFinalEvent = (function() {
    var timers;
    timers = {};
    return function(callback, ms, uniqueId) {
      if (!uniqueId) {
        uniqueId = 'Don\'t call this twice without a uniqueId';
      }
      if (timers[uniqueId]) {
        clearTimeout(timers[uniqueId]);
      }
      timers[uniqueId] = setTimeout(callback, ms);
    };
  })();

  /*
  			resize
   */
  $(window).resize(function() {
    waitForFinalEvent((function() {
      setPointers();
    }), 300, '');
  });
  $('.typical-tabs').each(function(i, tabs) {
    var typicalTabs;
    typicalTabs = new Vue({
      el: tabs,
      data: {
        activeTab: window.location.hash || $('ul a', tabs).eq(0).attr('href')
      },
      created: function() {
        setTimeout(function() {
          return setPointers();
        }, 10);
      },
      methods: {
        setPointer: function(event) {}
      }
    });
    window.onhashchange = function() {
      typicalTabs.activeTab = window.location.hash;
      setTimeout(function() {
        return setPointers();
      }, 10);
    };
  });
});

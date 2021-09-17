var $, callPopup, easing, isMenuOpened, scrollTo, waitForFinalEvent;

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

isMenuOpened = false;

(function(e) {
  e.closest = e.closest || function(css) {
    var node;
    node = this;
    while (node) {
      if (node.matches(css)) {
        return node;
      } else {
        node = node.parentElement;
      }
    }
    return null;
  };
})(Element.prototype);

$ = function(str, ctx) {
  var arr;
  arr = [];
  if (ctx) {
    if (typeof str === 'string' && ctx.querySelectorAll(str)) {
      arr = [].slice.call(ctx.querySelectorAll(str));
    } else {
      arr = [str];
    }
  } else {
    if (typeof str === 'string' && document.querySelectorAll(str)) {
      arr = [].slice.call(document.querySelectorAll(str));
    } else {
      arr = [str];
    }
  }
  arr.click = function(fn) {
    var j, len, n, results;
    results = [];
    for (j = 0, len = arr.length; j < len; j++) {
      n = arr[j];
      results.push(n.addEventListener('click', function(e) {
        return fn(e);
      }));
    }
    return results;
  };
  arr.on = function(ev, fn) {
    var evs, j, len, n, results;
    evs = [];
    evs = ev.match(/\s/gim) ? ev.split(/\s/gim) : [ev];
    results = [];
    for (j = 0, len = evs.length; j < len; j++) {
      ev = evs[j];
      results.push((function() {
        var k, len1, results1;
        results1 = [];
        for (k = 0, len1 = arr.length; k < len1; k++) {
          n = arr[k];
          results1.push(n.addEventListener(ev.replace(/(\s| )/gim), function(e) {
            return fn(e);
          }));
        }
        return results1;
      })());
    }
    return results;
  };
  arr.hover = function(fn1, fn2) {
    var j, len, n, results;
    results = [];
    for (j = 0, len = arr.length; j < len; j++) {
      n = arr[j];
      n.addEventListener('mouseenter', function(e) {
        return fn1(e);
      });
      if (fn2) {
        results.push(n.addEventListener('mouseleave', function(e) {
          return fn2(e);
        }));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  arr.addClass = function(str) {
    var j, len, n, results;
    results = [];
    for (j = 0, len = arr.length; j < len; j++) {
      n = arr[j];
      results.push(n.classList.add(str));
    }
    return results;
  };
  arr.removeClass = function(str) {
    var j, len, n, results;
    results = [];
    for (j = 0, len = arr.length; j < len; j++) {
      n = arr[j];
      results.push(n.classList.remove(str));
    }
    return results;
  };
  arr.src = function() {
    var j, len, n, results;
    results = [];
    for (j = 0, len = arr.length; j < len; j++) {
      n = arr[j];
      if (!n.getAttribute('src')) {
        n.setAttribute('src', n.getAttribute('data-src'));
        results.push(n.onload = function() {
          return this.classList.add('showed');
        });
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  arr.each = function(fn) {
    var i, j, len, n, results;
    results = [];
    for (i = j = 0, len = arr.length; j < len; i = ++j) {
      n = arr[i];
      results.push(fn(i, n));
    }
    return results;
  };
  arr.hasClass = function(className) {
    return this[0].classList.contains(className);
  };
  arr.siblings = function() {
    var getChildren, getSiblings, i, j, k, len, n, ref, ref1;
    for (i = j = ref = this.length; ref <= 0 ? j < 0 : j > 0; i = ref <= 0 ? ++j : --j) {
      this.splice(i, 1);
    }
    getChildren = function(n, skipMe) {
      var r;
      r = [];
      while (n) {
        if (n.nodeType === 1 && n !== skipMe) {
          r.push(n);
        }
        n = n.nextSibling;
      }
      return r;
    };
    getSiblings = function(n) {
      return getChildren(n.parentNode.firstChild, n);
    };
    ref1 = getSiblings(this[0]);
    for (k = 0, len = ref1.length; k < len; k++) {
      n = ref1[k];
      this.push(n);
    }
    return this;
  };
  arr.data = function(str) {
    return this[0].getAttribute('data-' + str);
  };
  arr.val = function(newVal) {
    if (newVal) {
      return n.value = newVal;
    } else {
      return this[0].value;
    }
  };
  arr.closest = function(str) {
    var cl, i, j, ref;
    cl = this[0].closest(str);
    if (cl) {
      for (i = j = 0, ref = this.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        this.splice(i, 1);
      }
      this.push(cl);
    }
    return this;
  };
  arr.last = function() {
    return this[this.length - 1];
  };
  return arr;
};

callPopup = function(e, id) {
  $(id).addClass('showed');
  setTimeout((function() {
    return $(id).addClass('active');
  }), 10);
};

easing = {
  linear: function(t) {
    return t;
  },
  easeInQuad: function(t) {
    return t * t;
  },
  easeOutQuad: function(t) {
    return t * (2 - t);
  },
  easeInOutQuad: function(t) {
    if (t < .5) {
      return 2 * t * t;
    } else {
      return -1 + (4 - (2 * t)) * t;
    }
  },
  easeInCubic: function(t) {
    return t * t * t;
  },
  easeOutCubic: function(t) {
    return --t * t * t + 1;
  },
  easeInOutCubic: function(t) {
    if (t < .5) {
      return 4 * t * t * t;
    } else {
      return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
  },
  easeInQuart: function(t) {
    return t * t * t * t;
  },
  easeOutQuart: function(t) {
    return 1 - (--t * t * t * t);
  },
  easeInOutQuart: function(t) {
    if (t < .5) {
      return 8 * t * t * t * t;
    } else {
      return 1 - (8 * --t * t * t * t);
    }
  },
  easeInQuint: function(t) {
    return t * t * t * t * t;
  },
  easeOutQuint: function(t) {
    return 1 + --t * t * t * t * t;
  },
  easeInOutQuint: function(t) {
    if (t < .5) {
      return 16 * t * t * t * t * t;
    } else {
      return 1 + 16 * --t * t * t * t * t;
    }
  },
  easeOutCirc: function(t) {
    return Math.sqrt(1 - (--t * t));
  }
};

scrollTo = function(Y, duration, easingFunction, callback) {
  var elem, from, min, scroll, start;
  start = Date.now();
  elem = document.documentElement.scrollTop ? document.documentElement : document.body;
  from = elem.scrollTop;
  min = function(a, b) {
    if (a < b) {
      return a;
    } else {
      return b;
    }
  };
  scroll = function(timestamp) {
    var currentTime, easedT, time;
    currentTime = Date.now();
    time = min(1, (currentTime - start) / duration);
    easedT = easingFunction(time);
    elem.scrollTop = easedT * (Y - from) + from;
    if (time < 1) {
      requestAnimationFrame(scroll);
    } else if (callback) {
      callback();
    }
  };
  if (from === Y) {
    callback();
    return;

    /* Prevent scrolling to the Y point if already there */
  }
  requestAnimationFrame(scroll);
};

window.addEventListener('load', function() {
  var clamp, getScrollTop, setFooterOffset, setHeaderOpacity, toggleMainMenu;
  $('img[data-src]').src();
  $('.tabs li').click(function(e) {
    var indx;
    indx = parseInt(e.target.closest('li').getAttribute('data-tab'));
    $('.tab, .tabs li').removeClass('active');
    $('.tab[data-tab="' + indx + '"]').addClass('active');
    $('.tabs li[data-tab="' + indx + '"]').addClass('active');
    e.preventDefault();
  });
  $('.input').each(function(i, inp) {
    inp.addEventListener('focus', function() {
      return this.classList.add('active');
    });
    inp.addEventListener('blur', function() {
      if (inp.value.trim() === '') {
        return this.classList.remove('active');
      }
    });
  });
  $('.hero .btn').hover(function(e) {
    window.hightSpeed = true;
  }, function() {
    window.hightSpeed = false;
  });
  $('.popup-close').click(function(e) {
    var popup;
    popup = $(e.target.closest('.popup'));
    popup.removeClass('active');
    setTimeout((function() {
      return popup.removeClass('showed');
    }), 500);
  });
  $('[data-scrollto]').click(function(e) {
    var offset;
    e.preventDefault();
    offset = $(e.target.closest('.btn').getAttribute('data-scrollto'))[0].getBoundingClientRect().top;
    scrollTo(offset, 2000, easing.easeInOutQuint);
  });
  (setFooterOffset = function() {
    var height;
    height = $('.main-footer')[0].getBoundingClientRect().height;
    $('.section').last().setAttribute('style', 'padding-bottom: ' + ((window.innerWidth > 480 ? 100 : 50) + height) + 'px');
    $('.main-footer')[0].setAttribute('style', 'margin-top: -' + height + 'px');
  })();
  $(window).on('resize', function() {
    waitForFinalEvent(function() {
      return setFooterOffset();
    }, 300, '');
  });
  toggleMainMenu = function() {
    if (isMenuOpened) {
      $('.menu-col').addClass('active');
      $('html,body').addClass('overlayed');
    } else {
      $('.menu-col').removeClass('active');
      $('html,body').removeClass('overlayed');
    }
  };
  $('.menu-toggle-btn').click(function(e) {
    e.preventDefault();
    isMenuOpened = !isMenuOpened;
    toggleMainMenu();
  });
  $('.menu-col .close').click(function(e) {
    e.preventDefault();
    isMenuOpened = false;
    toggleMainMenu();
  });
  clamp = function(val, min, max) {
    if (val < min) {
      return min;
    } else if (val > max) {
      return max;
    } else {
      return val;
    }
  };
  getScrollTop = function() {
    return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  };
  (setHeaderOpacity = function() {
    var top;
    top = getScrollTop();
    $('.main-header')[0].setAttribute("style", "background: rgba(23,33,65," + (clamp(top / 400, 0, 1)) + ");");
  })();
  $(window).on('scroll', function() {
    var top;
    top = getScrollTop();
    setHeaderOpacity();
    if ($('.hero-section').length === 0) {
      return;
    }
    $('.hero-section .section-title')[0].setAttribute("style", "-webkit-transform: translateY(" + (top / 2) + "px); -moz-transform: translateY(" + (top / 2) + "px); -o-transform: translateY(" + (top / 2) + "px); -ms-transform: translateY(" + (top / 2) + "px); transform: translateY(" + (top / 2) + "px); opacity: " + (1 - top / 300) + ";");
    if ($('.hero-section .subtitle').length === 0) {
      return;
    }
    $('.hero-section .subtitle')[0].setAttribute("style", "-webkit-transform: translateY(" + (top / 2.5) + "px); -moz-transform: translateY(" + (top / 2.5) + "px); -o-transform: translateY(" + (top / 2.5) + "px); -ms-transform: translateY(" + (top / 2.5) + "px); transform: translateY(" + (top / 2.5) + "px); opacity: " + (1 - top / 300) + ";");
  });
  $('body').removeClass('faded');
  $('a[href]').on('mousedown mouseup click touchstart touchend touchmove', function(e) {
    if (e.target.closest('a').getAttribute('href').match(/#/gim)) {
      return;
    }
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
      return false;
    }
    $('body').addClass('faded');
    setTimeout((function() {
      return location.href = e.target.closest('a').getAttribute('href');
    }), 510);
  });
});

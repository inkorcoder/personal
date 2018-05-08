var $;

$ = function(str, ctx) {
  var arr;
  arr = [];
  if (ctx) {
    if (ctx.querySelectorAll(str)) {
      arr = [].slice.call(ctx.querySelectorAll(str));
    }
  } else if (document.querySelectorAll(str)) {
    arr = [].slice.call(document.querySelectorAll(str));
  }
  if (arr.length > 0) {
    arr.click = function(fn) {
      var k, len, n, results;
      results = [];
      for (k = 0, len = arr.length; k < len; k++) {
        n = arr[k];
        results.push(n.addEventListener('click', function(e) {
          return fn(e);
        }));
      }
      return results;
    };
    arr.addClass = function(str) {
      var k, len, n, results;
      results = [];
      for (k = 0, len = arr.length; k < len; k++) {
        n = arr[k];
        results.push(n.classList.add(str));
      }
      return results;
    };
    arr.removeClass = function(str) {
      var k, len, n, results;
      results = [];
      for (k = 0, len = arr.length; k < len; k++) {
        n = arr[k];
        results.push(n.classList.remove(str));
      }
      return results;
    };
    arr.src = function() {
      var k, len, n, results;
      results = [];
      for (k = 0, len = arr.length; k < len; k++) {
        n = arr[k];
        n.setAttribute('src', n.getAttribute('data-src'));
        results.push(n.onload = function() {
          return this.classList.add('showed');
        });
      }
      return results;
    };
    arr.each = function(fn) {
      var i, k, len, n, results;
      results = [];
      for (i = k = 0, len = arr.length; k < len; i = ++k) {
        n = arr[i];
        results.push(fn(i, n));
      }
      return results;
    };
  }
  return arr;
};

window.onload = function() {
  $('.block .string').click(function(e) {
    if (window.innerWidth > 992) {
      return;
    }
    if ($('.explaining', e.target).length === 0) {
      return;
    }
    e.preventDefault();
    $('.popup .inner')[0].innerHTML = $('.explaining', e.target)[0].outerHTML;
    $('html,body').addClass('overlayed');
    $('.popup').addClass('opened');
    setTimeout(function() {
      return $('.popup .inner img').src();
    }, 1);
  });
  $('.popup button').click(function(e) {
    e.preventDefault();
    $('.popup').removeClass('opened');
    $('html,body').removeClass('overlayed');
  });
  setTimeout(function() {
    if (window.innerWidth > 992) {
      $('img').src();
      $('.work-dropdown').each(function(i, dropdown) {
        var f, h, indx, j, k;
        indx = dropdown.parentNode.getAttribute('href');
        f = document.createElement('figure');
        h = '';
        for (j = k = 0; k < 4; j = ++k) {
          h += "<img data-src=\"img/" + indx + (j + 1) + ".jpg\">";
        }
        f.innerHTML = h;
        dropdown.insertBefore(f, dropdown.firstChild);
        $('img', dropdown).src();
      });
    }
  }, 1000);
};

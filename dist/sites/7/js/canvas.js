window.addEventListener('load', function() {
  var Point, canvas, center, clamp, ctx, getAlpha, getB, getColor, getDistance, getG, getR, getRandom, height, hexToRgbA, i, img, inter, j, mask, maskData, max, points, setAlpha, update, updateMetrics, width;
  canvas = document.getElementById('canvas');
  if (!canvas) {
    return;
  }
  ctx = canvas.getContext('2d');
  width = canvas.width = 548;
  height = canvas.height = 435;
  window.speed = 1;
  window.hightSpeed = false;
  window.coef = 1.5;
  window.btnHover = false;
  center = {
    x: 0,
    y: 0
  };
  (updateMetrics = function() {
    var rect;
    rect = canvas.getBoundingClientRect();
    center.x = rect.left;
    center.y = rect.top;
  })();
  (function() {
    var requestAnimationFrame;
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();
  getR = function(precent, offset) {
    return parseInt(255 * Math.sin((Math.PI * 2) * precent + offset));
  };
  getG = function(precent, offset) {
    return parseInt(255 * Math.sin((Math.PI * 2 / 3) + (Math.PI * 2) * precent + offset));
  };
  getB = function(precent, offset) {
    return parseInt(255 * Math.sin((Math.PI * 2 / 3) * 2 + (Math.PI * 2) * precent + offset));
  };
  clamp = function(val, min, max) {
    if (val > max) {
      return max;
    } else if (val < min) {
      return min;
    } else {
      return val;
    }
  };
  getColor = function(precent, offset) {
    return "rgb( " + (parseInt(((255 * coef) + getR(precent, offset)) / (coef + 1))) + ", " + (parseInt(((255 * coef) + getG(precent, offset)) / (coef + 1))) + ", " + (parseInt(((255 * coef) + getB(precent, offset)) / (coef + 1))) + " )";
  };
  maskData = [];
  getDistance = function(x1, x2, y1, y2) {
    var x, y;
    x = x1 - x2;
    y = y1 - y2;
    return Math.sqrt(x * x + y * y);
  };
  getAlpha = function(x, y) {
    var index;
    index = (y * width + x) * 4;
    return maskData[index + 3];
  };
  setAlpha = function(data, x, y, val) {
    var index;
    index = (y * width + x) * 4;
    return data[index + 3] = val;
  };
  getRandom = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  hexToRgbA = function(hex, alpha) {
    var c;
    c = void 0;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [c >> 16 & 255, c >> 8 & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
  };
  img = document.getElementById('img');
  max = 100;
  Point = function() {
    this.x = getRandom(-100, 100);
    this.y = getRandom(-100, 10);
    this.size = Math.random() * 5;
    this.speed = getRandom(1, 3);
    this.alpha = 0;
    return this;
  };
  points = [];
  for (i = j = 0; j < 50; i = ++j) {
    points.push(new Point());
  }
  i = 0;
  update = function() {
    var data, fill, k, l, len, m, n, p, ref, ref1, ref2, w, x, y;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    for (w = k = 0, ref = width; 0 <= ref ? k < ref : k > ref; w = 0 <= ref ? ++k : --k) {
      ctx.fillStyle = getColor(w / width, i / (20 / speed));
      ctx.fillRect(w, 0, 1, height);
    }
    ctx.fill();
    data = ctx.getImageData(0, 0, width, height);
    for (x = l = 0, ref1 = width; 0 <= ref1 ? l < ref1 : l > ref1; x = 0 <= ref1 ? ++l : --l) {
      for (y = m = 0, ref2 = height; 0 <= ref2 ? m < ref2 : m > ref2; y = 0 <= ref2 ? ++m : --m) {
        if (getDistance(width / 2, x, height / 2 + 50, y) < 270) {
          setAlpha(data.data, x, y, getAlpha(x, y));
        } else {
          setAlpha(data.data, x, y, 0);
        }
      }
    }
    ctx.putImageData(data, 0, 0);
    fill = ctx.fillStyle;
    for (n = 0, len = points.length; n < len; n++) {
      p = points[n];
      p.y -= p.speed;
      if (p.y < -100) {
        p.y = getRandom(-50, 10);
      }
      if (coef > 1.5) {
        if (p.y < -50) {
          p.alpha = 1 - p.y / -100;
        } else {
          if (p.alpha < 1) {
            p.alpha += .05;
          } else {
            p.alpha = 1;
          }
        }
      } else {
        if (p.alpha > 0) {
          p.alpha -= .05;
        } else {
          p.alpha = 0;
        }
      }
      if (p.y > -150 && p.y < 10) {
        ctx.beginPath();
        ctx.fillStyle = hexToRgbA(fill, p.alpha);
        ctx.arc(width / 2 + p.x, height / 2 + p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    i++;
    if (window.innerWidth > 480) {
      requestAnimationFrame(update);
    }
  };
  mask = document.createElement('img');
  mask.src = 'img/mask2.png';
  mask.onload = function() {
    var tempCanvas, tempCtx;
    tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.width;
    tempCanvas.height = this.height;
    tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(mask, 0, 0);
    maskData = tempCtx.getImageData(0, 0, this.width, this.height).data;
    update();
  };
  window.addEventListener('resize', function() {
    updateMetrics();
  });
  inter = null;
  $('.hero .btn').on('mouseenter', function() {
    window.btnHover = true;
    if (inter) {
      clearInterval(inter);
    }
    inter = setInterval((function() {
      if (window.coef < 5) {
        return window.coef *= 1.02;
      } else {
        return clearInterval(inter);
      }
    }), 16.666);
  });
  $('.hero .btn').on('mouseleave', function() {
    window.btnHover = false;
    if (inter) {
      clearInterval(inter);
    }
    inter = setInterval((function() {
      if (window.coef > 1.5) {
        return window.coef /= 1.02;
      } else {
        clearInterval(inter);
        return window.coef = 1.5;
      }
    }), 16.666);
  });
});

(function() {
  var CLOCK, clock, dateElement, describeArc, polarToCartesian, timefix;

  polarToCartesian = function(cx, cy, r, angle) {
    angle = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  describeArc = function(x, y, r, startAngle, endAngle) {
    var end, large, start;
    start = polarToCartesian(x, y, r, startAngle %= 360);
    end = polarToCartesian(x, y, r, endAngle %= 360);
    large = Math.abs(endAngle - startAngle) >= 180;
    return "M" + start.x + "," + start.y + " A" + r + "," + r + ",0, " + (large ? 1 : 0) + ", 1," + end.x + "," + end.y;
  };

  timefix = function(str) {
    if (str < 10) {
      return "0" + str;
    } else {
      return str;
    }
  };

  dateElement = {
    Parent: document.getElementById('dateParent'),
    Date: document.getElementById('date'),
    Hours: document.getElementById('hours'),
    Minutes: document.getElementById('minutes'),
    Seconds: document.getElementById('seconds')
  };

  CLOCK = (function() {
    function CLOCK(radiuses, strokes, duration) {
      if (radiuses == null) {
        radiuses = [130, 110, 90];
      }
      if (strokes == null) {
        strokes = [4, 18, 14];
      }
      if (duration == null) {
        duration = 500;
      }
      this.date = new Date();
      this.paper = Snap(window.innerWidth, window.innerHeight);
      this.top = window.innerHeight / 2;
      this.left = window.innerWidth / 2;
      this.duration = duration;
      this.s1 = strokes[0];
      this.s2 = strokes[1];
      this.s3 = strokes[2];
      this._seconds(this.date);
      this._minutes(this.date);
      this._hours(this.date);
      this.r1 = radiuses[0];
      this.r2 = radiuses[1];
      this.r3 = radiuses[2];
      this._updateSeconds(new Date());
      this._updateMinutes(new Date());
      this._updateHours(new Date());
      this._updateInfo();
      setInterval((function(_this) {
        return function() {
          _this._updateInfo();
          return _this._updateSeconds(new Date());
        };
      })(this), 1000);
      this.months = ['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      this.days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      dateElement.Date.innerHTML = "" + this.days[this.date.getDay() - 1] + ", " + (this.date.getDay()) + " " + this.months[this.date.getMonth()] + " " + (this.date.getFullYear());
    }

    CLOCK.prototype._seconds = function(date, s1) {
      var seconds;
      this.date = date;
      seconds = this.date.getSeconds();
      return this._initParts(0, this.paper, this.r1, seconds, 6, 4, this.s1);
    };

    CLOCK.prototype._minutes = function(date) {
      var minutes;
      this.date = date;
      minutes = this.date.getMinutes();
      return this._initParts(1, this.paper, this.r2, minutes, 6, 6, this.s2);
    };

    CLOCK.prototype._hours = function(date) {
      var hours;
      this.date = date;
      hours = this.date.getHours();
      return this._initParts(2, this.paper, this.r3, hours, 6, 5, this.s3);
    };

    CLOCK.prototype._initParts = function(obj, paper, r, t, time, o, s) {
      var _cache;
      _cache = paper.path(describeArc(this.left, this.top, r, 0, time * t)).attr({
        fill: 'transparent',
        stroke: "rgba(255,255,255,." + o + ")",
        strokeWidth: s
      });
      if (obj === 0) {
        this.s = _cache;
      }
      if (obj === 1) {
        this.m = _cache;
      }
      if (obj === 2) {
        return this.h = _cache;
      }
    };

    CLOCK.prototype._updateSeconds = function(date) {
      var seconds;
      this.date = date;
      seconds = this.date.getSeconds();
      if (seconds < 1) {
        this._updateMinutes(this.date);
      }
      this._updatePart(seconds, this.s, this.r1, 6);
    };

    CLOCK.prototype._updateMinutes = function(date) {
      var minutes;
      this.date = date;
      minutes = this.date.getMinutes();
      if (minutes < 1) {
        this._updateHours(this.date);
      }
      this._updatePart(minutes, this.m, this.r2, 6);
    };

    CLOCK.prototype._updateHours = function(date) {
      var hours;
      this.date = date;
      hours = this.date.getHours();
      this._updatePart(hours, this.h, this.r3, 30);
    };

    CLOCK.prototype._updateInfo = function() {
      this.date = new Date();
      dateElement.Seconds.innerHTML = timefix(this.date.getSeconds());
      dateElement.Minutes.innerHTML = timefix(this.date.getMinutes());
      return dateElement.Hours.innerHTML = timefix(this.date.getHours());
    };

    CLOCK.prototype._updatePart = function(val, obj, r, t) {
      if (val > 1) {
        return obj.animate({
          d: describeArc(this.left, this.top, r, 0, val * t)
        }, this.duration, mina.elastic);
      } else if (val < 1) {
        obj.stop().animate({
          d: describeArc(this.left, this.top, r, 0, 359.99)
        }, this.duration, mina.elastic);
        return setTimeout((function(_this) {
          return function() {
            return obj.stop().animate({
              d: describeArc(_this.left, _this.top, r, 0, 0.00001)
            }, 0, mina.elastic);
          };
        })(this), this.duration);
      } else {
        return obj.animate({
          d: describeArc(this.left, this.top, r, 0, 6)
        }, this.duration, mina.elastic);
      }
    };

    return CLOCK;

  })();

  clock = new CLOCK([130, 110, 90], [4, 18, 10], 900);

}).call(this);

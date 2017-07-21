var GRID;

(GRID = function(size, texture) {
  var _ylines, drawLine, setValues, step, xlines, ylines, zlines;
  step = .1;
  xlines = 0;
  ylines = 0;
  zlines = 0;
  _ylines = 0;
  setValues = function() {
    xlines = room.rect.x / 2 / step;
    ylines = room.rect.y / 2 / step;
    zlines = room.rect.z / 2 / step;
    return _ylines = room.rect.z / 2 / step;
  };
  drawLine = function(arr, type) {
    var _for, _i, count, horizontal, horizontal2, j, k, m, n, o, p, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, results, results1, results2, results3;
    horizontal = (type === 'x') || (type === 'X');
    horizontal2 = (type === 'z') || (type === 'Z');
    count = (horizontal ? xlines : horizontal2 ? zlines : ylines);
    _for = function(i, isFirst) {
      var lin;
      lin = line(new THREE.Vector3(i * step, -room.rect.y / 2, -room.rect.z / 2), new THREE.Vector3(room.rect.x / 2, i * step, -room.rect.z / 2), type);
      if (type === 'x') {
        lin.rotation.y = Math.PI;
      }
      if (type === 'X') {
        lin.rotation.y = 0;
      }
      if (type === '_X') {
        lin.rotation.y = Math.PI;
      }
      if (type === 'z') {
        lin.rotation.y = -Math.PI / 2;
      }
      if (type === '_z') {
        lin.rotation.y = -Math.PI / 2;
      }
      if (type === 'Z') {
        lin.rotation.y = Math.PI / 2;
      }
      if (type === '_Z') {
        lin.rotation.y = Math.PI / 2;
      }
      if (type === 'y') {
        lin.rotation.x = -Math.PI / 2;
      }
      if (type === 'Y') {
        lin.rotation.z = Math.PI / 2;
      }
      if (type === 'Y') {
        lin.rotation.x = Math.PI / 2;
      }
      if ((type === 'z') || (type === 'Z')) {
        lin.position.z = i * step;
      }
      if ((type === 'x') || (type === 'X')) {
        lin.position.x = i * step;
      }
      if ((type === '_x') || (type === '_X')) {
        lin.position.y = i * step;
      }
      if ((type === '_z') || (type === '_Z')) {
        lin.position.y = i * step;
      }
      if (type === 'y') {
        lin.position.z = i * step;
      }
      if (type === 'Y') {
        lin.position.x = i * step;
      }
      if ((type === 'x') || (type === '_x')) {
        lin.position.z = -room.rect.z / 2 + 0.001;
      }
      if ((type === 'X') || (type === '_X')) {
        lin.position.z = room.rect.z / 2 - 0.001;
      }
      if ((type === 'z') || (type === '_z')) {
        lin.position.x = -room.rect.x / 2 + 0.001;
      }
      if ((type === 'Z') || (type === '_Z')) {
        lin.position.x = room.rect.x / 2 - 0.001;
      }
      if ((i * step % 1) === 0) {
        if (horizontal || horizontal2) {
          lin.scale.set(3, 1, 1);
        } else {
          lin.scale.set(1, 3, 1);
        }
      }
      if (!horizontal && !horizontal2) {
        lin.position.y -= room.rect.y / 2 - 0.001;
      }
      return arr.push(lin);
    };
    if ((type === 'x') || (type === 'X') || (type === 'z') || (type === 'Z')) {
      for (_i = j = 0, ref = -count; 0 <= ref ? j < ref : j > ref; _i = 0 <= ref ? ++j : --j) {
        _for(_i, _i === 0);
      }
      results = [];
      for (_i = k = 0, ref1 = count; 0 <= ref1 ? k < ref1 : k > ref1; _i = 0 <= ref1 ? ++k : --k) {
        results.push(_for(_i, _i === 0));
      }
      return results;
    } else if (type === 'y') {
      for (_i = m = 0, ref2 = -_ylines; 0 <= ref2 ? m < ref2 : m > ref2; _i = 0 <= ref2 ? ++m : --m) {
        _for(_i, _i === 0);
      }
      results1 = [];
      for (_i = n = 0, ref3 = _ylines; 0 <= ref3 ? n < ref3 : n > ref3; _i = 0 <= ref3 ? ++n : --n) {
        results1.push(_for(_i, _i === 0));
      }
      return results1;
    } else if (type === 'Y') {
      for (_i = o = 0, ref4 = -xlines; 0 <= ref4 ? o < ref4 : o > ref4; _i = 0 <= ref4 ? ++o : --o) {
        _for(_i, _i === 0);
      }
      results2 = [];
      for (_i = p = 0, ref5 = xlines; 0 <= ref5 ? p < ref5 : p > ref5; _i = 0 <= ref5 ? ++p : --p) {
        results2.push(_for(_i, _i === 0));
      }
      return results2;
    } else {
      results3 = [];
      for (_i = q = 0, ref6 = count * 2; 0 <= ref6 ? q < ref6 : q > ref6; _i = 0 <= ref6 ? ++q : --q) {
        results3.push(_for(_i, _i === -count));
      }
      return results3;
    }
  };
  this.remove = function() {
    var j, k, l, len, len1, len2, len3, len4, len5, len6, len7, len8, len9, m, n, o, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, s, t;
    ref = LINES.x;
    for (j = 0, len = ref.length; j < len; j++) {
      l = ref[j];
      scene.remove(l);
    }
    ref1 = LINES.X;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      l = ref1[k];
      scene.remove(l);
    }
    ref2 = LINES._x;
    for (m = 0, len2 = ref2.length; m < len2; m++) {
      l = ref2[m];
      scene.remove(l);
    }
    ref3 = LINES._X;
    for (n = 0, len3 = ref3.length; n < len3; n++) {
      l = ref3[n];
      scene.remove(l);
    }
    ref4 = LINES.z;
    for (o = 0, len4 = ref4.length; o < len4; o++) {
      l = ref4[o];
      scene.remove(l);
    }
    ref5 = LINES.Z;
    for (p = 0, len5 = ref5.length; p < len5; p++) {
      l = ref5[p];
      scene.remove(l);
    }
    ref6 = LINES._z;
    for (q = 0, len6 = ref6.length; q < len6; q++) {
      l = ref6[q];
      scene.remove(l);
    }
    ref7 = LINES._Z;
    for (r = 0, len7 = ref7.length; r < len7; r++) {
      l = ref7[r];
      scene.remove(l);
    }
    ref8 = LINES.y;
    for (s = 0, len8 = ref8.length; s < len8; s++) {
      l = ref8[s];
      scene.remove(l);
    }
    ref9 = LINES.Y;
    for (t = 0, len9 = ref9.length; t < len9; t++) {
      l = ref9[t];
      scene.remove(l);
    }
    LINES.x = [];
    LINES.X = [];
    LINES._x = [];
    LINES._X = [];
    LINES.z = [];
    LINES.Z = [];
    LINES._z = [];
    LINES._Z = [];
    LINES.y = [];
    return LINES.Y = [];
  };
  this.add = function() {
    var j, k, len, len1, len2, len3, len4, len5, len6, len7, len8, len9, lin, m, n, o, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results, s, t;
    setValues();
    drawLine(LINES.x, 'x');
    drawLine(LINES._x, '_x');
    drawLine(LINES.x, 'X');
    drawLine(LINES._x, '_X');
    drawLine(LINES.z, 'z');
    drawLine(LINES.z, '_z');
    drawLine(LINES.z, 'Z');
    drawLine(LINES.z, '_Z');
    drawLine(LINES.y, 'y');
    drawLine(LINES.Y, 'Y');
    ref = LINES.x;
    for (j = 0, len = ref.length; j < len; j++) {
      lin = ref[j];
      scene.add(lin);
    }
    ref1 = LINES._x;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      lin = ref1[k];
      scene.add(lin);
    }
    ref2 = LINES.X;
    for (m = 0, len2 = ref2.length; m < len2; m++) {
      lin = ref2[m];
      scene.add(lin);
    }
    ref3 = LINES._X;
    for (n = 0, len3 = ref3.length; n < len3; n++) {
      lin = ref3[n];
      scene.add(lin);
    }
    ref4 = LINES.z;
    for (o = 0, len4 = ref4.length; o < len4; o++) {
      lin = ref4[o];
      scene.add(lin);
    }
    ref5 = LINES.Z;
    for (p = 0, len5 = ref5.length; p < len5; p++) {
      lin = ref5[p];
      scene.add(lin);
    }
    ref6 = LINES._z;
    for (q = 0, len6 = ref6.length; q < len6; q++) {
      lin = ref6[q];
      scene.add(lin);
    }
    ref7 = LINES._Z;
    for (r = 0, len7 = ref7.length; r < len7; r++) {
      lin = ref7[r];
      scene.add(lin);
    }
    ref8 = LINES.y;
    for (s = 0, len8 = ref8.length; s < len8; s++) {
      lin = ref8[s];
      scene.add(lin);
    }
    ref9 = LINES.Y;
    results = [];
    for (t = 0, len9 = ref9.length; t < len9; t++) {
      lin = ref9[t];
      results.push(scene.add(lin));
    }
    return results;
  };
  this.setValue = (function(_this) {
    return function(val) {
      step = val;
      setValues();
      _this.remove();
      if ($('#gridSizeChecker').prop('checked')) {
        return _this.add();
      }
    };
  })(this);
  this.setColor = function(hex) {
    var j, k, l, len, len1, len2, len3, len4, len5, len6, len7, len8, len9, m, n, o, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results, s, t;
    ref = LINES.x;
    for (j = 0, len = ref.length; j < len; j++) {
      l = ref[j];
      l.material.color = new THREE.Color(hex);
    }
    ref1 = LINES.X;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      l = ref1[k];
      l.material.color = new THREE.Color(hex);
    }
    ref2 = LINES._x;
    for (m = 0, len2 = ref2.length; m < len2; m++) {
      l = ref2[m];
      l.material.color = new THREE.Color(hex);
    }
    ref3 = LINES._X;
    for (n = 0, len3 = ref3.length; n < len3; n++) {
      l = ref3[n];
      l.material.color = new THREE.Color(hex);
    }
    ref4 = LINES.z;
    for (o = 0, len4 = ref4.length; o < len4; o++) {
      l = ref4[o];
      l.material.color = new THREE.Color(hex);
    }
    ref5 = LINES.Z;
    for (p = 0, len5 = ref5.length; p < len5; p++) {
      l = ref5[p];
      l.material.color = new THREE.Color(hex);
    }
    ref6 = LINES._z;
    for (q = 0, len6 = ref6.length; q < len6; q++) {
      l = ref6[q];
      l.material.color = new THREE.Color(hex);
    }
    ref7 = LINES._Z;
    for (r = 0, len7 = ref7.length; r < len7; r++) {
      l = ref7[r];
      l.material.color = new THREE.Color(hex);
    }
    ref8 = LINES.y;
    for (s = 0, len8 = ref8.length; s < len8; s++) {
      l = ref8[s];
      l.material.color = new THREE.Color(hex);
    }
    ref9 = LINES.Y;
    results = [];
    for (t = 0, len9 = ref9.length; t < len9; t++) {
      l = ref9[t];
      results.push(l.material.color = new THREE.Color(hex));
    }
    return results;
  };
  return this;
})();

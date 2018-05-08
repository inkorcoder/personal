var Conus, HOLE, Hole, Merge, Point, ScaleArrows, _assignUVs, _line, _vertex, addObjectDistances, clearObjectDistances, collision, dashedLine, deg, disableObjectControls, enableObjectControls, faceCenter, getBBox, getBBoxes, getPrtialRect, getXY, helpBox, helpBoxes, helpLine, hintLines, line, message, rad, rand, setObjectDistance, setScale, setSliderScale, updateObjectDistances;

helpLine = null;

helpBox = null;

helpBoxes = [];

deg = function(radians) {
  return radians * 180 / Math.PI;
};

rad = function(degrees) {
  return degrees * Math.PI / 180;
};

rand = function(min, max) {
  return Math.random() * (max - min) + min;
};

_line = function(from, to) {
  var _lin, geometry, material;
  _lin = void 0;
  geometry = void 0;
  material = void 0;
  material = new THREE.LineBasicMaterial({
    color: 0x000000
  });
  geometry = new THREE.Geometry;
  geometry.vertices.push(from, to);
  _lin = new THREE.Line(geometry, material);
  return _lin;
};

dashedLine = function(from, to, color, width) {
  var _lin, geometry, material;
  _lin = void 0;
  geometry = void 0;
  material = void 0;
  material = new THREE.LineDashedMaterial({
    color: color || 0x444444,
    dashSize: 0.1,
    gapSize: 0.1,
    linewidth: width
  });
  geometry = new THREE.Geometry;
  geometry.vertices.push(from, to);
  geometry.computeLineDistances();
  _lin = new THREE.Line(geometry, material);
  _lin.name = 'dashedLineHelper';
  return _lin;
};

line = function(vec1, vec2, type) {
  var geometry, gridMaterial;
  geometry = void 0;
  gridMaterial = void 0;
  gridMaterial = new THREE.MeshBasicMaterial({
    color: 0x999999
  });
  if (type === 'x' || type === 'X' || type === 'z' || type === 'Z') {
    geometry = new THREE.PlaneGeometry(0.005, vec1.y * 2, 1);
  } else if (type === '_z' || type === '_Z') {
    geometry = new THREE.PlaneGeometry(vec2.z * 2, 0.005, 1);
  } else if (type === 'Y') {
    geometry = new THREE.PlaneGeometry(vec2.z * 2, 0.005, 1);
  } else {
    geometry = new THREE.PlaneGeometry(vec2.x * 2, 0.005, 1);
  }
  helpLine = new THREE.Mesh(geometry, gridMaterial);
  return helpLine;
};

getBBox = function(obj, color) {
  scene.remove(helpBox);
  helpBox = new THREE.BoundingBoxHelper(obj, color ? color : 0xff0000);
  helpBox.update();
  return scene.add(helpBox);
};

getBBoxes = function(arr) {
  var b, bb, k, len, len1, n, results;
  for (k = 0, len = helpBoxes.length; k < len; k++) {
    b = helpBoxes[k];
    scene.remove(b);
  }
  results = [];
  for (n = 0, len1 = arr.length; n < len1; n++) {
    b = arr[n];
    bb = new THREE.BoundingBoxHelper(b, 0x00ff00);
    bb.update();
    helpBoxes.push(bb);
    results.push(scene.add(bb));
  }
  return results;
};

getPrtialRect = function(obj) {
  return {
    x: obj.rect.x / 2,
    y: obj.rect.y / 2,
    z: obj.rect.z / 2
  };
};

faceCenter = function(O, f) {
  var _c, a, b, c;
  a = O.geometry.vertices[f.a];
  b = O.geometry.vertices[f.b];
  c = O.geometry.vertices[f.c];
  _c = [new THREE.Vector3(O.p.x + a.x, O.p.y + a.y, O.p.z + a.z), new THREE.Vector3(O.p.x + b.x, O.p.y + b.y, O.p.z + b.z), new THREE.Vector3(O.p.x + c.x, O.p.y + c.y, O.p.z + c.z)];
  c = new THREE.Vector3((_c[0].x + _c[1].x + _c[2].x) / 3, (_c[0].y + _c[1].y + _c[2].y) / 3, (_c[0].z + _c[1].z + _c[2].z) / 3);
  return {
    _c: _c,
    c: c
  };
};

collision = function(obj, objs, isHole) {
  var A, C, O, __c, _c, a, b, c, collisions, f, g, k, len, len1, len2, len3, len4, len5, m, n, o, p, q, r, ref, ref1, results, t, u, v;
  O = obj;
  O.r = getPrtialRect(obj);
  O.p = obj.position;
  C = {
    p: obj.position
  };
  A = [];
  for (k = 0, len = helpBoxes.length; k < len; k++) {
    b = helpBoxes[k];
    b = helpBoxes[j];
    scene.remove(b);
  }
  helpBoxes = [];
  collisions = [];
  results = [];
  for (n = 0, len1 = objs.length; n < len1; n++) {
    o = objs[n];
    if (O.uuid !== o.uuid) {
      o.r = getPrtialRect(o);
      o.p = o.position;
      O.collisions.x = O.p.x - O.r.x < o.p.x + o.r.x ? true : false;
      O.collisions.X = O.p.x + O.r.x > o.p.x - o.r.x ? true : false;
      O.collisions.y = O.p.y - O.r.y < o.p.y + o.r.y ? true : false;
      O.collisions.Y = O.p.y + O.r.y > o.p.y - o.r.y ? true : false;
      O.collisions.z = O.p.z - O.r.z < o.p.z + o.r.z ? true : false;
      O.collisions.Z = O.p.z + O.r.z > o.p.z - o.r.z ? true : false;
      if (O.collisions.x && O.collisions.X && O.collisions.y && O.collisions.Y && O.collisions.z && O.collisions.Z) {
        collisions.push(o);
      }
      if (O.name !== 'hole') {
        if (C.p.x - O.r.x < o.p.x + o.r.x + stickness && C.p.x > o.p.x && O.collisions.y && O.collisions.Y && O.collisions.z && O.collisions.Z) {
          O.p.x = o.p.x + O.r.x + o.r.x + 0.00001;
        }
        if (C.p.x + O.r.x > o.p.x - o.r.x - stickness && C.p.x < o.p.x && O.collisions.y && O.collisions.Y && O.collisions.z && O.collisions.Z) {
          O.p.x = o.p.x - O.r.x - o.r.x - 0.00001;
        }
        if (C.p.z - O.r.z < o.p.z + o.r.z + stickness && C.p.z > o.p.z && O.collisions.x && O.collisions.X && O.collisions.y && O.collisions.Y) {
          O.p.z = o.p.z + O.r.z + o.r.z + 0.00001;
        }
        if (C.p.z + O.r.z > o.p.z - o.r.z - stickness && C.p.z < o.p.z && O.collisions.x && O.collisions.X && O.collisions.y && O.collisions.Y) {
          O.p.z = o.p.z - O.r.z - o.r.z - 0.00001;
        }
        if (C.p.y - O.r.y < o.p.y + o.r.y + stickness && C.p.y > o.p.y && O.collisions.x && O.collisions.X && O.collisions.z && O.collisions.Z) {
          O.p.y = o.p.y + O.r.y + o.r.y + 0.00001;
        }
        if (C.p.y + O.r.y > o.p.y - o.r.y - stickness && C.p.y < o.p.y && O.collisions.x && O.collisions.X && O.collisions.z && O.collisions.Z) {
          O.p.y = o.p.y - O.r.y - o.r.y - 0.00001;
        }
      }
      ref = scene.children;
      for (p = 0, len2 = ref.length; p < len2; p++) {
        c = ref[p];
        if (c && c.name && c.name === 'collisions') {
          scene.remove(c);
        }
      }
      O.geometry.colorsNeedUpdate = true;
      ref1 = O.geometry.faces;
      for (r = 0, len3 = ref1.length; r < len3; r++) {
        f = ref1[r];
        __c = faceCenter(O, f);
        c = __c.c;
        _c = __c._c;
        if (c.x >= o.p.x - (o.r.x * O._scale.x) - 0.005 && c.x <= o.p.x - (o.r.x * O._scale.x) + 0.005 && O.collisions.z && O.collisions.Z && O.collisions.y && O.collisions.Y) {
          A.push(_c);
        }
        if (c.x <= o.p.x + o.r.x * O._scale.x + 0.005 && c.x >= o.p.x + o.r.x * O._scale.x - 0.005 && O.collisions.z && O.collisions.Z && O.collisions.y && O.collisions.Y) {
          A.push(_c);
        }
        if (c.z >= o.p.z - (o.r.z * O._scale.z) - 0.005 && c.z <= o.p.z - (o.r.z * O._scale.z) + 0.005 && O.collisions.x && O.collisions.X && O.collisions.y && O.collisions.Y) {
          A.push(_c);
        }
        if (c.z <= o.p.z + o.r.z * O._scale.z + 0.005 && c.z >= o.p.z + o.r.z * O._scale.z - 0.005 && O.collisions.x && O.collisions.X && O.collisions.y && O.collisions.Y) {
          A.push(_c);
        }
        if (c.y >= o.p.y - (o.r.y * O._scale.y) - 0.005 && c.y <= o.p.y - (o.r.y * O._scale.y) + 0.005 && O.collisions.x && O.collisions.X && O.collisions.z && O.collisions.Z) {
          A.push(_c);
        }
        if (c.y <= o.p.y + o.r.y * O._scale.y + 0.005 && c.y >= o.p.y + o.r.y * O._scale.y - 0.005 && O.collisions.x && O.collisions.X && O.collisions.z && O.collisions.Z) {
          A.push(_c);
        }
      }
      g = new THREE.Geometry;
      q = 0;
      for (t = 0, len4 = A.length; t < len4; t++) {
        a = A[t];
        for (u = 0, len5 = a.length; u < len5; u++) {
          v = a[u];
          v.x = v.x + (O.p.x < v.x ? O.p.x + O.r.x - v.x : O.p.x - O.r.x - v.x);
          v.y = v.y + (O.p.y < v.y ? O.p.y + O.r.y - v.y : O.p.y - O.r.y - v.y);
          v.z = v.z + (O.p.z < v.z ? O.p.z + O.r.z - v.z : O.p.z - O.r.z - v.z);
          g.vertices.push(v);
        }
      }
      m = new THREE.Line(g, new THREE.LineBasicMaterial({
        color: 0x00ff00,
        linewidth: 10
      }));
      m.name = 'collisions';
    }
  }
  return (O.collisions.x && O.collisions.X && O.collisions.y && O.collisions.Y && O.collisions.z && O.collisions.Z && hole.visible ? collisions : false);
};

getXY = function(e, type) {
  var intersects, mouse;
  intersects = void 0;
  mouse = void 0;
  mouse = getCoordinates(e);
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects([room.plane]);
  return intersects[0].point;
};

enableObjectControls = function() {
  $('#editObject, #deleteObject, #rotation, #scale').removeClass('disabled');
  clearObjectDistances();
  return addObjectDistances();
};

disableObjectControls = function() {
  $('#editObject, #deleteObject, #rotation, #scale').addClass('disabled');
  $('.popup').removeClass('active');
  return clearObjectDistances();
};

message = function(text) {
  var elem;
  elem = void 0;
  elem = $('<div/>').addClass('message').html(text);
  $('.page-wrapper').append(elem);
  return setTimeout((function() {
    elem.addClass('active');
    return setTimeout((function() {
      elem.removeClass('active');
      return setTimeout((function() {
        return elem.remove();
      }), 500);
    }), 4000);
  }), 100);
};

setSliderScale = function(val1, val2) {
  if (val1 > val2) {
    if (window.currentZoom < ZOOM.max) {
      controls.zoomIn();
      return controls.zoomIn();
    }
  } else {
    if (window.currentZoom > ZOOM.min) {
      controls.zoomOut();
      return controls.zoomOut();
    }
  }
};

setScale = function(val) {
  return console.log(val);
};

Conus = function(hex) {
  var c;
  c = void 0;
  c = new THREE.Mesh(new THREE.SphereGeometry(0.01, 10, 10), new THREE.MeshBasicMaterial({
    color: hex
  }));
  c.type = 'cylinder';
  return c;
};

ScaleArrows = function(mesh) {
  var X, Y, Z, array, x, y, z;
  array = [];
  x = new Conus(0xff0000);
  x.visible = false;
  scene.add(x);
  x.mark = 'x';
  array[0] = x;
  X = new Conus(0xff0000);
  X.visible = false;
  scene.add(X);
  X.mark = 'X';
  array[1] = X;
  y = new Conus(0x00ff00);
  y.visible = false;
  scene.add(y);
  y.mark = 'y';
  array[2] = y;
  Y = new Conus(0x00ff00);
  Y.visible = false;
  scene.add(Y);
  Y.mark = 'Y';
  array[3] = Y;
  z = new Conus(0x0000ff);
  z.visible = false;
  scene.add(z);
  z.mark = 'z';
  array[4] = z;
  Z = new Conus(0x0000ff);
  Z.visible = false;
  scene.add(Z);
  Z.mark = 'Z';
  array[5] = Z;
  return array;
};

hintLines = [];

clearObjectDistances = function() {
  var k, l, len;
  for (k = 0, len = hintLines.length; k < len; k++) {
    l = hintLines[k];
    scene.remove(l);
  }
  return hintLines = [];
};

addObjectDistances = function() {
  var k, l, len, results;
  results = [];
  for (k = 0, len = hintLines.length; k < len; k++) {
    l = hintLines[k];
    results.push(scene.add(l));
  }
  return results;
};

updateObjectDistances = function(obj, s) {
  var O, X, Y, Z, x, y, z;
  clearObjectDistances();
  if (obj.object.name !== 'ruler' && obj.object.name !== 'hole') {
    O = {};
    O.p = obj.position;
    O.r = obj.object.rect;
    O.d = obj.object.distances;
    x = [new THREE.Vector3(room.rect.x / 2, O.p.y, O.p.z), new THREE.Vector3(O.p.x + O.r.x / 2, O.p.y, O.p.z)];
    X = [new THREE.Vector3(-room.rect.x / 2, O.p.y, O.p.z), new THREE.Vector3(O.p.x - (O.r.x / 2), O.p.y, O.p.z)];
    Y = [new THREE.Vector3(O.p.x, -room.rect.y / 2, O.p.z), new THREE.Vector3(O.p.x, O.p.y - (O.r.y / 2), O.p.z)];
    y = [new THREE.Vector3(O.p.x, room.rect.y / 2, O.p.z), new THREE.Vector3(O.p.x, O.p.y + (O.r.y / 2), O.p.z)];
    z = [new THREE.Vector3(O.p.x, O.p.y, room.rect.z / 2), new THREE.Vector3(O.p.x, O.p.y, O.p.z + O.r.z / 2)];
    Z = [new THREE.Vector3(O.p.x, O.p.y, -room.rect.z / 2), new THREE.Vector3(O.p.x, O.p.y, O.p.z - (O.r.z / 2))];
    hints.x.text.position.x = obj.position.x + O.r.x / 2 + .3;
    hints.x.text.position.z = obj.position.z;
    hints.x.text.position.y = obj.position.y + 0.07 * s;
    hints.X.text.position.x = obj.position.x - (O.r.x / 2 + .3);
    hints.X.text.position.z = obj.position.z;
    hints.X.text.position.y = obj.position.y + 0.07 * s;
    hints.y.text.position.x = obj.position.x;
    hints.y.text.position.y = obj.position.y - (O.r.y / 2 + .3);
    hints.y.text.position.z = obj.position.z + 0.07 * s;
    hints.Y.text.position.x = obj.position.x;
    hints.Y.text.position.y = obj.position.y + (O.r.y / 2 + .3);
    hints.Y.text.position.z = obj.position.z + 0.07 * s;
    hints.z.text.position.x = obj.position.x;
    hints.z.text.position.z = obj.position.z + O.r.z / 2 + .3;
    hints.z.text.position.y = obj.position.y + 0.07 * s;
    hints.Z.text.position.x = obj.position.x;
    hints.Z.text.position.z = obj.position.z - (O.r.z / 2 + .3);
    hints.Z.text.position.y = obj.position.y + 0.07 * s;
    if (OPTIONS.hints.x.enabled === true) {
      hintLines.push(new dashedLine(x[0], x[1], ($('#isIndicatorsGrey').prop('checked') ? 0xff0000 : 0x000000), OPTIONS.hints.x.width));
      hintLines.push(new dashedLine(X[0], X[1], ($('#isIndicatorsGrey').prop('checked') ? 0xff0000 : 0x000000), OPTIONS.hints.x.width));
    }
    if (OPTIONS.hints.y.enabled === true) {
      hintLines.push(new dashedLine(Y[0], Y[1], ($('#isIndicatorsGrey').prop('checked') ? 0x00ff00 : 0x000000), OPTIONS.hints.y.width));
      hintLines.push(new dashedLine(y[0], y[1], ($('#isIndicatorsGrey').prop('checked') ? 0x00ff00 : 0x000000), OPTIONS.hints.y.width));
    }
    if (OPTIONS.hints.z.enabled === true) {
      hintLines.push(new dashedLine(z[0], z[1], ($('#isIndicatorsGrey').prop('checked') ? 0x0000ff : 0x000000), OPTIONS.hints.z.width));
      hintLines.push(new dashedLine(Z[0], Z[1], ($('#isIndicatorsGrey').prop('checked') ? 0x0000ff : 0x000000), OPTIONS.hints.z.width));
    }
    O.d.x = (x[0].distanceTo(x[1]) * 100).toFixed(0);
    O.d.X = (X[0].distanceTo(X[1]) * 100).toFixed(0);
    O.d.y = (Y[0].distanceTo(Y[1]) * 100).toFixed(0);
    O.d.Y = (y[0].distanceTo(y[1]) * 100).toFixed(0);
    O.d.z = (z[0].distanceTo(z[1]) * 100).toFixed(0);
    O.d.Z = (Z[0].distanceTo(Z[1]) * 100).toFixed(0);
    hints.x.set(O.d.x * 10 + 'мм');
    hints.X.set(O.d.X * 10 + 'мм');
    hints.y.set(O.d.y * 10 + 'мм');
    hints.Y.set(O.d.Y * 10 + 'мм');
    hints.z.set(O.d.z * 10 + 'мм');
    hints.Z.set(O.d.Z * 10 + 'мм');
    addObjectDistances();
  }
};

Point = function(pos, s) {
  var mesh;
  s = s || 0.02;
  mesh = new THREE.Mesh(new THREE.SphereGeometry(s, s, s), new THREE.MeshBasicMaterial({
    color: 0x009900
  }));
  mesh.position.x = pos.x;
  mesh.position.y = pos.y;
  mesh.position.z = pos.z;
  return mesh;
};

setObjectDistance = function(input, direction) {
  var D, O, d, dir, val;
  O = control.object;
  if (O) {
    D = O.distances;
    dir = {
      X: O.distances.X,
      x: O.distances.x,
      Y: O.distances.Y,
      y: O.distances.y,
      Z: O.distances.Z,
      z: O.distances.z
    };
    val = parseInt(input.val()) || 0;
    dir[direction] = val;
    d = {
      X: -room.rect.x / 2 + O.rect.x / 2 + dir['X'] / 100,
      x: room.rect.x / 2 - O.rect.x / 2 - dir['x'] / 100,
      Z: -room.rect.z / 2 + O.rect.z / 2 + dir['Z'] / 100,
      z: room.rect.z / 2 - O.rect.z / 2 - dir['z'] / 100,
      y: -room.rect.y / 2 + O.rect.y / 2 + dir['y'] / 100,
      Y: room.rect.y / 2 - O.rect.y / 2 - dir['Y'] / 100
    };
    switch (direction) {
      case 'X':
        O.position.x = d['X'];
        break;
      case 'x':
        O.position.x = d['x'];
        break;
      case 'Z':
        O.position.z = d['Z'];
        break;
      case 'z':
        O.position.z = d['z'];
        break;
      case 'y':
        O.position.y = d['y'];
        break;
      case 'Y':
        O.position.y = d['Y'];
    }
    updateObjectDistances(control, 20);
    return $('#objectDistanceLeft, #objectDistanceFront, ' + '#objectDistanceRear, #objectDistanceRight, ' + '#objectDistanceTop, #objectDistanceBottom').not(input).each(function(i, inp) {
      $(inp).val(O.distances[$(inp).data('direction')]);
    });
  }
};


/*
	holes
 */

HOLE = function() {
  var bbox, mesh, size;
  mesh = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 1, 30), new THREE.MeshPhongMaterial({
    color: 0x444444,
    emissive: 0x222222
  }));
  mesh._scale = {
    x: 1,
    y: 1,
    z: 1
  };
  mesh.collisions = {
    x: false,
    X: false,
    y: false,
    Y: false,
    z: false,
    Z: false
  };
  bbox = (new THREE.Box3).setFromObject(mesh);
  size = {
    x: bbox.max.x - bbox.min.x,
    y: bbox.max.y - bbox.min.y,
    z: bbox.max.z - bbox.min.z
  };
  mesh.rect = {
    x: size.x,
    y: size.y,
    z: size.z
  };
  mesh.name = 'hole';
  mesh.visible = false;
  scene.add(mesh);
  return mesh;
};

_vertex = function(size, angle, y) {
  var a, v;
  a = rad(angle);
  v = new THREE.Vector3();
  v.x = size * Math.sin(a);
  v.z = size * Math.cos(a);
  if (y) {
    v.y = y;
  }
  return v;
};

_assignUVs = function(geometry) {
  geometry.faceVertexUvs[0] = [];
  geometry.faces.forEach(function(face) {
    var components, v1, v2, v3;
    components = ['x', 'y', 'z'].sort(function(a, b) {
      return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
    });
    v1 = geometry.vertices[face.a];
    v2 = geometry.vertices[face.b];
    v3 = geometry.vertices[face.c];
    geometry.faceVertexUvs[0].push([new THREE.Vector2(v1[components[0]], v1[components[1]]), new THREE.Vector2(v2[components[0]], v2[components[1]]), new THREE.Vector2(v3[components[0]], v3[components[1]])]);
  });
  geometry.uvsNeedUpdate = true;
};

Hole = function(obj) {
  var createCircle, createSquare, createTriangle, hole, material, setPosition, setVariables, size, type;
  size = 0;
  type = '';
  hole = {};
  material = new THREE.MeshPhongMaterial({
    color: 0x777777,
    map: obj.material.map
  });
  (setVariables = function() {
    var min;
    min = Math.min(obj.rect.x, obj.rect.z);
    size = parseInt($('#holeSize').val().trim()) / 100;
    return type = $('#holeType').val().trim();
  })();
  setPosition = function(tmp) {
    tmp.position.x = obj.position.x;
    return tmp.position.z = obj.position.z;
  };

  /*
  		circle constructor
   */
  createCircle = function() {
    var geometry, tmp;
    geometry = new THREE.CylinderGeometry(size, size, 1, 30);
    tmp = new THREE.Mesh(geometry, material);
    setPosition(tmp);
    return tmp;
  };

  /*
  		circle constructor
   */
  createTriangle = function() {
    var face, faces, geometry, max, min, offset, range, tmp;
    geometry = new THREE.Geometry();
    face = function(a, b, c) {
      geometry.faces.push(new THREE.Face3(a, b, c));
    };
    geometry.vertices.push(_vertex(size, 60, .5));
    geometry.vertices.push(_vertex(size, 180, .5));
    geometry.vertices.push(_vertex(size, 300, .5));
    geometry.vertices.push(_vertex(size, 60, -.5));
    geometry.vertices.push(_vertex(size, 180, -.5));
    geometry.vertices.push(_vertex(size, 300, -.5));
    face(0, 1, 2);
    face(5, 3, 0);
    face(0, 2, 5);
    face(5, 2, 1);
    face(1, 4, 5);
    face(4, 1, 0);
    face(0, 3, 4);
    face(5, 4, 3);
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    _assignUVs(geometry);
    max = geometry.boundingBox.max;
    min = geometry.boundingBox.min;
    offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    faces = geometry.faces;
    tmp = new THREE.Mesh(geometry, material);
    setPosition(tmp);
    return tmp;
  };

  /*
  		square constructor
   */
  createSquare = function() {
    var geometry, tmp;
    geometry = new THREE.BoxGeometry(size * 2, 1, size * 2);
    tmp = new THREE.Mesh(geometry, material);
    setPosition(tmp);
    return tmp;
  };
  switch (type) {
    case 'circle':
      hole = new OBJ(void 0, createCircle());
      break;
    case 'triangle':
      hole = new OBJ(void 0, createTriangle());
      break;
    case 'square':
      hole = new OBJ(void 0, createSquare());
  }
  hole.create = function(obj) {
    var c, cBsp, holeBsp, holeCollisions, i, k, len, len1, n, newMesh, o, result, resultBsp;
    holeCollisions = collision(hole, OBJECTS);
    for (k = 0, len = holeCollisions.length; k < len; k++) {
      c = holeCollisions[k];
      cBsp = new ThreeBSP(c);
      holeBsp = new ThreeBSP(hole);
      resultBsp = cBsp.subtract(holeBsp);
      result = resultBsp.toMesh(c.material);
      newMesh = new OBJ(void 0, result);
      newMesh.scale.set(c.scale.x, c.scale.y, c.scale.z);
      newMesh._setRects(true);
      newMesh.holeType = hole.type;
      newMesh.calculateHoles();
      newMesh.scaleArrows = ScaleArrows(newMesh);
      scene.add(newMesh);
      newMesh.objectName = c.objectName;
      scene.add(newMesh.hint.text);
      for (i = n = 0, len1 = OBJECTS.length; n < len1; i = ++n) {
        o = OBJECTS[i];
        if (o.uuid === c.uuid) {
          scene.remove(c.hint.text);
          scene.remove(c);
          OBJECTS.splice(i, 1, newMesh);
          control.detach(c);
          clearObjectDistances();
        }
      }
    }
    return $('#contextmenu').removeClass('active');
  };
  control.detach(hole);
  scene.add(hole);
  control.attach(hole);
  hole.name = 'hole';
  hole.type = type;
  delete hole.isObject;
  return hole;
};


/*
	merge array
 */

Merge = function(array) {
  var box, box2, boxMesh, buffer, c, holeMesh, holes, i, k, len, m, n, p, ref, ref1;
  holes = new THREE.Geometry();
  buffer = new THREE.Geometry();
  for (k = 0, len = array.length; k < len; k++) {
    c = array[k];
    box = c.geometry;
    for (i = n = 0, ref = box.vertices.length; 0 <= ref ? n < ref : n > ref; i = 0 <= ref ? ++n : --n) {
      box.vertices[i].x *= c._scale.x;
      box.vertices[i].y *= c._scale.y;
      box.vertices[i].z *= c._scale.z;
      box.vertices[i].x += c.pos.x;
      box.vertices[i].y += c.pos.y;
      box.vertices[i].z += c.pos.z;
    }
    if (c.children[0]) {
      box2 = c.children[0].geometry;
      c.children[0].position.x = c.pos.x;
      c.children[0].position.y = c.pos.z;
      c.children[0].position.z = c.pos.y;
      for (i = p = 0, ref1 = box2.vertices.length; 0 <= ref1 ? p < ref1 : p > ref1; i = 0 <= ref1 ? ++p : --p) {
        box2.vertices[i].x *= c._scale.x;
        box2.vertices[i].y *= c._scale.y;
        box2.vertices[i].z *= c._scale.z;
        box2.vertices[i].x += c.pos.x;
        box2.vertices[i].y += c.pos.y;
        box2.vertices[i].z += c.pos.z;
      }
    }
    boxMesh = new THREE.Mesh(box);
    holeMesh = new THREE.Mesh(box2);
    m = new THREE.Matrix4();
    buffer.merge(boxMesh.geometry, m.copy(boxMesh.matrix));
    holes.merge(holeMesh.geometry, m.copy(holeMesh.matrix));
  }
  return [buffer, holes];
};

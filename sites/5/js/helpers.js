var arrow, deg2rad, easeInCubic, easeInOutCubic, easeInOutQuad, easeInOutQuart, easeInOutQuint, easeInQuad, easeInQuart, easeInQuint, easeOutCubic, easeOutQuad, easeOutQuart, easeOutQuint, lineIntersect, linear, orbit, point, rad2deg, random;

deg2rad = function(v) {
  return v * (Math.PI / 180);
};

rad2deg = function(v) {
  return v * (180 / Math.PI);
};

random = function(min, max) {
  var rand;
  rand = Math.floor(Math.random() * (max - min + 1)) + min;
  return rand;
};

orbit = function(radius, scene, tank1) {
  var i, j, obj, og, om, v;
  this.radius = radius;
  og = new THREE.Geometry();
  om = new THREE.ParticleBasicMaterial({
    color: 0xffffff,
    size: 5,
    sizeAttenuation: false
  });
  for (i = j = 0; j < 10; i = ++j) {
    v = new THREE.Vector3();
    v.x = tank1.MESH.position.x + Math.sin(Math.PI / 18 * i) * this.radius;
    v.y = tank1.MESH.position.y + Math.cos(Math.PI / 18 * i) * this.radius;
    og.vertices.push(v);
  }
  obj = new THREE.ParticleSystem(og, om);
  return scene.add(obj);
};

lineIntersect = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  var x, y;
  x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  if (isNaN(x) || isNaN(y)) {
    return false;
  } else {
    if (x1 >= x2) {
      if (!(x2 <= x && x <= x1)) {
        return false;
      }
    } else {
      if (!(x1 <= x && x <= x2)) {
        return false;
      }
    }
    if (y1 >= y2) {
      if (!(y2 <= y && y <= y1)) {
        return false;
      }
    } else {
      if (!(y1 <= y && y <= y2)) {
        return false;
      }
    }
    if (x3 >= x4) {
      if (!(x4 <= x && x <= x3)) {
        return false;
      }
    } else {
      if (!(x3 <= x && x <= x4)) {
        return false;
      }
    }
    if (y3 >= y4) {
      if (!(y4 <= y && y <= y3)) {
        return false;
      }
    } else {
      if (!(y3 <= y && y <= y4)) {
        return false;
      }
    }
  }
  return {
    x: x,
    y: y
  };
};

point = function(v) {
  var p;
  p = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 10), new THREE.MeshNormalMaterial());
  p.position.set(v.x, v.y, 0);
  return SCENE.add(p);
};

arrow = function(direction, point) {
  return SCENE.add(new THREE.ArrowHelper(direction, point, 10, 0xffffff));
};

linear = function(t) {
  return t;
};

easeInQuad = function(t) {
  return t * t;
};

easeOutQuad = function(t) {
  return t * (2 - t);
};

easeInOutQuad = function(t) {
  if (t < .5) {
    return 2 * t * t;
  } else {
    return -1 + (4 - 2 * t) * t;
  }
};

easeInCubic = function(t) {
  return t * t * t;
};

easeOutCubic = function(t) {
  return (--t) * t * t + 1;
};

easeInOutCubic = function(t) {
  if (t < .5) {
    return 4 * t * t * t;
  } else {
    return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
};

easeInQuart = function(t) {
  return t * t * t * t;
};

easeOutQuart = function(t) {
  return 1 - (--t) * t * t * t;
};

easeInOutQuart = function(t) {
  if (t < .5) {
    return 8 * t * t * t * t;
  } else {
    return 1 - 8 * (--t) * t * t * t;
  }
};

easeInQuint = function(t) {
  return t * t * t * t * t;
};

easeOutQuint = function(t) {
  return 1 + (--t) * t * t * t * t;
};

easeInOutQuint = function(t) {
  if (t < .5) {
    return 16 * t * t * t * t * t;
  } else {
    return 1 + 16 * (--t) * t * t * t * t;
  }
};

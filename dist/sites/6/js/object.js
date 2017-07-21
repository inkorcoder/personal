var OBJ;

OBJ = void 0;


/*---------------------------------------------------------
	object factory
---------------------------------------------------------
 */

(OBJ = function(model, size, modelTexture, callback, minScale) {
  var create, l, obj;
  obj = {};
  l = new THREE.JSONLoader;

  /*
  		creating function
   */
  create = function(obj, holeObj) {
    obj.timestamp = (new Date).getTime();
    obj.collisions = {
      x: false,
      X: false,
      y: false,
      Y: false,
      z: false,
      Z: false
    };
    obj.distances = {
      x: 0,
      X: 0,
      y: 0,
      Y: 0,
      z: 0,
      Z: 0
    };
    obj.corners = {
      sides: {
        front: false,
        rear: false,
        left: false,
        right: false
      },
      vertical: '-',
      type: '-'
    };
    obj.fixedFloor = false;
    obj.floorDistance = 0;
    obj.objectName = 'Введите название элемента';
    obj.minScale = minScale;
    obj._scale = {
      x: 1,
      y: 1,
      z: 1
    };
    obj.rot = 0;
    obj.rotX = 0;
    obj.hint = new Hint(0.20, 0.02, 0.0001, 'Z', true);
    obj.isObject = true;

    /*
    			set texture
     */
    obj.setTexture = function(path) {
      var texture, textureLoader;
      textureLoader = new THREE.TextureLoader;
      texture = textureLoader.load(path, function() {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture.repeat.set(1, 1);
      });
      return obj.material.map = texture;
    };

    /*
    			calculate holes
     */
    obj.calculateHoles = function() {
      var a, b, bbox, box, c, cache, g, mesh, p, r, s, v1, v2;
      obj.areaPoints = [];
      model = model || '';
      cache = [];
      size = parseInt($('#holeSize').val().trim()) / 100;
      bbox = (new THREE.Box3).setFromObject(obj);
      obj.geometry.vertices.forEach(function(v) {
        if (v.x > bbox.min.x && v.x < bbox.max.x && v.y >= bbox.min.y && v.y <= bbox.max.y && v.z > bbox.min.z && v.z < bbox.max.z) {
          cache.push(v);
        }
      });
      cache.forEach(function(a, i) {
        if (a.y >= 0) {
          obj.areaPoints.push(a);
        }
      });
      if (obj.holeType === 'circle') {
        r = size;
        obj.hole = {
          radius: r.toFixed(2),
          diameter: (r * 2).toFixed(2),
          area: (Math.PI * Math.pow(r, 2)).toFixed(2)
        };
      } else if (obj.holeType === 'triangle') {
        v1 = _vertex(size, 60, .5);
        v2 = _vertex(size, 180, .5);
        a = v1.distanceTo(v2);
        b = v1.distanceTo(v2);
        c = v1.distanceTo(v2);
        p = (a + b + c) / 2;
        obj.hole = {
          a: a.toFixed(2),
          b: b.toFixed(2),
          c: c.toFixed(2),
          p: p.toFixed(2),
          area: Math.sqrt(p * (p - a) * (p - b) * (p - c)).toFixed(2)
        };
      } else if (obj.holeType === 'square') {
        g = new THREE.BoxGeometry(size * 2, size * 2, size * 2);
        mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
          color: 0x009900
        }));
        box = (new THREE.Box3).setFromObject(mesh);
        s = {
          x: box.max.x - box.min.x,
          y: box.max.y - box.min.y,
          z: box.max.z - box.min.z
        };
        obj.hole = {
          a: s.x.toFixed(2),
          b: s.z.toFixed(2),
          area: (s.x * s.z).toFixed(2)
        };
      }
    };

    /*
    			<private> set rect
     */
    obj._setRects = function(isFirst) {
      var _y, bbox;
      obj.rotation.y = 0;
      _y = obj.children.length > 0 ? 0.001 : 0;
      bbox = (new THREE.Box3).setFromObject(obj);
      bbox.max.y -= _y;
      size = {
        x: bbox.max.x - bbox.min.x,
        y: bbox.max.y - bbox.min.y,
        z: bbox.max.z - bbox.min.z
      };
      if (isFirst) {
        obj._firstRect = {
          x: size.x,
          y: size.y,
          z: size.z
        };
      }
      obj._rect = {
        x: size.x,
        y: size.y,
        z: size.z
      };
      obj.rect = {
        x: size.x,
        y: size.y,
        z: size.z
      };
      if (holeObj && typeof holeObj !== 'string') {
        obj.hole = JSON.parse(JSON.stringify(holeObj.hole));
        obj.holeType = holeObj.holeType;
      } else {
        obj.calculateHoles();
      }
    };
    obj._setRects(true);

    /*
    			<private> update rect
     */
    obj._updateRect = function(R) {
      var r, scale;
      if (R.x < obj.minScale.x) {
        R.x = obj.minScale.x;
      }
      if (R.z < obj.minScale.z) {
        R.z = obj.minScale.z;
      }
      if (R.y < obj.minScale.y) {
        R.y = obj.minScale.y;
      }
      scale = {
        x: R.x / obj._firstRect.x,
        y: R.y / obj._firstRect.y,
        z: R.z / obj._firstRect.z
      };
      obj.scale.set(scale.x, scale.y, scale.z);
      obj._scale = {
        x: scale.x,
        y: scale.y,
        z: scale.z
      };
      r = obj.rotation.y;
      obj._setRects();
      obj.rotation.y = r;
    };

    /*
    			update rect
     */
    obj.updateRect = function(newRect) {
      if (newRect) {
        obj._updateRect(newRect);
      }
      if (obj.rot === 90 || obj.rot === -90 || obj.rot === 270 || obj.rot === -270) {
        obj.rect = {
          x: obj._rect.z,
          y: obj._rect.y,
          z: obj._rect.x
        };
      } else {
        obj.rect = {
          x: obj._rect.x,
          y: obj._rect.y,
          z: obj._rect.z
        };
      }
      obj.material.map.repeat.set(parseInt(obj.rect.x) > 0 ? parseInt(obj.rect.x) : 1, parseInt(obj.rect.z) > 0 ? parseInt(obj.rect.z) : 1);
    };

    /*
    			update rect, when object in rotation
     */
    obj.updateRectX = function(newRect) {
      if (newRect) {
        obj._updateRect(newRect);
      }
      if (obj.rotX === 90 || obj.rotX === -90 || obj.rotX === 270 || obj.rotX === -270) {
        return obj.rect = {
          x: obj._rect.x,
          y: obj._rect.x,
          z: obj._rect.y
        };
      } else {
        return obj.rect = {
          x: obj._rect.x,
          y: obj._rect.y,
          z: obj._rect.z
        };
      }
    };

    /*
    			rotate left
     */
    obj.rotateLeft = function() {
      var r;
      r = obj.rotation;
      if (obj.rot === 270) {
        r.y = 0;
        obj.rot = 0;
      } else {
        r.y += rad(90);
        obj.rot += 90;
      }
      return obj.updateRect();
    };

    /*
    			rotate right
     */
    obj.rotateRight = function() {
      var r;
      r = obj.rotation;
      if (obj.rot === -270) {
        r.y = 0;
        obj.rot = 0;
      } else {
        r.y -= rad(90);
        obj.rot -= 90;
      }
      return obj.updateRect();
    };

    /*
    			rotate up
     */
    obj.rotateUp = function() {
      var r;
      r = obj.rotation;
      if (obj.rotX === -270) {
        r.x = 0;
        obj.rotX = 0;
      } else {
        r.x -= rad(90);
        obj.rotX -= 90;
      }
      return obj.updateRectX();
    };

    /*
    			rotate down
     */
    obj.rotateDown = function() {
      var r;
      r = obj.rotation;
      if (obj.rotX === 270) {
        r.x = 0;
        obj.rotX = 0;
      } else {
        r.x += rad(90);
        obj.rotX += 90;
      }
      return obj.updateRectX();
    };

    /*
    			update scale arrows
     */
    obj.updateScaleArrows = function(scale) {
      var a, j, len, ref;
      ref = obj.scaleArrows;
      for (j = 0, len = ref.length; j < len; j++) {
        a = ref[j];
        a.position.x = obj.position.x;
        a.position.y = obj.position.y;
        a.position.z = obj.position.z;
      }
      obj.scaleArrows[0].position.x = obj.scaleArrows[0].position.x - (obj.rect.x / 2);
      obj.scaleArrows[1].position.x = obj.scaleArrows[1].position.x + obj.rect.x / 2;
      obj.scaleArrows[2].position.y = obj.scaleArrows[2].position.y - (obj.rect.y / 2);
      obj.scaleArrows[3].position.y = obj.scaleArrows[3].position.y + obj.rect.y / 2;
      obj.scaleArrows[4].position.z = obj.scaleArrows[4].position.z - (obj.rect.z / 2);
      return obj.scaleArrows[5].position.z = obj.scaleArrows[5].position.z + obj.rect.z / 2;
    };

    /*
    			show scale arrows
     */
    obj.showScaleArrows = function() {
      var a, j, len, ref;
      ref = obj.scaleArrows;
      for (j = 0, len = ref.length; j < len; j++) {
        a = ref[j];
        a.visible = true;
      }
    };

    /*
    			hide scale arrows
     */
    obj.hideScaleArrows = function() {
      var a, j, len, ref;
      ref = obj.scaleArrows;
      for (j = 0, len = ref.length; j < len; j++) {
        a = ref[j];
        a.visible = false;
      }
    };

    /*
    			clear scale arrows color
     */
    obj.uncolor = function() {
      obj.scaleArrows[0].material.color.set(0xff0000);
      obj.scaleArrows[1].material.color.set(0xff0000);
      obj.scaleArrows[2].material.color.set(0x00ff00);
      obj.scaleArrows[3].material.color.set(0x00ff00);
      obj.scaleArrows[4].material.color.set(0x0000ff);
      return obj.scaleArrows[5].material.color.set(0x0000ff);
    };

    /*
    			do callback if exists
     */
    if (callback) {
      return callback(obj);
    }
  };

  /*
  		if it isn't an object from buffer
   */
  if (model !== void 0) {
    l.load('models/' + model, function(geo, d, dd, ddd) {
      var material, texture, textureLoader;
      textureLoader = new THREE.TextureLoader;
      texture = textureLoader.load('textures/' + modelTexture, function() {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        return texture.anisotropy = 16;
      });
      material = new THREE.MeshPhongMaterial({
        map: texture,
        emissive: 0x000000
      });
      obj = new THREE.Mesh(geo, material);
      obj.texturePath = 'textures/' + modelTexture;
      obj.hightlighter = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
        side: THREE.BackSide,
        color: 0x000000
      }));
      scene.add(obj.hightlighter);
      obj.hightlighter.visible = false;
      return create(obj);
    });
  }

  /*
  		if it is an object from buffer
   */
  if (model === void 0 && typeof size === 'object') {
    obj = size;
    create(obj, modelTexture);
  }
  return obj;
})();

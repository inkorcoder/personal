var OBJ;

(OBJ = function(model, size, modelTexture, callback) {
  var cube, l;
  cube = {};
  l = new THREE.JSONLoader();
  if (model !== void 0) {
    l.load('models/' + model, function(geo) {
      var material, texture, textureLoader;
      textureLoader = new THREE.TextureLoader();
      texture = textureLoader.load("textures/" + modelTexture, function() {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        return texture.anisotropy = 16;
      });
      material = new THREE.MeshPhongMaterial({
        map: texture,
        emissive: 0x000000
      });
      cube = new THREE.Mesh(geo, material);
      cube.texturePath = "textures/" + modelTexture;
      cube.hightlighter = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
        side: THREE.BackSide,
        color: 0x000000
      }));
      scene.add(cube.hightlighter);
      cube.hightlighter.visible = false;
      cube.scale.set(1, 1, 1);
      cube.collisions = {
        x: false,
        X: false,
        y: false,
        Y: false,
        z: false,
        Z: false
      };
      cube.objectName = 'Введите название элемента';
      cube.setTexture = function(path) {
        textureLoader = new THREE.TextureLoader();
        texture = textureLoader.load(path, function() {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          return texture.repeat.set(1, 1);
        });
        return cube.material.map = texture;
      };
      cube._setRects = function(isFirst) {
        var bbox;
        cube.rotation.y = 0;
        bbox = new THREE.Box3().setFromObject(cube);
        size = {
          x: bbox.max.x - bbox.min.x,
          y: bbox.max.y - bbox.min.y,
          z: bbox.max.z - bbox.min.z
        };
        if (isFirst) {
          cube._firstRect = {
            x: size.x,
            y: size.y,
            z: size.z
          };
        }
        cube._rect = {
          x: size.x,
          y: size.y,
          z: size.z
        };
        return cube.rect = {
          x: size.x,
          y: size.y,
          z: size.z
        };
      };
      cube._setRects(true);
      cube.rot = 0;
      cube.rotX = 0;
      cube._updateRect = function(R) {
        var r, scale;
        scale = {
          x: R.x / cube._firstRect.x,
          y: R.y / cube._firstRect.y,
          z: R.z / cube._firstRect.z
        };
        cube.scale.set(scale.x, scale.y, scale.z);
        r = cube.rotation.y;
        cube._setRects();
        return cube.rotation.y = r;
      };
      cube.updateRect = function(newRect) {
        if (newRect) {
          cube._updateRect(newRect);
        }
        if (cube.rot === 90 || cube.rot === -90 || cube.rot === 270 || cube.rot === -270) {
          cube.rect = {
            x: cube._rect.z,
            y: cube._rect.y,
            z: cube._rect.x
          };
        } else {
          cube.rect = {
            x: cube._rect.x,
            y: cube._rect.y,
            z: cube._rect.z
          };
        }
        return cube.material.map.repeat.set((parseInt(cube.rect.x) > 0 ? parseInt(cube.rect.x) : 1), (parseInt(cube.rect.z) > 0 ? parseInt(cube.rect.z) : 1));
      };
      cube.updateRectX = function(newRect) {
        if (newRect) {
          cube._updateRect(newRect);
        }
        if (cube.rotX === 90 || cube.rotX === -90 || cube.rotX === 270 || cube.rotX === -270) {
          return cube.rect = {
            x: cube._rect.x,
            y: cube._rect.x,
            z: cube._rect.y
          };
        } else {
          return cube.rect = {
            x: cube._rect.x,
            y: cube._rect.y,
            z: cube._rect.z
          };
        }
      };
      cube.rotateLeft = function() {
        var _r, r;
        r = cube.rotation;
        _r = cube.hightlighter.rotation;
        if (cube.rot === 270) {
          r.y = 0;
          _r.y = 0;
          cube.rot = 0;
        } else {
          r.y += rad(90);
          _r.y += rad(90);
          cube.rot += 90;
        }
        return cube.updateRect();
      };
      cube.rotateRight = function() {
        var _r, r;
        r = cube.rotation;
        _r = cube.hightlighter.rotation;
        if (cube.rot === -270) {
          r.y = 0;
          _r.y = 0;
          cube.rot = 0;
        } else {
          r.y -= rad(90);
          _r.y -= rad(90);
          cube.rot -= 90;
        }
        return cube.updateRect();
      };
      cube.rotateUp = function() {
        var _r, r;
        r = cube.rotation;
        _r = cube.hightlighter.rotation;
        if (cube.rotX === -270) {
          r.x = 0;
          _r.x = 0;
          cube.rotX = 0;
        } else {
          r.x -= rad(90);
          _r.x -= rad(90);
          cube.rotX -= 90;
        }
        return cube.updateRectX();
      };
      cube.rotateDown = function() {
        var _r, r;
        r = cube.rotation;
        _r = cube.hightlighter.rotation;
        if (cube.rotX === 270) {
          r.x = 0;
          _r.x = 0;
          cube.rotX = 0;
        } else {
          r.x += rad(90);
          _r.x += rad(90);
          cube.rotX += 90;
        }
        return cube.updateRectX();
      };
      cube.updateScaleArrows = function(scale) {
        var a, j, len, ref;
        ref = cube.scaleArrows;
        for (j = 0, len = ref.length; j < len; j++) {
          a = ref[j];
          a.position.x = cube.position.x;
          a.position.y = cube.position.y;
          a.position.z = cube.position.z;
        }
        cube.scaleArrows[0].position.x = cube.scaleArrows[0].position.x - cube.rect.x / 2;
        cube.scaleArrows[1].position.x = cube.scaleArrows[1].position.x + cube.rect.x / 2;
        cube.scaleArrows[2].position.y = cube.scaleArrows[2].position.y - cube.rect.y / 2;
        cube.scaleArrows[3].position.y = cube.scaleArrows[3].position.y + cube.rect.y / 2;
        cube.scaleArrows[4].position.z = cube.scaleArrows[4].position.z - cube.rect.z / 2;
        return cube.scaleArrows[5].position.z = cube.scaleArrows[5].position.z + cube.rect.z / 2;
      };
      cube.showScaleArrows = function() {
        var a, j, len, ref, results;
        ref = cube.scaleArrows;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          a = ref[j];
          results.push(a.visible = true);
        }
        return results;
      };
      cube.hideScaleArrows = function() {
        var a, j, len, ref, results;
        ref = cube.scaleArrows;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          a = ref[j];
          results.push(a.visible = false);
        }
        return results;
      };
      cube.distancesPosition = function() {
        var c, i, j, len, ref, results;
        ref = cube.children[0].children[0].children;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          c = ref[i];
          results.push(console.log(c.position));
        }
        return results;
      };
      cube.uncolor = function() {
        cube.scaleArrows[0].material.color.set(0xff0000);
        cube.scaleArrows[1].material.color.set(0xff0000);
        cube.scaleArrows[2].material.color.set(0x00ff00);
        cube.scaleArrows[3].material.color.set(0x00ff00);
        cube.scaleArrows[4].material.color.set(0x0000ff);
        return cube.scaleArrows[5].material.color.set(0x0000ff);
      };
      if (callback) {
        return callback(cube);
      }
    });
  }
  return cube;
})();

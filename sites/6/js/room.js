var ROOM;

(ROOM = function(size, texture) {
  var __material, _geometry, _material, cube, geometry, material, textureLoader;
  textureLoader = new THREE.TextureLoader();
  texture = textureLoader.load("textures/side.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 16;
  if (size) {
    geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    material = new THREE.MeshPhongMaterial({
      side: THREE.BackSide,
      map: texture
    });
    $('#roomLength').html(size.z);
    $('#roomHeight').html(size.y);
    $('#roomWidth').html(size.x);
    cube = new THREE.Mesh(geometry, material);
    cube._firstRect = {
      x: size.x,
      y: size.y,
      z: size.z
    };
    cube.rect = {
      x: size.x,
      y: size.y,
      z: size.z
    };
    _geometry = new THREE.PlaneGeometry(100, 100, 10, 1);
    _material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    __material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    cube.setTexture = function(path) {
      textureLoader = new THREE.TextureLoader();
      texture = textureLoader.load(path, function() {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture.repeat.set(4, 4);
      });
      return cube.material.map = texture;
    };
    cube._updateRect = function(R) {
      var scale;
      scale = {
        x: R.x / cube._firstRect.x,
        y: R.y / cube._firstRect.y,
        z: R.z / cube._firstRect.z
      };
      cube.scale.set(scale.x, scale.y, scale.z);
      cube.rect = {
        x: R.x,
        y: R.y,
        z: R.z
      };
      if (grid) {
        grid.remove();
      }
      if (grid) {
        return grid.add();
      }
    };
    cube.name = 'room';
    cube.plane = new THREE.Mesh(_geometry, _material);
    cube.plane.side = THREE.FrontSide;
    scene.add(cube.plane);
    cube.planeX = new THREE.Mesh(new THREE.PlaneGeometry(200, 100, 1, 1), __material);
    cube.planeX.rotation.x = 1.6;
    scene.add(cube.planeX);
  }
  return cube;
})();

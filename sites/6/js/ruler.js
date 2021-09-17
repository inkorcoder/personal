var RULER;

RULER = function() {
  var bbox, geometry, material, size;
  this.distance = 0;
  this.center = new THREE.Vector3();
  this.enabled = false;
  this.start = new THREE.Mesh(new THREE.SphereGeometry(0.015, 20, 20), new THREE.MeshBasicMaterial({
    color: 0x000000
  }));
  this.start.name = 'ruler';
  this.start._scale = {x: 1, y: 1, z: 1};
  this.start.position.x = -1;
  this.start.rotation.y = 0;
  this.start.collisions = {
    x: false,
    X: false,
    y: false,
    Y: false,
    z: false,
    Z: false
  };
  bbox = new THREE.Box3().setFromObject(this.start);
  size = {
    x: bbox.max.x - bbox.min.x,
    y: bbox.max.y - bbox.min.y,
    z: bbox.max.z - bbox.min.z
  };
  this.start.rect = {
    x: size.x,
    y: size.y,
    z: size.z
  };
  this.end = new THREE.Mesh(new THREE.SphereGeometry(0.015, 20, 20), new THREE.MeshBasicMaterial({
    color: 0x000000
  }));
  this.end.name = 'ruler';
  this.end.position.x = 1;
  this.end._scale = {x: 1, y: 1, z: 1};
  this.end.collisions = {
    x: false,
    X: false,
    y: false,
    Y: false,
    z: false,
    Z: false
  };
  bbox = new THREE.Box3().setFromObject(this.end);
  size = {
    x: bbox.max.x - bbox.min.x,
    y: bbox.max.y - bbox.min.y,
    z: bbox.max.z - bbox.min.z
  };
  this.end.rect = {
    x: size.x,
    y: size.y,
    z: size.z
  };
  this.line = _line(this.start.position, this.end.position);
  this.line.material.color = new THREE.Color('#000');
  this.dynamicTexture = new THREEx.DynamicTexture(512, 128);
  this.dynamicTexture.context.font = "bold 104px Arial";
  this.dynamicTexture.texture.needsUpdate = true;
  this.dynamicTexture.texture.anisotropy = 16;
  geometry = new THREE.BoxGeometry(.0001, .022, .1);
  material = new THREE.MeshBasicMaterial({
    map: this.dynamicTexture.texture,
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  this.text = new THREE.Mesh(geometry, material);
  this.text.dynamicTexture = this.dynamicTexture;
  this.updateLine = (function(_this) {
    return function() {
      _this.distance = (_this.start.position.distanceTo(_this.end.position) * 100).toFixed(0)*10 + ' мм';
      scene.remove(_this.line);
      _this.line = _line(_this.start.position, _this.end.position);
      if (_this.enabled) {
        scene.add(_this.line);
      }
      _this.center = new THREE.Vector3((_this.start.position.x + _this.end.position.x) / 2, (_this.start.position.y + _this.end.position.y) / 2, (_this.start.position.z + _this.end.position.z) / 2);
      _this.text.position.x = _this.center.x;
      _this.text.position.y = _this.center.y + 0.01 * _SCALE;
      _this.text.position.z = _this.center.z;
      return _this.text.lookAt(new THREE.Vector3(_this.end.position.x, _this.end.position.y + 0.01 * _SCALE, _this.end.position.z));
    };
  })(this);
  this.enable = (function(_this) {
    return function() {
      _this.enabled = true;
      scene.add(_this.start);
      scene.add(_this.end);
      scene.add(_this.text);
      return scene.add(_this.line);
    };
  })(this);
  this.disable = (function(_this) {
    return function() {
      _this.enabled = false;
      scene.remove(_this.start);
      scene.remove(_this.end);
      scene.remove(_this.text);
      return scene.remove(_this.line);
    };
  })(this);
  return this;
};

var Hint, hints;

Hint = function(x, y, z, type, name) {
  var geometry, material;
  this.name = 'hint';
  this.value = new THREEx.DynamicTexture((!name ? 512 : 2048), 128);
  this.value.context.font = "bold 104px Arial";
  this.value.texture.needsUpdate = true;
  this.value.texture.anisotropy = 16;
  geometry = new THREE.BoxGeometry(x, y, z);
  material = new THREE.MeshBasicMaterial({
    map: this.value.texture,
    transparent: true,
    color: 0x000000,
    depthTest: false,
    depthWrite: false,
    side: THREE.FrontSide
  });
  this.text = new THREE.Mesh(geometry, material);
  this.text.dynamicTexture = this.value;
  this.text.name = 'hint';
  if ((type === 'z') || (type === 'Z') || (type === 'y') || (type === 'Y')) {
    this.text.rotation.y = Math.PI / 2;
  }
  if ((type === 'y') || (type === 'Y')) {
    this.text.rotation.x = Math.PI / 2;
  }
  this.set = function(val) {
    this.value.clear('#000');
    this.value.drawText(val, null, 100, '#ffffff');
    return this.text.material.alphaMap = this.value.texture;
  };
  return this;
};

hints = {};

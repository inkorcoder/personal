var Importer;

Importer = {
  imageLoader: new THREE.TextureLoader(),
  setRotation: function(mesh, rot, rotX) {
    switch (rot) {
      case 90:
        mesh.rotateLeft();
        break;
      case 270:
        mesh.rotateLeft();
        mesh.rotateLeft();
        mesh.rotateLeft();
        break;
      case -90:
        mesh.rotateRight();
        break;
      case -270:
        mesh.rotateRight();
        mesh.rotateRight();
        mesh.rotateRight();
    }
    switch (rotX) {
      case 90:
        mesh.rotateDown();
        break;
      case 270:
        mesh.rotateDown();
        mesh.rotateDown();
        mesh.rotateDown();
        break;
      case -90:
        mesh.rotateUp();
        break;
      case -270:
        mesh.rotateUp();
        mesh.rotateUp();
        mesh.rotateUp();
    }
  },
  parseHexString: function(str) {
    var result;
    result = [];
    while (str.length >= 2) {
      result.push(parseInt(str.substring(0, 2), 16));
      str = str.substring(2, str.length);
    }
    return result;
  },
  createHexString: function(arr) {
    var i, result, str;
    result = '';
    for (i in arr) {
      str = arr[i].toString(16);
      str = str.length === 0 ? '00' : str.length === 1 ? '0' + str : str.length === 2 ? str : str.substring(str.length - 2, str.length);
      result += str;
    }
    return result;
  },
  addVertices: function(array, geometry) {
    var a, j, len, results, v;
    results = [];
    for (j = 0, len = array.length; j < len; j++) {
      a = array[j];
      v = new THREE.Vector3(a.x, a.y, a.z);
      results.push(geometry.vertices.push(v));
    }
    return results;
  },
  addFaces: function(array, geometry) {
    var a, j, len, results;
    results = [];
    for (j = 0, len = array.length; j < len; j++) {
      a = array[j];
      results.push(geometry.faces.push(a));
    }
    return results;
  },
  _createBasicMaterial: function(material) {
    return new THREE.MeshBasicMaterial();
  },
  _createPhongMaterial: function(material) {
    return new THREE.MeshPhongMaterial();
  },
  generateMaterial: function(material) {
    var texture, textureImage;
    textureImage = material.map.substring(material.map.indexOf('textures/') + 9);
    switch (material.type) {
      case 'MeshBasicMaterial':
        material = this._createBasicMaterial(material);
        break;
      case 'MeshPhongMaterial':
        material = this._createPhongMaterial(material);
    }
    texture = this.imageLoader.load('textures/' + textureImage, function() {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      return texture.anisotropy = 16;
    });
    material.map = texture;
    return material;
  },
  generateObject: function(mesh, map, m) {
    var clone, object;
    clone = mesh.clone(mesh);
    object = new OBJ(void 0, clone, map);
    object.scaleArrows = ScaleArrows(object);
    object.position.x = m.position.x;
    object.position.y = m.position.y;
    object.position.z = m.position.z;
    scene.add(object);
    scene.add(object.hint.text);
    OBJECTS.push(object);
    return object;
  },
  "import": function(object, scene) {
    var geometry, isRepeated, j, k, len, len1, m, material, mesh, r, ref, repeats, result, results;
    repeats = [];
    ref = object.meshes;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      m = ref[j];
      isRepeated = false;
      for (k = 0, len1 = repeats.length; k < len1; k++) {
        r = repeats[k];
        if (r === m.timestamp && !isRepeated) {
          isRepeated = true;
        }
      }
      if (!isRepeated) {
        geometry = new THREE.Geometry();
        geometry.faceVertexUvs = m.geometry.faceVertexUvs;
        material = this.generateMaterial(m.material);
        this.addVertices(m.geometry.vertices, geometry);
        this.addFaces(m.geometry.faces, geometry);
        mesh = new THREE.Mesh(geometry, material);
        result = this.generateObject(mesh, '', m);
        result.fixedFloor = m.fixedFloor;
        result.floorDistance = m.floorDistance;
        result.objectName = m.objectName;
        result.texturePath = m.texturePath;
        result.timestamp = m.timestamp;
        result.corners = m.corners;
        result.hole = m.hole;
        result.holeType = m.holeType;
        result.scale.set(m.scale.x, m.scale.y, m.scale.z);
        this.setRotation(result, m.rot, m.rotX);
        results.push(repeats.push(m.timestamp));
      } else {
        results.push(void 0);
      }
    }
    return results;
  }
};

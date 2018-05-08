var Exporter;

Exporter = {
  cache: "",
  result: {
    meshes: []
  },
  traverse: function(arr) {
    var a, i, len, res;
    res = [];
    for (i = 0, len = arr.length; i < len; i++) {
      a = arr[i];
      res.push(a);
    }
    return res;
  },
  getVertices: function(mesh) {
    return this.traverse(mesh.geometry.vertices);
  },
  getFaces: function(mesh) {
    return this.traverse(mesh.geometry.faces);
  },
  getPosition: function(mesh) {
    return {
      x: mesh.position.x,
      y: mesh.position.y,
      z: mesh.position.z
    };
  },
  getRotation: function(mesh) {
    return {
      x: mesh.rotation.x,
      y: mesh.rotation.y,
      z: mesh.rotation.z
    };
  },
  _getColor: function(color) {
    if (color) {
      return color.getHexString();
    } else {
      return '000000';
    }
  },
  getMaterial: function(mesh) {
    return {
      anisotropy: mesh.material.map ? mesh.material.map.anisotropy : void 0,
      type: mesh.material.type,
      color: this._getColor(mesh.material.color),
      emissive: this._getColor(mesh.material.emissive),
      side: mesh.material.side,
      map: mesh.material.map ? mesh.material.map.image.currentSrc : void 0,
      repeat: mesh.material.map ? mesh.material.map.repeat : {
        height: 1,
        width: 1,
        x: 1,
        y: 1
      }
    };
  },
  parseMesh: function(mesh) {
    var obj;
    obj = {
      geometry: {
        vertices: this.getVertices(mesh),
        faces: this.getFaces(mesh),
        faceVertexUvs: mesh.geometry.faceVertexUvs
      },
      material: this.getMaterial(mesh),
      position: this.getPosition(mesh),
      rotation: this.getRotation(mesh),
      fixedFloor: mesh.fixedFloor,
      floorDistance: mesh.floorDistance,
      objectName: mesh.objectName,
      rot: mesh.rot,
      rotX: mesh.rotX,
      texturePath: mesh.texturePath,
      timestamp: mesh.timestamp,
      corners: mesh.corners,
      hole: mesh.hole,
      scale: mesh.scale,
      holeType: mesh.holeType
    };
    return this.result.meshes.push(obj);
  },
  "export": function(scene) {
    var i, isRepeated, j, len, len1, obj, r, ref, repeats;
    repeats = [];
    ref = scene.children;
    for (i = 0, len = ref.length; i < len; i++) {
      obj = ref[i];
      isRepeated = false;
      for (j = 0, len1 = repeats.length; j < len1; j++) {
        r = repeats[j];
        if ((r.uuid === obj.uuid) || (r.timestamp === obj.timestamp)) {
          isRepeated = true;
        }
      }
      if (obj.isObject && !isRepeated) {
        this.parseMesh(obj);
        repeats.push(obj);
      }
    }
    return JSON.stringify(this.result, true);
  }
};

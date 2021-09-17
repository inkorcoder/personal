var UTILS;

UTILS = {
  grid: function(count, size) {
    var c, g, geometry, i, j, line, material, ref, ref1, ref2, ref3, x, z;
    material = new THREE.LineBasicMaterial({
      color: 0x333333
    });
    geometry = new THREE.Geometry();
    for (x = i = ref = -count, ref1 = count + 1; ref <= ref1 ? i < ref1 : i > ref1; x = ref <= ref1 ? ++i : --i) {
      c = x;
      x *= size;
      g = new THREE.Geometry();
      g.vertices.push(new THREE.Vector3(x, 0, Math.abs(c) % 2 === 1 ? -count * size : count * size));
      g.vertices.push(new THREE.Vector3(x, 0, Math.abs(c) % 2 === 1 ? count * size : -count * size));
      geometry.merge(g);
    }
    for (z = j = ref2 = -count, ref3 = count + 1; ref2 <= ref3 ? j < ref3 : j > ref3; z = ref2 <= ref3 ? ++j : --j) {
      c = z;
      z *= size;
      g = new THREE.Geometry();
      g.vertices.push(new THREE.Vector3((Math.abs(c) % 2 === 1 ? -count * size : count * size), 0, z));
      g.vertices.push(new THREE.Vector3((Math.abs(c) % 2 === 1 ? count * size : -count * size), 0, z));
      geometry.merge(g);
    }
    line = new THREE.Line(geometry, material);
    return line;
  }
};

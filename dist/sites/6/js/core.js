
/*
	variables
 */
var CACHE, COPY, LINES, OBJECTS, SCALE, TIMES, ZOOM, _SCALE, a_, activeObject, axisHelper, camera, cameraFirstCoordinates, control, controls, grid, hole, lastObjsLength, lastPosY, light, pointLight, render, renderer, room, ruler, scene, stickness, webglAvailable;

TIMES = [];

SCALE = 0;

_SCALE = 0;

CACHE = [];

COPY = false;

scene = new THREE.Scene;

camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);

OPTIONS.hints = {
  x: {
    enabled: true,
    width: 1
  },
  y: {
    enabled: true,
    width: 1
  },
  z: {
    enabled: true,
    width: 1
  }
};


/*
	check and run webgl
 */

webglAvailable = function() {
  var canvas, e, error;
  try {
    canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (error) {
    e = error;
    return false;
  }
};

if (webglAvailable()) {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('webglRender').appendChild(renderer.domElement);
  renderer.setPixelRatio(window.devicePixelRatio);
} else {
  alert('Ваш браузер не поддерживает технологию WEBGL');
}


/* room */

room = new ROOM({
  x: parseFloat($('#roomLengthInput').val()) / 10,
  z: parseFloat($('#roomWidthInput').val()) / 10,
  y: parseFloat($('#roomHeightInput').val()) / 10
}, 'side.jpg');

scene.add(room);

updateRoomProperties();


/* objects */

OBJECTS = [];

activeObject = null;

window.currentZoom = 0;

window.currentZoomOld = 0;

lastObjsLength = 0;

ZOOM = {
  max: 60,
  min: -40
};

stickness = 0.1;

updateSticknessVal();


/* lights */

camera.position.z = room.rect.z / 2 * 2;

camera.position.y = room.rect.y;

light = new THREE.AmbientLight(0x999999);

scene.add(light);

pointLight = new THREE.PointLight(0xffffff, 0.5, 5000);

pointLight.position.set(0, room.rect.y / 3, 0);

scene.add(pointLight);


/* ruler */

ruler = new RULER;


/* hole maker */

hole = null;


/*
	objects lines
 */

LINES = {
  x: [],
  X: [],
  z: [],
  Z: [],
  _x: [],
  _X: [],
  _z: [],
  _Z: [],
  y: [],
  Y: []
};


/*grid */

grid = new GRID;


/* controls */

control = new THREE.TransformControls(camera, renderer.domElement);

scene.add(control);

control.enabled = false;

axisHelper = new THREE.AxisHelper(1);

controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.enabled = false;


/* hints */

hints.x = new Hint(0.06, 0.02, 0.0001, 'x');

scene.add(hints.x.text);

hints.z = new Hint(0.06, 0.02, 0.0001, 'z');

scene.add(hints.z.text);

hints.y = new Hint(0.06, 0.02, 0.0001, 'y');

scene.add(hints.y.text);

hints.X = new Hint(0.06, 0.02, 0.0001, 'X');

scene.add(hints.X.text);

hints.Z = new Hint(0.06, 0.02, 0.0001, 'Z');

scene.add(hints.Z.text);

hints.Y = new Hint(0.06, 0.02, 0.0001, 'Y');

scene.add(hints.Y.text);

cameraFirstCoordinates = {
  position: new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z),
  rotation: camera.rotation.clone()
};

lastPosY = 0;

a_ = 0;


/*
	renderer
 */

render = function() {
  var O, S, arrow, c, i, j, k, l, len, len1, len2, len3, len4, len5, m, n, o, oScale, ref, ref1;
  requestAnimationFrame(render);
  SCALE = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
  ruler.updateLine();
  ruler.text.dynamicTexture.clear('#333');
  ruler.text.dynamicTexture.drawText(ruler.distance, null, 100, '#ffffff');
  S = control.object ? camera.position.distanceTo(control.object.position) : 0.01;
  if (OPTIONS.hints.x.enabled) {
    hints.x.text.scale.set(S, S, S);
  } else {
    hints.x.text.scale.set(0.001, 0.001, 0.001);
  }
  if (OPTIONS.hints.x.enabled) {
    hints.X.text.scale.set(S, S, S);
  } else {
    hints.X.text.scale.set(0.001, 0.001, 0.001);
  }
  if (OPTIONS.hints.y.enabled) {
    hints.y.text.scale.set(S, S, S);
  } else {
    hints.y.text.scale.set(0.001, 0.001, 0.001);
  }
  if (OPTIONS.hints.y.enabled) {
    hints.Y.text.scale.set(S, S, S);
  } else {
    hints.Y.text.scale.set(0.001, 0.001, 0.001);
  }
  if (OPTIONS.hints.z.enabled) {
    hints.z.text.scale.set(S, S, S);
  } else {
    hints.z.text.scale.set(0.001, 0.001, 0.001);
  }
  if (OPTIONS.hints.z.enabled) {
    hints.Z.text.scale.set(S, S, S);
  } else {
    hints.Z.text.scale.set(0.001, 0.001, 0.001);
  }
  hints.x.set('');
  hints.y.set('');
  hints.z.set('');
  hints.X.set('');
  hints.Y.set('');
  hints.Z.set('');
  camera.updateProjectionMatrix();
  control.update();
  if (room.plane) {
    room.plane.rotation.x = camera.rotation.x;
    room.plane.rotation.y = camera.rotation.y;
    room.plane.rotation.z = camera.rotation.z;
  }
  if (control.object && control.object.scaleArrows) {
    control.object.updateScaleArrows(SCALE);
    ref = control.object.scaleArrows;
    for (i = 0, len = ref.length; i < len; i++) {
      arrow = ref[i];
      arrow.scale.set(SCALE, SCALE, SCALE);
    }
    if (camera.fov === 1) {
      ref1 = control.object.scaleArrows;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        arrow = ref1[j];
        arrow.scale.set(0.01 * SCALE, 0.01 * SCALE, 0.01 * SCALE);
      }
    }
  }
  if (camera.fov === 1) {
    controls.enabled = false;
    hints.x.text.scale.set(0.00001, 0.00001, 0.00001);
    hints.y.text.scale.set(0.00001, 0.00001, 0.00001);
    hints.z.text.scale.set(0.00001, 0.00001, 0.00001);
    hints.X.text.scale.set(0.00001, 0.00001, 0.00001);
    hints.Y.text.scale.set(0.00001, 0.00001, 0.00001);
    hints.Z.text.scale.set(0.00001, 0.00001, 0.00001);
  }
  if (room && room.planeY) {
    room.planeY.rotation.y = camera.rotation.y;
  }
  for (k = 0, len2 = OBJECTS.length; k < len2; k++) {
    o = OBJECTS[k];
    if (o.position.y - (o.rect.y / 2) < -room.rect.y / 2) {
      o.position.y = -room.rect.y / 2 + o.rect.y / 2;
    }
    if (o.position.x - (o.rect.x / 2) < -room.rect.x / 2) {
      o.position.x = -room.rect.x / 2 + o.rect.x / 2;
    }
    if (o.position.z - (o.rect.z / 2) < -room.rect.z / 2) {
      o.position.z = -room.rect.z / 2 + o.rect.z / 2;
    }
  }
  _SCALE = camera.position.distanceTo(ruler.center);
  if (camera.fov !== 1) {
    ruler.start.scale.set(_SCALE, _SCALE, _SCALE);
    ruler.end.scale.set(_SCALE, _SCALE, _SCALE);
    ruler.text.scale.set(_SCALE, _SCALE, _SCALE);
  } else {
    ruler.text.rotation.x = -Math.PI / 2;
    ruler.text.rotation.y = Math.PI / 2;
    ruler.text.rotation.z = 0;
  }
  for (l = 0, len3 = OBJECTS.length; l < len3; l++) {
    o = OBJECTS[l];
    oScale = camera.position.distanceTo(o.position);
    o.hint.text.rotation.y = 0;
    o.hint.text.rotation.x = 0;
    o.hint.text.position.x = o.position.x;
    o.hint.text.position.y = o.position.y + o.rect.y / 2 + oScale * 0.01;
    o.hint.text.position.z = o.position.z - (o.rect.z / 2);
    o.hint.text.scale.set(oScale, oScale, oScale);
    o.hint.set(o.objectName);
    if (camera.fov === 1) {
      o.hint.text.scale.set(oScale / 50, oScale / 50, oScale / 50);
      o.hint.text.rotation.x = -Math.PI / 2;
      o.hint.text.position.z = o.position.z - (o.rect.z / 2) - (oScale * 0.0002);
    }
  }
  O = control.object;
  if (typeof O !== 'undefined') {
    if (CACHE.length > 0) {
      for (m = 0, len4 = CACHE.length; m < len4; m++) {
        c = CACHE[m];
        if (c.uuid !== control.object.uuid) {
          if (c.pos) {
            c.position.x = control.position.x + c.pos.x;
            c.position.y = control.position.y + c.pos.y;
            c.position.z = control.position.z + c.pos.z;
          }
        }
      }
    }
  }
  $('#groupLength').html(CACHE.length > 0 ? 'В группе: ' + CACHE.length : 'Группа не выбрана');
  if (camera.fov === 1) {
    camera.rotation.x = -1.570;
    camera.rotation.y = 0;
    camera.position.x = 0;
    camera.position.z = 0;
    camera.position.y = camera.position.y;
  }
  if (control.object && $('#fixedFloorDistanceChecker').prop('checked')) {
    updateObjectDistances(control, 1);
  }
  for (n = 0, len5 = OBJECTS.length; n < len5; n++) {
    o = OBJECTS[n];
    if (o.fixedFloor) {
      o.position.y = -room.rect.y / 2 + o.rect.y / 2 + parseFloat(o.floorDistance / 100);
    }
  }
  renderer.render(scene, camera);
};

render();

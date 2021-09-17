var INSTRUMENT, KEYS, OPTIONS, RENDER, _bindCalc, ambient, asideWidth, axis, calc, camera, colorPopup, controls, cube, geometry, i, imgLoader, j, k, lastTime, len, len1, light, loader, mainHeader, material, obj, onWindowResize, random, ref, ref1, render, renderer, scene, title, vueRenderer;

ref = document.querySelectorAll('[data-title]');
for (j = 0, len = ref.length; j < len; j++) {
  title = ref[j];
  title.onmouseover = function() {
    var hint, rect, text;
    text = this.getAttribute('data-title');
    hint = document.createElement('div');
    hint.className = 'hint';
    hint.innerHTML = text;
    document.body.appendChild(hint);
    rect = this.getBoundingClientRect();
    hint.style.left = rect.left + rect.width / 2 + 'px';
    hint.style.top = rect.top + rect.height + 'px';
    setTimeout(function() {
      return hint.classList.add('active');
    }, 1000);
  };
  title.onmouseout = function() {
    var hint, k, len1, ref1;
    ref1 = document.getElementsByClassName('hint');
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      hint = ref1[k];
      hint.classList.remove('active');
      setTimeout(function() {
        return document.body.removeChild(hint);
      }, 100);
    }
  };
}

_bindCalc = function(calc) {
  var input, minus, plus;
  input = calc.previousElementSibling;
  plus = calc.querySelector('.plus');
  minus = calc.querySelector('.minus');
  plus.addEventListener('mousedown', function() {
    var val;
    val = parseInt(input.value) ? parseInt(input.value) : 0;
    return input.value = val + 1;
  });
  minus.addEventListener('mousedown', function() {
    var val;
    val = parseInt(input.value) && parseInt(input.value) > 0 ? parseInt(input.value) : 1;
    return input.value = val - 1;
  });
};

ref1 = document.querySelectorAll('.calc');
for (k = 0, len1 = ref1.length; k < len1; k++) {
  calc = ref1[k];
  _bindCalc(calc);
}

Object.prototype.getName = function() {
  var funcNameRegex, results;
  funcNameRegex = /function (.{1,})\(/;
  results = funcNameRegex.exec(this.constructor.toString());
  if (results && results.length > 1) {
    return results[1];
  } else {
    return "";
  }
};

colorPopup = {};

mainHeader = {};

vueRenderer = {};

OPTIONS = {
  leftAside: true,
  rightAside: false
};

RENDER = {
  isPlaying: false
};

INSTRUMENT = '';

asideWidth = {
  left: 260,
  right: 260
};

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100000);

axis = new THREE.AxisHelper(200);

scene.add(axis);

renderer = new THREE.WebGLRenderer({
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('renderWrapper').appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);

random = function(min, max) {
  var rand;
  return rand = min + Math.random() * (max - min);
};

document.addEventListener('contextmenu', function(e) {
  return e.preventDefault();
});

geometry = new THREE.BoxGeometry(10, 10, 10);

material = new THREE.MeshNormalMaterial();

loader = new THREE.JSONLoader();

imgLoader = new THREE.TextureLoader();

cube = new THREE.Object3D();

light = new THREE.PointLight(0xffffff, 1, 1000);

ambient = new THREE.AmbientLight(0x555555);

light.position.set(50, 10, 50);

scene.add(light);

scene.add(ambient);

camera.position.x = 10;

camera.position.y = 10;

camera.position.z = 10;

KEYS = {};

document.addEventListener('keydown', function(e) {
  var ev;
  ev = e.code.toLowerCase().replace(/(Key|Arrow)/gim, '');
  return KEYS[ev] = true;
});

document.addEventListener('keyup', function(e) {
  var ev;
  ev = e.code.toLowerCase().replace(/(Key|Arrow)/gim, '');
  return KEYS[ev] = false;
});

lastTime = new Date().getTime();

i = 0;

render = function() {
  var difference, newTime;
  requestAnimationFrame(render);
  newTime = new Date().getTime();
  difference = newTime - lastTime;
  lastTime = newTime;
  if (window.infoBar && i % 10 === 1) {
    infoBar.fps = difference;
  }
  if (KEYS.up) {
    controls.pan(new THREE.Vector2(0, 10));
  }
  if (KEYS.down) {
    controls.pan(new THREE.Vector2(0, -10));
  }
  if (KEYS.left) {
    controls.pan(new THREE.Vector2(10, 0));
  }
  if (KEYS.right) {
    controls.pan(new THREE.Vector2(-10, 0));
  }
  renderer.render(scene, camera);
  controls.update();
  return i++;
};

render();

obj = cube;

onWindowResize = function(e) {
  vueRenderer.setViewport();
};

window.addEventListener('resize', onWindowResize, false);

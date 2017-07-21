var PAGE, _CACHE, axis, cancelFullscreen, clickHandler, controlsUpdate, disableGroupSelect, fixedFloorDistanceFunction, getCoordinates, launchFullScreen, pos, raycaster, scaleHandler, scalePerentHandler, setObjectName, setOptions, updateCachedObjects, updateRangeSlider, updateRoomProperties, updateSticknessVal;

var isContextMenu = false;

window.onresize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  return renderer.setSize(window.innerWidth, window.innerHeight);
};

raycaster = new THREE.Raycaster();

getCoordinates = function(ev) {
  var mouse;
  mouse = new THREE.Vector2();
  mouse.y = -(ev.clientY / renderer.domElement.height) * 2 + 1;
  mouse.x = (ev.clientX / renderer.domElement.width) * 2 - 1;
  return mouse;
};

updateCachedObjects = function() {
  var O, P, c, j, len, p;
  O = control.object;
  if (typeof O !== 'undefined') {
    P = O.position;
    for (j = 0, len = CACHE.length; j < len; j++) {
      c = CACHE[j];
      p = c.position;
      c.pos = {
        x: -(P.x - p.x),
        y: -(P.y - p.y),
        z: -(P.z - p.z)
      };
    }
  }
};

disableGroupSelect = function() {
  var j, len, o;
  for (j = 0, len = OBJECTS.length; j < len; j++) {
    o = OBJECTS[j];
    o.material.opacity = 1;
  }
  CACHE.splice(0, CACHE.length);
};

clickHandler = function(event) {
  var OBJS, a, intersects, j, k, len, len1, mouse, o, ref, rightclick;
  event.preventDefault();
  event.stopPropagation();
  mouse = getCoordinates(event);
  raycaster.setFromCamera(mouse, camera);
  OBJS = new Array();
  for (j = 0, len = OBJECTS.length; j < len; j++) {
    o = OBJECTS[j];
    OBJS.push(o);
  }
  // OBJS.push(hole);
  OBJS.push(ruler.start);
  OBJS.push(ruler.end);
  if (control.object && control.object.name !== 'ruler' && control.object.name !== 'hole') {
    ref = control.object.scaleArrows;
    if (ref){
      for (k = 0, len1 = ref.length; k < len1; k++) {
        a = ref[k];
        OBJS.push(a);
      }
    }
  }
  intersects = raycaster.intersectObjects(OBJS);
  if (intersects.length > 0) {
    if (intersects[0].object.type !== 'cylinder') {
      control.attach(intersects[0].object);
      setObjectName();
      if (event.ctrlKey && !COPY) {
        CACHE.push(control.object);
        control.object.material.opacity = 0.6;
        updateCachedObjects();
      } else {
        disableGroupSelect();
      }
    }
    if (event.which) {
      rightclick = event.which === 3;
    } else if (event.button) {
      rightclick = event.button === 2;
    }
    $('body').addClass('uncursor');
  } else {
    control.detach();
    $('body').removeClass('uncursor');
    $('#contextmenu').removeClass('active');
    disableGroupSelect();
    if (camera.fov === 1) {
      camera.lastRot = camera.lastRot ? camera.lastRot : 0;
      $(document).on('mousemove touchmove', function(e) {
        e.preventDefault();
        if (e.shiftKey){
          if (camera.lastRot < e.pageY) {
            camera.rotation.z += 0.05;
          } else {
            camera.rotation.z -= 0.05;
          }
          camera.lastRot = e.pageY;
        }
      });
    }
  }
  if (control.object) {
    if (CACHE.length <= 1) {
      collision(control.object, OBJECTS);
    }
    enableObjectControls();
    setObjectName();
    if (camera.fov === 1) {
      $(document).on('mousemove touchmove', function(e) {
        var pos;
        e.preventDefault();
        controls.enabled = false;
        mouse = getCoordinates(e);
        pos = getXY(e);
        pos.y = control.object.position.y;
        if (!$('#scale').hasClass('active')) {
          control.object.position.x = pos.x;
          control.object.position.z = pos.z;
          controlsUpdate(pos);
        }
      });
    }
  } else {
    disableObjectControls();
  }
};

$(document).on('mousedown touchstart', 'canvas', clickHandler);

// $(document).off('contextmenu');

$(document).on('contextmenu', function(event) {
  var OBJS, a, intersects, j, k, len, len1, mouse, o, rect, ref, rightclick;
  event.preventDefault();
  event.stopPropagation();
  mouse = getCoordinates(event);
  raycaster.setFromCamera(mouse, camera);
  OBJS = new Array();
  for (j = 0, len = OBJECTS.length; j < len; j++) {
    o = OBJECTS[j];
    OBJS.push(o);
  }
  // OBJS.push(hole);
  if (control.object) {
    ref = control.object.scaleArrows;
    if (ref) {
      for (k = 0, len1 = ref.length; k < len1; k++) {
        a = ref[k];
        OBJS.push(a);
      }
    }
  }
  intersects = raycaster.intersectObjects(OBJS);
  if (intersects.length > 0) {
    if (intersects[0].object.type !== 'cylinder') {
      control.attach(intersects[0].object);
      setObjectName();
    }
    if (event.which) {
      rightclick = event.which === 3;
    } else if (event.button) {
      rightclick = event.button === 2;
    }
    if (rightclick) {
      isContextMenu = true;
      if (control.object.name === 'hole'){
        $('#contextmenu [data-for-type="obj"]').hide();
        $('#contextmenu [data-for-type="hole"]').show();
      } else {
        $('#contextmenu [data-for-type="hole"]').hide();
        $('#contextmenu [data-for-type="obj"]').show();
        $('.popup').removeClass('active');
        $('#objectLength').val((control.object._rect.x*100).toFixed(0));
        $('#objectWidth').val((control.object._rect.y*100).toFixed(0));
        $('#objectHeight').val((control.object._rect.z*100).toFixed(0));
        rect = $('#contextmenu')[0].getBoundingClientRect();
        D = control.object.distances;
        $('[data-object-hole]','#propertiesPopup').hide();
        if (control.object.holeType === 'circle') {
          $('[data-object-hole="circle"]','#propertiesPopup').show();
        }
        if (control.object.holeType === 'triangle') {
          $('[data-object-hole="triangle"]','#propertiesPopup').show();
        }
        if (control.object.holeType === 'box') {
          $('[data-object-hole="box"]','#propertiesPopup').show();
        }
        $('#objectFloorSpace')[0].checked = false;
        $('#objectSpaceHeight').val(control.object.floorDistance);

        if (control.object.fixedFloor){
          $('#objectFloorSpace')[0].checked = true;
        }
        $('#objectDistanceLeft').val(D.X);
        $('#objectDistanceRight').val(D.x);
        $('#objectDistanceFront').val(D.Z);
        $('#objectDistanceRear').val(D.z);
        $('#objectDistanceTop').val(D.Y);
        $('#objectDistanceBottom').val(D.y);
        $('#sideFront')[0].checked = control.object.corners.sides.front;
        $('#sideRear')[0].checked = control.object.corners.sides.rear;
        $('#sideLeft')[0].checked = control.object.corners.sides.left;
        $('#sideRight')[0].checked = control.object.corners.sides.right;
        if (control.object.hole){
          $('.holeRadius').html(control.object.hole.radius);
          $('.holeDiameter').html(control.object.hole.diameter);
          $('.holeArea').html(control.object.hole.area);
          $('.holeSideA').html(control.object.hole.a);
          $('.holeSideB').html(control.object.hole.b);
          $('.holeSideC').html(control.object.hole.c);
        }
      }
      $('#contextmenu').css({
        marginLeft: 0,
        top: event.pageY < window.innerHeight ? event.pageY : window.innerHeight - rect.height - 40,
        left: event.pageX < window.innerWidth ? event.pageX : window.innerWidth - rect.width - 10
      }).addClass('active');
    }
  } else {
    isContextMenu = false;
    $('#contextmenu').removeClass('active');
    return control.detach();
  }
});

_CACHE = [];

$(document).on('keydown', function(e) {
  var CACHE, c, clone, intersects, j, k, len, len1, mouse, point, ref, results;
  window.COPY = (e.keyCode === 67) || (e.keyCode === 86) ? true : false;
  if (e.ctrlKey && !window.COPY) {
    CACHE = [];
  }
  if (e.keyCode === 16) {
    controls.enabled = true;
    $('#rotationStatus').stop(true,true).fadeIn();
  } else if (e.keyCode === 67) {
    OBJECTS.forEach(function(c){
      c.material.opacity = 1;
    });
    _CACHE = [];
    window.COPY = true;
    ref = window.CACHE;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      c = ref[j];
      clone = new OBJ(void 0, c.clone(c));
      clone.scaleArrows = ScaleArrows(clone);
      results.push(_CACHE.push(clone));
    }
    return results;
  } else if (e.keyCode === 86) {
    mouse = getCoordinates(PAGE);
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects([room.plane]);
    point = {};
    if (intersects.length > 0) {
      point = intersects[0].point;
    }
    window.COPY = false;
    for (k = 0, len1 = _CACHE.length; k < len1; k++) {
      c = _CACHE[k];
      scene.add(c);
      scene.add(c.hint.text);
      OBJECTS.push(c);
    }
    _CACHE = [];
    return CACHE = [];
  } else if (e.keyCode === 13) {

    var a;
    C = window.CACHE;
    var holeObj = undefined;
    C.forEach(function(c,i){
      OBJECTS.forEach(function(o,_i){
        if (o.uuid === c.uuid){
          ref1 = o.scaleArrows;
          for (l = 0, len2 = ref1.length; l < len2; l++) {
            a = ref1[l];
            scene.remove(a);
          }
          scene.remove(o.hint.text);
          scene.remove(o);
          OBJECTS.splice(_i, 1);
          control.detach(o);
          clearObjectDistances();
        }
      });
    });
    var ref = scene.children;
    for (j = 0, len = ref.length; j < len; j++) {
      c = ref[j];
      if (c && c.name && (c.name === 'collisions')) {
        scene.remove(c);
      }
    }
    var singleGeometry = new THREE.Geometry();
    
    C.forEach(function(c,i){
      var box = c.geometry;
      if (c.hole){
        holeObj = c;
      }
      for (k = 0, len1 = box.vertices.length; k < len1; k++) {
        box.vertices[k].x *= c._scale.x;
        box.vertices[k].y *= c._scale.y;
        box.vertices[k].z *= c._scale.z;
        box.vertices[k].x += c.pos.x;
        box.vertices[k].y += c.pos.y;
        box.vertices[k].z += c.pos.z;
      }
      var boxMesh = new THREE.Mesh(box);
      var m = new THREE.Matrix4();
      singleGeometry.merge(boxMesh.geometry, m.copy(boxMesh.matrix));

    });
    var mesh = new THREE.Mesh(singleGeometry, C[0].material);
    var clone = mesh.clone(mesh);
    var cc = new OBJ(void 0, clone, holeObj);
    bbox = new THREE.Box3().setFromObject(cc);
    cc.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(
      -(bbox.max.x+bbox.min.x)/2,
      -(bbox.max.y+bbox.min.y)/2,
      -(bbox.max.z+bbox.min.z)/2
    ));
    window.CACHE = [];
    cc.scaleArrows = ScaleArrows(cc);
    scene.add(cc);
    scene.add(cc.hint.text);
    OBJECTS.push(cc);
    // console.log(cc);

  }
});

$(document).on('keyup', function(e) {
  if (e.keyCode === 16) {
    controls.enabled = false;
    return $('#rotationStatus').stop(true,true).fadeOut();
    // $(documen).unbind('mousemove touchmove');
  }
});

PAGE = {};

$(document).on('mousemove', function(e) {
  return PAGE = e;
});

$(document).on('mouseup touchend', function(e) {
  return $(document).off('mousemove touchmove');
});

setObjectName = function() {
  return $('#objectName').val(control.object.objectName);
};

$('#objectName').on('keyup', function(e) {
  return control.object.objectName = $(this).val().trim();
});

$('.subcategories ul li').click(function(e) {
  var $t, object, size;
  e.preventDefault();
  size = {
    x: $(this).data('x'),
    y: $(this).data('y'),
    z: $(this).data('z')
  };
  minSize = {
    x: parseFloat($(this).data('min').split(',')[0])/100,
    z: parseFloat($(this).data('min').split(',')[1])/100,
    y: parseFloat($(this).data('min').split(',')[2])/100
  };
  $t = $(this);
  return object = new OBJ($(this).data('objectmodel'), size, $('[data-obj-texture].active').data('obj-texture'), function(cube) {
    var activeObject;
    $('#objectPreview img').attr('src', $t.data('picture'));
    cube.position.x = Math.random();
    // cube.position.y = Math.random();
    cube.position.z = Math.random();
    activeObject = cube;
    control.attach(activeObject);
    OBJECTS.push(cube);
    control.object.scaleArrows = ScaleArrows(control.object);
    scene.add(cube);
    scene.add(cube.hint.text);
    TIMES.forEach(function(t, i) {
      if ($('#fixedFloorDistanceChecker').prop('checked') && i === TIMES.length - 1) {
        t[1] = (new Date).getTime();
      }
      if (cube.timestamp > t[0] && cube.timestamp < t[1]) {
        cube.position.y = -room.rect.y / 2 + cube.rect.y / 2 + parseFloat($('#fixedFloorDistance').val() / 100);
      }
    });
    setObjectName();
    enableObjectControls();
    collision(control.object, OBJECTS);
    // console.log(cube);
  }, minSize);
});

controlsUpdate = function(pos) {
  var box;
  box = new THREE.Box3().setFromObject(control.object);
  if (pos.x + (control.object.rect.x / 2) > room.rect.x / 2 - stickness * 2) {
    control.object.position.x = room.rect.x / 2 - (control.object.rect.x / 2);
  }
  if (pos.x - (control.object.rect.x / 2) < -room.rect.x / 2 + stickness * 2) {
    control.object.position.x = -room.rect.x / 2 + (control.object.rect.x / 2);
  }
  if (pos.y + (control.object.rect.y / 2) > room.rect.y / 2 - stickness * 2) {
    control.object.position.y = room.rect.y / 2 - (control.object.rect.y / 2);
  }
  if (pos.y - (control.object.rect.y / 2) < -room.rect.y / 2 + stickness * 2) {
    control.object.position.y = -room.rect.y / 2 + (control.object.rect.y / 2);
  }
  if (pos.z + (control.object.rect.z / 2) > room.rect.z / 2 - stickness * 2) {
    control.object.position.z = room.rect.z / 2 - (control.object.rect.z / 2);
  }
  if (pos.z - (control.object.rect.z / 2) < -room.rect.z / 2 + stickness * 2) {
    control.object.position.z = -room.rect.z / 2 + (control.object.rect.z / 2);
  }
  if (CACHE.length <= 1) {
    return collision(control.object, OBJECTS);
  }
};

$('#rotateLeft').click(function(e) {
  e.preventDefault();
  control.object.rotateLeft();
  if (CACHE.length <= 1) {
    return collision(control.object, OBJECTS);
  }
});

$('#rotateRight').click(function(e) {
  e.preventDefault();
  control.object.rotateRight();
  if (CACHE.length <= 1) {
    return collision(control.object, OBJECTS);
  }
});

$('#rotateUp').click(function(e) {
  e.preventDefault();
  control.object.rotateUp();
  if (CACHE.length <= 1) {
    return collision(control.object, OBJECTS);
  }
});

$('#rotateDown').click(function(e) {
  e.preventDefault();
  control.object.rotateDown();
  if (CACHE.length <= 1) {
    return collision(control.object, OBJECTS);
  }
});

updateRangeSlider = function(inSlider) {
  var r;
  if (inSlider) {
    r = parseInt(window.range.get());
    console.log(window.currentZoomOld, parseInt(window.range.get()));
    if (r > 0) {
      if (window.currentZoomOld > r) {
        return controls.zoomOut();
      } else {
        return controls.zoomIn();
      }
    } else {
      if (window.currentZoomOld < r) {
        return controls.zoomOut();
      } else {
        return controls.zoomIn();
      }
    }
  } else {
    return window.range.set(window.currentZoom + 40);
  }
};

$('.close-popup').click(function(e) {
  e.preventDefault();
  $('.popup').removeClass('active');
  // controls.enabled = true;
  isContextMenu = false;
  return $('#enableControls').addClass('active');
});

$('#editObject').click(function(e) {
  e.preventDefault();
  if (!$(this).hasClass('disabled')) {
    $('.popup').removeClass('active');
    $('#objectLength').val(control.object._rect.x.toFixed(2));
    $('#objectWidth').val(control.object._rect.y.toFixed(2));
    $('#objectHeight').val(control.object._rect.z.toFixed(2));
    $('#propertiesPopup').addClass('active');
    controls.enabled = false;
    $('#enableControls').removeClass('active');
  }
});

$('#deleteObject').click(function(e) {
  var a, c, i, j, k, l, len, len1, len2, o, ref, ref1, results;
  e.preventDefault();
  ref = scene.children;
  for (j = 0, len = ref.length; j < len; j++) {
    c = ref[j];
    if (c && c.name && (c.name === 'collisions')) {
      scene.remove(c);
    }
  }
  if (!$(this).hasClass('disabled')) {
    results = [];
    for (i = k = 0, len1 = OBJECTS.length; k < len1; i = ++k) {
      o = OBJECTS[i];
      if (o.uuid === control.object.uuid) {
        ref1 = o.scaleArrows;
        for (l = 0, len2 = ref1.length; l < len2; l++) {
          a = ref1[l];
          scene.remove(a);
        }
        scene.remove(o.hint.text);
        scene.remove(o);
        OBJECTS.splice(i, 1);
        control.detach(o);
        results.push(clearObjectDistances());
      } else {
        results.push(void 0);
      }
    }
    $('#contextmenu').removeClass('active');
    return results;
  }
});

$('#objectLength, #objectWidth, #objectHeight').keyup(function(e) {
  return setTimeout(function() {
    var newRect;
    newRect = {
      x: $('#objectLength').val().trim() === '' ? parseFloat(control.object.rect.x) : parseFloat($('#objectLength').val().trim())/100,
      y: $('#objectWidth').val().trim() === '' ? parseFloat(control.object.rect.y) : parseFloat($('#objectWidth').val().trim())/100,
      z: $('#objectHeight').val().trim() === '' ? parseFloat(control.object.rect.z) : parseFloat($('#objectHeight').val().trim())/100
    };
    return control.object.updateRect(newRect);
  }, 1000);
});

$('#sticknessUp').click(function(e) {
  e.preventDefault();
  if (stickness < 0.45) {
    stickness += 0.05;
  }
  return updateSticknessVal();
});

$('#sticknessDown').click(function(e) {
  e.preventDefault();
  if (stickness > 0.1) {
    stickness -= 0.05;
  }
  return updateSticknessVal();
});

updateSticknessVal = function() {
  return $('#sticknessValue').html(Math.round(stickness * 100) / 100);
};

$('#defaultView, #startView').click(function(e) {
  var c, j, len, ref;
  ref = control.children[0].children[0].children;
  for (j = 0, len = ref.length; j < len; j++) {
    c = ref[j];
    c.scale.set(1, 1, 1);
    c.visible = true;
  }
  // controls.enabled = true;
  control.enabled = true;
  controls.reset();
  camera.fov = 50;
  control.enpose();
  pointLight.visible = true;
  return light.color.setHex(0x999999);
});

$('#topView').click(function(e) {
  var c, i, j, len, ref;
  controls.enabled = false;
  control.enabled = false;
  camera.fov = 1;
  camera.position.y = 500;
  camera.position.z = 0;
  camera.position.x = 0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.rotation.z = 0;
  ref = control.children[0].children[0].children;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    c = ref[i];
    c.visible = false;
  }
  control.dispose();
  room.plane.position.y = -room.rect.y / 2 + 0.1;
  pointLight.visible = false;
  return light.color.setHex(0xffffff);
});

$('[data-material]').click(function(e) {
  var shiness;
  e.preventDefault();
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  shiness = parseFloat($(this).data('material').split(':')[1]);
  return control.object.material.shininess = shiness;
});

$('[data-obj-texture]').click(function(e) {
  e.preventDefault();
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  $('[data-texture-type]').hide();
  return $('[data-texture-type="' + $(this).attr('data-switch-texture') + '"]').show();
});

$('#enableControls').click(function(e) {
  e.preventDefault();
  $(this).toggleClass('active');
  return controls.enabled = $(this).hasClass('active') ? true : false;
});

launchFullScreen = function(element) {
  if (element.requestFullScreen) {
    element.requestFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
};

cancelFullscreen = function() {
  if (document.cancelFullScreen) {
    document.cancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
};

$('#fullscreen').click(function(e) {
  e.preventDefault();
  return launchFullScreen(document.getElementById("webglRender"));
});

updateRoomProperties = function() {
  room._updateRect({
    x: parseFloat($('#roomLengthInput').val()/100),
    z: parseFloat($('#roomWidthInput').val()/100),
    y: parseFloat($('#roomHeightInput').val()/100)
  });
  $('#roomLength').html($('#roomLengthInput').val());
  $('#roomWidth').html($('#roomWidthInput').val());
  $('#roomHeight').html($('#roomHeightInput').val());
};

$('#roomLengthInput, #roomWidthInput, #roomHeightInput').keyup(function() {
  setTimeout(function() {
    updateRoomProperties();
  }, 1000);
});

$('#roomSettings').click(function(e) {
  e.preventDefault();
  $('.popup').removeClass('active');
  return $('#roomSettingsPopup').addClass('active');
});

$('#enableIndicatorsPopup').click(function(e) {
  e.preventDefault();
  $('.popup').removeClass('active');
  return $('#indicatorsPopup').addClass('active');
});

$('[data-room-texture]').click(function(e) {
  e.preventDefault();
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  return room.setTexture($(this).data('room-texture'));
});

$('[data-change-texture]').click(function(e) {
  e.preventDefault();
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  return control.object.setTexture($(this).data('change-texture'));
});

$('#help').click(function(e) {
  e.preventDefault();
  $('.popup').removeClass('active');
  return $('#helpPopup').addClass('active');
});

scaleHandler = function(event) {
  var X, Y, Z, _X, _x, intersects, mouse, scale, x, xCoef, y, z;
  mouse = getCoordinates(event);
  raycaster.setFromCamera(mouse, camera);
  if ((axis === 'x') || (axis === 'X') || (axis === 'z') || (axis === 'Z')) {
    intersects = raycaster.intersectObjects([room.planeX]);
  }
  if ((axis === 'y') || (axis === 'Y')) {
    intersects = raycaster.intersectObjects([room.plane]);
  }
  if (intersects.length > 0) {
    scale = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    // console.log(intersects);
    // var _y = control.object.children.length > 0 ? 0.001 : 0;
    xCoef = control.object.position.x - intersects[0].object.position.x;
    _x = intersects[0].point.x + control.object.rect.x / 2 + (0.1 * scale) + 0.02;
    _X = intersects[0].point.x - control.object.rect.x / 2 - (0.1 * scale) - 0.02;
    x = intersects[0].point.x - control.object.position.x;
    X = control.object.position.x - intersects[0].point.x;
    y = intersects[0].point.y - control.object.position.y;
    Y = control.object.position.y - intersects[0].point.y;
    z = intersects[0].point.z - control.object.position.z;
    Z = control.object.position.z - intersects[0].point.z;
    if (axis === 'x') {
      control.object.updateRect({
        x: X,
        y: control.object.rect.y,
        z: control.object.rect.z
      });
      control.object.position.x = control.object.scalePos.x - control.object.rect.x / 2;
    }
    if (axis === 'X') {
      control.object.updateRect({
        x: x,
        y: control.object.rect.y,
        z: control.object.rect.z
      });
      control.object.position.x = control.object.scalePos.X + control.object.rect.x / 2;
    }
    if (axis === 'y') {
      control.object.updateRect({
        x: control.object.rect.x,
        y: Y,
        z: control.object.rect.z
      });
      control.object.position.y = control.object.scalePos.y - control.object.rect.y / 2;
    }
    if (axis === 'Y') {
      control.object.updateRect({
        x: control.object.rect.x,
        y: y,
        z: control.object.rect.z
      });
      control.object.position.y = control.object.scalePos.Y + control.object.rect.y / 2;
    }
    if (axis === 'z') {
      control.object.updateRect({
        x: control.object.rect.x,
        y: control.object.rect.y,
        z: Z
      });
      control.object.position.z = control.object.scalePos.z - control.object.rect.z / 2;
    }
    if (axis === 'Z') {
      control.object.updateRect({
        x: control.object.rect.x,
        y: control.object.rect.y,
        z: z
      });
      return control.object.position.z = control.object.scalePos.Z + control.object.rect.z / 2;
    }
  }
};

axis = '';

pos = void 0;

scalePerentHandler = function(event) {
  var intersects, mouse;
  mouse = getCoordinates(event);
  raycaster.setFromCamera(mouse, camera);
  if (control.object) {
    intersects = raycaster.intersectObjects(control.object.scaleArrows);
    if (intersects.length > 0) {
      intersects[0].object.material.color.set(0xffff00);
      return $('body').bind('mousedown', function(event) {
        if ($('#scale').hasClass('active')) {
          control.object.scalePos = {
            x: control.object.position.x + control.object.rect.x / 2,
            X: control.object.position.x - control.object.rect.x / 2,
            y: control.object.position.y + control.object.rect.y / 2,
            Y: control.object.position.y - control.object.rect.y / 2,
            z: control.object.position.z + control.object.rect.z / 2,
            Z: control.object.position.z - control.object.rect.z / 2
          };
          pos = intersects[0].point;
          axis = intersects[0].object.mark;
          return $('body').bind('mousemove', scaleHandler);
        }
      }).bind('mouseup', function(event) {
        return $('body').unbind('mousemove', scaleHandler);
      });
    } else {
      return control.object.uncolor();
    }
  }
};

$('#scale').click(function(e) {
  var c, j, k, len, len1, ref, ref1;
  e.preventDefault();
  if (!$(this).hasClass('disabled')) {
    $(this).toggleClass('active');
    if ($(this).hasClass('active')) {
      if (control.object.children.length > 0){
        control.object.children[0].visible = false;
      }
      control.object.children[0]
      control.object.showScaleArrows();
      control.dispose();
      ref = control.children[0].children[0].children;
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        c.scale.set(0.0000001, 0.0000001, 0.0000001);
      }
      controls.enabled = false;
      message('Режим изменения размера');
      if (control.object) {
        $('body').on('mousemove', scalePerentHandler);
      } else {
        $('body').off('mousemove', scalePerentHandler);
      }
    } else {
      if (control.object.children.length > 0){
        control.object.children[0].visible = true;
      }
      $('body').off('mousemove', scalePerentHandler);
      control.object.hideScaleArrows();
      ref1 = control.children[0].children[0].children;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        c = ref1[k];
        c.scale.set(1, 1, 1);
      }
      controls.enabled = true;
      if (camera.fov !== 1){
        control.enpose();
      }
      return message('Режим перемещения');
    }
  }
});

$('[data-switch-texture].active').click();

fixedFloorDistanceFunction = function(e) {
  var val;
  val = parseFloat($('#fixedFloorDistance').val());
  return $('#fixedFloorDistance').val(e.deltaY > 0 ? (val < room.rect.y * 100 / 2 ? val + 5 : room.rect.y * 100 / 2) : val <= 5 ? 0 : val - 5);
};

$('#fixedFloorDistance').on('focus', function() {
  return $(document).on('mousewheel', fixedFloorDistanceFunction);
});

$('#fixedFloorDistance').on('blur', function() {
  return $(document).off('mousewheel', fixedFloorDistanceFunction);
});

$('#gridSizeChecker').on('change', function(e) {
  e.preventDefault();
  if ($(this).prop('checked')) {
    return grid.add();
  } else {
    return grid.remove();
  }
});

$('[name="grid-size"]').on('change', function(e) {
  e.preventDefault();
  return grid.setValue(parseFloat($(this).val()));
});

$('[data-grid-color]').on('click', function(e) {
  var color;
  e.preventDefault();
  color = $(this).data('grid-color');
  return grid.setColor(color);
});

$('#hideRoomSides').on('change', function(e) {
  e.preventDefault();
  if (!$(this).prop('checked')) {
    room.material.transparent = true;
    return room.material.opacity = 0;
  } else {
    return room.material.opacity = 1;
  }
});

$('#ruler').click(function(e) {
  e.preventDefault();
  $(this).toggleClass('active');
  if ($(this).hasClass('active')) {
    return ruler.enable();
  } else {
    control.detach(ruler.start);
    control.detach(ruler.end);
    return ruler.disable();
  }
});

setOptions = function(opt) {
  if (opt) {
    OPTIONS.hints.x.enabled = opt.hints.x.enabled;
    OPTIONS.hints.y.enabled = opt.hints.y.enabled;
    OPTIONS.hints.z.enabled = opt.hints.z.enabled;
  }
  OPTIONS.hints.x.width = parseFloat($('#lineWidthX').val());
  OPTIONS.hints.y.width = parseFloat($('#lineWidthY').val());
  return OPTIONS.hints.z.width = parseFloat($('#lineWidthZ').val());
};

$('[data-indicator-check]').click(function(e) {
  setOptions({
    hints: {
      x: {
        enabled: $('#indicatorX').prop('checked')
      },
      y: {
        enabled: $('#indicatorY').prop('checked')
      },
      z: {
        enabled: $('#indicatorZ').prop('checked')
      }
    }
  });
});

$('.filter-input').each(function(i, elem) {
  $('.plus', elem).click(function(e) {
    var inp;
    e.preventDefault();
    inp = $('input', elem);
    inp.val(parseFloat(inp.val()) < 4.5 ? (parseFloat(inp.val()) + 0.5).toFixed(1) : 5);
    setOptions();
  });
  $('.minus', elem).click(function(e) {
    var inp;
    e.preventDefault();
    inp = $('input', elem);
    inp.val(parseFloat(inp.val()) > 1 ? (parseFloat(inp.val()) - 0.5).toFixed(1) : 0.5);
    setOptions();
  });
});


$('#fixedFloorDistanceChecker').on('change', function(e){
  ch = $(this).prop('checked');
  if (ch){
    TIMES.push(new Array(new Date().getTime(), 0))
  }
});


$('body').on('keydown', function(e){
  if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
    if (control.object){
      if (e.keyCode == 37 && !isContextMenu){ control.object.position.x -= 0.01; }
      if (e.keyCode == 39 && !isContextMenu){ control.object.position.x += 0.01; }
      if (e.keyCode == 38 && !isContextMenu){ control.object.position.z -= 0.01; }
      if (e.keyCode == 40 && !isContextMenu){ control.object.position.z += 0.01; }
    }
    collision(control.object, OBJECTS);
  } else {return;}
});

/*
  fixed floor distance
*/
$('#objectFloorSpace').click(function(e){
  control.object.fixedFloor = $(this)[0].checked;
});
$('#objectSpaceHeight').keyup(function() {
  $t = this
  setTimeout(function() {
    if (control.object){
      var val = parseInt($($t).val()) || 0;
      control.object.floorDistance = val;
      // console.log(control.object.floorDistance);
    }
  }, 1000);
});

$('#objectDistanceLeft, #objectDistanceFront, '+
  '#objectDistanceRear, #objectDistanceRight, '+
  '#objectDistanceTop, #objectDistanceBottom')
  .each(function(i, input){
    $(input).on('keyup', function(e){
      setObjectDistance($(this), $(this).data('direction'));
    });
  });


function enableHatch(){
  OBJECTS.forEach(function(o){
    o.cachedTexture = o.material.map.image.src.toString();
    o.setTexture('textures/hatch.jpg');
  });
  // room.cachedTexture = room.material.map.image.src.toString();
  // room.setTexture('textures/hatch.jpg');
};
function disableHatch(){
  OBJECTS.forEach(function(o){
    o.setTexture(o.cachedTexture);
    o.cachedTexture = '';
  });
  // room.setTexture(room.cachedTexture);
  // room.cachedTexture = '';
};

$('#hatch').click(function(e){
  e.preventDefault();
  $(this).toggleClass('active');
  if ($(this).hasClass('active')){
    enableHatch();
  } else {
    disableHatch();
  }
});

$('body').on('click', '[data-call]', function(e){
  $('#contextmenu').removeClass('active');
  call = $($(this).data('call'));
  call.addClass('active');
});
$('#contextmenu li').click(function(){
  $('#contextmenu').removeClass('active');
});

$('select').selectBox();

$('#sideFront').click(function(){
  if (control.object)
    control.object.corners.sides.front = $(this)[0].checked;
});
$('#sideRear').click(function(){
  if (control.object)
    control.object.corners.sides.rear = $(this)[0].checked;
});
$('#sideLeft').click(function(){
  if (control.object)
    control.object.corners.sides.left = $(this)[0].checked;
});
$('#sideRight').click(function(){
  if (control.object)
    control.object.corners.sides.right = $(this)[0].checked;
});
$('.vertical-type-selectBox-dropdown-menu li').click(function(e){
  if (control.object)
    control.object.corners.vertical = $(this).text();
});
$('.material-type-selectBox-dropdown-menu li').click(function(e){
  if (control.object)
    control.object.corners.material = $(this).text();
});

$('#save').click(function(e){
  e.preventDefault();
  // var exporter = new THREE.SceneExporter();
  // var sceneJson = JSON.stringify(scene.children[0]);
  // // localStorage.setItem('scene', JSON.stringify(scene));
  // console.log(sceneJson);
  // var cache = [];
  // json = JSON.stringify(scene, function (key, value) {
  //     if (typeof value === 'object' && value !== null) {
  //         if (cache.indexOf(value) !== -1) {
  //             value = value.toString();
  //         }
  //         cache.push(value);
  //     }
  //     return value;
  // });
  // localStorage.setItem('scene', json);

  json = Exporter.export(scene);



  $.ajax({
      url: 'http://localhost:8080',
      type: 'POST',
      data: json,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      complete: function(msg) {
          // console.clear();
          // console.log(msg);
      }
  });

});

// new THREE.Mesh(new THREE.BoxGeometry(10,10,10), new THREE.MeshNormalMaterial());

$('#load').click(function(e){
  e.preventDefault();

  $.ajax({
      url: 'scene.json',
      type: 'GET',
      dataType: 'json',
      async: true,
      complete: function(json) {
        // console.log(scene.children);
        scene.children.forEach(function(c){
          if (c.type === 'Mesh' && c.name !== 'room'){
            scene.remove(c);
          }
        });
        object = JSON.parse(json.responseText.toString());
        Importer.import(object, scene);
        // childs =  localStorage.getItem('scene');
        // JSON.parse(childs).children.forEach(function(c){
        //   if (c.type === 'Mesh' && c.name !== 'hole' && c.name !== 'hint'){
        //     scene.add(c);
        //     console.log(c);
        //   }
        // });
        //   // scene.children = scene2.children;
          // sceneLoader.parse(, function (e) {scene = e.scene;}, '.');
          // console.log(scene.children.length);
      }
  });

  // var json = (localStorage.getItem('scene'));
  // var sceneLoader = new THREE.SceneLoader();
  // sceneLoader.parse(JSON.parse(json), function (e) {
  //     scene = e.scene;
  // }, '.');

  // scene.children.forEach(function(c){
  //   scene.remove(c);
  // });
  // childs.children.forEach(function(c){
  //   scene.add(c);
  // });

});


$('#holeMaker').click(function(e){
  e.preventDefault();
  $(this).toggleClass('active');
  if ($(this).hasClass('active')){
    hole.visible = true;
  } else {
    hole.visible = false;
  }

});

$('#booleanOperaion').click(function(e){
  e.preventDefault();
  holeCollisions = collision(hole, OBJECTS);
  if (typeof holeCollisions !== 'boolean'){
    holeCollisions.forEach(function(c){

      // var cube_bsp = new ThreeBSP( c );
      // var sphere_bsp = new ThreeBSP( hole );
      // var subtract_bsp = cube_bsp.subtract( sphere_bsp );
      // var result = subtract_bsp.toMesh( c.material );
      // // result.geometry.computeVertexNormals();

      // var _i = 0;
      // OBJECTS.forEach(function(child){
      //   if (child.uuid === c.uuid){
      //     scene.remove(child);
      //     OBJECTS.splice(_i, 1);
      //   }
      //   _i++;
      // });

      // var cc = new OBJ(void 0, result);
      // scene.add( cc );
      // OBJECTS.push(cc);

      // $('#contextmenu').removeClass('active');

      

    });
  }
});
$('#makeHole').click(function(e){
  e.preventDefault();
  s = parseInt($('#holeSize').val()) || 10;
  c = control.object;
  var h = new Hole(c, s);
});
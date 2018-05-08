if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var CAR = {
  name: "Bugatti Veyron",
  url:  "obj/veyron/VeyronNoUv_bin.js",
  init_rotation: [ 0, 0, 0 ],
  scale: 5,
  init_material: 4,
  body_materials: [ 2 ],
  object: null,
  buttons: null,
  materials: null
};


var container, stats;

var camera, scene, renderer;
var cameraCube, sceneCube;

var cameraCache = {};

var m, mi;

var controls = undefined;

var titles = [];
var titlesPlanes = [];
var titlesLines = [];
var captions = [];

var sceneObj = {}, torus;

var directionalLight, pointLight;

var mouseX = 0, mouseY = 0;

var featuresIndx = 0;
var featuresAnimation = false;
var featuresAnimationFrame = 0;
var featuresDirection = 0;
var featuresShowing = false;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var loader = new THREE.BinaryLoader();

var currentScene = 0;
var lastCurrentScene = 0;

var isAnim = false;
var currentAnimStep = 0;
var currentAnimDirection = 'down';


// var stats = new Stats();
// stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

// // align top-left
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.left = '0px';
// stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );


var clickOnMap, mouse, raycaster;

document.addEventListener('mousemove', function(e) {
  return e = e || event;
});

CURSOR = {
  position: {
    x: 0,
    y: 0,
    z: 0
  },
  pointObj: null
};



// init();
// animate();

function init(type) {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // CAMERAS
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100000 );
  cameraCube = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.0001, 1000000 );

  // SCENE
  scene = new THREE.Scene();
  sceneCube = new THREE.Scene();


  // controls.addEventListener( 'change', render );

  // LIGHTS
  var ambient = new THREE.AmbientLight( 0x000000 );
  scene.add( ambient );
  // var lig = new THREE.PointLight( 0xff0000, 1, 1000 );
  // lig.position.set(0, 500, 0);
  // scene.add( lig );

  cube = new THREE.Mesh(
    new THREE.BoxGeometry(100,100,100),
    new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.BackSide})
  );
  var sc = 150;
  cube.position.y = -700;
  cube.scale.set(sc,sc,sc);
  scene.add(cube);

  scene.add( light );

  // currentScene = 3;

  // var axisHelper = new THREE.AxisHelper(5000);
  // scene.add(axisHelper);

  var shader = THREE.ShaderLib[ "cube" ];
  shader.uniforms[ "tCube" ].value = textureCube;

  var material = new THREE.ShaderMaterial( {
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  } ),

  mesh = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 10 ), material );
  sceneCube.add( mesh );
  plane.rotation.x = deg2rad(-90);
  plane.receiveShadow = false;

  plane.receiveShadow = true;
  scene.add( plane );

  // renderer = new THREE.WebGLRenderer(); // featuresAnimationFrame
  if (type == 'slow'){
    renderer = new THREE.WebGLRenderer();
  } else {
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
  }
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setFaceCulling( THREE.CullFaceNone );
  renderer.autoClear = false;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera.position.x = scenes[0].pos.x;
  camera.position.y = scenes[0].pos.y;
  camera.position.z = scenes[0].pos.z;
  camera.rotation.x = scenes[0].rot.x;
  camera.rotation.y = scenes[0].rot.y;
  camera.rotation.z = scenes[0].rot.z;

  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  CAR.materials = {
    body: [
      [ "Orange metal",   MATERIALS[ "Orange metal" ] ],
      [ "Blue metal",   MATERIALS[ "Blue metal" ] ],
      [ "Red metal",    MATERIALS[ "Red metal" ] ],
      [ "Green metal",  MATERIALS[ "Green metal" ] ],
      [ "Black metal",  MATERIALS[ "Black metal" ] ],
      [ "Gold",     MATERIALS[ "Gold" ] ],
      [ "Bronze",   MATERIALS[ "Bronze" ] ],
      [ "Chrome",   MATERIALS[ "Chrome" ] ]
    ],
  };
  m = CAR.materials;
  mi = CAR.init_material;
  CAR.mmap = {
    0: MATERIALS[ "Black rough" ],
    1: MATERIALS[ "Pure chrome" ],
    2: m.body[ mi ][ 1 ],
    3: MATERIALS[ "Dark glass" ],
    4: MATERIALS[ "Pure chrome" ],
    5: MATERIALS[ "Pure chrome" ],
    6: MATERIALS[ "Red glass 50" ],
    7: MATERIALS[ "Orange glass 50" ]
  };
  loader.load( CAR.url, function( geometry ) { createScene( geometry, "veyron" ) } );
  window.addEventListener( 'resize', onWindowResize, false );


  var partMat = new THREE.MeshPhongMaterial({
    color: 0xdddddd,
    emissive: 0xdddddd,
    transparent: true,
    opacity: 0.5
  });
  






  // 
  // 

  var material1 = new THREE.MeshPhongMaterial({
    color: 0xdddddd,
    emissive: 0xdddddd,
    transparent: true,
    opacity: 0
  });
  var material2 = new THREE.MeshPhongMaterial({
    color: 0xdddddd,
    emissive: 0xdddddd,
    transparent: true,
    opacity: 0
  });
  var material3 = new THREE.MeshPhongMaterial({
    color: 0xdddddd,
    emissive: 0xdddddd,
    transparent: true,
    opacity: 0
  });
  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, -40, 600 ),
    new THREE.Vector3( -300, 200, 700 ),
    new THREE.Vector3( -400, 200, 700 )
  );
  var line = new THREE.Line( geometry, material1 );
  line.castShadow = true;
  scene.add( line );
  titlesLines[0] = line;

  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 200, 0, 0 ),
    new THREE.Vector3( 600, 200, 0 ),
    new THREE.Vector3( 740, 200, 0 )
  );
  var line2 = new THREE.Line( geometry, material2 );
  line2.castShadow = true;
  scene.add( line2 );
  titlesLines[1] = line2;


  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 0, 70, -350 ),
    new THREE.Vector3( -200, 250, -350 ),
    new THREE.Vector3( -420, 250, -350 )
  );
  var line3 = new THREE.Line( geometry, material3 );
  line3.castShadow = true;
  scene.add( line3 );
  titlesLines[2] = line3;



  titles.push(addText('P R I C E', [-395, 220, 700], 18));
  titles.push(addText('S P E E D', [600, 220, 0], 26));
  titles.push(addText('E N G I N E', [-410, 280, -350], 32));

  titlesPlanes.push(addTextPlane([-395, 220, 700], 18, 0));
  titlesPlanes.push(addTextPlane([600, 220, 0], 26, 1));
  titlesPlanes.push(addTextPlane([-410, 280, -350], 32, 2));

  captions[0] = addCaption([
    '3 000 000 $', '',
    'Augmented by German witch doctors Mansory,',
    'the 1,200-hp Veyron starts out',
    'as a Grand Sport Vitesse Roadster,',
    'only to be adorned with a gorgeous',
    'carbon fiber body, a new spoiler package,',
    'upgraded LED lights, a rebuffed cabin,',
    'and a redesigned front grill.',
    'Further classifying the Veyron',
    'as a work of art, maps of historic race events',
    'like the Targa Florio are laser etched',
    'into the exterior and interior.'
  ], [-900, 250, -100], 14, {x: 0, y: 0, z: 0}, 0);

  captions[1] = addCaption([
    'THE FASTEST', '',
    'The Super Sport will hit 62mph', 'in the same 2.5 seconds',
    'as the standard Veyron ', '(and never was such an adjective',
    'less appropriate), but its', '0-124mph and 0-186mph times',
    'are reduced to 7.3 seconds', 'and 15.0 seconds.',
    '124mph in just over seven seconds.', '',
    'On the Ehra-Lessien test track,', 'the Super Sports hit 427.933km/h',
    'on its upwind run, before reaching', '434.211km/h on the return leg.'
  ], [500, 150, 850], 14, {x: 0, y: 1.6, z: 0}, 1);

  captions[2] = addCaption([
    '8.0L W16 ENGINE', '',
    'According to Volkswagen Group and',
    'certified by \"TUV Suddeutschland\"',
    'the final production Veyron engine produces',
    '1,001 metric horsepower of motive power,',
    'and generates 1,250 newton metres of torque.', '',
    'The nominal figure has been stated',
    'by Bugatti officials to be conservative,',
    'with the real total being 1,020 metric',
    'horsepower at 6,000 rpm.'
  ], [-200, 250, -750], 14, {x: -1.3, y: 0, z: 0}, 2);

  // captions.push(addText('fasda sd fas dsf asd fasd', [-410, 170, -350], 32));


  clickOnMap = function(obj) {
    var cords, m, mt, poi, u, _i, _len, _results;

    featuresIndx = obj.indx;
    featuresAnimation = true;
    featuresDirection = 0;

    // console.log(obj.indx);
    return _results;
  };
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  clickHandler = function(event) {
    var intersects;
    event.preventDefault();
    mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(titlesPlanes);
    if (intersects.length > 0) {
      // console.log(titlesPlanes[intersects[0].object.indx]);
      clickOnMap(titlesPlanes[intersects[0].object.indx]);
    }
  };

  hoverCaster = new THREE.Raycaster();
  hoverMouse = new THREE.Vector2();

  hoverHandler = function(event) {
    var intersects;
    event.preventDefault();
    mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(titlesPlanes);
    if (intersects.length > 0) {
      // console.log(intersects[0].object.indx);
      // clickOnMap(titlesPlanes[intersects[0].object.indx]);
      if (featuresShowing == false && currentScene == 4){
        titlesLines[intersects[0].object.indx].material.opacity = 1;
        titles[intersects[0].object.indx].material.opacity = 0.5;
        $('body').addClass('pointered');
      }
      // titlesLines[intersects[0].object.indx].material.color = 0xdddddd;
    } else {
      if (featuresShowing == false && currentScene == 4){
        titlesLines.forEach(function(line){
          line.material.opacity = 0.2;
        });
        titles.forEach(function(title){
          title.material.opacity = 1;
        });
      }
      $('body').removeClass('pointered');
    }
  };

  document.addEventListener('click', clickHandler, false);
  document.addEventListener('mousemove', hoverHandler, false);

}

function addText(text, position, size){
  var material = new THREE.MeshPhongMaterial({
    color: 0xcccccc,
    emissive: 0xcccccc,
    transparent: true,
    opacity: 0
  });
  var textGeom = new THREE.TextGeometry( text, {
    font: 'helvetiker',
    size: size,
    height: 1

  });
  var textMesh = new THREE.Mesh( textGeom, material );
  textMesh.position.x = position[0];
  textMesh.position.y = position[1];
  textMesh.position.z = position[2];
  scene.add( textMesh );
  return textMesh;
}

function addCaption(text, position, size, angle, indx){
  var material = new THREE.MeshBasicMaterial({color: 0x777777, transparent: true, opacity: 0});
  var material2 = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0});
  var textMeshArray = [];
  for (var i=text.length-1; i >= 0; i--){
    var textGeom = new THREE.TextGeometry( text[i], {
      font: 'helvetiker',
      size: size,
      height: 1
    });
    var textMesh = new THREE.Mesh( textGeom, i == 0 ? material2 : material );
    textMesh.position.x = position[0];
    textMesh.position.y = position[1]+(angle && angle.x == 0 ? -i*size-i*10 : 0);
    textMesh.position.z = position[2]+(angle && angle.x != 0 ? i*size+i*10 : 0);
    if (angle){
      textMesh.rotation.x = angle.x;
      textMesh.rotation.y = angle.y;
      textMesh.rotation.z = angle.z;
    }
    scene.add( textMesh );
    // console.log(textMesh);
    textMeshArray.push(textMesh);
  }
  var materialPlane = new THREE.MeshPhongMaterial({
    color: 0x000000,
    emissive: 0x000000,
    transparent: true,
    opacity: 0.8
  });
  var planeGeo = new THREE.PlaneGeometry(600+(indx == 2 ? 100 : 0), 800, 10, 10);
  var plane = new THREE.Mesh( planeGeo, materialPlane );
  plane.position.x = position[0]+(indx == 0 ? 200 : indx == 2 ? 200 : -20);
  plane.position.y = position[1]+(indx == 1 ? -50 : 0);
  plane.position.z = position[2]+(indx == 1 ? -200 : 0);
  if (angle){
    plane.rotation.x = angle.x;
    plane.rotation.y = angle.y;
    plane.rotation.z = angle.z;
  }
  // scene.add( plane );
  return textMeshArray;
}

function addTextPlane(position, size, indx){
  var material = new THREE.MeshPhongMaterial({
    color: 0x444444,
    emissive: 0x444444,
    transparent: true,
    opacity: 0
  });
  var textGeom = new THREE.PlaneGeometry(size*6, size*2, 10, 10);
  var textMesh = new THREE.Mesh( textGeom, material );
  textMesh.position.x = position[0]+size*3;
  textMesh.position.y = position[1]+10;
  textMesh.position.z = position[2];
  textMesh.indx = indx;
  scene.add( textMesh );
  return textMesh;
}

function createScene( geometry, car ) {
  var m = new THREE.MeshFaceMaterial(),
    s = CAR.scale * 1,
    r = CAR.init_rotation,
    materials = CAR.materials,
    mi = CAR.init_material,
    bm = CAR.body_materials;

  for ( var i in CAR.mmap ) {
    m.materials[ i ] = CAR.mmap[ i ];
  }

  var mesh = new THREE.Mesh( geometry, m );

  mesh.rotation.x = r[ 0 ];
  mesh.rotation.y = r[ 1 ];
  mesh.rotation.z = r[ 2 ];

  mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
  scene.add( mesh );
  mesh.castShadow = true;
  CAR.object = mesh;
  $('.loader').addClass('disabled');
  $('.back').addClass('fadein');
}


function animate() {
  requestAnimationFrame( animate );
  render();
}


function render() {
  // stats.begin();


  var timer = -0.0005 * Date.now();

  // currentScene = 5;

  if (isAnim){
    if (currentAnimDirection == 'down'){
      if (currentAnimStep < 200){
        if (currentAnimStep == 0){
          fadeInFunction();
        }
        if (currentAnimStep == 140 && currentScene < 3){
          fadeOutFunction();
        }
        currentAnimStep++;
        scrollFunction('down');
        // console.log(currentAnimStep);
      }else {
        isAnim = false;
        endAnimationCallback();

        currentAnimStep = 0;
        if (currentScene <= scenes.length){
          currentScene++;
        }
        // console.log(currentScene);
      }
    }else{
      // if (currentAnimStep == 0 ){
      //   currentScene--;
      //   fadeInFunction();
      // }
      // if (currentAnimStep == 140 ){
      //   fadeOutFunction();
      // }
      // if (currentAnimStep < 200){
      //   currentAnimStep++;
      //   scrollFunction('up');
      //   // console.log(currentAnimStep);
      // }else {
      //   isAnim = false;
      //   endAnimationCallback();
      //   currentAnimStep = 0;
      //   console.log(currentScene);
      // }
    }
  }

  if (scenes[currentScene] != undefined){
    sceneObj = scenes[currentScene];
  } else {
    sceneObj = scenes[currentScene-1];
  }

  // console.log(camera.position.y);


  // camera.position.x = ( - mouseX - 300 ) * 2;
  // camera.position.z = ( - mouseX - 300 ) * 2;

  if (currentScene >= 6){
    camera.lookAt( scene.position );
  }
  if (currentScene == 7){ //  && controls == undefined

    // camera.position.x = Math.sin((lastPos2 + (pageX - current2))/100) * zoom;
    // camera.position.z = Math.cos((lastPos2 + (pageX - current2))/100) * zoom;

    // controls = new THREE.TrackballControls( camera );
    // controls.rotateSpeed = 3.0;
    // controls.zoomSpeed = 1.2;
    // controls.panSpeed = 1.8;
    // controls.noZoom = false;
    // controls.noPan = false;
    // controls.staticMoving = true;
    // controls.dynamicDampingFactor = 0.3;
    // controls.keys = [ 65, 83, 68 ];
    // controls.enabled = true;
    // console.log(controls.position);
  }

  if (featuresAnimation && featuresAnimationFrame < 100) {
    if (featuresAnimationFrame == 0){
      featuresShowing = true;
      $('.color-block').addClass('disabled');
    }
    if (featuresIndx == 0){
      camera.position.x -= Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 10 * (featuresDirection == 0 ? 1 : -1);
      camera.position.z -= Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 10 * (featuresDirection == 0 ? 1 : -1);
      camera.position.y -= Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 4 * (featuresDirection == 0 ? 1 : -1);
      camera.rotation.y -= Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 0.004 * (featuresDirection == 0 ? 1 : -1);
      camera.rotation.z -= Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 0.004 * (featuresDirection == 0 ? 1 : -1);
    }
    if (featuresIndx == 1){
      camera.position.x += Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 10 * (featuresDirection == 0 ? 1 : -1);
      camera.position.z -= Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 10 * (featuresDirection == 0 ? 1 : -1);
      camera.position.y -= Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 4 * (featuresDirection == 0 ? 1 : -1);
      camera.rotation.z += Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 0.022 * (featuresDirection == 0 ? 1 : -1);
      camera.rotation.y += Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 0.012 * (featuresDirection == 0 ? 1 : -1);
      camera.rotation.x -= Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 0.018 * (featuresDirection == 0 ? 1 : -1);
    }
    if (featuresIndx == 2){
      camera.position.z -= Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 17 * (featuresDirection == 0 ? 1 : -1);
      camera.position.y += Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 1 * (featuresDirection == 0 ? 1 : -1);
      camera.rotation.x -= Math.sin(featuresAnimationFrame/100*(Math.PI)) * 1.6 * 0.01 * (featuresDirection == 0 ? 1 : -1);
    }
    captions[featuresIndx].forEach(function(elem){
      if (featuresDirection == 0){
        elem.material.opacity = featuresAnimationFrame/120;
      } else {
        elem.material.opacity = 101/featuresAnimationFrame/100;
      }
    });
    titlesLines.forEach(function(line){
      if (featuresDirection == 1){
        line.material.opacity = featuresAnimationFrame/120;
      } else {
        line.material.opacity = 101/featuresAnimationFrame/100;
      }
    });
    titles.forEach(function(title){
      if (featuresDirection == 1){
        title.material.opacity = featuresAnimationFrame/120;
      } else {
        title.material.opacity = 101/featuresAnimationFrame/100;
      }
    });
    featuresAnimationFrame++;
    if (featuresAnimationFrame == 100 && featuresDirection == 0){
      $('.back-link').addClass('active');
      $('.color-block').addClass('disabled');
      featuresOut();
      endAnimationCallback();
    }
    if (featuresAnimationFrame == 100 && featuresDirection == 1){
      featuresIn();
      endAnimationCallback();
      $('.color-block').removeClass('disabled');
      featuresShowing = false;
    }
  }else {
    featuresAnimation = false;
    featuresAnimationFrame = 0;
  }


  cameraCube.rotation.x = 0;
  cameraCube.rotation.y = 0;
  cameraCube.rotation.z = 0;
  // stats.end();
  // if (controls != undefined){
  //   controls.update();
  // }

  renderer.render( sceneCube, cameraCube );
  renderer.render( scene, camera );
}

function parseColor(){
  console.log(this.color);
}





// var SCREEN_WIDTH = window.innerWidth - 100;
// var SCREEN_HEIGHT = window.innerHeight - 100;

// var camera, scene;
// var canvasRenderer, webglRenderer;

// var container, mesh, geometry, plane;

// var windowHalfX = window.innerWidth / 2;
// var windowHalfY = window.innerHeight / 2;

// init();
// animate();

// function init() {

//     container = document.createElement('div');
//     document.body.appendChild(container);

//     camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000);
//     camera.position.x = 1200;
//     camera.position.y = 1000;
//     camera.lookAt({
//         x: 0,
//         y: 0,
//         z: 0
//     });

//     scene = new THREE.Scene();
    
//     var groundMaterial = new THREE.MeshPhongMaterial({
//         color: 0x6C6C6C
//     });
//     plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), groundMaterial);
//     plane.rotation.x = -Math.PI / 2;
//     plane.receiveShadow = true;

//     scene.add(plane);

//     // LIGHTS
//     scene.add(new THREE.AmbientLight(0x666666));

//     var light;

//     light = new THREE.DirectionalLight(0xdfebff, 1.75);
//     light.position.set(300, 400, 50);
//     light.position.multiplyScalar(1.3);

//     light.castShadow = true;
//     light.shadowCameraVisible = true;

//     light.shadowMapWidth = 512;
//     light.shadowMapHeight = 512;

//     var d = 200;

//     light.shadowCameraLeft = -d;
//     light.shadowCameraRight = d;
//     light.shadowCameraTop = d;
//     light.shadowCameraBottom = -d;

//     light.shadowCameraFar = 1000;
//     light.shadowDarkness = 0.2;

//     scene.add(light);
    
//     var boxgeometry = new THREE.CubeGeometry(100, 100, 100);
//     var boxmaterial = new THREE.MeshLambertMaterial({
//         color: 0x0aeedf
//     });
//     var cube = new THREE.Mesh(boxgeometry, boxmaterial);
//     cube.castShadow = true;
//     cube.position.x = 0;
//     cube.position.y = 100;
//     cube.position.z = 0;

//     scene.add(cube);

//     // RENDERER
//     webglRenderer = new THREE.WebGLRenderer();
//     webglRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
//     webglRenderer.domElement.style.position = "relative";
//     webglRenderer.shadowMapEnabled = true;
//     webglRenderer.shadowMapSoft = true;

//     container.appendChild(webglRenderer.domElement);
//     window.addEventListener('resize', onWindowResize, false);
// }

// function onWindowResize() {
//     windowHalfX = window.innerWidth / 2;
//     windowHalfY = window.innerHeight / 2;

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     webglRenderer.setSize(window.innerWidth, window.innerHeight);
// }

// function animate() {
//     var timer = Date.now() * 0.0002;
//     camera.position.x = Math.cos(timer) * 1000;
//     camera.position.z = Math.sin(timer) * 1000;
//     requestAnimationFrame(animate);
//     render();
// }

// function render() {
//     camera.lookAt(scene.position);
//     webglRenderer.render(scene, camera);
// }
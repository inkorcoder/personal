if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var CAR = {
	name:	"Bugatti Veyron",
	url: 	"obj/veyron/VeyronNoUv_bin.js",
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

var m, mi;

var directionalLight, pointLight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var loader = new THREE.BinaryLoader();

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// CAMERAS
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100000 );
	cameraCube = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.0001, 1000000 );

	// SCENE
	scene = new THREE.Scene();
	sceneCube = new THREE.Scene();

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

	var axisHelper = new THREE.AxisHelper(5000);
	scene.add(axisHelper);

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

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setFaceCulling( THREE.CullFaceNone );
	renderer.autoClear = false;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;


	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	CAR.materials = {
		body: [
			[ "Orange metal", 	MATERIALS[ "Orange metal" ] ],
			[ "Blue metal", 	MATERIALS[ "Blue metal" ] ],
			[ "Red metal", 		MATERIALS[ "Red metal" ] ],
			[ "Green metal",	MATERIALS[ "Green metal" ] ],
			[ "Black metal", 	MATERIALS[ "Black metal" ] ],
			[ "Gold", 		MATERIALS[ "Gold" ] ],
			[ "Bronze", 	MATERIALS[ "Bronze" ] ],
			[ "Chrome", 	MATERIALS[ "Chrome" ] ]
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
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	cameraCube.aspect = window.innerWidth / window.innerHeight;
	cameraCube.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
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
}

function onDocumentMouseMove(event) {
	mouseY = ( event.clientY - window.innerHeight );
	mouseX = ( event.clientX - window.innerWidth );
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {

	var timer = -0.0005 * Date.now();

	camera.position.x = 0
	camera.position.y = ( - mouseY - 300 ) * 2;
	camera.position.z = 1000
	// camera.position.x = ( - mouseX - 300 ) * 2;
	// camera.position.z = ( - mouseX - 300 ) * 2;

	camera.lookAt( scene.position );
	cameraCube.rotation.copy( camera.rotation );

	renderer.render( sceneCube, cameraCube );
	renderer.render( scene, camera );
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
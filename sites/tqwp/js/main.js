var app = new Vue({
	el: '#app',
	data: {
		lang: window.lang,
		aside: false,
		size: {
			x: 350, y: 0, z: 0
		},
		partition: {
			x: 0, y: 0, z: 0
		},
		port: {
			x: 0, y: 0, z: 20
		},
		horn: {
			s: 0, l: 0, S0: 0, Sl: 0
		},
		thickness: 20,
		fs: 55,
		sd: 248,
		sd2: 0,
		waveLength: 0,
		holeDiameter: 260,
		radius: 0,
		activePanel: null,
		elongation: 1,
		planeDetailKeys: [
			{key: 'width', unit: 'mm'},
			{key: 'height', unit: 'mm'},
			{key: 'thickness', unit: 'mm'},
			{key: 'square', unit: 'm2'}
		]
	},
	methods: {
		toggleSide: function(side, value){
			if (!side) return;
			window.box[side].visible = value;
		},
		updateRects: function(){
			this.horn.s = Math.PI * Math.pow(this._data.sd/2, 2) * 2.58;

			this.port.x = this.size.x;
			this.port.y = this.sd2 / this.port.x;

			this.size.z = Math.floor(this.horn.s / this.size.x + this.thickness);


			this.sd2 = Math.PI * Math.pow(this.sd / 2, 2);

			this.horn.S0 = this.size.x * this.port.z;
			this.horn.SL = this.size.x * (this.size.z - this.port.z - this.thickness);

			// this.elongation = (this.waveLength / 4) + (this.waveLength * 0.1025) * Math.log(this.horn.SL / this.horn.S0);

			this.elongation = 1.52;
			this.waveLength = Math.getWaveLength(this.fs);
			this.horn.l = this.waveLength / 4 * 1000 * this.elongation;

			this.size.y = Math.floor(this.horn.l / 2);

			// console.log(this.elongation, this.horn.l);
			fitSpeaker();
			createBox();
			if (this.activePanel){
				let key = this.activePanel;
				this.showHelper(null);
				this.showHelper(key);
			}
		},
		handleInputChanging: function(e){
			// console.log(e.target.value);
			var $this = this;
			this.size.x = parseInt(this.size.x);
			this.thickness = parseInt(this.thickness);
			this.holeDiameter = parseInt(this.holeDiameter);
			if (this.holeDiameter > this.size.x){
				this.holeDiameter = this.size.x;
			}
			waitForFinalEvent(function(){
				if (!parseInt(e.target.value)) return;
				$this.updateRects();
			}, 1000, '');
		},
		toggleAside: function(){
			this.aside = !this.aside;
		},
		showHelper: function(key){
			for (let k in HELPERS){
				scene.remove(HELPERS[k]);
			}
			if (!key || key === this.activePanel){
				this.activePanel = null;
				this.highlightSide(this.activePanel);
				return;
			};
			this.activePanel = key;
			this.highlightSide(this.activePanel);
			HELPERS[key] = createHelper(box[key]);
			scene.add(HELPERS[key]);
		},
		highlightSide: function(key){
				for (let k in box){
					if (box[k].material){
						box[k].material.transparent = key ? true : false;
						box[k].material.opacity = key ? .3 : 1;
					}
				}
			if (key && box[key].material){
				box[key].material.transparent = false;
				box[key].material.opacity = 1;
			}
		}
	}
});

function getWindowWidth(){
	return window.innerWidth > 768 ? window.innerWidth-ASIDE_WIDTH : window.innerWidth;
}

var blue = 0x5e7eff;
var MIN_ZOOM = 500,
		MAX_ZOOM = 3000;
var ASIDE_WIDTH = 350;
var HORN_START_POINT;
var MIDDLE_POINT;
var box;
var FAKE_CYLINDER;
var SPEAKER, _speakerObject;
var TEXTURES = [
	new THREE.TextureLoader().load("textures/floor.jpg"),
	new THREE.TextureLoader().load("textures/wood1.jpg"),
	new THREE.TextureLoader().load("textures/wood2.jpg"),
	new THREE.TextureLoader().load("textures/wood3.jpg"),
	new THREE.TextureLoader().load("textures/wood4.jpg"),
	new THREE.TextureLoader().load("textures/wood5.jpg"),
	new THREE.TextureLoader().load("textures/wood6.jpg")
];
var HELPERS = {},
		HELPERS_CANVAS = document.createElement('canvas'),
		HELPERS_CTX = HELPERS_CANVAS.getContext('2d');

var POINTS = {};

HELPERS_CANVAS.width = 256;
HELPERS_CANVAS.height = 128;

TEXTURES[0].wrapS = THREE.RepeatWrapping;
TEXTURES[0].wrapT = THREE.RepeatWrapping;
TEXTURES[0].repeat.set( 10, 10 );
var FLOOR = new THREE.Mesh(
	new THREE.PlaneGeometry(20000,20000,1,1),
	new THREE.MeshStandardMaterial({
		color: 0x999999,
		map: TEXTURES[0],
		roughness: 1,
		metalness: 0,
		side: THREE.FrontSide
	})
);
FLOOR.rotation.x = -Math.PI/2;
FLOOR.receiveShadow = true;

function Plane(sizeX, sizeY, sizeZ, image){
	var texture = TEXTURES[image||1];
	texture.anisotropy = 12;
	var geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
	var material = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		map: texture,
		roughness: 1,
		metalness: 0,
		side: THREE.FrontSide
	});
	var plane = new THREE.Mesh( geometry, material );
	plane.castShadow = true;
	// plane.receiveShadow = true;
	return plane;
}

function Point(x, y, z, color){
	var point = new THREE.Mesh(
		new THREE.SphereGeometry(10, 10, 10),
		new THREE.MeshBasicMaterial({color: color || 0xff0000})
	);
	point.position.set(x, y, z);
	return point;
}

function intersect(meshA, meshB){
	var bspA = new ThreeBSP(meshA);
	var bspB = new ThreeBSP(meshB);
	var bspResult = bspA.union(bspB);
	var resultMesh = bspResult.toMesh(meshA.material);
	resultMesh.castShadow = true;
	resultMesh.geometry.computeVertexNormals();
	return resultMesh;
};

// FAKE_CYLINDER.position.z = app.size.z/2-app.thickness;


var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffeedd);
var light = new THREE.AmbientLight( 0x777777 ); // soft white light
scene.add( light );
scene.add(FLOOR);

scene.fog = new THREE.Fog(0xffeedd, 6000, 8000);

var light = new THREE.SpotLight( 0xffffff, 1.2 );
light.castShadow = true;
scene.add( light );
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.far = 50000;
light.position.z = 15000;
light.position.x = -15000;
light.position.y = 30000;

// var axesHelper = new THREE.AxesHelper( 500 );
// scene.add( axesHelper );
// scene.fog = new THREE.Fog(0xffffff, 500, 1000);
var camera = new THREE.PerspectiveCamera( 50, getWindowWidth()/window.innerHeight, 0.1, 100000 );
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = window.innerWidth > 768;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize( getWindowWidth(), window.innerHeight );
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableKeys = false;
controls.minDistance = MIN_ZOOM;
controls.maxDistance = MAX_ZOOM;
document.querySelector('#app').appendChild( renderer.domElement );

window.addEventListener('resize', function(){
	camera.aspect = getWindowWidth() / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(getWindowWidth(), window.innerHeight);
});

var loader = new THREE.OBJLoader();
loader.load("meshes/noema.obj", function(obj){
	_speakerObject = obj;
	app.updateRects();
});

function createBox(){

	if (box) {
		for (var key in box){
			scene.remove(box[key]);
		}
		box = null;
	}

	// console.log(app.size.x);

	var p1v = new THREE.Vector2(POINTS.hornStart.position.z, POINTS.hornStart.position.y),
			p2v = new THREE.Vector2(POINTS.hornMiddle.position.z, POINTS.hornMiddle.position.y),
			angle = Math.PI/2-p2v.clone().sub(p1v).angle();
	app.partition.y = Math.floor(p1v.distanceTo(p2v));
	// app.partition.y = (app.size.y-app.port.y-app.size.z/2-app.thickness).toFixed();

	box = {
		_front: Plane(app.size.x+app.thickness*2, app.size.y-app.port.y+app.thickness*2, app.thickness, 3),
		left: Plane(app.thickness, app.size.y+app.thickness*2, app.size.z, 3),
		right: Plane(app.thickness, app.size.y+app.thickness*2, app.size.z, 3),
		top: Plane(app.size.x, app.thickness, app.size.z, 3),
		bottom: Plane(app.size.x, app.thickness, app.size.z, 3),
		rear: Plane(app.size.x+app.thickness*2, app.size.y+app.thickness*2, app.thickness, 3),
		partition: Plane(app.size.x, app.partition.y, app.thickness, 3),
		port: Plane(app.size.x, app.thickness, app.port.z+app.thickness, 3)
	};

	box.partition.rotation.x = angle;

	if (!FAKE_CYLINDER){
		box.front = Plane(app.size.x + app.thickness*2, app.size.y-app.port.y+app.thickness*2, app.thickness, 3);
	} else {
		var meshA = Plane(app.size.x + app.thickness*2, app.size.y-app.port.y+app.thickness*2, app.thickness, 3);
		meshA.position.set(0,0,0);
		var meshB = Object.assign(FAKE_CYLINDER);
		meshB.position.set(0, POINTS.hornMiddle.position.y-app.port.y/2, 0);
		box.front = intersect(meshA, meshB);
	}

	box.front.position.z = app.size.z/2+app.thickness/2;
	box.front.position.y = app.port.y/2;

	// box.left.rotation.set(0, -Math.PI/2, 0);
	box.left.position.x = -app.size.x/2-app.thickness/2;

	// box.right.rotation.set(0, Math.PI/2, 0);
	box.right.position.x = app.size.x/2+app.thickness/2;
	box.right.visible = false;

	box.top.position.y = app.size.y/2+app.thickness/2;
	box.bottom.position.y = -app.size.y/2-app.thickness/2;

	box.rear.position.z = -app.size.z/2-app.thickness/2;

	box.port.position.y = -app.size.y/2 + app.port.y - app.thickness/2;
	box.port.position.z = app.size.z/2 - (app.port.z+app.thickness)/2;

	box.speaker = SPEAKER ? Object.assign(SPEAKER) : new THREE.Object3D();

	scene.add( box.front );
	scene.add( box.left );
	scene.add( box.right );
	scene.add( box.top );
	scene.add( box.bottom );
	scene.add( box.rear );
	scene.add( box.partition );
	scene.add( box.port );
	scene.add( box.speaker );


	// POINTS.hornStart.scale.set(5,5,5);
	// POINTS.hornMiddle.scale.set(5,5,5);
	// console.log(POINTS.hornStart.position, POINTS.hornMiddle.position);
	// console.log(p1v, p2v, p1v.distanceTo(p2v));
	var partitionPosition = Math.getMiddleVector(POINTS.hornStart, POINTS.hornMiddle);
	var pp = Point(partitionPosition.x, partitionPosition.y, partitionPosition.z);

	// scene.add(pp);
	// console.log(partitionPosition);
	box.partition.position.y = partitionPosition.y;
	box.partition.position.z = partitionPosition.z;


	// scene.add(POINTS.hornMiddle);
	// scene.add(POINTS.hornStart);

	FLOOR.position.y = -app.size.y/2-app.thickness;


	// helpers
	// for (let k in HELPERS){
	// 	scene.remove(HELPERS[k]);
	// }
	// // for (let k in box){
	// // 	HELPERS[k] = createHelper(box[k]);
	// // 	scene.add(HELPERS[k]);
	// // }
	// HELPERS["front"] = createHelper(box["front"]);
	// scene.add(HELPERS["front"]);
	// // HELPERS["top"] = createHelper(box["top"]);
	// // scene.add(HELPERS["top"]);
}

function createLine(pointA, pointB){
	if (pointA.hasOwnProperty("length")){
		pointB = pointA[1];
		pointA = pointA[0];
	}
	var geometry = new THREE.Geometry();
	geometry.vertices.push(pointA);
	geometry.vertices.push(pointB);
	return new THREE.Line(geometry, new THREE.LineBasicMaterial({
		color: new THREE.Color("#5e7eff"),
		linewidth: 2
	}));
}

function fitSpeaker(){
	if (FAKE_CYLINDER) {
		scene.remove(FAKE_CYLINDER);
	}
	if (SPEAKER){
		scene.remove(SPEAKER);
	}

	for (var k in POINTS){
		scene.remove(POINTS[k]);
	}
	POINTS = {
		hornStart: Point(0, -app.size.y/2+app.port.y, app.size.z/2-app.port.z-app.thickness/2, blue),
		hornMiddle: Point(0, app.size.y/2-app.thickness-app.size.z/2, 0, blue),
		hornMiddleTop: Point(0, app.size.y/2, 0, blue),
		hornMiddleFront: Point(0, app.size.y/2-app.thickness-app.size.z/2, app.size.z/2, blue),
		hornMiddleRear: Point(0, app.size.y/2-app.thickness-app.size.z/2, -app.size.z/2, blue)
	};
	for (var k in POINTS){
		scene.add(POINTS[k]);
	}


	// if (POINTS.hornStart){
	// 	scene.remove(POINTS.hornStart);
	// }
	// POINTS.hornStart = Point(0, -app.size.y/2+app.port.y, app.size.z/2-app.port.z-app.thickness/2);
	// if (POINTS.hornMiddle){
	// 	scene.remove(POINTS.hornMiddle);
	// }
	// POINTS.hornMiddle = Point(0, app.size.y/2-app.thickness-app.size.z/2, 0);

	// console.log(POINTS.hornMiddle, POINTS.hornStart);

	FAKE_CYLINDER = new THREE.Mesh(
		new THREE.CylinderGeometry(app.holeDiameter/2, app.holeDiameter/2, 60, 32),
		new THREE.MeshBasicMaterial({color: 0xffff00})
	);
	FAKE_CYLINDER.rotation.x = Math.PI/2;
	FAKE_CYLINDER.position.z = app.size.z/2+app.thickness/2;
	FAKE_CYLINDER.position.y = POINTS.hornMiddle.position.y;
	FAKE_CYLINDER.visible = false;

	if (_speakerObject){
		SPEAKER = Object.assign(_speakerObject);

		SPEAKER.scale.set(app.sd/9,app.sd/9,app.sd/9);
		SPEAKER.rotation.x = Math.PI/2;
		SPEAKER.position.z = (app.size.z - app.thickness) / 2 + app.thickness*1.5;
		SPEAKER.position.y = FAKE_CYLINDER.position.y;
		SPEAKER.children.forEach(function(child) {
			child.geometry.computeVertexNormals();
			// console.log(child);
			child.material = new THREE.MeshStandardMaterial({
				color: child.name.match(/diffusor/gim) ? 0x444444 : 0x111111,
				side: THREE.DoubleSide,
				roughness: 1,
				metalness: 0
			});
			// child.castShadow = true;
			// child.receiveShadow = true;
		});
		// console.log(obj);
		// scene.add(SPEAKER);
	}

	scene.add(FAKE_CYLINDER);
}

function createHelperText(text){
	HELPERS_CTX.beginPath();
	HELPERS_CTX.textAlign = "center";
	HELPERS_CTX.textBaseline = "middle";
	HELPERS_CTX.fillStyle = "#5e7eff";
	HELPERS_CTX.font = (HELPERS_CANVAS.height/2)+"px sans-serif";
	HELPERS_CTX.fillRect(0, 0, HELPERS_CANVAS.width, HELPERS_CANVAS.height);
	HELPERS_CTX.fillStyle = "#fff";
	HELPERS_CTX.fillText(text, HELPERS_CANVAS.width/2, HELPERS_CANVAS.height/2);
	var temp = document.createElement('canvas'),
			ctx = temp.getContext('2d');
	temp.width = HELPERS_CANVAS.width;
	temp.height = HELPERS_CANVAS.height;
	ctx.putImageData(HELPERS_CTX.getImageData(0, 0, HELPERS_CANVAS.width, HELPERS_CANVAS.height), 0, 0);
	var texture = new THREE.CanvasTexture(temp);
	texture.anisotropy = 24;
	texture.needsUpdate = true;
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(HELPERS_CANVAS.width/2, HELPERS_CANVAS.height/2, 2, 2), new THREE.MeshBasicMaterial({
		color: 0xffffff,
		map: texture,
		depthTest: false,
		side: THREE.DoubleSide
	}));

	var helper = new THREE.Object3D();
	// helper.add(Point(0, 0, 0));
	helper.add(plane);
	helper.plane = plane;
	return helper;
}

function createHelper(planeObject){
	var helper = new THREE.Object3D();
	helper.gizmo = new THREE.Mesh(planeObject.geometry, new THREE.MeshBasicMaterial({
		color: new THREE.Color("#5e7eff"),
		map: planeObject.material.map
	}));
	helper.gizmo.geometry.computeVertexNormals();
	// helper.gizmo.material.color = new THREE.Color('#5e7eff');

	// console.log(planeObject.rotation);
	// helper.gizmo.scale.set(1.1,1.1,1.1);
	helper.add(helper.gizmo);
	helper.position.add(planeObject.position);
	helper.rotation.x = planeObject.rotation.x;
	helper.rotation.y = planeObject.rotation.y;
	helper.rotation.z = planeObject.rotation.z;

	planeObject.geometry.computeBoundingBox();

	var min = planeObject.geometry.boundingBox.min.clone(),
			max = planeObject.geometry.boundingBox.max.clone();

	// console.log(min, max);

	// helper.add(Point(min.x, min.y, min.z));
	// helper.add(Point(max.x, max.y, max.z));

	var xHelper = createHelperText((max.x-min.x).toFixed()+"мм");
	xHelper.metric = max.x-min.x;
	xHelper.position.y = max.y + HELPERS_CANVAS.height/2;
	xHelper.position.z = max.z;
	var lines = {
		main: createLine(Math.getSidePoints(min, max, "x")),
		left: createLine(Math.getSidePoints(min, max, "-x", HELPERS_CANVAS.height/2)),
		right: createLine(Math.getSidePoints(min, max, "+x", HELPERS_CANVAS.height/2))
	};
	xHelper.plane.position.y = HELPERS_CANVAS.height/4;
	xHelper.add(lines.main);
	xHelper.add(lines.left);
	xHelper.add(lines.right);

	var yHelper = createHelperText((max.y-min.y).toFixed()+"мм");
	yHelper.metric = max.y-min.y;
	// yHelper.position.y = min.y + max.clone().sub(min).divideScalar(2).y;
	yHelper.position.z = max.z + HELPERS_CANVAS.height/2;
	yHelper.position.x = min.x;
	yHelper.plane.rotation.y = Math.PI/2;
	yHelper.plane.rotation.x = Math.PI/2;
	yHelper.plane.position.z = HELPERS_CANVAS.height/4;
	var lines = {
		main: createLine(Math.getSidePoints(min, max, "y")),
		bottom: createLine(Math.getSidePoints(min, max, "-y", HELPERS_CANVAS.height/2)),
		top: createLine(Math.getSidePoints(min, max, "+y", HELPERS_CANVAS.height/2))
	};
	// lines.main.rotation.z = Math.PI/2;
	// lines.top.rotation.y = Math.PI/2;
	// console.log(lines.main);
	yHelper.add(lines.main);
	yHelper.add(lines.top);
	yHelper.add(lines.bottom);


	var zHelper = createHelperText((max.z-min.z).toFixed()+"мм");
	zHelper.metric = max.z-min.z;
	zHelper.plane.rotation.x = -Math.PI/2;
	zHelper.plane.rotation.z = Math.PI/2;
	zHelper.position.y = max.y;
	zHelper.position.z = min.z + (max.z - min.z) / 2;
	zHelper.position.x = max.x + HELPERS_CANVAS.height/2;
	zHelper.plane.position.x = HELPERS_CANVAS.height/4;
	// zHelper.position.z = max.z + HELPERS_CANVAS.height/4;
	var lines = {
		main: createLine(Math.getSidePoints(min, max, "z")),
		front: createLine(Math.getSidePoints(min, max, "-z", HELPERS_CANVAS.height/2)),
		rear: createLine(Math.getSidePoints(min, max, "+z", HELPERS_CANVAS.height/2))
	};
	// lines.main.rotation.z = Math.PI/2;
	// lines.top.rotation.y = Math.PI/2;
	// console.log(lines.main);
	zHelper.add(lines.main);
	zHelper.add(lines.rear);
	zHelper.add(lines.front);

	// console.log(min, max);

	// plane.translate(planeObject.position.x, planeObject.position.y, planeObject.position.z);

	helper.xHelper = xHelper;
	helper.yHelper = yHelper;
	helper.zHelper = zHelper;

	helper.add(xHelper);
	helper.add(yHelper);
	helper.add(zHelper);
	return helper;
}

app.updateRects();




// console.log(angle);



camera.position.z = 1000;
camera.position.y = 1000;
camera.position.x = 1000;
controls.update();










var animate = function(){
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
};
animate();


window.waitForFinalEvent = (function() {
	var timers;
	timers = {};
	return function(callback, ms, uniqueId) {
		if (!uniqueId) {
			uniqueId = 'Don\'t call this twice without a uniqueId';
		}
		if (timers[uniqueId]) {
			clearTimeout(timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();
var r = "textures/cube/garage/";
var urls = [ r + "posx.jpg", r + "negx.jpg",
			 r + "posy.jpg", r + "floor.jpg",
			 r + "posz.jpg", r + "negz.jpg" ];

var textureCube = THREE.ImageUtils.loadTextureCube( urls );
textureCube.format = THREE.RGBFormat;


light = new THREE.SpotLight(0xdfebff, 1.75);
light.position.set(500, 1500, 300);
light.castShadow = true;
light.shadowCameraVisible = false;
light.shadowMapWidth = 2048;
light.shadowMapHeight = 2048;
var d = 500;
light.shadowCameraLeft = -d;
light.shadowCameraRight = d;
light.shadowCameraTop = d;
light.shadowCameraBottom = -d;
light.shadowCameraFar = 3000;
light.shadowDarkness = 0.9;




var asphalt = new THREE.ImageUtils.loadTexture('textures/cube/garage/floor.jpg');
asphalt.wrapS = THREE.RepeatWrapping;
asphalt.wrapT = THREE.RepeatWrapping;
asphalt.repeat.set( 200, 200 );
asphalt.anisotropy = 12;
plane = new THREE.Mesh(new THREE.PlaneGeometry(100000,100000,10), new THREE.MeshPhongMaterial({
	color: 0xffffff,
	map: asphalt
}));
plane.position.y = -190;
var MATERIALS = {
	"Orange": 	new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 } ),
	"Blue": 	new THREE.MeshLambertMaterial( { color: 0x001133, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 } ),
	"Red": 		new THREE.MeshLambertMaterial( { color: 0x660000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),
	"Black": 	new THREE.MeshLambertMaterial( { color: 0x000000, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.15 } ),
	"White":	new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),
	"Carmine": 	new THREE.MeshPhongMaterial( { color: 0x770000, specular:0xffaaaa, envMap: textureCube, combine: THREE.MultiplyOperation } ),
	"Gold": 	new THREE.MeshPhongMaterial( { color: 0xaa9944, specular:0xbbaa99, shininess:50, envMap: textureCube, combine: THREE.MultiplyOperation } ),
	"Bronze":	new THREE.MeshPhongMaterial( { color: 0x150505, specular:0xee6600, shininess:10, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.25 } ),
	"Chrome": 	new THREE.MeshPhongMaterial( { color: 0xffffff, specular:0xffffff, envMap: textureCube, combine: THREE.MultiplyOperation } ),
	"Orange metal": new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: textureCube, combine: THREE.MultiplyOperation } ),
	"Blue metal": 	new THREE.MeshLambertMaterial( { color: 0x001133, envMap: textureCube, combine: THREE.MultiplyOperation } ),
	"Red metal": 	new THREE.MeshLambertMaterial( { color: 0x770000, envMap: textureCube, combine: THREE.MultiplyOperation } ),
	"Green metal": 	new THREE.MeshLambertMaterial( { color: 0x007711, envMap: textureCube, combine: THREE.MultiplyOperation } ),
	"Black metal":	new THREE.MeshLambertMaterial( { color: 0x1E1B30, envMap: textureCube, combine: THREE.MultiplyOperation } ),
	"Pure chrome": 	new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: textureCube } ),
	"Dark chrome":	new THREE.MeshLambertMaterial( { color: 0x444444, envMap: textureCube } ),
	"Darker chrome":new THREE.MeshLambertMaterial( { color: 0x222222, envMap: textureCube } ),
	"Black glass": 	new THREE.MeshLambertMaterial( { color: 0x101016, envMap: textureCube, opacity: 0.975, transparent: true } ),
	"Dark glass":	new THREE.MeshLambertMaterial( { color: 0x101046, envMap: textureCube, opacity: 0.25, transparent: true } ),
	"Blue glass":	new THREE.MeshLambertMaterial( { color: 0x668899, envMap: textureCube, opacity: 0.75, transparent: true } ),
	"Light glass":	new THREE.MeshBasicMaterial( { color: 0x223344, envMap: textureCube, opacity: 0.25, transparent: true, combine: THREE.MixOperation, reflectivity: 0.25 } ),
	"Red glass":	new THREE.MeshLambertMaterial( { color: 0xff0000, opacity: 0.75, transparent: true } ),
	"Yellow glass":	new THREE.MeshLambertMaterial( { color: 0xffffaa, opacity: 0.75, transparent: true } ),
	"Orange glass":	new THREE.MeshLambertMaterial( { color: 0x995500, opacity: 0.75, transparent: true } ),
	"Orange glass 50":	new THREE.MeshLambertMaterial( { color: 0xffbb00, opacity: 0.5, transparent: true } ),
	"Red glass 50": 	new THREE.MeshLambertMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } ),
	"Fullblack rough":	new THREE.MeshLambertMaterial( { color: 0x000000 } ),
	"Black rough":		new THREE.MeshLambertMaterial( { color: 0x050505 } ),
	"Darkgray rough":	new THREE.MeshLambertMaterial( { color: 0x090909 } ),
	"Red rough":		new THREE.MeshLambertMaterial( { color: 0x330500 } ),
	"Darkgray shiny":	new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x050505 } ),
	"Gray shiny":		new THREE.MeshPhongMaterial( { color: 0x050505, shininess: 20 } )
};
Math.Speed = 343000000;
Math.FS = 0.75;

Math.getWaveLength = function(frequency){
	return Math.Speed / frequency / 1000000;
};

Math.getMiddleVector = function(pointA, pointB){
	var dir = pointB.position.clone().sub(pointA.position);
	var len = dir.length();
	dir = dir.normalize().multiplyScalar(len * .5);
	return pointA.position.clone().add(dir);
};

Math.getSidePoints = function(min, max, axis, offset){

	min = min.clone();
	max = max.clone();

	var result = [
		new THREE.Vector3(),
		new THREE.Vector3()
	];

	if (axis === "x" || axis === "-x" || axis === "+x"){
		result[0].x = min.x;
		result[1].x = max.x;
	}
	if (axis === "-x"){
		result[1].y = -offset;
		result[1].x = result[0].x;
	}
	if (axis === "+x"){
		result[1].y = -offset;
		result[0].x = result[1].x;
	}

	if (axis === "y" || axis === "-y" || axis === "+y"){
		result[0].y = min.y;
		result[1].y = max.y;
	}
	if (axis === "-y"){
		result[1].y = min.y;
		result[1].z = -offset;
	}
	if (axis === "+y"){
		result[0].y = max.y;
		result[0].z = -offset;
	}

	if (axis === "z" || axis === "-z" || axis === "+z"){
		result[0].z = min.z;
		result[1].z = max.z;
	}
	if (axis === "-z"){
		result[1].z = min.z;
		result[1].x = -offset;
	}
	if (axis === "+z"){
		result[0].z = max.z;
		result[0].x = -offset;
	}


	return result;

};

Math.getSideParameters = function(side){

	var metrics = {
		width: 0,
		height: 0,
		depth: 0,
		length: 0,
		thickness: 0,
		square: 0
	};

	if (window.box[side]){
		var mesh = window.box[side],
				x = HELPERS[side].xHelper,
				y = HELPERS[side].yHelper,
				z = HELPERS[side].zHelper;
		// console.log(x.metric, y.metric, z.metric);

		metrics.thickness = app.thickness;

		if (side === "front" || side === "rear" || side === "partition"){
			metrics.width = x.metric.toFixed();
			metrics.height = y.metric.toFixed();
		}
		if (side === "top" || side === "bottom" || side === "port"){
			metrics.width = x.metric.toFixed();
			metrics.height = z.metric.toFixed();
		}
		if (side === "left" || side === "right"){
			metrics.width = z.metric.toFixed();
			metrics.height = y.metric.toFixed();
		}

		// metrics.width = app.size.x;
		// metrics.thickness = app.thickness;

		// if (side === "front" || side === "rear"){
		// 	metrics.width += app.thickness*2;
		// }
		// if (side === "front"){
		// 	metrics.height = (app.size.y - app.port.y).toFixed();
		// }
		// if (side === "left" || side === "right"){
		// 	metrics.height = (app.size.y).toFixed();
		// 	metrics.width = app.size.z;
		// }
		// if (side === "top" || side === "bottom"){
		// 	metrics.height = app.size.z;
		// }
		// if (side === "partition"){
		// 	metrics.height = app.partition.y
		// }
	}

	metrics.square = ((metrics.width * metrics.height) / 1000000).toFixed(2);

	return metrics;
};
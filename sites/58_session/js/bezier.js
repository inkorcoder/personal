var Bezier = {

	getPointInLine(p0, p1, t) {
		var point = new Vector();
		point.x = p0.x - ((p0.x - p1.x) * t);
		point.y = p0.y - ((p0.y - p1.y) * t);
		return point;
	},

	getPointInCubic(p0, p1, p2, p3, t){
		var A = this.getPointInLine(p0, p1, t),
				B = this.getPointInLine(p1, p2, t),
				C = this.getPointInLine(p2, p3, t),
				D = this.getPointInLine(A, B, t),
				E = this.getPointInLine(B, C, t),
				F = this.getPointInLine(D, E, t);
		return F;
	},

	getPointInQuadrant(p0, p1, p2, t){
		var A = this.getPointInLine(p0, p1, t),
				B = this.getPointInLine(p1, p2, t),
				C = this.getPointInLine(A, B, t);
		return C;
	},

	getPointInPath(path, t){
		var point = new Vector();
		var i = Math.floor(t * path.length);
		var _t = t / path.length;

		// console.log(t, t * path.length - i);

		if (i <= 1){
			var fragment = {
				a: path[0],
				b: path[1],
				c: path[1].getMiddleWith(path[2])
			};
			var delta = t * path.length / 2;
			var interpolationPoint = this.getPointInQuadrant(fragment.a, fragment.b, fragment.c, delta);
			point.x = interpolationPoint.x;
			point.y = interpolationPoint.y;
		}
		if (i >= path.length-2){
			var fragment = {
				a: path.end(2).getMiddleWith(path.end(1)),
				b: path.end(1),
				c: path.end()
			};
			var delta = ((t * (path.length)) - path.length) / 2 + 1;
			// console.log(delta)
			var interpolationPoint = this.getPointInQuadrant(fragment.a, fragment.b, fragment.c, delta);
			point.x = interpolationPoint.x;
			point.y = interpolationPoint.y;
		}
		if (i > 1 && i < path.length-2){
			var fragment = {
				a: path[i-1].getMiddleWith(path[i]),
				b: path[i],
				c: path[i].getMiddleWith(path[i+1])
			};
			var delta = t * path.length - i + (_t * (i % 2));
			var interpolationPoint = this.getPointInQuadrant(fragment.a, fragment.b, fragment.c, delta);
			point.x = interpolationPoint.x;
			point.y = interpolationPoint.y;
		}


		// if (i % 2 == 0 && i >= 2 && i < path.length){
		// 	var fragment = {
		// 		a: path[i-2],
		// 		b: path[i-1],
		// 		c: path[i]
		// 	};
		// 	var delta = t * path.length - i + (_t * (i % 2));
		// 	var interpolationPoint = this.getPointInQuadrant(fragment.a, fragment.b, fragment.c, delta);
		// 	point.x = interpolationPoint.x;
		// 	point.y = interpolationPoint.y;
		// }
		// if (t === 1){
		// 	console.log('----')
		// }

		return point;
	}

};
function polarToCartesian(cx, cy, r, angle){
	var angle = (angle - 90) * Math.PI / 180;
	return {
		x: cx + r * Math.cos(angle),
		y: cy + r * Math.sin(angle)
	}
};

function describeArc(x, y, r, startAngle, endAngle, continueLine, q1, q2){
	var start = polarToCartesian(x, y, r, startAngle %= 360),
			end = polarToCartesian(x, y, r, endAngle %= 360),
			large = Math.abs(endAngle - startAngle) >= 180,
			alter = endAngle > startAngle;
	return {
		d: (continueLine && q1 && q2 ? "C"+q2.cx+","+q2.cy+" "+q1.cx+","+q1.cy+" " : "M")+start.x+","+start.y+
				"A"+r+","+r+",0,"+
				(large ? 1 : 0)+
				(alter ? 1 : 0)+
				end.x+","+end.y,
		start: start,
		end: end
	};
};

function normal(start, end){
	var dx = end.x - start.x,
			dy = end.y - start.y;
	return {
		x: -dy,
		y: dx
	} 
};

function center(start, end){
	return {
		x: start.x + (end.x - start.x) / 2,
		y: start.y + (end.y - start.y) / 2
	} 
};

function length(start, end){
	var x = end.x - start.x,
			y = end.y - start.y;
	return Math.sqrt(x*x + y*y);
};


function describeSector(x, y, r, r2, startAngle, endAngle){
	var inner = describeArc(x, y, r, startAngle, endAngle),
			outer = describeArc(x, y, r2, endAngle, startAngle, true);
	var l = length(inner.start, outer.end);
	var c = center(inner.start, outer.end);
	var n = normal(inner.start, outer.end);
	// console.log(c, n)
	var q = {cx: c.x+(n.x), cy: c.y+(n.y)};
	var q1 = {cx: inner.start.x+n.x, cy: inner.start.y+n.y};
	var q2 = {cx: outer.end.x+n.x, cy: outer.end.y+n.y};
	inner = describeArc(x, y, r, startAngle, endAngle, false);
	var l = length(outer.start, inner.end);
	var c = center(outer.start, inner.end);
	var n = normal(outer.start, inner.end); 
	var q3 = {cx: outer.start.x+n.x, cy: outer.start.y+n.y};
	var q4 = {cx: inner.end.x+n.x, cy: inner.end.y+n.y};
	outer = describeArc(x, y, r2, endAngle, startAngle, true, q3, q4);
	return inner.d+outer.d+"C"+q2.cx+","+q2.cy+" "+q1.cx+","+q1.cy+" "+inner.start.x+","+inner.start.y+"Z";
};
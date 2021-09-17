function random(min, max){
	return Math.floor(Math.random() * (max - min)) + min;
}

function Random(seed){

	return {

		next: function(min, max){
			max = max || 1;
			min = min || 0;
			seed = (seed * 9301 + 49297) % 233280;
			var rnd = seed / 233280;
			return Math.floor(min + rnd * (max - min));
		}
	}
}

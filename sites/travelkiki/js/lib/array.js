Array.prototype.min = function(){
	return Math.min.apply(null, this);
}

Array.prototype.max = function(){
	return Math.max.apply(null, this);
}

Array.prototype.flat = function(index){
	var res = [];
	for (var i = 0; i < this.length; i++){
		res.push(this[i][index]);
	}
	return res;
}

Array.prototype.search = function(key, value){
	var item = null;
	for (var i = 0; i < this.length; i++){
		if (this[i][key] && this[i][key].toString().match(new RegExp(value, 'gim'))){
			item = this[i];
			return item;
		}
	}
	return item;
};

Array.prototype.getUnusedIndex = function(undoubled){
	var index = Math.floor(Math.random()*this.length);
	if (index === undoubled){
		index = this.getUnusedIndex(undoubled);
	}
	return index;
};
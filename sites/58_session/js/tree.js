function Tree(node) {

	this.ratio = 1;

	this.translation = 0;
	this.offset = 0;
	this.padding = .2;

	this.width = 0;
	this.height = 0;

	this.canvas = node.querySelector('canvas');
	this.ctx = this.canvas.getContext('2d');

	this.branches = [];
	this._branches = [];

	this.point = new Vector();

	this.actions = [];
	this._actions = [];
	this.__actions = [];
	this.progress = 0;

	this.spring = new Vector(-40,0);
	this.spring2 = new Vector(0,0);

	/* rects */
	this.updateRects = function(){
		var rect = node.getBoundingClientRect();
		this.width = this.canvas.width = rect.width * this.ratio;
		this.height = this.canvas.height = rect.height * this.ratio;
	}
	this.updateRects();

	/* add branches */
	this.addBrunch = function(point){
		this.branches.push(point)
		this._branches = this.branches.slice();
	}

	/* shuffle */
	this.shuffle = function(seed, length){
		var rand = new Random(seed);
		var shuffledArray = this._branches.slice();
		for (var j = 0; j < shuffledArray.length-1; j++){
			indx = rand.next(j, shuffledArray.length);
			temp = shuffledArray[indx].clone();
			shuffledArray[indx].x = shuffledArray[j].clone().x;
			shuffledArray[j].x = temp.x;
		}
		this.branches = shuffledArray;
	}

	/* fill */
	this.fill = function(start, end){
		if (typeof end === "undefined"){
			end = start;
			start = 0;
		}
		this.ctx.strokeStyle = "#000";
		this.ctx.lineWidth = 4;
		p0 = Bezier.getPointInPath(this.branches, start);
		this.ctx.moveTo(p0.x, p0.y + this.offset*this.height + this.translation*this.height);
		this.ctx.beginPath();
		for (var i = 0; i < 40; i++){
			p = Bezier.getPointInPath(this.branches, start + i / 39 * (end - start));
			this.ctx.lineTo(p.x, p.y + this.offset*this.height + this.translation*this.height);
		}
		this.ctx.stroke();
	}

	/* render */
	this.render = function(){
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.lineWidth = 2;

		for (var i = 0; i < this.branches.length; i++){
			var p = this.branches[i];
			// this.ctx.beginPath();
			// this.ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
			// this.ctx.fill();
			var a, b, c;
			a = b = c = new Vector();

			/*
				render line
			*/
			this.ctx.beginPath();
			this.ctx.strokeStyle = "rgba(0,0,0,.2)";
			// first
			if (i == 0){
				a = this.branches[0].clone(),
				b = this.branches[1].clone(),
				c = this.branches[1].clone().getMiddleWith(this.branches[2].clone());
			}
			// middle
			if (i > 1 && i < this.branches.length-2){
				a = this.branches[i-1].clone().getMiddleWith(this.branches[i].clone()),
				b = this.branches[i].clone(),
				c = this.branches[i].clone().getMiddleWith(this.branches[i+1].clone());
			}
			// last
			if (i == this.branches.length-1){
				a = this.branches.end(2).clone().getMiddleWith(this.branches.end(1)),
				b = this.branches.end(1).clone(),
				c = this.branches.end().clone();
			}
			a.y += this.offset*this.height + this.translation*this.height;
			b.y += this.offset*this.height + this.translation*this.height;
			c.y += this.offset*this.height + this.translation*this.height;
			this.ctx.moveTo(a.x, a.y);
			this.ctx.quadraticCurveTo(b.x, b.y, c.x, c.y);
			this.ctx.stroke();
		}

		for (var i = 0; i < this.branches.length; i++){
			var p = this.branches[i];
			this.ctx.beginPath();
			this.ctx.arc(p.x, p.y + this.offset*this.height + this.translation*this.height, 5, 0, Math.PI*2);
			this.ctx.fill();
		}

		/*
			render action points
		*/
		for (var i = 0; i < this.actions.length; i++){
			var action = Bezier.getPointInPath(this.branches, this.actions[i]);
			var size = this.progress >= this.actions[i] && (this.actions[i+1] ? this.progress < this.actions[i+1] : true) ? 14 : 6;
			this.ctx.beginPath();
			this.ctx.fillStyle = size === 14 ? "rgba(0,0,0,1)" : "rgba(0,0,0,1)";
			this.ctx.rect(
				action.x - size/2,
				action.y + this.offset*this.height + this.translation*this.height - size/2,
				size, size
			);
			this.ctx.fill();
		}

		// this.ctx.beginPath();
		// this.ctx.arc(this.point.x, this.point.y + this.offset*this.height + this.translation*this.height, 6, 0, Math.PI*2);
		// this.ctx.fill();


	}

	this.createActions = function(count){
		this.actions.push(.2);
		this.actions.push(.45);
		this.actions.push(.77);
		// for (var i = 0; i < count; i++){
		// 	var action = i / (count-1);
		// 	this.actions.push(this.padding + (action * (1 - this.padding*2)));
		// 	this._actions.push(this.padding + (action * (1 - this.padding*2)));
		// 	this.__actions.push(this.padding + (action * (1 - this.padding*2)));
		// }
	}

	this.translate = function(value){
		this.translation = value;
	}

	this.setActivePoint = function(index){
		
	}

	this.getWorldPointFrom = function(action){
		var point = Bezier.getPointInPath(this.branches, action);
		// console.log(point)
		// $(li).css({
		// 	top: (point.y + tree.offset*tree.height/2 + tree.translation*tree.height/2 - (index/(items-1)*tree.height/2)) + "px",
		// 	left: (point.x / 2) + "px",
		// })
		return {
			top: (point.y + this.translation*this.height + this.offset*this.height) / this.ratio,
			left: point.x / this.ratio
		}
	}

}



var items = $('[data-point]').length;
var tree = new Tree(document.getElementsByClassName('tree')[0]);
var co = items * 4;
// for (var j = 0; j <= co; j++){
// 	tree.addBrunch(new Vector(
// 		tree.width / 2 + (-.5 + j / co) * (tree.width/2),
// 		j / co * tree.height
// 	));
// }

tree.addBrunch(new Vector(30, 0));
tree.addBrunch(new Vector(0, 50));
tree.addBrunch(new Vector(40, 80));
tree.addBrunch(new Vector(20, 130));
tree.addBrunch(new Vector(70, 180));
tree.addBrunch(new Vector(40, 240));
tree.addBrunch(new Vector(10, 290));
tree.addBrunch(new Vector(60, 320));
tree.addBrunch(new Vector(20, 380));
tree.addBrunch(new Vector(50, 420));
tree.addBrunch(new Vector(40, 450));
tree.addBrunch(new Vector(30, 500));

// tree.offset = 0.35;
// tree.shuffle(tree.branches.length);
tree.createActions(items);
tree.render();

var i = 0;
var steps = 200;
var progress = 0;
var prevItemIndex = 0;
var activeItemIndex = 0;
var animationRunning = false;
var oldProgress = 0;
var slideHasScroll = false;
var slideScrollPrecent = 0;
var direction = 1;
var loadingAnimation = false;
var loadedAnimation = false;
var oldFillStart = 0, oldFillEnd = 0;

var velocity = 0;
var weight = tree._branches[3].add(new Vector(-20, 0));

var offset = 0;
var velocity = new Vector();

function render(){

	tree.render();

	var k = 0.5;
	var friction = .9;
	var distance = weight.subtract(tree._branches[3]);
	velocity.x += distance.multiply(k).x;
	velocity.x *= friction;
	tree._branches[3].x += velocity.x;
	// console.log(velocity)

	if (animationRunning){
		i++;
	}
	if (animationRunning && i > animationFrames){
		animationRunning = false;
		i = 0;
	}
	requestAnimationFrame(render);
}


render();


$(window).resize(function(){
	tree.updateRects();
});

window["TREE_ONLEAVE"] = function(index, _direction){

}

window["TREE_ONLOAD"] = function(index){

}

window["TREE_ONSCROLL"].push(function(precent){

})



$('.tree .titles li').click(function(){
	$.fn.fullpage.moveTo($(this).index()+1);
})


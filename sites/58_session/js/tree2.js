(function(){
   
	var k = 0.1;
	var friction = .97;
	var frictionOffset = 5;

	var branchesOffsets = [0.05, 0.06, 0.07];
	if ($(window).height() < 800){
		branchesOffsets = [0.08, 0.08, 0.09];
	}

	function Tree(node) {

		this.expanded = false;
		this.beforeExpand = {};

		this.theme = "light";
		this.colors = {};

		this.ratio = 2;

		this.translation = 0;
		this.offset = 0;
		this.paddingTop = .2;
		this.paddingBottom = .35;

		this.width = 0;
		this.height = 0;

		this.canvas = node.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');

		this.branches = [];
		this._branches = [];
		this.__branches = [];

		this.point = new Vector();

		this.actions = [];
		this._actions = [];
		this.__actions = [];
		this.progress = 0;

		this.bouncedBranches = [];
		this.showingPoints = [];

		/* rects */
		this.updateRects = function(){
			var rect = node.getBoundingClientRect();
			this.width = this.canvas.width = rect.width * this.ratio;
			this.height = this.canvas.height = rect.height * this.ratio;
		}
		this.updateRects();

		/* add branches */
		this.addBrunch = function(point){
			this.branches.push(point.clone());
			this._branches.push(point.clone());
			this.__branches.push(point.clone());
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
			this.ctx.strokeStyle = this.colors.fill;
			this.ctx.lineWidth = 6;
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
			this.ctx.lineWidth = 3;

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
				this.ctx.strokeStyle = this.colors.line;
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
				// var alpha = 0;
				// var prog = (this.progress * this.height + this.offset*this.height + this.translation*this.height);
				// if (b.y < prog){
				// 	alpha = -0.4 + b.y / prog;
				// } else {
				// 	alpha = 1.8 - b.y / prog;
				// }
				// this.ctx.globalAlpha = Math.clamp(alpha, 0, 1);
				// console.log(b.y, (this.progress * this.height));
				this.ctx.stroke();
			}
			this.ctx.globalAlpha = 1;

			// for (var i = 0; i < this.branches.length; i++){
			// 	var p = this.branches[i];
			// 	this.ctx.beginPath();
			// 	this.ctx.arc(p.x, p.y + this.offset*this.height + this.translation*this.height, 5, 0, Math.PI*2);
			// 	this.ctx.fill();
			// }

			/*
				render action points
			*/
			// for (var i = 0; i < this.actions.length; i++){
			// 	if (this.actions[i-1] > this.progress || this.actions[i+1] < this.progress) continue;
			// 	var action = Bezier.getPointInPath(this.branches, this.actions[i]);
			// 	var size = this.progress >= this.actions[i] && (this.actions[i+1] ? this.progress < this.actions[i+1] : true) ? 20 : 10;
			// 	this.ctx.beginPath();
			// 	this.ctx.fillStyle = size === 20 ? "rgba(0,0,0,1)" : "rgba(0,0,0,.2)";
			// 	this.ctx.rect(
			// 		action.x - size/2,
			// 		action.y + this.offset*this.height + this.translation*this.height - size/2,
			// 		size, size
			// 	);
			// 	this.ctx.fill();
			// }

			// this.ctx.beginPath();
			// this.ctx.arc(this.point.x, this.point.y + this.offset*this.height + this.translation*this.height, 6, 0, Math.PI*2);
			// this.ctx.fill();


		}

		this.createActions = function(count){
			for (var i = 0; i < count; i++){
				var action = i / (count-1);
				this.actions.push(this.paddingTop + (action * (1 - this.paddingBottom - this.paddingTop)));
				this._actions.push(this.paddingTop + (action * (1 - this.paddingBottom - this.paddingTop)));
				this.__actions.push(this.paddingTop + (action * (1 - this.paddingBottom - this.paddingTop)));
			}
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

		this.bounce = function(index, smaller){
			tree._branches[index].x -= frictionOffset*(smaller ? .5 : 1);
			this.bouncedBranches.push({
				index: index,
				weight: tree._branches[index].add(new Vector(frictionOffset*(smaller ? .5 : 1), 0)),
				offset: 0,
				velocity: new Vector(),
				arrayIndex: this.bouncedBranches.length
			});
		}

		this.debounce = function(index){
			var branch = this.bouncedBranches[index];
			if (!branch) return;
			// console.log(this.branches[branch.index], this.__branches[branch.index])
			this.branches[branch.index].x = this.__branches[branch.index].x;
			this._branches[branch.index].x = this.__branches[branch.index].x;
			this.bouncedBranches.splice(index, 1);
		}

		this.debounceAll = function(){
			for (var j = 0; j < this.bouncedBranches.length; j++){
				var branch = this.bouncedBranches[j];
				this.branches[branch.index].x = this.__branches[branch.index].x;
				this._branches[branch.index].x = this.__branches[branch.index].x;
			}
			this.bouncedBranches = [];
		}

		this.getNeighboursForBounce = function(index, goUp){
			var actionPoint = Bezier.getPointInPath(this.branches, this.actions[index]);
			var prev = null, next = null, prev2 = null, next2 = null;
			// console.log(goUp)
			for (var i = 0; i < this.branches.length; i++){
				var prevPoint = Bezier.getPointInPath(this.branches, (i-(goUp ? 7 : 4))/this.branches.length);
				var nextPoint = Bezier.getPointInPath(this.branches, (i+(goUp ? 4 : 8))/this.branches.length);
				var prevPoint2 = Bezier.getPointInPath(this.branches, (i-(goUp ? 5 : 2))/this.branches.length);
				var nextPoint2 = Bezier.getPointInPath(this.branches, (i+(goUp ? 2 : 6))/this.branches.length);
				if (prevPoint.y < actionPoint.y) prev = i;
				if (nextPoint.y > actionPoint.y && !next) next = i;
				if (prevPoint2.y < actionPoint.y) prev2 = i;
				if (nextPoint2.y > actionPoint.y && !next2) next2 = i;
			}
			// console.log(prev, prev2, next2, next)
			return [prev, prev2, next2, next];
		}

		this.showActionPoint = function(index, color, size, primary){
			this.showingPoints.push({
				index: index,
				progress: 0,
				steps: 0,
				color: color,
				size: size,
				arrayIndex: this.showingPoints.length,
				primary: primary || false,
				reset: function(_tree){
					var colors = _tree.colors;
					this.color = this.primary ? colors.actionFilled : colors.action;
					this.progress = 0;
					this.steps = 0;
				}
			});
		}

		this.hideActonPoints = function(){
			this.showingPoints = [];
		}

		this.drawSquare = function(position, size, t, color){
			var center = position.clone();
			var progress = {
				left: 	Math.min(t / 0.25, 1),
				top: 		Math.max(Math.min((t - 0.25) / 0.25, 1), 0),
				right: 	Math.max(Math.min((t - 0.5) / 0.25, 1), 0),
				bottom: Math.max(Math.min((t - 0.75) / 0.25, 1), 0)
			};
			var leftBottom = center.add(new Vector(-size/2, size/2)),
					leftTop = center.add(new Vector(-size/2, -size/2)),
					rightTop = center.add(new Vector(size/2, -size/2)),
					rightBottom = center.add(new Vector(size/2, size/2));

			// this.ctx.beginPath();
			// this.ctx.lineWidth = 3;
			// // left
			// this.ctx.moveTo(leftBottom.x, leftBottom.y);
			// this.ctx.lineTo(leftBottom.x, lerp(leftBottom.y, leftTop.y, progress.left));
			// // top
			// this.ctx.moveTo(leftTop.x, leftTop.y);
			// this.ctx.lineTo(lerp(leftTop.x, rightTop.x, progress.top), leftTop.y);
			// // right
			// this.ctx.moveTo(rightTop.x, rightTop.y);
			// this.ctx.lineTo(rightTop.x, lerp(rightTop.y, rightBottom.y, progress.right));
			// // bottom
			// this.ctx.moveTo(rightBottom.x, rightBottom.y);
			// this.ctx.lineTo(lerp(rightBottom.x, leftBottom.x, progress.bottom), rightBottom.y);
			// this.ctx.stroke();

			this.ctx.beginPath();
			// this.ctx.fillStyle = "rgba("+(color || "0,0,0")+","+(progress.bottom)+")";
			this.ctx.fillStyle = "rgba("+(color || "0,0,0")+",1)";
			// this.ctx.fillStyle = color;
			this.ctx.rect(center.x-(size/2+1.5)*t, center.y-(size/2+1.5)*t, (size+3)*t, (size+3)*t);
			this.ctx.fill();
		}

		this.expand = function(){
			this.expanded = true;
			this.beforeExpand.progress = this.progress;
			this.beforeExpand.offset = this.offset;
			this.beforeExpand.translation = this.translation;
			// this.offset = 0;
			// this.translation = 0;
			this.progress = 0;
			$('.tree').addClass('expanded');
			// console.log(this)
		}

		this.collapse = function(){
			this.expanded = false;
			this.progress = this.beforeExpand.progress;
			this.offset = this.beforeExpand.offset;
			this.translation = this.beforeExpand.translation;
			$('.tree').removeClass('expanded');
		}

		this.toggle = function(){
			if (this.expanded){
				this.collapse();
			} else {
				this.expand();
			}
		}

		this.setTheme = function(theme){
			this.theme = theme || "light";
			if (this.theme === "light"){
				this.colors = {
					line: "#C5C9D1",
					fill: "#1F2023",
					action: "197,201,209",
					actionFilled: "31,32,35"
				}
			} else {
				this.colors = {
					line: "#5B5B5B",
					fill: "#fff",
					action: "91,91,91",
					actionFilled: "255,255,255"
				}
			}
			$('.tree').attr('data-theme', tree.theme);
			for (var j = 0; j < this.showingPoints.length; j++){
				var point = this.showingPoints[j];
				// console.log(point)
				point.reset(this);
				// point.color = point.primary ? this.colors.
			}
		}

	}



	var items = $('[data-point]').length;
	var tree = new Tree($('.canvas-inner')[0]);
	tree.setTheme("light");
	var co = items * 4;
	// for (var j = 0; j <= co; j++){
	// 	tree.addBrunch(new Vector(
	// 		tree.width / 2 + (-.5 + j / co) * (tree.width/2),
	// 		j / co * tree.height
	// 	));
	// }

	function addBranch(x, y){
		tree.addBrunch(new Vector((x / 100) * tree.width, (y / 100) * tree.height));
	}
	addBranch(10, 0);
	addBranch(35, 4);
	addBranch(-5, 8);
	addBranch(35, 12);
	addBranch(20, 16);
	addBranch(20, 20);
	addBranch(-5, 24);
	addBranch(40, 27);
	addBranch(30, 32);
	addBranch(70, 34);
	addBranch(60, 39);
	addBranch(30, 43);
	addBranch(70, 48);
	addBranch(40, 51);
	addBranch(70, 56);
	addBranch(55, 61);
	addBranch(105, 66);
	addBranch(70, 72);
	addBranch(80, 80);
	addBranch(95, 90);
	addBranch(80, 95);
	addBranch(50, 95);
	addBranch(30, 90);
	addBranch(60, 90);
	addBranch(70, 95);
	addBranch(60, 97);
	addBranch(70, 100);


	tree.offset = 0.35;
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




	// tree.bounce(8);

	function render(){
		// console.log('d');

		// console.log(tree.bouncedBranches)

		/* bouncing dots*/
		for (var b = 0; b < tree.bouncedBranches.length; b++){
			var branch = tree.bouncedBranches[b];
			var distance = branch.weight.subtract(tree._branches[branch.index]);
			branch.velocity.x += distance.multiply(k).x;
			branch.velocity.x *= friction;
			tree._branches[branch.index].x += branch.velocity.x;
			// if not frictioned - remove it
			tree.branches[branch.index].x = tree._branches[branch.index].x
			if (Math.abs(branch.velocity.x) < 0.001){
				tree.debounce(b);
				// console.log(branch.arrayIndex);
			}
		}

		var animationFrames = loadedAnimation ? 80 : 40;

		// tree.point = Bezier.getPointInQuadrant(tree.branches[0], tree.branches[1], tree.branches[2], i/100);

		// tree.point = Bezier.getPointInPath(tree.branches, i);
		if (animationRunning){
			tree.progress = lerp(oldProgress, progress, Easing.easeInOutQuad(i/animationFrames));
		} else {
			tree.progress = progress;
		}
		if (!tree.expanded){
			tree.translate(-tree.progress);
		} else {
			if (Math.abs(tree.translation) > 0.0001) tree.translation /= 1.3;
			if (Math.abs(tree.offset) > 0.0001) tree.offset /= 1.3;
			// console.log(tree.translation);
			// tree.translate(-tree.beforeExpand.progress);
		}

		var animationPrecent = Easing.easeInOutQuad(Math.min(i/animationFrames+.7, 1));

		if (!tree.expanded){
			for (var j = 0; j < tree.actions.length; j++){
				if (animationRunning){
					tree.actions[j] = lerp(tree.__actions[j], tree._actions[j], animationPrecent);
				} else {
					// tree.__actions[j] = tree._actions[j];
					tree.actions[j] = tree._actions[j];
				}
			}
		} else {
			tree.actions = tree.__actions.slice();
		}

		tree.render();
		var prev = tree.actions[prevItemIndex],
				curr = tree.actions[activeItemIndex],
				next = tree.actions[activeItemIndex+1];
		if (!next){
			next = curr + 0.1;
		}
		var fillStart = curr,
				fillEnd = curr + (next - curr)*.8;
		if (slideHasScroll){
			// fillEnd = curr + (next - curr)*(.2+(.8*slideScrollPrecent));
			fillEnd = curr + (next - curr)*(slideScrollPrecent);
		}
		// last item
		if (activeItemIndex === items-1){
			fillEnd = fillStart;
		}


		// tree.fill(prev, lerp(prev, fillEnd, animationRunning ? i/animationFrames : 1));

		// console.log("loading: "+loadingAnimation+", loaded: "+ loadedAnimation)
		if (prevItemIndex === activeItemIndex){
			tree.fill(fillStart, fillEnd);
			oldFillStart = fillStart;
			oldFillEnd = fillEnd;
		} else {
			tree.fill(
				lerp(oldFillStart, fillStart, animationRunning ? Easing.easeInOutQuad(i/animationFrames) : 1),
				lerp(oldFillEnd, fillEnd, animationRunning ? Easing.easeInOutQuad(i/animationFrames) : 1)
			);
		}

		// if (loadingAnimation){
		// 	tree.fill(fillEnd, lerp(fillEnd, next, animationRunning ? i/animationFrames : 1));
		// } else if (loadedAnimation){
		// 	tree.fill(
		// 		next,
		// 		lerp(next2, fillEnd2, animationRunning ? i/animationFrames : 1)
		// 	);
		// }
		// if (!slideHasScroll){
		// 	tree.fill(tree.progress, lerp(tree.progress, fillEnd, animationRunning ? i/40 : 1));
		// } else {
		// 	tree.fill(tree.progress, lerp(tree.progress, fillEnd, slideScrollPrecent));
		// }
		// console.log(fillStart, fillEnd)
		// console.log(Math.floor(progress*tree.branches.length) / tree.branches.length)


		/*
			show actions points
		*/
		for (var j = 0; j < tree.showingPoints.length; j++){
			var showingPoint = tree.showingPoints[j];
			// if (showingPoint.progress === 1) continue;
			if (showingPoint.steps < 1){
				showingPoint.steps += 0.03;
			} else {
				showingPoint.steps = 1;
			}
			showingPoint.progress = Easing.easeInOutQuad(showingPoint.steps);
			// console.log(showingPoint.progress)
			if (tree.actions[showingPoint.index-1] > tree.progress || tree.actions[showingPoint.index+1] < tree.progress) continue;
			var action = Bezier.getPointInPath(tree.branches, tree.actions[showingPoint.index]);
			// var size = tree.progress >= tree.actions[showingPoint.index] && (tree.actions[showingPoint.index+1] ? tree.progress < tree.actions[showingPoint.index+1] : true) ? 20 : 10;
			// var size = showingPoint.size * tree.showingPoints[j].progress;
			// tree.ctx.beginPath();
			// tree.ctx.fillStyle = showingPoint.color;
			// tree.ctx.rect(
			// 	action.x - size/2,
			// 	action.y + tree.offset*tree.height + tree.translation*tree.height - size/2,
			// 	size, size
			// );
			// tree.ctx.fill();
			tree.drawSquare(
				action.add(new Vector(0, tree.offset*tree.height + tree.translation*tree.height)),
				showingPoint.size,
				showingPoint.progress,
				showingPoint.color
			);
		}


		if (!animationRunning) animationPrecent = 1;
		$('.tree .titles li').each(function(index, li){
			var pos = tree.getWorldPointFrom(tree.actions[index]);
			// animationPrecent
			$(li).css({top: pos.top+"px", left: pos.left+"px"});
			$(li).removeClass("prev next hiddened");
			if (index === activeItemIndex-1){
				$(li).addClass('prev');
			} else if (index === activeItemIndex+1){
				$(li).addClass('next');
			} else if (index < activeItemIndex-1 || index > activeItemIndex+1) {
				$(li).addClass('hiddened');
			}
		});

		if (animationRunning){
			i++;
		}
		if (animationRunning && i > animationFrames){
			animationRunning = false;
			i = 0;
		}
		requestAnimationFrame(render);
	}

	function activateActonPoint(index, onloaded){
		// console.log(index)
		var offs = branchesOffsets;
		var normalStep = 1 / tree.actions,
				smallStep = index > 5 ? offs[0] : index > 3 ? offs[1] : offs[2];
		var isMultiline = $('.titles li').eq(index).html().match(/\<br\>/gim);
		for (var i = 0; i < tree.actions.length; i++){
			// console.log(i-index)
			if (i === index){
				tree._actions[i] = tree.__actions[i];
				activeItemIndex = i;
			} else {
				var coef = i - index,
						offset = coef < 0 ? -smallStep*.2 : smallStep*(isMultiline ? 1 : .5);
				// console.log(coef, offset)
				tree._actions[i] = tree.__actions[index] + coef*smallStep + offset;
			}
			// tree.actions[i] = i === index ? tree._actions[i] : tree._actions[i]+((i-index)*smallStep);
		}
		// console.log(tree.actions);
		// var prev = tree.actions[index],
		// 		next = tree.actions[index+1];
		// progress = prev + (next - prev)*.8;
		progress = tree._actions[index];
	}
	activateActonPoint(0);
	render();


	// $(window).scroll(function(){
	// 	var top = $(document).scrollTop(),
	// 			height = $('body')[0].scrollHeight - $(window).height();
	// 	progress = top / height;
	// })
	$(window).resize(function(){
		tree.updateRects();
	});

	$('.fullpage').on("fullpage:leave", function(e, data){
		// console.log('leave', data);
		// console.log("leave")
		var index = data.next;
		if (animationRunning) return;
		if (!$('[data-point="'+index+'"]').length) return;
		animationRunning = true;
		slideScrollPrecent = parseFloat($('[data-point="'+index+'"]').attr('data-scroll') || 0);
		$('.tree .titles li').removeClass('active').eq(index).addClass('active');
		oldProgress = progress;
		slideHasScroll = $('[data-point="'+index+'"]').hasClass('scrolled');
		activateActonPoint(index);
		tree.hideActonPoints();
		tree.debounceAll();
		var bounced = tree.getNeighboursForBounce(index, data.prev >= data.next);
		tree.bounce(bounced[0], true);
		tree.bounce(bounced[1]);
		tree.bounce(bounced[2]);
		tree.bounce(bounced[3], true);
	});
	$('.fullpage').on("fullpage:load", function(e, data){
		// console.log('load', data);
		prevItemIndex = activeItemIndex;
		index = data.index;
		if (!$('[data-point="'+index+'"]').length) return;
		if (index > 0){
			tree.showActionPoint(index-1, tree.colors.action, 6, false);
		}
		tree.showActionPoint(index, tree.colors.actionFilled, 24, true);
		if (index < tree.actions.length-1){
			tree.showActionPoint(index+1, tree.colors.action, 6, true);
		}
	});
	$('.fullpage').on("fullpage:scroll", function(e, data){
		// console.log("scroll", data);
		slideScrollPrecent = data.precent;
		$('.fullpage .section.active').attr('data-scroll', slideScrollPrecent);
	});

	// window["TREE_ONLEAVE"] = function(index, _direction){
	// 	if (animationRunning) return;
	// 	if (!$('[data-point="'+index+'"]').length) return;
	// 	// if (tree.expanded) return;
	// 	animationRunning = true;
	// 	slideScrollPrecent = parseFloat($('[data-point="'+index+'"]').find('.fp-scrollable').attr('data-scroll') || 0);
	// 	$('.tree .titles li').removeClass('active').eq(index).addClass('active');
	// 	oldProgress = progress;
	// 	slideHasScroll = $('[data-point="'+index+'"]').find('.fp-scrollable').length > 0;
	// 	// console.log(slideHasScroll);
	// 	// progress = tree.actions[index];
	// 	// activeItemIndex = index;
	// 	activateActonPoint(index);
	// 	// loadingAnimation = true;
	// 	// loadedAnimation = false;
	// 	tree.hideActonPoints();
	// 	tree.debounceAll();
	// };

	// window["TREE_ONLOAD"] = function(index){
	// 	// loadingAnimation = false;
	// 	// loadedAnimation = true;
	// 	// if (tree.expanded) return;
	// 	prevItemIndex = activeItemIndex;
	// 	index -= 1;
	// 	if (!$('[data-point="'+index+'"]').length) return;
	// 	var bounced = tree.getNeighboursForBounce(index);
	// 	tree.bounce(bounced[0]);
	// 	tree.bounce(bounced[1]);
	// 	if (index > 0){
	// 		tree.showActionPoint(index-1, tree.colors.action, 4, false);
	// 	}
	// 	tree.showActionPoint(index, tree.colors.actionFilled, 24, true);
	// 	if (index < tree.actions.length-1){
	// 		tree.showActionPoint(index+1, tree.colors.action, 4, true);
	// 	}
	// };

	// window["TREE_ONSCROLL"].push(function(precent){
	// 	slideScrollPrecent = precent;
	// });

	var lastBouncedBranch = 0;
	$('.tree canvas').mousemove(function(e){
		// console.log(e.clientY);
		for (var j = 1; j < tree.branches.length; j++){
			var worldPointPrev = tree.getWorldPointFrom((j-1) / tree.branches.length);
			var worldPointNext = tree.getWorldPointFrom(j / tree.branches.length);
			// console.log(worldPoint.top, e.clientY);
			if (worldPointPrev.top < e.clientY && worldPointNext.top > e.clientY){
				if (lastBouncedBranch !== j){
					tree.debounceAll();
					tree.bounce(j);
					lastBouncedBranch = j;
				}
				// console.log(tree.branches[j]);
			}
		}
	}).mouseleave(function(e){
		lastBouncedBranch = 0;
	});


	// window["TREE_ONLEAVE"] = function(index, _direction){
	// 	loadingAnimation = true;
	// 	loadedAnimation = false;
	// 	oldProgress = progress;
	// 	animationRunning = true;
	// 	slideHasScroll = $('[data-point="'+index+'"]').find('.fp-scrollable').length > 0;
	// 	slideScrollPrecent = parseFloat($('[data-point="'+index+'"]').find('.fp-scrollable').attr('data-scroll') || 0);
	// 	tick(index);
	// }

	// window["TREE_ONLOAD"] = function(index){
	// 	loadingAnimation = false;
	// 	loadedAnimation = true;
	// 	animationRunning = true;
	// 	$('.tree .titles li').removeClass('active').eq(index-1).addClass('active');
	// }

	// window["TREE_ONSCROLL"] = function(precent){
	// 	slideScrollPrecent = precent;
	// }

	// document.querySelector('#progress').addEventListener('input', function(e){
	// 	i = e.target.value;
	// 	document.querySelector('#val').innerHTML = i;

	// 	// tree.shuffle(i * 10);

	// })
	// document.querySelector('#length').addEventListener('input', function(e){
	// 	var co = e.target.value;
	// 	tree.branches = [];
	// 	for (var j = 0; j <= co; j++){
	// 		tree.addBrunch(new Vector(
	// 			tree.width / 2 + (-.5 + j / co) * tree.width,
	// 			j / co * tree.height
	// 		));
	// 	}
	// 	tree.shuffle(e.target.value);
	// })

	// document.querySelector('#minus').addEventListener('click', function(e){
	// 	val = parseInt(document.querySelector('#length').value);
	// 	if (val > 4){
	// 		var event = new CustomEvent("input");
	// 		document.querySelector('#length').value = val - 2;
	// 		document.querySelector('#length').dispatchEvent(event);
	// 	}
	// });
	// document.querySelector('#plus').addEventListener('click', function(e){
	// 	val = parseInt(document.querySelector('#length').value);
	// 	if (val < 20){
	// 		var event = new CustomEvent("input");
	// 		document.querySelector('#length').value = val + 2;
	// 		document.querySelector('#length').dispatchEvent(event);
	// 	}
	// });





	// $('.tree .titles li').click(function(){
	// 	// $.fn.fullpage.moveTo($(this).index()+1);
	// });

	$('#treeToggler').click(function(){
		tree.toggle();
	});

	$('#treeColor').click(function(){
		tree.theme = tree.theme === "light" ? "dark" : "light";
		tree.setTheme(tree.theme);
	});

})();

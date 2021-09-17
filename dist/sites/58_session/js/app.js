(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

(function(){

	var currentIndex = 0;
	var lastIndex = 0;
	var maxIndex = $('.fullpage .section').length-1;
	var anchors = ['58session', 'usecases', 'methodology', 'rules', 'whyitworks', 'resources', 'testimonials', 'partners'];
	var wrapper = $('.fullpage');
	var sections = $('.fullpage .section');
	var isMoving = false;
	var isScrolling = false;
	var currentOffset,
			lastOffset = 0;
	var slideTimeout = 700;
	var prevTime = 0;
	var progressTime = 0;
	var progress = 0;
	var lastScroll = 0;
	var newScroll = 0;
	var responsiveWidth = 992;
	var enabled = false;
	var freezed = false;

	var scrollExceptions = "button";

	// wrapper.css("transform", "none");


	function MoveSectionUp(){
		if (isMoving) return;
		if (currentIndex > 0){
			currentIndex--;
			fitSection();
		}
	};

	function MoveSectionDown(){
		if (isMoving) return;
		if (currentIndex < maxIndex){
			currentIndex++;
			fitSection();
		}
	};

	function getHeightToScroll(){
		var height = 0;
		sections.each(function(i, section){
			if (i < currentIndex+1 && i > 0){
				height += $(section).outerHeight();
			}
		});
		return height;
	};

	function getAnchorIndex(anchor){
		for (var i = 0; i < anchors.length; i++){
			if (anchor === anchors[i]){
				return i;
			}
		}
		return -1;
	}

	function fitSection(){
		isMoving = true;
		currentOffset = getHeightToScroll();
		prevTime = new Date().getTime();
		sections.removeClass('active').eq(currentIndex).addClass('active');
		if (hasScroll(currentIndex)){
			sections.eq(currentIndex).addClass('scrolled');
		} else {
			sections.eq(currentIndex).removeClass('scrolled');
		}
		$('.fullpage').trigger("fullpage:leave", [{
			prev: lastIndex,
			next: currentIndex
		}]);
		translate();
	}
	if (getAnchorIndex(location.hash.replace(/\#/, "")) > 0){
		currentIndex = getAnchorIndex(location.hash.replace(/\#/, ""));
	}
	// fitSection();

	function translate(){
		if (!isMoving) return;
		var currentTime = new Date().getTime();
		progressTime += currentTime - prevTime;
		progress = Easing.easeOutQuint(Math.min(progressTime/slideTimeout, 1));
		var offset = lerp(lastOffset, currentOffset, progress);

		wrapper.css("transform", "translateY("+(-offset)+"px)");
		// console.log(progress);

		if (progressTime < slideTimeout){
			requestAnimationFrame(translate);
			prevTime = currentTime;
		} else {
			resetTransform();
			lastIndex = currentIndex;
			$('.fullpage').trigger("fullpage:load", [{
				index: currentIndex
			}]);
			if (history && anchors[currentIndex]){
				// console.log(location)
				location.hash = anchors[currentIndex];
				history.replaceState(null, null, location.origin+location.pathname+"#"+anchors[currentIndex]);
			}
		}
	};

	function scroll(){
		// if (!isScrolling) return;
		var currentTime = new Date().getTime();
		var t = slideTimeout / 2;
		progressTime += currentTime - prevTime;
		progress = Easing.easeOutQuint(Math.min(progressTime/t, 1));

		var s = lerp(lastScroll, newScroll, progress);
		// var maxScroll = section[0].scrollHeight - section.outerHeight();
		sections.eq(currentIndex).scrollTop(s);

		// wrapper.css("transform", "translateY("+(-offset)+"px)");
		// console.log(currentTime, prevTime);

		if (progressTime < t){
			requestAnimationFrame(scroll);
			prevTime = currentTime;
		} else {
			resetScroll();
		}
	}

	function resetTransform(){
		i = 0;
		isMoving = false;
		lastOffset = currentOffset;
		prevTime = 0;
		progressTime = 0;
		progress = 0;
		sections.eq(currentIndex).focus();
	};

	function resetScroll(){
		i = 0;
		isScrolling = false;
		prevTime = 0;
		progressTime = 0;
		progress = 0;
		currentTime = 0;
	}

	function hasScroll(index){
		var section = sections.eq(index);
		return section[0].scrollHeight > section.outerHeight();
	}

	function inRange(index, dir){
		var section = sections.eq(index);
		var scrollTop = section.scrollTop();
		var maxScroll = section[0].scrollHeight - section.outerHeight();
		// if ((scrollTop === 0 && dir < 0) || (scrollTop > maxScroll && dir > 0)){
		if ((scrollTop === 0 && dir < 0) || (scrollTop > (maxScroll-1) && dir > 0)){
			return false;
		}
		return true;
	}

	function checkDisplaySize(){
		if ($(window).width() > responsiveWidth){
			enabled = true;
			fitSection();
			$('body').css('overflow', "hidden");
		} else{
			enabled = false;
			resetTransform();
			wrapper.css("transform", "");
			$('body').css('overflow', "");
		}
	}
	checkDisplaySize();

	function freeze(){
		freezed = true;
		$('.fullpage').trigger("fullpage:freeze", [{
			index: currentIndex
		}]);
	}

	function restore(doNotTriggerEvent){
		freezed = false;
		if (doNotTriggerEvent) return;
		$('.fullpage').trigger("fullpage:restore", [{
			index: currentIndex
		}]);
	}

	$('.fullpage').on("fullpage:force-restore", function(){
		restore(true);
	});

	$(window).resize(function(){
		waitForFinalEvent(function(){
			checkDisplaySize();
		}, 300, "FULLPAGE");
	});

	$('.fullpage .section').scroll(function(){
		var section = sections.eq(currentIndex);
		var top = section.scrollTop();
		var maxScroll = section[0].scrollHeight - section.outerHeight();
		$('.fullpage').trigger("fullpage:scroll", [{
			precent: top / maxScroll,
			section: section,
			index: currentIndex
		}]);
	});

	$(document).mousewheel(function(e){
		if ($(e.target).closest(scrollExceptions).length || !enabled || freezed){
			return;
		}
		var dir = e.deltaY * -1;
		if (hasScroll(currentIndex) && inRange(currentIndex, dir) && !isMoving){
			var section = sections.eq(currentIndex);
			var top = section.scrollTop();
			var maxScroll = section[0].scrollHeight - section.outerHeight();
			section.scrollTop(top + (dir * 50));
			return;
		}
		if (dir < 0){
			MoveSectionUp();
		} else if (dir > 0){
			MoveSectionDown();
		}
	});

	$(window).on('hashchange', function(){
		if (!enabled || freezed) return;
		var newIndex = getAnchorIndex(location.hash.replace(/\#/, ""));
		if (newIndex < 0) return;
		if (newIndex !== lastIndex){
			currentIndex = newIndex;
			resetTransform();
			fitSection();
		}
	});

	$(window).keydown(function(e){
		if (!enabled || freezed) return;
		if (e.keyCode === 38) MoveSectionUp();
		if (e.keyCode === 40) MoveSectionDown();
	});

	$('.tree .titles li').click(function(){
		if (!enabled || freezed) return;
		resetTransform();
		currentIndex = $(this).index();
		fitSection();
	});

	/* methodology load */
	$('#loadMethodology').click(function(e){
		e.preventDefault();
		if (freezed){
			restore();
		} else {
			freeze();
		}
	});

})();


// $('.fullpage').on("fullpage:leave", function(e, data){
// 	console.log('leave', data);
// });
// $('.fullpage').on("fullpage:load", function(e, data){
// 	console.log('load', data);
// });
// $('.fullpage').on("fullpage:scroll", function(e, data){
// 	console.log("scroll", data);
// });
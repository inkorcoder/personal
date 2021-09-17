function Test(popup){

	if (!popup || !popup.length) {
		console.warn('No popup passed!');
		return;
	};


	this.showTimeout = parseInt(popup.find('.test').data('show-time') || 1000);
	this.delayTimeout = parseInt(popup.find('.test').data('delay-time') || 1000);
	this.introTime = parseInt(popup.find('.test').data('intro-time') || 5);
	this.images = popup.find('.test figure');
	this.length = this.images.length;
	this.popup = popup;
	this.currentIndex = 0;
	this.currentIntroIndex = 1;
	this.introPassed = false;

	// console.log(this.showTimeout, this.delayTimeout)
	popup.find('.timer').append($("<li></li>"));
	for (var i = 0; i < this.introTime; i++){
		popup.find('.timer').append($("<li>"+(i+1)+"</li>"));
	}

	var showTimeout = null;
	var delayTimeout = null;

	var timers = [];

	$this = this;
	function process(){
		if (!this.introPassed){
			timers[0] = setTimeout(function(){
				process.call($this);
				popup.find('.timer li').removeClass('active').eq($this.introTime-$this.currentIntroIndex+1).addClass('active');
				$this.currentIntroIndex++;
				if ($this.introPassed) {
					popup.find('.timer').trigger("timer:start", $this);
					return;
				}
				if ($this.currentIntroIndex > $this.introTime){
					$this.introPassed = true;
				}
			}, 1000);
			return;
		}
		$this.images.removeClass('active');
		timers[1] = setTimeout(function(){
			$this.images.eq($this.currentIndex).addClass('active');
			if ($this.currentIndex > 0 && $this.currentIndex < $this.length){
				popup.find('.timer').trigger("timer:change", $this);
			}
		}, this.delayTimeout);
		if ($this.currentIndex >= $this.length){
			timers[2] = setTimeout(function(){
				popup.find('.timer').trigger("timer:end", $this);
				HidePopups();
			}, $this.delayTimeout);
			return;
		}
		timers[3] = setTimeout(function(){
			$this.currentIndex++;
			process.call($this);
		}, this.showTimeout + this.delayTimeout);
	}

	var elem = this.popup[0];

	function openFullscreen() {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
	}
	function closeFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}

	this.reset = function(){
		this.currentIndex = 0;
		this.currentIntroIndex = 1;
		this.introPassed = false;
		popup.find('.timer li').removeClass('active');
		this.images.removeClass('active');
		timers.forEach(function(t){
			clearTimeout(t);
		});
	};

	this.run = function(){
		$this = this;
		this.reset();
		openFullscreen();
		process.call(this);
		// console.log(this, $this);
		// showTimeout = setTimeout(function(){

		// }, this.showTimeout);
	};

	this.popup.on('popup:onopen', function(e){
		// console.log(e.currentTarget.test);
		e.currentTarget.test.run();
	});
	this.popup.on('popup:onclose', function(e){
		// console.log(e);
		closeFullscreen();
		$this.reset();
	});

	document.addEventListener("fullscreenchange", function(e) {
		var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
		// console.log(isFullScreen);
		if (!document.webkitIsFullScreen){
			HidePopups();
			// console.log('d');
			$this.reset();
		}
	});

}

$(".popup .test").each(function(i, t){
	var test = new Test($(t).closest('.popup'));
	$(t).closest('.popup')[0].test = test;
	// test.run();
	// console.log(test);
});

// <script>
// 	function handleActiveTest(popup){
// 		var test = new Test(popup);
// 		test.run();
// 		console.log(test);
// 	}
// </script>
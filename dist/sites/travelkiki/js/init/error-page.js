var audio = document.createElement('audio');
audio.src = "sound/oddity1.wav";


audio.addEventListener("canplaythrough", function() {
	audio.play();

	setTimeout(function(){
		$('#captionAnimated').addClass('animated');
	}, 3800);
}, true);
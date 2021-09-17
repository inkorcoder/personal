var searchAnimationStrings = [
	"Roma?", "Berlin?", "Moscow?", "Manchester?",
	"Washington?", "Miami?", "Vancouver?", "Manas?"
];

$(document).ready(function() {


	function drawText(node, string, timeout, onChange, onEnd){
		var s = 0,
		interval = setInterval(function(){
			node.text(string.substring(0, s));
			if (s > string.length-1){
				s = 0;
				if (onEnd) onEnd();
				clearInterval(interval);
			} else {
				s++;
				if (onChange) onChange();
			}
		}, timeout);
	};

	function change(first){
		i = i < searchAnimationStrings.length-1 ? ++i : 0;
		setTimeout(function(){
			drawText($('.mobile-entry .text'), searchAnimationStrings[i], 100, null, change);
		}, first ? 0 : 3000);
	};

	var i = -1;

	change(true);

});

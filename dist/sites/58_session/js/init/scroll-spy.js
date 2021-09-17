Math.lerp = function(a, b, t){
	return a + (b - a) * t;
}

$(document).ready(function() {

	var clips = [];

	$('#spyNav').find('.nav-item').each(function(i, a){
		var text = $(a).text();
		$(".link-outer", a).addClass('faded').append(
			$("<div class=\"link-progress\">"+text+"</div>")
		);
		clips.push({
			progress: 0,
			index: i,
			a: $(a).find(".link-progress"),
			expanding: false,
			expandingBack: false,
			expandingPrecent: 0
		});
	});

	function clipPath(t, isNext, isReverse){
		var start = 0;
		var end = 1;
		var prog = start + t;
		var a = 0, b = 0;
		if (prog.toString() === "NaN"){
			prog = start;
		}
		if (t >= 0){
			if (isReverse){
				a = 0;
				b = t;
				// console.log(a, b);
			} else if (!isNext){
				a = prog;
				b = end;
			} else {
				a = 0;
				b = t;
			}
		}
		if (t < 0.00001){
			a = b = 0;
		}
		//  else if (t > -0.2 && t < 0){
		// 	a = start;
		// 	b = 1-prog*5*-1;
		// }
		// if (t < .5){
		// 	a = start;
		// 	b = prog;
		// } else if (t >= 0.5){
		// 	a = (prog);
		// 	b = end;
		// }
		return "polygon("+
			(a*100)+"% 0%, "+ 	// top left
			(b*100)+"% 0%, "+ 			// top right
			(b*100)+"% 100%, "+ 		// bottom right
			(a*100)+"% 100%)"; 	// bottom left
	}

	checkLinks();

	// var i = 0;
	function checkLinks(){

		// var precent = i / 100;


		var activeIndex = $('.page-inner').length;
		$('.page-inner').each(function(j, section){
			if ($(section).hasClass('in-viewport')){
				activeIndex = j;
				return;
			}
		});
		for (var j = 0; j < clips.length; j++){
			// if (j === 0){
				var precent = parseFloat($('.page-inner').eq(j).attr('data-scrolled'));
				var clip = clips[j];

				if (precent >= 0){
					clip.a.attr("style", "-webkit-clip-path: "+clipPath(precent)+"; clip-path: "+clipPath(precent)+";");
				} else if (precent > -0.2 && !clip.expanding){
					clip.expanding = true;
				} else if (precent > -0.2 && clip.expanding){
					clip.expandingPrecent += 0.05;
					if (clip.expandingPrecent >= 1){
						clip.expandingPrecent = 1;
					}
					clip.a.attr("style", "-webkit-clip-path: "+clipPath(clip.expandingPrecent, true)+"; clip-path: "+clipPath(clip.expandingPrecent, true)+";");
				} else if (precent < -0.2){
					// console.log(precent);
					clip.expanding = false;
					clip.expandingPrecent /= 1.2;
					// console.log(clip.expandingPrecent);
					clip.a.attr("style", "-webkit-clip-path: "+clipPath(clip.expandingPrecent, null, true)+"; clip-path: "+clipPath(clip.expandingPrecent, null, true)+";");
				}
				// if (precent > 0.8 && next){
				// 	if (!next.expanding){
				// 		next.expandingPrecent = 0;
				// 		next.expanding = true;
				// 	}
				// 	next.expandingPrecent += 0.05;
				// 	if (next.expandingPrecent >= 1){
				// 		next.expandingPrecent = 1;
				// 		// next.expanding = false;
				// 	}
				// } else if (precent <= .8 && next){
				// 	next.expandingPrecent = 1;
				// 	next.expanding = false;
				// }
				// if (next && next.expanding){
				// 	// console.log(next.expandingPrecent);
				// 	next.a.attr("style", "-webkit-clip-path: "+clipPath(next.expandingPrecent, true)+"; clip-path: "+clipPath(next.expandingPrecent, true)+";");
				// }
			// }
		}

		// console.log(clips);

		// i = i < 100 ? ++i : 0;
		requestAnimationFrame(checkLinks);
	}


});
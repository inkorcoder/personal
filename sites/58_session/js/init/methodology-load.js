(function(){

	var fited = false;
	var expanded = false;
	var CONTAINER = $('#methodologyPageContainer');
	var SECTION = $('#methodolodySection');
	var TREE = $('.tree');

	function fitMethodologySection(){
		if (!fited) return;
		$('.tree').addClass('underlayed');
		var windowHeight = $(window).height();
		var bbox = $('[data-methodology-anchor]')[0].getBoundingClientRect();
		SECTION.addClass('offseted');
		CONTAINER.find('.section-title').css({
			marginLeft: bbox.left-CONTAINER.find('.title-container').offset().left-45
		})
		CONTAINER.css('height', windowHeight-(bbox.top+bbox.height/2)+"px").addClass('opened');
	};
	function unfitMethodologySection(){
		CONTAINER.css('height', "200px").removeClass('opened');
		SECTION.removeClass('offseted');
		setTimeout(function(){
			$('.tree').removeClass('underlayed expanded');
			$('.fullpage').trigger("fullpage:force-restore");
		}, 510);
	};
	function expandSectionFully(){
		expanded = true;
		$.ajax({
			url: "methodology-ajax.html",
			method: "GET",
			success: function(res){
				// CONTAINER.html(res);
				$('.methodology-temp-fake').html(res);
				var h = $('.methodology-temp-fake').outerHeight();
				var w = $('.methodology-temp-fake > div').outerWidth();
				SECTION.addClass('faded');
				TREE.addClass('faded');
				CONTAINER.css('height', h+"px").css('width', w+"px").css('bottom', ($(window).height() - h)+"px").addClass('expanded');
				setTimeout(function(){
					location.href = "methodology.html";
				}, 510);
			}
		});
	};

	$('.fullpage').on("fullpage:freeze", function(){
		// console.log('freeze')
		fited = true;
		fitMethodologySection();
	});

	$('.fullpage').on("fullpage:restore", function(){
		// console.log('restore')
		unfitMethodologySection();
	});

	$(window).resize(function(){
		waitForFinalEvent(function(){
			fitMethodologySection();
		}, 500, "fit");
	});

	$(document).mousewheel(function(e){
		var dir = e.deltaY * -1;
		// console.log(dir);
		if (fited && dir > 0 && !expanded){
			expandSectionFully();
		} else if (fited && dir < 0 && !expanded){
			fited = false;
			expanded = false;
			unfitMethodologySection();
		}
	});

	$('.fullpage')

})();
$(document).ready(function() {
	$('#fullpage').fullpage({
		anchors: ['58session', 'usecases', 'methodology', 'rules', 'whyitworks', 'resources', 'testimonials', 'partners'],
		// scrollOverflow: true,
		// scrollBar: true,
		menu: '#treeNav',
		fixedElements: '.tree, #mainHeader, #fixedFooter, #pageFooter',
		afterLoad: function(anchorLink, destination, direction) {
			if (window["TREE_ONLOAD"]){
				window["TREE_ONLOAD"](destination, direction);
			}
		},
		afterRender: function(){

		},
		onLeave: function(anchorLink, destination, direction) {
			if(anchorLink + 1 === $('#fullpage .section').length && direction =='down'){
				$('#pageFooter').addClass('to-top');
			} else {
				$('#pageFooter').removeClass('to-top');
			}
			if (window["TREE_ONLEAVE"]){
				window["TREE_ONLEAVE"](destination-1, direction);
			}
		}
	});
});

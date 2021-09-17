Vue.directive('swipe', {
	bind: function(el, binding, vnode){

		console.log(el, binding, vnode);

		var isMoving = false;

		$(el).on('touchstart', function(){
			isMoving = true;
		});

		document.addEventListener('touchmove', function(){

		}, { passive: false })

		$(document).on('touchcancel touchend', function(e){
			isMoving = false;
			// vnode.$emit('swipe');
		});
	}
})
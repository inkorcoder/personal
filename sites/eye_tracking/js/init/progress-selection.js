$(document).ready(function(){

	function renderViews(table, user, length){

		var card = $(table).closest('.card');
		var list = "";
		var sum = 0;
		for (var i = 0; i < user.data.length; i++){
			var p = Math.floor(user.data[i]*100);
			var c = p < 25 ? "error" : p < 50 ? "danger" : "success";
			list += "<li><div data-tooltip='"+p+"%' style='height:"+(20+(p/100*80))+"%' class='"+c+"'><span>"+p+"%</span></div></li>";
			sum += user.data[i];
		}

		card.find('[data-sum-users]').html("0");
		card.find('[data-sum-age]').html("0");

		card.find('[data-user-age]').html(user.age || "...");
		card.find('[data-date]').html(user.date || "...");
		card.find('[data-attention]').html(Math.floor(sum * 100));

		if (typeof length !== 'undefined'){
			card.find('[data-sum-users]').html(user.length);
			card.find('[data-sum-age]').html(user.age);
		}

		$(table).html(list);
	}

	function renderSumOfViews(){
		var res = {
			data: [],
			age: 0,
			length: 0
		};
		for (var i = 0; i < window.viewProgressUsers.length; i++){
			var card = $('#usersProgress [data-progress]').eq(i).closest('.card');
			var user = window.viewProgressUsers[i];
			if (!card.hasClass('faded')){
				for (var j = 0; j < user.data.length; j++){
					if (typeof res.data[j] === "undefined"){
						res.data[j] = 0;
					}
					res.data[j] += user.data[j];
				}
				res.age += user.age;
				res.length++;
			}
		}
		res.age = Math.floor(res.age / res.length);
		for (var j = 0; j < res.data.length; j++){
			res.data[j] = res.data[j] / res.length;
		}
		renderViews($('#mainProgress'), res, res.length);
	}

	$('#usersProgress').on('click', "[data-toggle-view]", function(e){
		$(e.target).closest('.card').toggleClass("faded");
		renderSumOfViews();
	});

	$('#usersProgress [data-progress]').each(function(i, table){
		renderViews($(table), window.viewProgressUsers[i]);
	});

	renderSumOfViews();


	function checkCaptionsAvailability(){
		var w = $('.selection-table > li').eq(0).width();
		if (w < 20){
			$('.selection-table').addClass('no-caption');
		} else {
			$('.selection-table').removeClass('no-caption');
		}
	}
	checkCaptionsAvailability();

	$(window).resize(function(){
		checkCaptionsAvailability();
	});

});
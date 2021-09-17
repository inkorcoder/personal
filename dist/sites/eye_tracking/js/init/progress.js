$(document).ready(function(){

	function renderProgress(data, max){
		var res = "";
		var start = null;
		var end = null;

		var parts = [];

		for (var i = 0; i < data.length; i++){
			var next = data[i+1];
			var prev = data[i-1] || data[0];
			var curr = data[i];

			if (!start) start = curr;
			if (start){
				if (!next || !close(next, curr)){
					end = curr;
					// parts.push({start: curr, end: next, fill: false});
				} else {
					// end = curr;
				}
			}
			if (start && end){
				parts.push({start: start, end: end, fill: true});
				// parts.push(start.time+"-"+end.time);
				start = end = null;
			}
		}

		// console.log(parts);
		for (var i = 0; i < parts.length; i++){
			var size = Math.abs(parts[i].start.time - parts[i].end.time) / max * 100;
			var title = parts[i].start == parts[i].end ? (parts[i].start.time/1000)+"s" : (parts[i].start.time/1000)+"..."+(parts[i].end.time/1000)+"s";
			var start = parts[i].start.time/max;
			var step = 1000 / max * 100;
			res += "<li "+(parts[i].fill ? "" : "class='space'")+" data-tooltip=\""+title+"\" style=\"width:"+(size ? (size+step)+'%' : step+"%")+"; left: "+(start*100)+"%\"></li>";
		}

		return res;
	}

	function close(a, b){
		return Math.abs(a.time - b.time) <= 1000;
	}

	function renderProgressScale(max, length){
		var step = max / (length + 1);
		var res = "";
		for (var i = 0; i < length; i++){
			if (i % 5 == 0){
				res += '<li style="width: '+(step / max * 500)+'%">'+(i)+'s</li>';
			}
		}
		return res;
	}


	function renderViews(elements, user, length){

		elements.each(function(i, table){

			var key = $(table).attr('data-progress');
			if (!key) return;
			var data = user.data;
			var progressBlocks = $(table).find('.progress');
			var progressScale = $(table).find('.progress-scale');
			var card = $(table).closest('.card');

			// cover: 0,
			// scatter: 0,
			// points: [],

			progressBlocks.html("");
			progressScale.html("");
			card.find('[data-progress-count]').html("0");
			card.find('[data-sum-users]').html("0");
			card.find('[data-sum-age]').html("0");
			card.find('[data-user-age]').html("...");
			card.find('[data-date]').html("...");

			// главная карточка
			if (length){
				// console.log(data)
				var newData = [];
				var keys = {};
				for (var i = 0; i < data.length; i++){
					if (!keys[data[i].time]){
						keys[data[i].time] = [];
					}
					keys[data[i].time].push(data[i]);
				}
				// console.log(keys);
				for (var key in keys){
					var arr = keys[key],
							res = arr[0];
					for (var i = 1; i < arr.length; i++){
						if (res.cover < arr[i].cover){
							res = arr[i];
						}
					}
					newData.push(res);
				}
				data = newData;
				// console.log(newData);
				card.find('.eye-points').html("");
				for (var i = 0; i < user.points.length; i++){
					var p = user.points[i];
					card.find('.eye-points').append('<span style="left:'+p.x+'%;top:'+p.y+'%;"></span>');
				}
				card.find('[data-cover-sum]').css("width", (user.cover || 0)+"%").html((user.cover || 0)+"%");
				card.find('[data-scatter-sum]').css("width", (user.scatter || 0)+"%").html((user.scatter || 0)+"%");
			}

			if (!data || !data.length){
				console.warn("No data passed! ["+i+"] (1)");
				return;
			}
			// console.log(user);
			card.find('[data-sum-users]').html(user.count);
			card.find('[data-sum-age]').html(user.age);
			card.find('[data-user-age]').html(user.age);
			card.find('[data-date]').html(user.date);

			var max = 0;
			var step = 0;

			var blocks = [];

			for (var i = 0; i < data.length; i++){
				var p = data[i];
				if (!blocks[p.area]) blocks[p.area] = [];
				blocks[p.area].push(p);
				if (max < p.time) max = p.time;
			}

			max += 1000;


			progressBlocks.each(function(i, list){

				if (blocks[i]){

					$(list).html(renderProgress(blocks[i], max));
					$(list).closest('tr').find('[data-progress-count]').html(blocks[i].length);

				} else {
					console.warn("No data passed! ["+i+"]");
				}
			});
			// console.log(length);
			var total = length && length > 1 ? max/1000 : data.length-1;
			progressScale.html(renderProgressScale(max, total));

		});
	}


	$('#usersProgress [data-progress]').each(function(i, table){
		renderViews($(table), window.viewProgressUsers[i]);
	});

	function renderSumOfViews(){
		var sum = {
			age: 0,
			count: 0,
			cover: 0,
			scatter: 0,
			points: [],
			data: []
		};
		for (var i = 0; i < window.viewProgressUsers.length; i++){
			var card = $('#usersProgress [data-progress]').eq(i).closest('.card');
			if (!card.hasClass('faded')){
				sum.age += window.viewProgressUsers[i].age;
				sum.count++;
				sum.cover += card.find('[data-cover]').data('cover');
				sum.scatter += card.find('[data-scatter]').data('scatter');

				card.find('.eye-points span').each(function(i, span){
					sum.points.push({
						x: $(span).data('pos-x'),
						y: $(span).data('pos-y')
					})
				});

				for (var j = 0; j < window.viewProgressUsers[i].data.length; j++){
					sum.data.push(window.viewProgressUsers[i].data[j]);
				}
			}
		}
		sum.age = Math.floor(sum.age / sum.count);
		sum.cover = Math.floor(sum.cover / sum.count);
		sum.scatter = Math.floor(sum.scatter / sum.count);
		// console.log(sum.points);
		renderViews($('#mainProgress'), sum, window.viewProgressUsers.length);
	}
	renderSumOfViews();

	$('#usersProgress').on('click', "[data-toggle-view]", function(e){
		$(e.target).closest('.card').toggleClass("faded");
		renderSumOfViews();
	});

});
var days = [
			"Monday", "Tuesday", "Wednesday", "Thirsday", "Friday", "Saturday", "Sunday"
		],
		daysShort = [
			"Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"
		],
		months = [
			"January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		],
		monthsShort = [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];

moment.updateLocale('en', {
	week: {
		dow: 1
	}
});

(function( $ ) {

	if (!$){
		console.error('Calendar :: jQuery is not defined.')
	}

	/*
		helpers
	*/

	function createHeader(data){
		return (
			"<div class='header'>"+
				"<div class='date' v-bind:class='{active: startDay}'>"+
					"<i class='icon icon-fly-up'></i>Outbound "+
					(data.startDay ? data.startDay.format('MMMM DD, ddd') : '-')+
				"</div>"+
				"<div class='divider' v-bind:class='{active: startDay && endDay}'>"+
					"<div class='circle'></div>"+
					"<div class='line'></div>"+
					"<div class='circle'></div>"+
				"</div>"+
				"<div class='date' v-bind:class='{active: endDay}'>"+
					"<i class='icon icon-fly-return'></i>Return "+
					(data.endDay ? data.endDay.format('MMMM DD, ddd') : '-')+
				"</div>"+
			"</div>"
		);
	}

	function createNavigation(data){
		return (
			"<div class='sidebar'>"+
				"<ul class='clear months-list'>"+
					(list(data.months, function(month, i){
						return "<li data-bind-class=\"active|\" data-click=\"setMonth("+i+")\">"+months[month.month()]+"</li>";
					}))+
				"</ul>"+
			"</div>"
		);
	}

	// months

	function isInMonth(day, month){
		return moment(day).isSame(month, 'month');
	}
	function createMonth(month){
		var startWeek = month.startOf('month').week();
		var endWeek = month.endOf('month').week();
		let calendar = [];
		const startDay = month.clone().startOf('month').startOf('week');
		const endDay = month.clone().endOf('month').endOf('week');
		let date = startDay.clone().subtract(1, 'day');
		while (date.isBefore(endDay, 'day')) {
			calendar.push({
				days: Array(7).fill(0).map(() => date.add(1, 'day').clone())
			})
		}
		return (
			"<table>"+
				"<caption>"+months[month.month()]+" "+month.year()+"</caption>"+
				"<thead>"+
					(list(daysShort, function(day, i){
						return "<th>"+day+"</th>";
					}))+
				"</thead>"+
				"<tbody>"+
					(list(calendar, function(week, weekIndex){
						return (
							"<tr>"+
								(list(week.days, function(day, dayIndex){
									return (
										"<td>"+
											(isInMonth(day, month) ? "<span class='day'>"+day.format('D')+"</span>" : "")+
										"</td>"
									);
								}))+
							"</tr>"
						);
					}))+
					// "<tr v-for='(week, weekIndex) in calendar'>"+
					// 	"<td v-for='(day, dayIndex) in week.days'>"+
					// 		"<span class='day' v-if='isInMonth(day, month)'>{{day.format('D')}}</span>"+
					// 	"</td>"+
					// "</tr>"+
				"</tbody>"+
			"</table>"
		);
	}

	function list(array, callback){
		var result = "";
		for (var i = 0; i < array.length; i++){
			result += callback(array[i], i);
		}
		return result;
	}

	function createBody(data){
		return (
			"<div class='body'>"+
				"<div class='scrolled'>"+
					"<ul class='clear months'>"+
						(list(data.months, function(month, i){
							return "<li>"+(createMonth(month, data.calendar))+"</li>";
						}))+
					"</ul>"+
				"</div>"+
			"</div>"
		);
	}

	/*
		methods
	*/

	function parseValues(array){
		var result = [];
		for (var i = 0; i < array.length; i++){
			result.push(JSON.parse(array[i]))
		}
		return result;
	}

	/*
		plugin
	*/

	$.fn.Calendar = function(options) {

		this.each(function(i, input){

			var settings = {
				onOpen: null,
				onClose: null,
				onChange: null,
				container: null
			};

			var data = {
				startDay: null,
				endDay: null,
				months: [],
				activeMonth: 0,
				monthsRange: [0,1],
				scrolled: null
			}

			// Object.defineProperty(data.monthsRange, "push", {
			// 	configurable: false,
			// 	enumerable: false,
			// 	writable: false,
			// 	value: function () {
			// 		for (var i = 0, n = this.length, l = arguments.length; i < l; i++, n++) {
			// 			// RaiseMyEvent(this, n, this[n] = arguments[i]);
			// 			console.log(this, n, this[n] = arguments[i])
			// 		}
			// 		return n;
			// 	}
			// });

			var methods = {
				setMonth: function(index){
					data.activeMonth = index;
					if (index % 2 === 0) {
						data.monthsRange.splice(0, 1, index);
						data.monthsRange.splice(1, 1, index+1);
					} else {
						data.monthsRange.splice(0, 1, index-1);
						data.monthsRange.splice(1, 1, index);
					}
					
					// console.log(data.monthsRange)
					// if (this.scrolled){
					// 	this.scrolled.animate({
					// 		scrollTop: $('.months > li').eq(this.activeMonth).position().top + this.scrolled.scrollTop() - 30
					// 	}, 200);
					// }
				}
			};

			var settings = $.extend(settings, options);

			var result = $("<div class='calendar active'></div>");

			for (var i = 0; i < 12; i++){
				data.months.push(moment().add(i, 'months'));
			}

			data.scrolled = 

			// result.append(createHeader(data));
			result.append(createNavigation(data));
			result.append(createBody(data));

			// result.find('.months tbody td .day').click(function(e){
			// 	methods.setMonth.call(null, 1)
			// })

			result.find('[data-click]').each(function(i, element){
				var string = $(element).attr('data-click'),
						methodName = string.replace(/\(.*?\)/gim, ''),
						values = string.match(/\(.*?\)/gim, '')[0].replace(/\(|\)| |\s/gim, '').split('|');
				$(element).removeAttr('data-click');
				$(element).click(function(){
					// console.log('d')
					methods[methodName].apply(element, parseValues(values));
				})
			});

			result.appendTo(settings.container ? $(settings.container) : $(input).parent());

		});

		return this;

	};

}(jQuery));
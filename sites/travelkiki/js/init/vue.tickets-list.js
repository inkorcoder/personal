var ticketsList = new Vue({
	el: '#ticketsList',
	data: {
		tickets: []
	},
	methods: {

	}
});

var generateTicket = function(fromPlace, toPlace, data){

	getStops = function(){
		var res = [];
		for (var i = 0; i < Math.floor(Math.random()*3); i++){
			res.push(data[Math.floor(Math.random()*data.length)]);
		}
		return res;
	};

	return {
		from: fromPlace,
		to: toPlace,
		price: Math.floor(Math.random() * 500),
		stops: getStops(),
		duration: {
			hours: Math.floor(Math.random()*24),
			minutes: Math.floor(Math.random()*59)
		}
	};
}

$.ajax({
	url: 'temp/tickets.json',
	method: "GET",
	success: function(data){
		// console.log(data)
		for (var i = 0; i < data.length; i++){
			// console.log(
				
			// );
			ticketsList.tickets.push(generateTicket(
				data[i], data[Math.floor(Math.random()*data.length)],
				data
			));
		}
		// console.log(data)
	},
	error: function(){
	}
})
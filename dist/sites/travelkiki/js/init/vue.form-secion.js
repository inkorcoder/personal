var formSection = new Vue({
	el: '#form',
	data: {
		activeCity: null,
		activeCityIndex: 0,
		activeAirportIndex: 0,
		from: '',
		to: '',
		type: 'roundtrip',
		date: '',
		dateFrom: '',
		dateTo: '',
		focus: {
			from: false,
			to: false,
			date: false
		},
		placeholder: {
			from: 'From?',
			to: 'To?',
			date: 'Date'
		},
		cities: [{
			name: "London",
			country: "United Kingdom",
			expanded: false,
			airports: [
				{ name: "Heathrow", "code": "LHR", toCenter: "33km" },
				{ name: "Gatwick", "code": "LGW", toCenter: "20km" },
				{ name: "Stansted", "code": "STN", toCenter: "40km" },
				{ name: "City", "code": "LCY", toCenter: "57km" },
				{ name: "Luton", "code": "LTN", toCenter: "3km" },
				{ name: "Southend", "code": "SEN", toCenter: "1km" }
			]
		},{
			name: "Moscow",
			country: "Russia",
			airports: [
				{ name: "Moscow", "code": "SVO", toCenter: "1km" }
			]
		}],
		citiesArray: [],
		passengers: {
			adult: 1,
			childrens: 0,
			babies: 0
		},
		passengersCount: 1,
		collapsed: false
	},
	methods: {
		getCities: function(key){
			var cities = [];
			// this.activeCity = null;
			// this.activeCityIndex = 0;
			for (var i = 0; i < this.cities.length; i++){
				var city = this.cities[i];
				city.expanded = this.match(key, city.name, true);
				this.activeCity = city;
				// if (city.expanded){
					
				// }
				if (this.match(key, city.name)){
					cities.push(city);
				}
			}
			return cities;
		},
		showDropdown: function(key){
			this.focus[key] = true;
		},
		hideDropdown: function(key){
			var $this = this;
			setTimeout(function(){
				$this.focus[key] = false;
			}, 100);
		},
		clearModel: function(model) {
			this[model] = '';
		},
		match: function(key, value, checkByWords){
			if (checkByWords){
				return value.trim().toLowerCase() === this[key].toLowerCase();
			} else {
				return value.trim().match(new RegExp("(^"+this[key]+")", "gim"));
			}
		},
		highlight: function(key, value){
			return value.trim().replace(new RegExp("(^"+this[key]+")", "gim"), "<span class=\"highlight\">$1</span>")
		},
		setActiveOption: function(key, city, airport, event){
			// if (airport)
			if (airport){
				event.stopPropagation();
			}
			var isAirport = $(event.target).closest('.airports-list').length > 0;
			this[key] = isAirport ? airport.code+" "+airport.name : city.name;
		},
		handleNavigation: function(event){
			// for cities
			// if (event.keyCode === 38 && this.activeCityIndex > 0){ // up
			// 	this.activeCityIndex--;
			// } else if (event.keyCode === 40 && this.activeCityIndex < this.getCities().length-1){ // down
			// 	this.activeCityIndex++;
			// } else {
			// 	this.activeCityIndex = 0;
			// }

			// // for airport
			// if (this.activeCity && this.activeCity.airports){
			// 	if (event.keyCode === 38 && this.activeAirportIndex > 0){ // up
			// 		this.activeAirportIndex--;
			// 	} else if (event.keyCode === 40 && this.activeAirportIndex < this.activeCity.airports.length-1){ // down
			// 		this.activeAirportIndex++;
			// 	} else {
			// 		this.activeAirportIndex = 0;
			// 	}
			// } else {
			// 	this.activeAirportIndex = 0;
			// }
			// console.log(this.activeAirportIndex)
		},
		decrement: function(key, min){
			if (this.passengers[key] > min){
				this.passengers[key]--;
				this.updatePassengersCount();
			}
		},
		increment: function(key, max){
			if (this.passengers[key] < max){
				this.passengers[key]++;
				this.updatePassengersCount();
			}
		},
		setPassengerCount: function(key, event){
			if (event.target.value && parseInt(event.target.value) > 0){
				this.passengers[key] = parseInt(event.target.value);
				this.updatePassengersCount();
			}
		},
		updatePassengersCount: function(){
			this.passengersCount = this.passengers.adult + this.passengers.childrens + this.passengers.babies;
		},
		updateDates: function(event){
			if (!event.start && !event.end) {
				this.dateFrom = this.dateTo = this.date = '';
				return
			}
			this.dateFrom = event.start.format('MMMM DD, ddd');
			this.dateTo = event.end.format('MMMM DD, ddd');
			this.date = event.start.format('MMM DD')+" ― "+event.end.format('MMM DD');
		},
		clearCalendar: function(){
			if (this.$refs.calendar){
				this.$refs.calendar.clear();
				this.$refs.calendar.hide();
			}
		},
		showCalendar: function(){
			if (this.$refs.calendar){
				this.$refs.calendar.show();
			}
		},
		hideCalendar: function(){
			if (this.$refs.calendar){
				this.$refs.calendar.hide();
			}
		},
		onSend: function(event){
			// console.log(this.from, this.to)
			// this.collapsed = true;
			// $('.form-section, .main-header').addClass('collapsed');
			// setTimeout(function(){
			// 	if (map) map.resize();
			// }, 510)
			// $('body').attr('data-route', 'tickets');
			location.hash = "tickets";
			// var anim = maps.animatePath(
			// 	map,
			// 	points[4].position,
			// 	points[Math.floor(Math.random()*14)].position,
			// 	3000
			// );
			// setTimeout(function(){
			// 	anim.run();
			// }, 1)
		}
	}
});
var vueApp = new Vue({
	el: "#app",
	data: {
		calendarType: 'double',
		tripTypes: {
			double: "ROUNDTRIP",
			single: "ONE WAY"
		},
		models: {
			from: '',
			to: '',
			date: ''
		},
		start: null,
		end: null,
		onlyDirect: false,
		tripType: 'roundTrip',
		open: {
			trip: false,
			passangers: false,
			from: false,
			to: false,
			date: false,
			stops: false,
			departure: false,
			returning: false,
			duration: false,
			airlines: false,
			sortedBy: false
		},
		passangers: {
			adult: 1,
			children: 0,
			babies: 0
		},
		initialized: false
	},
	methods: {
		setCalendarType: function(type) {
			this.calendarType = type;
			this.$refs.calendar.clear();
		},
		setTripType: function(type){
			this.tripType = type || 'roundTrip';
		},
		toggle: function(key, event){
			if (typeof event === 'object'){
				if ($(event.target).closest('.inner').length === 0) {
					// this.open[key] = false;
				}
				return;
			} else if (typeof event === 'string'){
				setTimeout(function(){
					$('#'+event).focus();
				}, 500);
			}
			this.open[key] = !this.open[key];
		},
		close: function(key){
			this.open[key] = false;
		},
		decreasePassanger: function(key){
			if (this.passangers[key] > 0){
				this.passangers[key]--;
			}
		},
		increasePassanger: function(key){
			if (this.passangers[key] < 10){
				this.passangers[key]++;
			}
		},
		totalPassangers: function(){
			return this.passangers.adult + this.passangers.children + this.passangers.babies;
		},
		setModel: function(key, event){
			if (event && event.target){
				this.models[key] = event.target.value;
			} else if (event && event.start){
				this.models[key] = event.start.format('MMM DD')+" ― "+(event.end ? event.end.format('MMM DD') : '')
				if (event.start){
					this.models.start = event.start;
				}
				if (event.end){
					this.models.end = event.end;
				}
			}
		},
		resetModel: function(key, inputId){
			this.models[key] = '';
			$('#'+inputId).val('');
			this.models.start = null;
			this.models.end = null;
		},
		getStartDate: function(placeholder){

		},
		getEndDate: function(placeholder){

		}
	},
	mounted: function(){
		if (this.$refs.calendar){
			this.$refs.calendar.setToday();
		}
		var $this = this;
		setTimeout(function(){
			$this.initialized = true;
		}, 1000);
	}
});

$('.form-section form').change(function(){
	if (vueApp && vueApp.initialized){
		$('.mobile-filter').addClass('active');
		$(this).find('[type="reset"]').addClass('filled');
	}
});

$('.form-section form').on('reset', function(){
	setTimeout(function(){
		$('.mobile-filter').removeClass('active');
		$('.form-section form').find('[type="reset"]').removeClass('filled');
	}, 100)
});
var SEARCH_ENGINE = new Vue({
	el: ".s-engine",
	data: {
		type: "roundtrip",
		preloading: false,
		postloading: false,
		showBackground: false,
		scrollTop: 0,
		mobile: {
			active: false,
			dragging: false,
			transition: false,
			expanded: false,
			fullSize: false,
			swipeOffset: 0,
			oldSwipeOffset: 0,
			checkIsActive: function(){
				this.active = $(window).width() <= 768;
			},
			enterFullSize: function(hash){
				this.fullSize = true;
				$('html,body').addClass('no-touch');
				if (!hash || hash === location.hash.substr(1)) return;
				history.pushState(null, '', "#"+hash);
			},
			exitFullSize: function(){
				this.fullSize = false;
				$('input:focus').blur();
				$('html,body').removeClass('no-touch');
				history.pushState(null, '', "#");
			},
			getFadingProgress: function(){
				if (!SEARCH_ENGINE) return 0;
				var bbox = $('.s-engine .mobile-body')[0].getBoundingClientRect(),
						dir = SEARCH_ENGINE.mobile.oldSwipeOffset + SEARCH_ENGINE.mobile.swipeOffset;

				if (SEARCH_ENGINE.mobile.expanded){
					if (SEARCH_ENGINE.mobile.dragging){
						var offset = SEARCH_ENGINE.mobile.swipeOffset ? dir : 0;
						return 1-Math.min(1, offset / (bbox.height-90));
					} else {
						return 1;
					}
				} else {
					if (SEARCH_ENGINE.mobile.dragging){
						return Math.min(1, SEARCH_ENGINE.mobile.swipeOffset / (bbox.height-90) * -1);
					} else {
						return 0;
					}
				}
			}
		},
		passengers: {
			adult: 0,
			children: 0,
			babies: 0
		},
		fakeCities: [],
		activeFakeCity: 0,
		airports: [],
		from: {
			search: '',
			hightlighted: 0,
			selected: null,
			open: false,
			filtered: [],
			suggestion: null
		},
		to: {
			search: '',
			hightlighted: 0,
			selected: null,
			open: false,
			filtered: [],
			suggestion: null
		},
		dates: {
			arriving: null,
			departure: null
		},
		valid: {
			from: true, to: true, dates: true
		},
		collapsed: $('main').hasClass('s-engine-collapsed') && $(window).width() > 768,
		filters: {
			enabled: $('main').hasClass('has-filters'),
			alliances: [],
		}
	},
	watch: {
		collapsed: function(value){
			// this.collapsed = $(window).width() > 768 ? value : false;
			if ($(window).width() > 768){
				$('main').removeClass('s-engine-collapsed s-engine-expanded');
				$('main').addClass(value ? 's-engine-collapsed' : 's-engine-expanded');
			}
		}
	},
	created: function(){
		var $this = this;
		this.filters.enabled = $('main').hasClass('has-filters');
		$('.s-engine').removeClass('collapsed');
		$this.scrollTop = $(document).scrollTop();
		$(window).scroll(function(){
			$this.scrollTop = $(document).scrollTop();
		});
	},
	mounted: function(){
		var $this = this;
		if (this.$refs.calendar){
			this.$refs.calendar.setToday();
			this.$refs.calendar.setTomorow();
		}
		setInterval(function(){
			if ($this.activeFakeCity < $this.fakeCities.length-1){
				$this.activeFakeCity++;
			} else {
				$this.activeFakeCity = 0;
			}
		}, 3000);
	},
	methods: {
		setType: function(type){
			this.type = type;
			var $this = this;
			var calendar = this.$refs.calendar;
			calendar.clear();
			calendar.setToday();
			setTimeout(function(){
				if ($this.type === "roundtrip"){
					calendar.setTomorow();
				}
				window.waitForFinalEvent(function(){
					$('.s-engine').trigger('change:type', [type, 'type']);
				}, 500, 's-engine-type');
			});
		},
		decreasePassenger: function(key){
			if (this.passengers[key] > 0){
				this.passengers[key]--;
			}
		},
		increasePassenger: function(key){
			if (this.passengers[key] < 10){
				this.passengers[key]++;
			}
		},
		totalPassengers: function(){
			if (window.waitForFinalEvent){
				var $this = this;
				window.waitForFinalEvent(function(){
					$('.s-engine').trigger('change:passengers', [JSON.parse(JSON.stringify($this.passengers)), 'passengers']);
				}, 500, 's-engine-passengers');
			}
			return this.passengers.adult + this.passengers.children + this.passengers.babies;
		},
		highlightVariant: function(key, index){
			this[key].hightlighted = this[key].filtered[index];
		},
		setActiveVariant: function(key, index){
			if (!this[key].filtered.length){
				this[key].filtered.push(this.airports[index]);
			}
			this[key].selected = this[key].filtered[index];
			this[key].search = this[key].selected.airport
				.replace(/( |\s|\t)international/gim, '')
				.replace(/( |\s|\t)national/gim, '')
				.replace(/( |\s|\t)airport/gim, '');
			this[key].open = false;
			$("#"+key+"City").blur();
			if (this[key].selected){
				this.valid[key] = true;
			}
			this.mobile.exitFullSize();
			location.hash = "";
			$('.s-engine').trigger("change:"+key, [JSON.parse(JSON.stringify(this[key])), key]);
		},
		clearVariant: function(key){
			this[key].selected = null;
			this[key].hightlighted = 0;
			if (!this.mobile.active){
				this[key].open = false;
			}
			this[key].search = '';
			this[key].filtered = this.airports;
			setTimeout(function(){
				$('#'+key+'City').focus();
			});
			$('.s-engine').trigger("change:"+key, [JSON.parse(JSON.stringify(this[key])), key]);
		},
		getActiveVariantString: function(key){
			return this[key].selected ? (
				this[key].selected.location+", "+this[key].selected.country+", "+this[key].selected.code
			) : '&nbsp;';
		},
		hideSearch(key){
			var $this = this;
			var otherKey = key === "from" ? "to" : "from";
			setTimeout(function(){
				if ($this[otherKey].open){
					$this[key].open = false;
				}
			}, 10);
		},
		hideAllSearches(){
			this.from.open = false;
			this.to.open = false;
		},
		handleSearch(key, value, event){
			// this.setSuggestion(key, null);
			// console.log(event.keyCode);
			// if (!this[key].search) {
			// 	this[key].filtered = [];
			// 	return;
			// }
			// just mobile search
			if (event && event.type.match(/(input|change|cut|copy|paste|propertychange)/gim) && $(window).width() <= 768){
				waitForFinalEvent(function(){

					requestAirports(key);
				}, 500, key+"_search");
				return;
			}
			if ((event && !event.ctrlKey && !event.shiftKey)){
				// accept only letters
				if (event.keyCode === 8 || (event.keyCode > 64 && event.keyCode < 91) || (event.keyCode > 96 && event.keyCode < 123)){
					waitForFinalEvent(function(){

						requestAirports(key);
					}, 500, key+"_search");
				}
			}
			// this.from.filtered = this.airports.length ? this.airports : [];
		},
		navigateByKeys: function(key, event){
			if (event.keyCode === 38){ // up
				event.preventDefault();
				if (this[key].hightlighted > 0){
					this[key].hightlighted--;
					this.scrollToActiveVariant(key);
				}
			} else if (event.keyCode === 40){ // down
				event.preventDefault();
				if (this[key].hightlighted < this[key].filtered.length-1){
					this[key].hightlighted++;
					this.scrollToActiveVariant(key);
				}
			} else if (event.keyCode === 13){ // enter
				event.preventDefault();
				if (this[key].hightlighted >= 0){
					this.setActiveVariant(key, this[key].hightlighted);
				}
			}
		},
		scrollToActiveVariant: function(key){
			if (this.$refs[key+"List"]){
				var scrolled = $(this.$refs[key+"List"]);
				var oldOffset = scrolled.scrollTop();
				var activeVariant = scrolled.find('li').eq(this[key].hightlighted);
				if (!activeVariant) return;
				var bottom = activeVariant.position().top - scrolled.scrollTop();
				scrolled.scrollTop(0);
				var offset = activeVariant.position().top;
				if (offset + bottom > 250){
					scrolled.scrollTop(offset-87*2);
				} else if (offset + bottom < 0){
					scrolled.scrollTop(offset);
				} else {
					scrolled.scrollTop(oldOffset);
				}
			}
		},
		setSuggestion: function(key, suggestion){
			this[key].suggestion = suggestion;
		},
		getSuggestion: function(key){
			return this[key].suggestion;
		},
		activateSuggestion: function(key){
			this[key].filtered.push(this[key].suggestion);
			// this[key].suggestion = null;
			this.setActiveVariant(key, this[key].filtered.length-1);
		},
		switchPlaces: function(event){
			var temp = Object.assign({}, {
				search: this.from.search,
				hightlighted: this.from.hightlighted,
				selected: this.from.selected
			});
			this.from.search = this.to.search;
			this.from.hightlighted = this.to.hightlighted;
			this.from.selected = this.to.selected;
			this.to.search = temp.search;
			this.to.hightlighted = temp.hightlighted;
			this.to.selected = temp.selected;
			$(event.target).closest('button').removeClass('active').addClass('active');
			setTimeout(function(){
				$(event.target).closest('button').removeClass('active');
			}, 200);
		},

		toggleCalendar: function(isClose){
			if (isClose){
				this.$refs.calendar.hide();
				return;
			}
			this.$refs.calendar.show();
			this.mobile.enterFullSize('calendar');
			// console.log(this.$refs.calendar);
			// this.$refs.calendar.open = !this.$refs.calendar.open;
		},
		setCalendarType: function(type) {
			this.calendarType = type;
			this.$refs.calendar.clear();
		},
		setDates: function(event){
			this.dates.departure = event.start;
			this.dates.arriving = event.end;
			$('.s-engine').trigger("change:dates", [JSON.parse(JSON.stringify(this.dates)), 'dates']);
		},
		getDatesString: function(){
			if (this.type === "roundtrip"){
				return (this.dates.departure ? this.dates.departure.format('DD MMM') : "") + " — " + (this.dates.arriving ? this.dates.arriving.format('DD MMM') : "");
			} else {
				return this.dates.departure ? this.dates.departure.format('DD MMMM') : "";
			}
		},
		setModel: function(key, event){

		},
		isFormValid: function(){
			var state = true;
			if (!this.from.search || !this.to.search){
				state = false;
			}
			if (this.type === 'roundtrip' && (!this.dates.departure || !this.dates.arriving)){
				state = false;
			}
			if (this.type === 'oneway' && !this.dates.departure){
				state = false;
			}
			return state;
		},

		resetSubmit: function(){
			this.valid.from = this.valid.to = this.valid.dates = true;
		},
		submit: function(){
			var $this = this;
			this.resetSubmit();
			this.valid.from = this.from.search ? true : false;
			this.valid.to = this.to.search ? true : false;
			if (this.type = "roundtrip"){
				this.valid.dates = this.dates.departure && this.dates.arriving ? true : false;
			} else {
				this.valid.dates = this.dates.departure ? true : false;
			}
			if (this.isFormValid()){
				if (!this.mobile.active){
					this.collapsed = true;
				}
				$(this.$el).trigger('custom.submit', this.$data);
			}
			setTimeout(function(){
				$this.resetSubmit();
			}, 500);
		}
	}
});

$(window).on('hashchange', function(){
	if (!location.hash) {
		SEARCH_ENGINE.from.open = false;
		SEARCH_ENGINE.to.open = false;
		SEARCH_ENGINE.toggleCalendar(true);
		SEARCH_ENGINE.mobile.exitFullSize();
		$('[data-dismiss="passengers"]').click();
	}
});

SEARCH_ENGINE.mobile.checkIsActive();
$(window).resize(function(){
	SEARCH_ENGINE.mobile.checkIsActive();
});

var lastScroll = 0;
$(window).scroll(function(){
	var newScroll = $(document).scrollTop();

	// do nothing if not main page
	if (window.MAIN_PAGE) return;

	if (newScroll > lastScroll){
		if ($(window).width() > 768){
			SEARCH_ENGINE.collapsed = true;
		}
		SEARCH_ENGINE.from.open = false;
		SEARCH_ENGINE.to.open = false;
	} else if (newScroll <= 1) {
		if ($(window).width() > 768){
			SEARCH_ENGINE.collapsed = false;
		}
	}
	lastScroll = newScroll;
});

$('html,body').on('mousedown', function(e){
	if (!$(e.target).closest('[data-city="from"]').length){
		SEARCH_ENGINE.from.open = false;
	}
	if (!$(e.target).closest('[data-city="to"]').length){
		SEARCH_ENGINE.to.open = false;
	}

	// do nothing if not main page
	if (window.MAIN_PAGE) return;

	if (!$(e.target).closest('.main-header, .form-group, [data-dropdown], .dropdown, .fake-trigger, .calendar, button').length){
		if (!$('.s-engine').find('.dropdown.active, .search-dropdown.active, .calendar.active, [data-dropdown].active').length && (SEARCH_ENGINE.scrollTop > 10 || window.RESULTS_PAGE)){
			if (!SEARCH_ENGINE.mobile.active){
				SEARCH_ENGINE.collapsed = true;
			}
		}
	}
	if (window.RESULTS_PAGE){
		return;
	}
	if ($(e.target).closest('.ticket').length && SEARCH_ENGINE.scrollTop > 10){
		if (!SEARCH_ENGINE.mobile.active){
			SEARCH_ENGINE.collapsed = true;
		}
	}
});


var searchDragStart = 0;
$('.s-engine').on('touchstart', function(e){
	if (SEARCH_ENGINE.mobile.fullSize || (SEARCH_ENGINE.$refs.searchFilters && SEARCH_ENGINE.$refs.searchFilters.active)) return;
	// $('html,body').addClass('no-touch');
	// e.preventDefault();
	// if ($(e.target).closest('.search-dropdown').length) return;
	SEARCH_ENGINE.mobile.dragging = true;
	searchDragStart = e.originalEvent.touches[0].clientY;
	// console.log(e);
});
document.addEventListener('touchmove', function(e){
	if (!SEARCH_ENGINE.mobile.dragging) return;
	e.preventDefault();
	var searchDragCurrent = e.touches[0].clientY;
	var max = $('.s-engine .mobile-body')[0].getBoundingClientRect().height - 90;
	var newOffset = (SEARCH_ENGINE.mobile.oldSwipeOffset + (searchDragStart - searchDragCurrent)) * -1;
	SEARCH_ENGINE.mobile.swipeOffset = Math.max(max*-1, newOffset);
	// console.log(SEARCH_ENGINE.mobile.oldSwipeOffset + SEARCH_ENGINE.mobile.swipeOffset)

}, { passive: false });

$(document).on('touchend touchcancel', function(e){
	var direction = SEARCH_ENGINE.mobile.oldSwipeOffset + SEARCH_ENGINE.mobile.swipeOffset;
	// var searchDragCurrent = e.originalEvent.touches[0].clientY,
	// 		offset = (searchDragStart - searchDragCurrent) * -1;
	if (!SEARCH_ENGINE.mobile.expanded && Math.abs(SEARCH_ENGINE.mobile.swipeOffset) > window.innerHeight/3){
		SEARCH_ENGINE.mobile.expanded = true;
		$('html,body').addClass('overlayed');
		SEARCH_ENGINE.mobile.oldSwipeOffset = $('.s-engine .mobile-body')[0].getBoundingClientRect().height - 90;
	} else if(SEARCH_ENGINE.mobile.expanded && (Math.abs(SEARCH_ENGINE.mobile.swipeOffset) > 0) && (direction > window.innerHeight/5)) {
		SEARCH_ENGINE.mobile.expanded = false;
		SEARCH_ENGINE.mobile.oldSwipeOffset = 0;
		if (!SEARCH_ENGINE.mobile.fullSize){
			$('html,body').removeClass('overlayed');
		}
	}
	SEARCH_ENGINE.mobile.swipeOffset = 0;
	// console.log(SEARCH_ENGINE.swipeOffset);
	SEARCH_ENGINE.mobile.dragging = false;
	// $('html,body').removeClass('no-touch');
});

$(document).on('click', '.mobile-fake', function(){
	SEARCH_ENGINE.mobile.expanded = true;
	$('html,body').addClass('overlayed');
	SEARCH_ENGINE.mobile.oldSwipeOffset = $('.s-engine .mobile-body')[0].getBoundingClientRect().height - 90;
});


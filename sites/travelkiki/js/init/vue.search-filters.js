Vue.component('search-filters', {
	data: function(){
		return {
			filters: {
				stops: {
					counter: 1,
					direct: true, stop1: true, stop2: true, stop3: true,
					getString: function(){
						var result = "", c = 0;
						for (var k in this){
							if (k !== "getString" && this[k] === true){
								if (c == 0){
									result = SEARCH_I18N[k];
								}
								c++;
							}
						}
						this.counter = c;
						if (this.counter === 0){
							this.direct = true;
						}
						return this.counter === 4 ? SEARCH_I18N.all : result+(this.counter > 1 ? "<i>+</i>" : "");
					}
				},
				depart: {
					from: 0,
					to: 0,
					isAnytime: function(){ return this.from === "00" && this.to === "23"; },
					getString: function(){
						return this.isAnytime() ? SEARCH_I18N.anytime : this.from+"h — "+this.to+"h";
					}
				},
				return: {
					from: 0,
					to: 0,
					isAnytime: function(){ return this.from === "00" && this.to === "23"; },
					getString: function(){
						return this.isAnytime() ? SEARCH_I18N.anytime : this.from+"h — "+this.to+"h";
					}
				},
				duration: {
					from: 0,
					isAnytime: function(){ return this.from === "23" },
					getString: function(){
						return this.isAnytime() ? SEARCH_I18N.anytime : this.from;
					}
				},
				allAirlinesSelected: true,
				airlinesLabel: SEARCH_I18N.all,
				isChanged: function(){
					return !(
						(this.stops.counter === 4) &&
						this.depart.isAnytime() &&
						this.return.isAnytime() &&
						this.duration.isAnytime() &&
						this.allAirlinesSelected
					);
				},
				reset: function(key){
					switch (key){
						case "stops":
							this.stops.direct = this.stops.stop1 = this.stops.stop2 = this.stops.stop3 = true;
							break;
						case "depart":
							this.depart.from = "00";
							this.depart.to = "23";
							if ($('#departRange')[0].noUiSlider){
								$('#departRange')[0].noUiSlider.reset();
							}
							break;
						case "return":
							this.return.from = "00";
							this.return.to = "23";
							if ($('#returnRange')[0].noUiSlider){
								$('#returnRange')[0].noUiSlider.reset();
							}
							break;
						case "duration":
							this.duration.from = "2";
							if ($('#durationRange')[0].noUiSlider){
								$('#durationRange')[0].noUiSlider.reset();
							}
							break;
					}
				}
			},
			active: false
		}
	},
	props: ["alliances", "mobile"],
	methods: {
		fireChange: function(data, key){
			window.waitForFinalEvent(function(){
				$('.s-engine').trigger('custom.filter', [JSON.parse(JSON.stringify(data)), key])
				// JSON.parse(JSON.stringify(data))
			}, 500, 's-engine-filters');
		},
		filterAirlines: function(event){
			for (var i = 0; i < this.alliances.length; i++){
				var alliance = this.alliances[i];
				for (var j = 0; j < alliance.airlines.length; j++){
					alliance.airlines[j].checked = alliance.checked;
				}
			}
			setTimeout(function(){
				$('#airlinesScrolled').perfectScrollbar('update');
			});
			this.checkAllSelectedState(event);
		},
		selectAllAirlines: function(value, event){
			for (var i = 0; i < this.alliances.length; i++){
				var alliance = this.alliances[i];
				alliance.checked = value;
				for (var j = 0; j < alliance.airlines.length; j++){
					alliance.airlines[j].checked = value;
				}
			}
			// this.filters.allAirlinesSelected = value;
			this.filterAirlines(event);
		},
		checkAllSelectedState: function(event){
			var state = true;
			var label = "";
			var count = 0;
			// expensive
			var $this = this;
			setTimeout(function() {
				for (var i = 0; i < $this.alliances.length; i++){
					var alliance = $this.alliances[i];
					// alliance.checked = false;
					for (var j = 0; j < alliance.airlines.length; j++){
						if (!alliance.airlines[j].checked){
							state = false;
							alliance.checked = false;
						} else {
							if (count === 0){
								label = alliance.airlines[j].label;
							}
							count++;
							if (count === alliance.airlines.length){
								alliance.checked = true;
							}
						}
					}
				}
				if (state){
					$this.filters.airlinesLabel = SEARCH_I18N.all;
				} else {
					$this.filters.airlinesLabel = label ? label : SEARCH_I18N.none;
					if (count-1 >= 1) {
						$this.filters.airlinesLabel = SEARCH_I18N.custom;
					}
				}
				if (!event){
					$this.filters.allAirlinesSelected = state;
				}
			});
		},
		toggle: function(){
			this.active = !this.active;
			this.$emit('toggle', this.active);
		},
		history: function(hash){
			// console.log(hash);
			// console.log(this.$props.mobile);
		}
	},
	template: `
		<div class="main-filters" v-bind:class="{active: active}">
			<div class="container-fluid">
				<div class="toggler sm-hide" v-on:click="toggle()"><i class="icon icon-filter1" v-bind:class="{'changed': filters.isChanged()}"></i>Filters <i class="icon2 icon-chevron-down-thick"></i><i class="icon2 icon-chevron-up-thick"></i></div>
				<div class="layout">

					<div class="column">
						<div class="search-dropdown" data-dropdown>
							<div class="form-group">
								<label class="anchor">Stops</label>
								<button type="button" class="input anchor"
									v-bind:class="{grey: filters.stops.counter === 4}"
									v-on:click="history('filter-stops')"
								>
									<span v-html="filters.stops.getString()"></span>
								</button>
								<span class="line" v-bind:class="{hovered: filters.stops.counter !== 4}"></span>
								<button type="button" class="clear-input"
									v-on:click="filters.reset('stops'); fireChange(filters.stops, 'stops');"
									v-if="filters.stops.counter !== 4"
									v-cloak
								>
									<i class="icon icon-close"></i>
								</button>
							</div>
							<div class="dropdown">
								<div class="block">
									<div class="checkbox black">
										<input type="checkbox" id="direct" v-model="filters.stops.direct" v-on:input="fireChange(filters.stops, 'stops')">
										<label for="direct"><i>120&euro;</i><span></span>Direct</label>
									</div>
									<div class="checkbox black">
										<input type="checkbox" id="stop" v-model="filters.stops.stop1" v-on:input="fireChange(filters.stops, 'stops')">
										<label for="stop"><i>240&euro;</i><span></span>1 Stop</label>
									</div>
									<div class="checkbox black">
										<input type="checkbox" id="2stops" v-model="filters.stops.stop2" v-on:input="fireChange(filters.stops, 'stops')">
										<label for="2stops"><i>360&euro;</i><span></span>2 Stops</label>
									</div>
									<div class="checkbox black">
										<input type="checkbox" id="3stops" v-model="filters.stops.stop3" v-on:input="fireChange(filters.stops, 'stops')">
										<label for="3stops"><i>650&euro;</i><span></span>3 Stops</label>
									</div>
								</div>
								<div class="block sm-hide">
									<button class="btn btn-info btn-block" data-dismiss type="button">Ok</button>
								</div>
							</div>
						</div>
					</div>
					<!-- depart time -->
					<div class="column">
						<div class="search-dropdown" data-dropdown>
							<div class="form-group">
								<label class="anchor">Depart</label>
								<button type="button" class="input anchor"
									v-html="filters.depart.getString()"
									v-bind:class="{grey: filters.depart.isAnytime()}"
								></button>
								<span class="line" v-bind:class="{hovered: !filters.depart.isAnytime()}"></span>
								<button type="button" class="clear-input"
									v-if="!filters.depart.isAnytime()"
									v-on:click="filters.reset('depart')"
									v-cloak
								>
									<i class="icon icon-close"></i>
								</button>
							</div>
							<div class="dropdown">
								<div class="block">
									<div class="row range-labels">
										<div class="col-xs-6"><span>{{filters.depart.from}}</span>h</div>
										<div class="col-xs-6 align-right"><span>{{filters.depart.to}}</span>h</div>
									</div>
								</div>
								<div class="block">
									<input type="hidden" id="departTimeRange1" value="0" v-on:input="filters.depart.from = $event.target.value; fireChange(filters.depart, 'depart')">
									<input type="hidden" id="departTimeRange2" value="23" v-on:input="filters.depart.to = $event.target.value; fireChange(filters.depart, 'depart')">
									<div class="range-slider">
										<div
										data-range-time="#departTimeRange1,#departTimeRange2"
										data-range-labels=".departTimeLabel1,.departTimeLabel2"
										data-start="0" data-end="23" data-step="1"
										data-values="0,23" id="departRange"
										></div>
									</div>
								</div>
								<div class="block sm-hide">
									<button class="btn btn-info btn-block" data-dismiss type="button">Ok</button>
								</div>
							</div>
						</div>
					</div>
					<!-- return time -->
					<div class="column">
						<div class="search-dropdown" data-dropdown>
							<div class="form-group">
								<label class="anchor">Return</label>
								<button type="button" class="input anchor"
									v-html="filters.return.getString()"
									v-bind:class="{grey: filters.return.isAnytime()}"
								></button>
								<span class="line" v-bind:class="{hovered: !filters.return.isAnytime()}"></span>
								<button type="button" class="clear-input"
									v-if="!filters.return.isAnytime()"
									v-on:click="filters.reset('return')"
									v-cloak
								>
									<i class="icon icon-close"></i>
								</button>
							</div>
							<div class="dropdown">
								<div class="block">
									<div class="row range-labels">
										<div class="col-xs-6"><span>{{filters.return.from}}</span>h</div>
										<div class="col-xs-6 align-right"><span>{{filters.return.to}}</span>h</div>
									</div>
								</div>
								<div class="block">
									<input type="hidden" id="returnTimeRange1" value="0" v-on:input="filters.return.from = $event.target.value; fireChange(filters.return, 'return')">
									<input type="hidden" id="returnTimeRange2" value="23" v-on:input="filters.return.to = $event.target.value; fireChange(filters.return, 'return')">
									<div class="range-slider">
										<div
										data-range-time="#returnTimeRange1,#returnTimeRange2"
										data-range-labels=".returnTimeLabel1,.returnTimeLabel2"
										data-start="0" data-end="23" data-step="1"
										data-values="0,23" id="returnRange"
										></div>
									</div>
								</div>
								<div class="block sm-hide">
									<button class="btn btn-info btn-block" data-dismiss type="button">Ok</button>
								</div>
							</div>
						</div>
					</div>
					<!-- duration -->
					<div class="column">
						<div class="search-dropdown" data-dropdown>
							<div class="form-group">
								<label class="anchor">Duration</label>
								<button type="button" class="input anchor"
									v-html="filters.duration.getString()"
									v-bind:class="{grey: filters.duration.from === '23'}"
								></button>
								<span class="line" v-bind:class="{hovered: filters.duration.from !== '23'}"></span>
								<button type="button" class="clear-input"
									v-if="filters.duration.from !== '23'"
									v-on:click="filters.reset('duration')"
									v-cloak
								>
									<i class="icon icon-close"></i>
								</button>
							</div>
							<div class="dropdown">
								<div class="block">
									<div class="row range-labels">
										<div class="col-xs-6"><span>1</span>h</div>
										<div class="col-xs-6 align-right"><span>{{filters.duration.from}}</span>h</div>
									</div>
								</div>
								<div class="block">
									<input type="hidden" id="durationRange1" value="0" v-on:input="filters.duration.from = $event.target.value; fireChange(filters.duration, 'duration')">
									<div class="range-slider">
										<div
										data-range-time="#durationRange1"
										data-range-labels=".durtationLabel1"
										data-start="1" data-end="23" data-step="1"
										data-value="23" id="durationRange"
										></div>
									</div>
								</div>
								<div class="block sm-hide">
									<button class="btn btn-info btn-block" data-dismiss type="button">Ok</button>
								</div>
							</div>
						</div>
					</div>
					<!-- airlines -->
					<div class="column">
						<div class="search-dropdown" data-city="airlines" data-dropdown>
							<div class="form-group">
								<label class="anchor">Airlines</label>
								<button type="button" class="input anchor"
									v-bind:class="{grey: filters.allAirlinesSelected}"
								>
									<span v-html="filters.airlinesLabel"></span>
								</button>
								<span class="line" v-bind:class="{hovered: !filters.allAirlinesSelected}"></span>
								<button type="button" class="clear-input"
									v-on:click="selectAllAirlines(true); fireChange(alliances, 'alliances')"
									v-if="!filters.allAirlinesSelected"
									v-cloak
								>
									<i class="icon icon-close"></i>
								</button>
							</div>
							<div class="dropdown">
								<div class="block">
									<div class="checkbox round">
										<input type="checkbox" id="selectAllAirlines" v-on:change="selectAllAirlines($event.target.checked, $event)" v-model="filters.allAirlinesSelected" v-on:input="fireChange(alliances, 'alliances')">
										<label for="selectAllAirlines">
											All airlines
											<span></span>
										</label>
									</div>
								</div>
								<div class="scrolled" id="airlinesScrolled">
									<div class="block">
										<div class="subtitle">Alliances</div>
										<div class="checkbox black" v-for="(alliance, allianceIndex) in alliances">
											<input type="checkbox" v-bind:id="allianceIndex+'_parent'" v-model="alliance.checked" v-on:change="filterAirlines()"  v-on:input="fireChange(alliances, 'alliances')">
											<label v-bind:for="allianceIndex+'_parent'">
												<span></span>{{alliance.label}}
											</label>
										</div>
									</div>
									<div class="block" v-for="(alliance, allianceIndex) in alliances" >
										<div class="subtitle">Airlines</div>
										<div class="checkbox black" v-for="(airline, airlineIndex) in alliance.airlines">
											<input type="checkbox" v-bind:id="allianceIndex+'_'+airlineIndex" v-model="airline.checked" v-on:change="checkAllSelectedState();" v-on:input="fireChange(alliances, 'alliances')">
											<label v-bind:for="allianceIndex+'_'+airlineIndex">
												<i>{{alliance.label}}</i>
												<span></span>{{airline.label}}
											</label>
										</div>
									</div>
								</div>
								<div class="block sm-hide">
									<button class="btn btn-info btn-block" data-dismiss type="button">Ok</button>
								</div>
							</div>
						</div>
					</div>

					<div class="block sm-hide">
						<button class="btn btn-info btn-block" data-dismiss type="button"  v-on:click="toggle()">Ok</button>
					</div>
				</div>
			</div>
		</div>
	`
});
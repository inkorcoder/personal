Vue.component('ticket', {
	data: function(){
		return {
			id: 0,
			mapImage: {
				lat: 0,
				lng: 0
			},
			token: mapboxgl.accessToken,
			counter: 0
		}
	},
	methods: {
		createImageString: function(){
			var href = 'https://api.mapbox.com/styles/v1/inkor/cjm09fiiw784r2rppn2itgscr/static/',
					pointImage = "http%3A%2F%2Fdev.divisory.com%2F1%2Ftravel%2Fdist%2Fimg%2Fpoint.png",
					pointA = this.data.from.position,
					pointB = this.data.to.position,
					bounds = [
						Math.min(pointA[1], pointB[1]),
						Math.min(pointA[0], pointB[0]),
						Math.max(pointA[1], pointB[1]),
						Math.max(pointA[0], pointB[0])
					],
					size = [400, 400],
					vp = geoViewport.viewport(bounds, size),
					line = polyline.encode([
						[pointA[0],pointA[1]], [pointB[0],pointB[1]]
					]);
					// line = polyline.encode(
					// 	Math.createPolyline(pointA, pointB)
					// );


			// console.log(polyline.encode([
			// 	[pointA[1],pointA[0]], [pointB[1],pointB[0]]
			// ]));

			return (
				href+
				'url-'+pointImage+'('+pointA[1]+','+pointA[0]+'),'+
				'url-'+pointImage+'('+pointB[1]+','+pointB[0]+'),'+
				'path-5+f44-0.5('+line+')/'+
				vp.center.join(',')+','+(Math.max(1, vp.zoom-2))+',0.00,0.00/'+size.join('x')+
				'?access_token='+this.token
			);
		}
	},
	props: ['data'],
	events: ['start', 'end'],
	created: function(){
		this.id = Math.floor(Math.random() * 999999).toString();
		// console.log(this.createImageString())
		// this.mapImage.lng = this.data.to.position[1] - this.data.from.position[1];
		// this.mapImage.lat = this.data.to.position[0] - this.data.from.position[0];
		// var $this = this;
		// setTimeout(function(){
		// 	// Vue.set($this.$data.mapImage, 'lat', 53)
		// 	$this.mapImage.lat = 53;
		// 	console.log($this.mapImage.lat)
		// }, 2000);
		// $.ajax({
		// 	method: "GET",
		// 	url: "https://api.mapbox.com/geocoding/v5/mapbox.places/"+this.data.from.title+".json?access_token="+mapboxgl.accessToken,
		// 	success: function(data){
		// 		var res = data.features[0];
		// 		$this.mapImage.lat = res.center[0];
		// 		$this.mapImage.lng = res.center[1];
		// 		// $this.mapImage.splice(0,1,res.center[0]);
		// 		// $this.mapImage.splice(1,1,res.center[1]);
		// 		// console.log(res.center, data.query);
		// 		// marker = new maps.createMarker('point', '1');
		// 		// marker.setMap(this.map)
		// 		// marker.setPosition(res.center)
		// 		// map.panTo(res.center)
		// 	}
		// })
	},
	beforeUpdate: function(data){

	},
	mounted: function(){
	},
	template: `
		<div class="ticket">
			<div class="layout">
				<div class="column collapsed no-corner">
					<div class="map-wrapper">
						<img v-bind:src="createImageString()">
					</div>
				</div>
				<div class="column no-corner-left">
					{{data.from.title}} - {{data.to.title}}
					<div class="row">
						<div class="col-xs-6">
							<img v-bind:src="Math.random() > .5 ? 'temp/provider1.png' : 'temp/provider2.png'" alt="" class="airline-image"/>
						</div>
						<div class="col-xs-6">
							<i class="icon icon-duration"></i>
						</div>
					</div>
				</div>
				<div class="column small">
					{{Math.floor(Math.random() * 500)}}&euro;
				</div>
			</div>
		</div>
	`
})

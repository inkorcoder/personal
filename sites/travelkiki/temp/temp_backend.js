/* use it to request */
function requestAirports(key){

	var query = SEARCH_ENGINE[key].search;

	console.log('fetching...');
	// alert(query);

	$.ajax({
		url: "temp/search.json",
		complete: function(res){

			var result = JSON.parse(res.responseText);

			// SEARCH_ENGINE.airports = [];
			// SEARCH_ENGINE.from.filtered = [];
			// SEARCH_ENGINE.to.filtered = [];

			setTimeout(function(){
				console.log('results are taken.');
				// SEARCH_ENGINE.airports = JSON.parse(res.responseText);

				// this is a serch logic, replace by your own
				var filtered = [];
				var from = new RegExp(query, "gim");
				for (var i = 0; i < result.length; i++){
					var airport = result[i];
					if (airport.location.match(from) || airport.airport.match(from)){
						filtered.push(airport);
					}
				}
				// console.log(filtered);

				SEARCH_ENGINE[key].hightlighted = 0;
				SEARCH_ENGINE[key].filtered = filtered;
				SEARCH_ENGINE.$forceUpdate();
				if (SEARCH_ENGINE.$refs[key+"List"]){
					$(SEARCH_ENGINE.$refs[key+"List"]).scrollTop(0);
					setTimeout(function(){ // just to waif for Vue list render
						$(SEARCH_ENGINE.$refs[key+"List"]).perfectScrollbar('update');
					}, 10);
				}

				// SEARCH_ENGINE.handleSearch(key);
			}, 100);

			// console.log(JSON.parse(res.responseText));
			// SEARCH_ENGINE.airports = JSON.parse(res.responseText);
			// SEARCH_ENGINE.handleSearch('from');
			// SEARCH_ENGINE.setSuggestion('from', 0);
			// SEARCH_ENGINE.handleSearch('to');
			// SEARCH_ENGINE.$forceUpdate();
		}
	});
};

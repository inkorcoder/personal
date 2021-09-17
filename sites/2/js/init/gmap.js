
if( typeof google !== 'undefined' )
{
// When the window has finished loading create our google map below
      google.maps.event.addDomListener(window, 'load', init);

      var center = $('#vod_address').data('center').split(',');
      var caption = $('#vod_address').data('caption');

      var infoBubble;
      function init() {
      // Basic options for a simple Google Map
      // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
      var mapOptions = {
      // How zoomed in you want the map to start at (always required)
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      disableDefaultUI: true,
      // The latitude and longitude to center the map (always required)
      center: new google.maps.LatLng(center[0],center[1]),
      // How you would like to style the map.
      // This is where you would paste any style found on Snazzy Maps.
      styles: [{"featureType": "all", "elementType": "labels.text.fill", "stylers": [{"saturation": 36},{"color": "#333333"},{"lightness": 40}]},{"featureType": "all", "elementType": "labels.text.stroke", "stylers": [{"visibility": "on"},{"color": "#ffffff"},{"lightness": 16}]},{"featureType": "all", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},{"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#fefefe"},{"lightness": 20}]},{"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#fefefe"},{"lightness": 17},{"weight": 1.2}]},{"featureType": "landscape", "elementType": "geometry", "stylers": [{"lightness": 20},{"hue": "#ffad00"}]},{"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#f5f5f5"},{"lightness": 21}]},{"featureType": "poi", "elementType": "labels.text", "stylers": [{"visibility": "off"},{"color": "#242424"}]},{"featureType": "poi.attraction", "elementType": "labels.text", "stylers": [{"visibility": "off"},{"color": "#201f1f"}]},{"featureType": "poi.business", "elementType": "geometry", "stylers": [{"visibility": "on"},{"hue": "#ffad00"}]},{"featureType": "poi.business", "elementType": "geometry.fill", "stylers": [{"hue": "#ffad00"},{"visibility": "on"}]},{"featureType": "poi.business", "elementType": "labels.text", "stylers": [{"visibility": "off"},{"color": "#222222"}]},{"featureType": "poi.business", "elementType": "labels.text.fill", "stylers": [{"visibility": "on"},{"color": "#151414"}]},{"featureType": "poi.medical", "elementType": "labels.text", "stylers": [{"visibility": "off"}]},{"featureType": "poi.medical", "elementType": "labels.text.fill", "stylers": [{"visibility": "on"}]},{"featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#dedede"},{"lightness": 21}]},{"featureType": "poi.park", "elementType": "labels.text", "stylers": [{"visibility": "off"},{"color": "#474747"}]},{"featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{"visibility": "on"},{"color": "#505050"}]},{"featureType": "poi.place_of_worship", "elementType": "labels.text", "stylers": [{"visibility": "off"}]},{"featureType": "poi.place_of_worship", "elementType": "labels.text.fill", "stylers": [{"visibility": "off"}]},{"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"},{"lightness": 17},{"visibility": "off"}]},{"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#ffffff"},{"lightness": 29},{"weight": 0.2},{"visibility": "off"}]},{"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#ffffff"},{"lightness": 18}]},{"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#ffffff"},{"lightness": 16}]},{"featureType": "transit", "elementType": "geometry", "stylers": [{"color": "#f2f2f2"},{"lightness": 19}]},{"featureType": "water", "elementType": "geometry", "stylers": [{"lightness": 17},{"visibility": "on"},{"hue": "#0072ff"}]},{"featureType": "water", "elementType": "geometry.fill", "stylers": [{"visibility": "on"},{"hue": "#0072ff"},{"saturation": "0"}]}]
      };
      // Get the HTML DOM element that will contain your map
      // We are using a div with id="map" seen below in the <body>
      var mapElement = document.getElementById('vod_address');
      // Create the Google Map using our element and options defined above
      var map = new google.maps.Map(mapElement, mapOptions);
      // Popups
      
      var mapimage = 'http://ssstratos.com/vod_v2/img/map_dot.png';
      
      var marker_list = 
      [
        new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(center[0],center[1]),
          map: map,
          icon: mapimage
        })
      ];
      
      infoBubble = new InfoBubble({
        map: map,
        position: new google.maps.LatLng(center[0],center[1]),
        shadowStyle: 0,
        padding: 0,
        backgroundColor: '#fff',
        borderRadius: 0,
        arrowSize: 0,
        borderWidth: 0,
        disableAutoPan: true,
        disableAnimation: true,
        arrowPosition: 0,
        backgroundClassName: 'map_popup',
        minWidth: 356,
        maxWidth: 356,
        minHeight: 88,
        pixelOffset: new google.maps.Size(-325,-45),
        closeSrc: 'http://ssstratos.com/vod_v2/img/blank.png'
      });
      
      // Clicks
      function open_bubble1(){
        infoBubble.setContent('<img class="avatar" src="http://ssstratos.com/vod_v2/img/map_avatar.png"><p>'+caption+'</p>');
        //map.panTo(marker_list[0].getPosition());
        map.panTo(new google.maps.LatLng(center[0],center[1]));
        infoBubble.open(map, marker_list[0]);
      };

      open_bubble1();

      var bubble_list = [open_bubble1];
      
      google.maps.event.addListener(marker_list[0], 'click', bubble_list[0]);
      
      // close infobubble on map click
      // map.addListener('click', function() {
      //   infoBubble.close();
      // });
      
      }
      google.maps.event.addDomListener(window, 'load', init);
      
      // infobubble properties
      function updateStyles() {
        var shadowStyle = document.getElementById('shadowstyle').value;
        infoBubble.setShadowStyle(shadowStyle);
      
        var padding = document.getElementById('padding').value;
        infoBubble.setPadding(padding);
      
        var borderRadius = document.getElementById('borderRadius').value;
        infoBubble.setBorderRadius(borderRadius);
      
        var borderWidth = document.getElementById('borderWidth').value;
        infoBubble.setBorderWidth(borderWidth);
      
        var borderColor = document.getElementById('borderColor').value;
        infoBubble.setBorderColor(borderColor);
      
        var backgroundColor = document.getElementById('backgroundColor').value;
        infoBubble.setBackgroundColor(backgroundColor);
      
        var maxWidth = document.getElementById('maxWidth').value;
        infoBubble.setMaxWidth(maxWidth);
      
        var maxHeight = document.getElementById('maxHeight').value;
        infoBubble.setMaxHeight(maxHeight);
      
        var minWidth = document.getElementById('minWidth').value;
        infoBubble.setMinWidth(minWidth);
      
        var minHeight = document.getElementById('minHeight').value;
        infoBubble.setMinHeight(minHeight);
      
        var arrowSize = document.getElementById('arrowSize').value;
        infoBubble.setArrowSize(arrowSize);
      
        var arrowPosition = document.getElementById('arrowPosition').value;
        infoBubble.setArrowPosition(arrowPosition);
      
        var arrowStyle = document.getElementById('arrowStyle').value;
        infoBubble.setArrowStyle(arrowStyle);
      
        var closeSrc = document.getElementById('closeSrc').value;
        infoBubble.setCloseSrc(closeSrc);
      };
}
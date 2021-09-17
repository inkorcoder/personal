var initMap, mapStyles, points;

mapStyles = [
  {
    "stylers": [
      {
        "hue": "#2c3e50"
      }, {
        "saturation": 250
      }
    ]
  }, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "lightness": 50
      }, {
        "visibility": "simplified"
      }
    ]
  }, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];

points = [
  {
    lat: 40.7108865,
    lng: -74.0120392
  }, {
    lat: 41.8862473,
    lng: -87.6259024
  }, {
    lat: 33.9796351,
    lng: -118.4153068
  }
];

initMap = function() {
  var beachMarker, center, i, image, len, map, p, styledMap;
  styledMap = new google.maps.StyledMapType(mapStyles, {
    name: "Styled Map"
  });
  center = points[0];
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 18,
    disableDefaultUI: false,
    scrollwheel: false,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  });
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
  image = 'img/map.png';
  for (i = 0, len = points.length; i < len; i++) {
    p = points[i];
    beachMarker = new google.maps.Marker({
      position: p,
      map: map,
      icon: image,
      title: ''
    });
  }
  $('.map-places-list li').click(function(e) {
    var latLng, point;
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    point = points[$(this).data('point') || 0];
    latLng = new google.maps.LatLng(point.lat, point.lng);
    map.panTo(latLng);
  });
};

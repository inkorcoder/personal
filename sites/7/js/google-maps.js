var initMap, mapStyles;

mapStyles = [
  {
    "featureType": "all",
    "stylers": [
      {
        "hue": "#16203f"
      }, {
        "invert_lightness": "true"
      }, {
        "saturation": 20
      }
    ]
  }
];

initMap = function() {
  var center, image, map, marker, styledMap;
  styledMap = new google.maps.StyledMapType(mapStyles, {
    name: "Styled Map"
  });
  center = new google.maps.LatLng(49.4388402, 32.0699464);
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 17,
    disableDefaultUI: false,
    scrollwheel: false,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  });
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
  image = 'img/map.svg';
  marker = new google.maps.Marker({
    position: center,
    map: map,
    icon: {
      url: image,
      size: new google.maps.Size(56, 56)
    },
    title: '',
    visible: true
  });
  marker.setMap(map);
};

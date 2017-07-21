var initMap, mapStyles;

mapStyles = [
  {
    "featureType": "administrative",
    "elementType": "labels",
    "stylers": [
      {
        "hue": "#000000"
      }, {
        "lightness": -100
      }, {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  }, {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      {
        "hue": "#ededed"
      }, {
        "saturation": -100
      }, {
        "lightness": 36
      }, {
        "visibility": "on"
      }
    ]
  }, {
    "featureType": "landscape.man_made",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  }, {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  }, {
    "featureType": "landscape.natural",
    "elementType": "all",
    "stylers": [
      {
        "hue": "#e0e0e0"
      }, {
        "saturation": -100
      }, {
        "lightness": -8
      }, {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
      {
        "hue": "#000000"
      }, {
        "saturation": -100
      }, {
        "lightness": -100
      }, {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "poi.business",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "poi.business",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "poi.government",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "hue": "#ff0000"
      }, {
        "saturation": -100
      }, {
        "lightness": -100
      }, {
        "visibility": "simplified"
      }, {
        "invert_lightness": true
      }
    ]
  }, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "hue": "#ff0000"
      }, {
        "saturation": -100
      }, {
        "lightness": -100
      }, {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "road",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  }, {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  }, {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  }, {
    "featureType": "road.highway",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "road.highway.controlled_access",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  }, {
    "featureType": "road.highway.controlled_access",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "road.arterial",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  }, {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "road.local",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  }, {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "hue": "#ff0000"
      }, {
        "lightness": -100
      }, {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "transit",
    "elementType": "labels",
    "stylers": [
      {
        "hue": "#000000"
      }, {
        "lightness": -100
      }, {
        "visibility": "off"
      }
    ]
  }, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "hue": "#ffffff"
      }, {
        "saturation": -100
      }, {
        "lightness": 100
      }, {
        "visibility": "on"
      }
    ]
  }, {
    "featureType": "water",
    "elementType": "labels",
    "stylers": [
      {
        "hue": "#000000"
      }, {
        "saturation": -100
      }, {
        "lightness": -100
      }, {
        "visibility": "off"
      }
    ]
  }
];

initMap = function() {
  var beachMarker, center, i, image, j, len, map, p, resetMarkers, styledMap;
  styledMap = new google.maps.StyledMapType(mapStyles, {
    name: "Styled Map"
  });
  center = points[0].pos;
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 13,
    disableDefaultUI: false,
    scrollwheel: false,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  });
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
  image = 'img/map.png';
  resetMarkers = function() {
    var j, len, p;
    for (j = 0, len = points.length; j < len; j++) {
      p = points[j];
      p.marker.setIcon(image);
    }
  };
  for (i = j = 0, len = points.length; j < len; i = ++j) {
    p = points[i];
    beachMarker = new google.maps.Marker({
      position: p.pos,
      map: map,
      icon: image,
      title: p.title
    });
    points[i].marker = beachMarker;
  }
  $('.map-places-list li').click(function(e) {
    var latLng, point;
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    point = points[$(this).data('point') || 0];
    latLng = new google.maps.LatLng(point.pos.lat, point.pos.lng);
    resetMarkers();
    point.marker.setIcon("img/map2.png");
    map.panTo(latLng);
  });
};

appControllers.controller('mapMultiMarkerController', function($scope, $state, deviceService, $compile) {
  var position = {
    latitude: '13.7462656',
    longitude: '100.5338024'
  };

  var mapArray = [{
      latitude: '13.747434',
      longitude: '100.525217'
    },
    {
      latitude: '13.755017',
      longitude: '100.535078'
    },
    {
      latitude: '13.748377',
      longitude: '100.542743'
    },
    {
      latitude: '13.739542',
      longitude: '100.534501'
    },
    {
      latitude: '13.752565',
      longitude: '100.528018'
    },
    {
      latitude: '13.742042',
      longitude: '100.526913'
    },
    {
      latitude: '13.741991',
      longitude: '100.540271'
    },
    {
      latitude: '13.752668',
      longitude: '100.539535'
    }
  ];

  $scope.btnBack = function() {
    $state.go('app.home');
  };

  $scope.renderMap = function(position, mapArray) {
    var myLatlng = new google.maps.LatLng(position.latitude, position.longitude);
    var mapOptions = {
      zoom: 14,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('mapMarker'), mapOptions);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: 'img/pokemon-logo.png'
    });
    var htmlString = "<div style='width:250px; height:130px'>" +
      "<div class='button button-icon ion-map' ng-click='clickTest()'>&nbsp; Launch Map</div>" +
      "<p>Latitude : " + position.latitude +
      "<p>Longitude : " + position.longitude +
      "</p>" +
      "</div>";
    var compiled = $compile(htmlString)($scope);
    var infowindow = new google.maps.InfoWindow({
      content: compiled[0]
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
    // *** Use mapArray for multi marker call deviceService.setMarkerInfo() *** //
    deviceService.setMarkerInfo(map, mapArray, function() {});
  };

  $scope.renderMap(position, mapArray);
});

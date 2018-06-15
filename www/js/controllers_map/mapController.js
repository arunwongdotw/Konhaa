appControllers.controller('mapController', function($scope, $state, $compile, $rootScope) {

  $scope.btnBack = function() {
    $state.go('app.home');
  };

  $scope.renderMap = function(position, record) {
    var myLatlng = new google.maps.LatLng(position.latitude, position.longitude);
    var mapOptions = {
      zoom: 12,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
    var marker = new google.maps.Marker({
      position: myLatlng,
      title: "Hello Senchabox!"
    });
    marker.setMap(map);
    var htmlString = "<div style='width: 200px; height: 100px'>" +
      "<div class='button button-icon ion-map' ng-click='clickTest()'> Launch Map</div>" +
      "<p>Latitude : " + position.latitude +
      "<br>Longitude : " + position.longitude +
      "</p>" +
      "</div>";
    var compiled = $compile(htmlString)($scope);
    var infoWindow = new google.maps.InfoWindow({
      content: compiled[0]
    });

    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });
  };

  $scope.clickTest = function() {
    alert('click click click');
  };

  $scope.renderMap($rootScope.gpsLocation);
});

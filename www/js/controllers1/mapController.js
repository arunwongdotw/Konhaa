appControllers.controller('mapController', function($scope, $state, $compile, $rootScope, $mdDialog, $ionicPlatform) {
  $scope.shop = $rootScope.gpsLocation;

  $scope.btnBack = function() {
    navigator.app.backHistory();
  };

  $scope.initMap = function(position, cLocation) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var myLatlng = new google.maps.LatLng(position.latitude, position.longitude);
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: myLatlng
    });
    directionsDisplay.setMap(map);
    directionsService.route({
      origin: cLocation.cLatitude + "," + cLocation.cLongtitude,
      destination: position.latitude + "," + position.longitude,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  };

  $scope.initMap($rootScope.gpsLocation, $rootScope.currentLocation);

  $ionicPlatform.registerBackButtonAction(function() {
    if (($state.current.name == "app1.home") || ($state.current.name == "app2.home")) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "คุณต้องการออกจากแอปพลิเคชัน ?",
            content: "คุณแน่ใจที่จะออกจากแอปพลิเคชันนี้",
            ok: "ตกลง",
            cancel: "ยกเลิก"
          }
        }
      }).then(function(response) {
        navigator.app.exitApp();
      });
    } else {
      navigator.app.backHistory();
    }
  }, 100);
});

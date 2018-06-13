appControllers.controller('homeController', function($scope, $state, $http, myService, deviceService, $rootScope, $ionicPopup, $ionicPlatform, $mdDialog, $ionicNavBarDelegate) {
  $scope.form = {};

  $scope.$on('$ionicView.enter', function() {
    $ionicNavBarDelegate.showBar(true);
    $scope.currState = $state;
    var currentState = $state.current.name;
    if ($state.current.name == "app1.home") {
      $scope.menubar = "Konhaa";
    } else {
      getMemberUsername(function(status) {
        $scope.menubar = "Welcome " + $scope.memberUsername;
      });
    }
  });

  function getMemberUsername(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/getUserDetail.php',
      method: 'POST',
      data: {
        var_username: window.localStorage.username
      }
    }).then(function(response) {
      $scope.memberUsername = response.data.results[0].member_username;
      callback($scope.memberUsername);
    }, function(error) {
      console.log(error);
    });
  }
  
  $scope.btnSearch = function() {
    if (($scope.form.txt_Search != null) && ($scope.form.txt_Search != "")) {
      deviceService.passValueFromHome = $scope.form.txt_Search;
      // if (Object.keys(myService.passDataObject).length === 1) {
      if ($state.current.name == "app1.home") {
        $state.go('app1.search');
      } else {
        $state.go('app2.search');
      }
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "คำค้นหาไม่ถูกต้อง !",
            content: "กรุณากรอกคำค้นหาลงในช่องค้นหา",
            ok: "ตกลง"
          }
        }
      });
    }
  };

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
      }).then(function() {
        navigator.app.exitApp();
      }, function() {

      });
    } else {
      navigator.app.backHistory();
    }
  }, 100);
});

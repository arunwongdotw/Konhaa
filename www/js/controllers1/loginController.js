appControllers.controller('loginCtrl', function($scope, $mdDialog, $http, myService, $state, $cordovaOauth, localStorage, $cordovaDevice) {
  $scope.login = {};

  $scope.btnLogin = function() {
    var notify_id = $cordovaDevice.getUUID();
    if (($scope.login.username != null) && ($scope.login.username != "")) {
      if (($scope.login.password != null) && ($scope.login.password != "")) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/loginMember.php',
          method: 'POST',
          data: {
            var_username: $scope.login.username,
            var_password: $scope.login.password,
            var_notifyid: notify_id
          }
        }).then(function(response) {
          if (response.data.results == 'notfound_username') {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "ชื่อผู้ใช้ไม่ถูกต้อง !",
                  content: "ไม่พบชื่อผู้ใช้นี้อยู่ในระบบ",
                  ok: "ตกลง"
                }
              }
            });
          } else if (response.data.results == 'wrong_password') {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "รหัสผ่านไม่ถูกต้อง !",
                  content: "รหัสผ่านไม่ถูกต้อง กรุณากรอกรหัสผ่านใหม่",
                  ok: "ตกลง"
                }
              }
            });
          } else {
            window.localStorage.username = $scope.login.username;
            // myService.passDataObject = response.data.results[0];
            $state.go('app2.home');
          }
        });
      } else {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "รหัสผ่านไม่ถูกต้อง !",
              content: "กรุณากรอกรหัสผ่าน",
              ok: "ตกลง"
            }
          }
        });
      }
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ชื่อผู้ใช้ไม่ถูกต้อง !",
            content: "กรุณากรอกชื่อผู้ใช้",
            ok: "ตกลง"
          }
        }
      });
    }
  };
});

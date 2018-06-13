appControllers.controller('forgotPasswordCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state) {
  $scope.toggleLeft = buildToggler('left');
  $scope.forgot = {};

  function buildToggler(navID) {
    var debounceFn = $mdUtil.debounce(function() {
      $mdSidenav(navID).toggle();
    }, 0);
    return debounceFn;
  }

  $scope.navigateTo = function(stateName) {
    $timeout(function() {
      $mdSidenav('left').close();
      if ($ionicHistory.currentStateName() != stateName) {
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        $state.go(stateName);
      }
    }, ($scope.isAndroid == false ? 300 : 0));
  };

  $scope.btnRecoverPassword = function() {
    if (($scope.forgot.username != null) && ($scope.forgot.username != "")) {
      if (($scope.forgot.email != null) && ($scope.forgot.email != "")) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/forgotPassword.php',
          method: 'POST',
          data: {
            var_username: $scope.forgot.username,
            var_email: $scope.forgot.email
          }
        }).then(function(response) {
          if(response.data.results == "emailsend_success"){
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "กู้รหัสผ่านเสร็จสิ้น",
                  content: "ระบบได้ส่งรหัสผ่านไปทางอีเมลที่คุณระบุเรียบร้อยแล้ว กรุณาเช็คอีเมล",
                  ok: "ตกลง"
                }
              }
            });
          }else{
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "กู้รหัสผ่านไม่สำเร็จ !",
                  content: "ไม่พบชื่อผู้ใช้หรืออีเมลนี้อยู่ในระบบ กรุณากรอกใหม่",
                  ok: "ตกลง"
                }
              }
            });
          }
        }, function(error) {
          console.log(error);
        });
      } else {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "อีเมลไม่ถูกต้อง !",
              content: "กรุณากรอกอีเมล",
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

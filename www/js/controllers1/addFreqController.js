appControllers.controller('addFreqCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, myService, $http, $mdDialog) {
  $scope.addfreq = myService.addFreqDetail;
  $scope.freq = myService.mpFrequency;
  $scope.amount = {};

  $scope.btnAddFreq = function() {
    var number = /^[0-9]+$/;
    if (number.test($scope.amount.freq)) {
      var amountfreq = parseInt($scope.freq.mp_frequency) + parseInt($scope.amount.freq);
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/updateFreq.php',
        method: 'POST',
        data: {
          var_memberpromotionid: $scope.freq.member_promotion_id,
          var_freqamount: amountfreq
        }
      }).then(function(response) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เพิ่มสิทธิ์สำเร็จ !",
              content: "คุณเพิ่มสิทธิ์ให้กับลูกค้าสำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $state.go('app2.shop');
        });
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnAddFreq ใน addFreqController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "จำนวนสิทธิ์ไม่ถูกต้อง !",
            content: "จำนวนสิทธิ์กรอกต้องเป็นตัวเลขเท่านั้น",
            ok: "ตกลง"
          }
        }
      });
    }
  };

  $scope.btnBack = function() {
    navigator.app.backHistory();
  };
});

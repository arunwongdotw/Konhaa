appControllers.controller('addPromotionToMemberCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, $http, myService, $mdDialog) {
  $scope.amount = {};

  $http({
    url: myService.configAPI.webserviceURL + 'webservices/getPromotionToAdd.php',
    method: 'POST',
    data: {
      var_shopid: myService.shopid.shop_id
    }
  }).then(function(response) {
    console.log(response.data.results);
    $scope.PromotionListArray = response.data.results;
  }, function(error) {
    console.log(error);
  });

  $scope.setmdSelectValue = function(promotion_id) {
    $scope.mdSelectValue = promotion_id;
  };

  $scope.btnAddPromotionToMember = function() {
    var number = /^[0-9]+$/;
    if(($scope.mdSelectValue != null) && ($scope.mdSelectValue != "")) {
      if(($scope.amount.freq != null) && ($scope.amount.freq != "")) {
        if(number.test($scope.amount.freq)) {
          $http({
            url: myService.configAPI.webserviceURL + 'webservices/addPromotionToMember.php',
            method: 'POST',
            data: {
              var_mpfrequency: $scope.amount.freq,
              var_promotionid: $scope.mdSelectValue,
              var_memberid: myService.memberidInCaseMemberNotHavePromotion
            }
          }).then(function(response) {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "เพิ่มโปรโมชั่นสำเร็จให้ลูกค้าสำเร็จ !",
                  content: "คุณเพิ่มโปรโมชั่นให้กับลูกค้าสำเร็จ",
                  ok: "ตกลง"
                }
              }
            }).then(function(response) {
              $state.go('app2.shop');
            }, function(error) {
              console.log(error);
            });
          }, function(error) {
            console.log(error);
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
      } else {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "จำนวนสิทธิ์ไม่ถูกต้อง !",
              content: "กรุณากรอกจำนวนสิทธิ์",
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
            title: "รายการโปรโมชั่นของร้านค้าไม่ถูกต้อง !",
            content: "กรุณาเลือกรายการโปรโมชั่นของร้านค้า",
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

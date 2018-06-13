appControllers.controller('promotionCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, $http, myService, $mdDialog) {
  $scope.toggleLeft = buildToggler('left');
  $scope.member_id = myService.passDataObject.member_id;

  $http({
    url: myService.configAPI.webserviceURL + 'webservices/getAllMemberHavePromotion.php',
    method: 'POST',
    data: {
      var_shopid: myService.shopid.shop_id
    }
  }).then(function(response) {
    $scope.PromotionListArray = response.data.results;
  }, function(error) {
    console.log(error);
  });

  $http.get('http://1did.net/centerapp/webservices/getPromotion.php?member_id=' + $scope.member_id)
    .then(function(response) {
      $scope.promotionArray = response.data.results;
    }, function(error) {
      console.log(error);
    });

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

  $scope.btnEditPromotion = function(promotionid) {
    $http.get('http://1did.net/centerapp/webservices/getPromotionDetail.php?promotion_id=' + promotionid)
      .then(function(response) {
        myService.promotionDetail = response.data.results[0];
        $state.go('app2.editpromotion');
      }, function(error) {
        console.log(error);
      });
  };

  $scope.btnDelPromotion = function(promotionid) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ลบโปรโมชั่นนี้ ?",
          content: "คุณแน่ใจที่จะลบโปรโมชั่นนี้ออกจากร้านค้าของคุณ",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function() {
      $http.get('http://1did.net/centerapp/webservices/deletePromotion.php?promotion_id=' + promotionid)
        .then(function(response) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "ลบข้อมูลสินค้าสำเร็จ !",
                content: "คุณได้ทำการลบข้อมูลสินค้าสำเร็จ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            $state.reload();
          });
        }, function(error) {
          console.log(error);
        });
    }, function() {
      // err
    });
  };

  $scope.viewProfile = function(promotionList) {
    myService.userDetailFromReview = promotionList;
    $scope.navigateTo('app2.userprofile');
  };
});

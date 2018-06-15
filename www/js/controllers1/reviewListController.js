appControllers.controller('reviewListCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, myService, $mdDialog, $http, $stateParams, $ionicNavBarDelegate) {
  $scope.toggleLeft = buildToggler('left');

  $http.get(myService.configAPI.webserviceURL + 'webservices/getReview.php?shop_id=' + myService.shopid.shop_id)
    .then(function(response) {
      $scope.reviewArray = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getReview.php ใน reviewListController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.$on('$ionicView.enter', function() {
    $ionicNavBarDelegate.showBar(true);
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

  $scope.btnDeleteReview = function(commentid) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ลบข้อความรีวิวร้านค้านี้ ?",
          content: "คุณแน่ใจที่จะลบขข้อความรีวิวนี้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/delReview.php',
        method: 'POST',
        data: {
          var_commentid: commentid
        }
      }).then(function(response) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ลบข้อความรีวิวร้านค้าสำเร็จ !",
              content: "คุณได้ทำการลบข้อความรีวิวร้านค้าสำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $state.reload();
        });
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnDeleteReview ใน reviewListController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
    });
  };

  $scope.viewProfile = function(review){
    myService.userDetailFromReview = review;
    $scope.navigateTo('app2.userprofile');
  };

  $scope.btnReply = function(comment_id){
    myService.commentidForReply = comment_id;
    $scope.navigateTo('app2.reply');
  };
});

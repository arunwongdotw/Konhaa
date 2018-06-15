appControllers.controller('ratingListCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, myService, $mdDialog, $http, $stateParams, $ionicNavBarDelegate) {
  $scope.toggleLeft = buildToggler('left');

  $http.get(myService.configAPI.webserviceURL + 'webservices/getReview.php?shop_id=' + myService.shopid.shop_id)
    .then(function(response) {
      $scope.ratingArray = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getReview.php ใน ratingController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  // $scope.getAsterisks = rating => Array.from('*'.repeat(parseInt(rating, 10)));

  $scope.getRepeater = function(num) {
    // return new Array(num);
    var ratings = [];
    for (var i = 0; i < num; i++) {
      ratings.push(i);
    }
    return ratings;
  };

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

  $scope.btnDeleteRating = function(commentid) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ลบคะแนนร้านค้านี้ ?",
          content: "คุณแน่ใจที่จะลบคะแนนร้านค้า",
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
              title: "ลบคะแนนร้านค้าสำเร็จ !",
              content: "คุณได้ทำการลบลบคะแนนร้านค้าสำเร็จ",
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
              content: "เกิดข้อผิดพลาด btnDeleteRating ใน ratingController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
    });
  };
});

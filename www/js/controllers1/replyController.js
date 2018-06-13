appControllers.controller('replyCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, myService, $mdDialog, $http, $stateParams, $ionicNavBarDelegate) {
  $scope.toggleLeft = buildToggler('left');
  $scope.reply = {};
  var shop_id = myService.shopid.shop_id;

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

  $scope.btnReply = function() {
    if (($scope.reply.detail != null) && ($scope.reply.detail != "")) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/addReply.php',
        method: 'POST',
        data: {
          var_replydetail: $scope.reply.detail,
          var_commentid: myService.commentidForReply,
          var_shopid: shop_id
        }
      }).then(function(response) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ตอบกลับรีวิวสำเร็จ !",
              content: "ตอบกลับรีวิวสำเร็จ ระบบจะนำไปสู่หน้ารีวิวร้านค้า",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $state.go('app2.shop');
        }, function(error) {
          console.log(error);
        });
      }, function(error){
        console.log(response);
      });
    } else {

    }
  };
});

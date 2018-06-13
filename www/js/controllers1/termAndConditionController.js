appControllers.controller('termAndConditionCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, $mdDialog) {
  $scope.toggleLeft = buildToggler('left');
  $scope.termandcondition = {};

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

  $scope.btnCreateShop = function() {
    if ($scope.termandcondition.checkbox == true) {
      $scope.navigateTo('app2.shopregister');
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ยอมรับข้อกำหนดและเงื่อนไขในการให้บริการ !",
            content: "กรุณายอมรับข้อกำหนดและเงื่อนไขในการให้บริการ",
            ok: "ตกลง"
          }
        }
      });
    }
  };
});

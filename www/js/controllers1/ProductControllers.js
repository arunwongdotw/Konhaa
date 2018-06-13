appControllers.controller('ProductController', function($scope, $mdToast, $mdDialog, $state, $stateParams, myService) {
  $scope.shop_id = myService.passDataObject.sp_id;
  $scope.shop_name = myService.passDataObject.sp_name;
  $scope.shop_detail = myService.passDataObject.sp_detail;
  $scope.pic1 = myService.passDataObject.sp_pic1;
  $scope.pic2 = myService.passDataObject.sp_pic2;
  $scope.pic3 = myService.passDataObject.sp_pic3;
  $scope.pic4 = myService.passDataObject.sp_pic4;

  $scope.showConfirmDialog = function($event) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      targetEvent: $event,
      locals: {
        displayOption: {
          title: "Confirm Order",
          content: "Confirm to add Order.",
          ok: "Confirm",
          cancel: "Close"
        }
      }
    }).then(function() {
      $mdToast.show({
        controller: 'toastController',
        templateUrl: 'toast.html',
        hideDelay: 1200,
        position: 'top',
        locals: {
          displayOption: {
            title: "Item added."
          }
        }
      });
    }, function() {

    });
  };
  $scope.btnBack = function() {
    navigator.app.backHistory();
  };
}); // End of catalog controller.

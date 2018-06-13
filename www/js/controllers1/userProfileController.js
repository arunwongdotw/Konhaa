appControllers.controller('userProfileCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, $mdDialog, myService, $ionicModal, $ionicScrollDelegate) {
  $scope.toggleLeft = buildToggler('left');
  $scope.userDetail = myService.userDetailFromReview;

  $scope.btnBack = function() {
    navigator.app.backHistory();
  };

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

  $scope.userImage = [{
    src: 'http://1did.net/centerapp/img/img_profile/' + $scope.userDetail.member_username + '.jpg'
  }];

  $scope.zoomMin = 1;

  $scope.showUserImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/templates1/userzoomview.html');
  };

  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove();
  };

  $scope.updateSlideStatus = function(slide) {
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
});

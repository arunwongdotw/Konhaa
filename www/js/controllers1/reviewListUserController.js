appControllers.controller('reviewListUserCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, myService, $mdDialog, $http, $stateParams, $ionicNavBarDelegate) {
  $scope.toggleLeft = buildToggler('left');
  console.log(myService.memberidFromReview);
  $scope.username = myService.memberidFromReview.member_username;

  $http.get(myService.configAPI.webserviceURL + 'webservices/getAllReviewFromUser.php?member_id=' + myService.memberidFromReview.member_id)
    .then(function(response) {
      $scope.reviewArray = response.data.results;
      console.log($scope.reviewArray);
    }, function(error) {
      console.log(error);
    });

  $scope.$on('$ionicView.enter', function() {
    $ionicNavBarDelegate.showBar(true);
  });

  $scope.getRepeater = function(num) {
    // return new Array(num);
    var ratings = [];
    for (var i = 0; i < num; i++) {
      ratings.push(i);
    }
    return ratings;
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

  $scope.btnBack = function() {
    navigator.app.backHistory();
  };

});

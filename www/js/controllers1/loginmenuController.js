appControllers.controller('loginmenuCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, myService, $mdDialog, $http, $stateParams, $ionicNavBarDelegate) {
  $scope.toggleLeft = buildToggler('left');
  // $scope.profile = myService.configAPI.webserviceURL + 'img/img_profile/' + myService.passDataObject.member_username + '.jpg?random+\=' + Math.random();
  // $scope.firstname = myService.passDataObject.member_firstname;
  // $scope.lastname = myService.passDataObject.member_lastname;

  // $scope.$on('$ionicView.enter', function() {
  //   $ionicNavBarDelegate.showBar(true);
  //   $scope.profile = myService.configAPI.webserviceURL + 'img/img_profile/' + myService.passDataObject.member_username + '.jpg?random+\=' + Math.random();
  //   $scope.firstname = myService.passDataObject.member_firstname;
  //   $scope.lastname = myService.passDataObject.member_lastname;
  // });

  if ((window.localStorage.username != "") || (window.localStorage.username != null)) {
    getUserDetailFromLocalStorage(function(status) {
      $ionicNavBarDelegate.showBar(true);
      $scope.profile = myService.configAPI.webserviceURL + 'img/img_profile/' + myService.passDataObject.member_username + '.jpg?random+\=' + Math.random();
      $scope.firstname = myService.passDataObject.member_firstname;
      $scope.lastname = myService.passDataObject.member_lastname;
    });
  }

  function getUserDetailFromLocalStorage(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/getUserDetail.php',
      method: 'POST',
      data: {
        var_username: window.localStorage.username
      }
    }).then(function(response) {
      myService.passDataObject = response.data.results[0];
      callback(myService.passDataObject);
    }, function(error) {
      console.log(error);
    });
  }

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

  $scope.btnLogout = function() {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ยืนยันการออกจากระบบ",
          content: "คุณต้องการที่จะออกจากระบบ?",
          ok: "ยืนยัน",
          cancel: "ยกเลิก"
        }
      }
    }).then(function() {
      window.localStorage.username = "";
      $state.go('app1.home');
    }, function() {
      console.log('cancel');
    });
  };

  $scope.btnCountshop = function() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkMemberHaveShop.php',
      method: 'POST',
      data: {
        var_id: myService.passDataObject.member_id
      }
    }).then(function(response) {
      if (response.data.results == 'notfound_shop') {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ไม่พบร้านค้าของคุณ !",
              content: "คุณยังไม่ได้ลงทะเบียนร้านค้า กรุณาลงทะเบียนร้านค้า",
              ok: "ตกลง",
              cancel: "ยกเลิก"
            }
          }
        }).then(function() {
          $scope.navigateTo('app2.termandcondition');
        }, function() {

        });
      } else {
        myService.shopid = {
          shop_id: response.data.results[0]
        };
        $scope.navigateTo('app2.shop');
      }
    });
  };
});

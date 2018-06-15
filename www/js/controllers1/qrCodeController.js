appControllers.controller('qrCodeCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, $http, myService) {
  $scope.toggleLeft = buildToggler('left');

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

  $http({
    url: myService.configAPI.webserviceURL + 'webservices/getMemberQRCode.php',
    method: 'POST',
    data: {
      var_memberid: myService.passDataObject.member_id
    }
  }).then(function(response) {
    $scope.username = response.data.results[0].member_username;
    $scope.qrcode = 'http://1did.net/centerapp/img/img_qrcode/' + response.data.results[0].member_qrcode;
  }, function(error) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "เกิดข้อผิดพลาด !",
          content: "เกิดข้อผิดพลาด getMemberQRCode.php ใน qrCodeController ระบบจะปิดอัตโนมัติ",
          ok: "ตกลง"
        }
      }
    }).then(function(response) {
      ionic.Platform.exitApp();
    });
  });

  $scope.closeCard = function() {
    var myEl = angular.element(document.querySelector('#advertise-card'));
    myEl.remove();
  };

  $scope.adsArray = [];
  var arrayOfRandomNumber = [];
  var randomNumber;
  var allAdsLength;
  var checkDup;

  $scope.$on('$ionicView.enter', function() {
    getAllAds(function(status) {
      createAdsArray(function(status) {});
      addAdFrequency(function(status) {});
    });
  });

  function getAllAds(callback) {
    $http.get('http://1did.net/pohjai9/webservices/getAllAds.php')
      .then(function(response) {
        $scope.allAds = response.data.results;
        callback();
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getAllAds ใน questionManagementController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function createAdsArray(callback) {
    for (var i = 0; i < 1; i++) {
      getRandomNumber(function(status) {
        pushAdsArray(randomNumber, function(status) {
          callback();
        });
      });
    }
  }

  function getRandomNumber(callback) {
    allAdsLength = $scope.allAds.length;
    randomNumber = Math.floor(Math.random() * allAdsLength);
    if (arrayOfRandomNumber.length == 0) {
      arrayOfRandomNumber.push(randomNumber);
      callback(randomNumber);
    } else {
      checkDup = checkDupInArrayOfRandomNumber(randomNumber);
      if (checkDup == true) {
        getRandomNumber(callback);
      } else {
        arrayOfRandomNumber.push(randomNumber);
        callback(randomNumber);
      }
    }
  }

  function pushAdsArray(randomNumber, callback) {
    $scope.adsArray.push($scope.allAds[randomNumber]);
    callback();
  }

  function checkDupInArrayOfRandomNumber(randomNumber) {
    for (var j = 0; j < arrayOfRandomNumber.length; j++) {
      if (arrayOfRandomNumber[j] == randomNumber) {
        return true;
      }
    }
    return false;
  }

  function addAdFrequency(callback) {
    for (var i = 0; i < $scope.adsArray.length; i++) {
      var frequency = parseInt($scope.adsArray[i].advertise_frequency);
      frequency = frequency + 1;
      $http.get('http://1did.net/pohjai9/webservices/addAdFrequency.php?adID=' + $scope.adsArray[i].advertise_id + '&frequency=' + frequency);
    }
    callback();
  }
});

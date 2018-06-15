appControllers.controller('shopController', function($http, $scope, $state, $cordovaCamera, $cordovaFileTransfer, $cordovaDialogs, myService, $mdDialog) {
  $scope.member_id = myService.passDataObject.member_id;
  var shop_id = myService.shopid.shop_id;

  $http.get(myService.configAPI.webserviceURL + '/webservices/getshopdetail2.php?shop_id=' + shop_id)
    .then(function(response) {
      myService.shopDataObject = response.data.results[0];
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getshopdetail2.php ใน shopControler ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.$on('$ionicView.enter', function() {
    $http.get('http://1did.net/centerapp/webservices/showproduct.php?member_id=' + $scope.member_id)
      .then(function(response) {
        $scope.picArray = response.data.results;
        $scope.no = Math.random();
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด showproduct.php ใน shopControler ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  });

  $scope.btnShopDetail = function() {
    $state.go('app2.shopdetail');
  };

  $scope.btnEdit = function(product_id) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/editproduct.php',
      method: 'POST',
      data: {
        var_id: product_id
      }
    }).then(function(response) {
      myService.editproduct = response.data.results[0];
      $state.go('app2.editproduct');
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnEdit ใน shopControler ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.btndel = function(product_id, product_pic) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ลบข้อมูลสินค้านี้ ?",
          content: "คุณแน่ใจที่จะลบข้อมูลสินค้านี้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/delproduct.php',
        method: 'POST',
        data: {
          var_id: product_id,
          var_productpic: product_pic
        }
      }).then(function(response) {
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
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btndel ใน shopControler ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
    });
  };

  $scope.btnGetReview = function() {
    $state.go('app2.reviewlist');
  };

  $scope.btnGetRating = function() {
    $state.go('app2.ratinglist');
  };

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
              content: "เกิดข้อผิดพลาด getAllAds ใน shopControler ระบบจะปิดอัตโนมัติ",
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

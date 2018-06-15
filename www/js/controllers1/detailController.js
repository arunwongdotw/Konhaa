appControllers.controller('detailCtrl', function($scope, $state, $stateParams, $ionicPopup, $http, myService, $timeout, $mdUtil, $mdSidenav, $ionicHistory, $ionicPlatform, $rootScope, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, $mdDialog) {
  $scope.shop = myService.passDataObject2;
  $scope.shop_member_id = myService.passDataObject2.member_id;
  $scope.member_id = myService.passDataObject.member_id;
  $scope.shopid = myService.passDataObject2.shop_id;
  $scope.shop_id = myService.passDataObject2.shop_id;
  $scope.shop_name = myService.passDataObject2.shop_name;
  $scope.shop_detail = myService.passDataObject2.shop_detail;
  $scope.toggleLeft = buildToggler('left');
  $scope.currState = $state;
  var currentState = $state.current.name;
  $scope.currentState = $state.current.name;

  $http.get(myService.configAPI.webserviceURL + 'webservices/ws_product.php?shop_id=' + $scope.shopid)
    .then(function(response) {
      $scope.myDataArray = response.data.results;
      for (var i = 0; i < $scope.myDataArray.length; i++) {
        $scope.items[i].img = myService.configAPI.webserviceURL + 'img/img_shop/' + $scope.myDataArray[i].img + '?random+\=' + Math.random();
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด ws_product.php ใน detailController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $http.get(myService.configAPI.webserviceURL + 'webservices/getAddress.php?shop_id=' + $scope.shopid)
    .then(function(response) {
      $scope.province_name = response.data.results[0].province_name;
      $scope.amphur_name = response.data.results[0].amphur_name;
      $scope.district_name = response.data.results[0].district_name;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getAddress.php ใน detailController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.$on('$ionicView.enter', function() {
    $http.get(myService.configAPI.webserviceURL + 'webservices/getReview.php?shop_id=' + $scope.shopid)
      .then(function(response) {
        $scope.reviewArray = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getReview.php ใน detailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  });

  $scope.getRepeater = function(num) {
    var ratings = [];
    for (var i = 0; i < num; i++) {
      ratings.push(i);
    }
    return ratings;
  };

  $scope.btnBack = function() {
    if ($state.current.name == "app1.detail") {
      $scope.navigateTo('app1.search');
    } else {
      $scope.navigateTo('app2.search');
    }
  };

  $scope.btnPro = function(record) {
    myService.passDataObject3 = record;
    $state.go('app2.productdetail');
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

  $scope.closeSideNav = function() {
    $mdSidenav('left').close();
  };

  $scope.btnChat = function() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkChat.php',
      method: 'POST',
      data: {
        var_shopid: $scope.shop_id,
        var_memberid: myService.passDataObject.member_id
      }
    }).then(function(response) {
      if (response.data.results == "ShopOwner") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "คุณเป็นเจ้าของร้านค้านี้ !",
              content: "ชื่อผู้ใช้ของคุณเป็นเจ้าของร้านค้านี้ ไม่สามารถแชทกันได้",
              ok: "ตกลง"
            }
          }
        });
      } else {
        myService.firebaseUser = $scope.shop_id;
        $state.go('app2.chatfirebase');
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnChat ใน detailController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.viewAllReview = function(review) {
    myService.memberidFromReview = review;
    $state.go('app2.reviewlistuser');
  };

  $scope.btnConfirmOwner = function() {
    $state.go('app2.confirmowner');
  };

  $scope.btnGetUserDetail = function() {
    myService.userDetailFromReview = myService.passDataObject;
    if ($state.current.name == "app1.detail") {
      $scope.navigateTo('app1.userprofile');
    } else {
      $scope.navigateTo('app2.userprofile');
    }
  };

  $scope.shopImage = [{
    src: $scope.shop.img
  }];

  $scope.zoomMin = 1;

  function setProductImage(productImgUrl0, productImgUrl1, productImgUrl2, productImgUrl3) {
    $scope.productImage = [];
    if (productImgUrl0 != "") {
      var object0 = {
        src: 'http://1did.net/centerapp/img/img_product/' + productImgUrl0
      };
      $scope.productImage.push(object0);
      if (productImgUrl1 != "") {
        var object1 = {
          src: 'http://1did.net/centerapp/img/img_product/' + productImgUrl1
        };
        $scope.productImage.push(object1);
        if (productImgUrl2 != "") {
          var object2 = {
            src: 'http://1did.net/centerapp/img/img_product/' + productImgUrl2
          };
          $scope.productImage.push(object2);
          if (productImgUrl3 != "") {
            var object3 = {
              src: 'http://1did.net/centerapp/img/img_product/' + productImgUrl3
            };
            $scope.productImage.push(object3);
          }
        }
      }
    }
  }

  $scope.showProductImages = function(index, productImgUrl0, productImgUrl1, productImgUrl2, productImgUrl3) {
    setProductImage(productImgUrl0, productImgUrl1, productImgUrl2, productImgUrl3);
    $scope.activeSlide = index;
    $scope.showModal('templates/templates1/productzoomview.html');
  };

  $scope.showImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/templates1/shopzoomview.html');
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

appControllers.controller('confirmOwnerCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, myService, $mdDialog, $http, $stateParams, $ionicNavBarDelegate, $cordovaCamera, $cordovaFileTransfer) {
  $scope.toggleLeft = buildToggler('left');
  $scope.cfmOwner = {};
  $scope.member_id = myService.passDataObject.member_id;
  $scope.shop_id = myService.passDataObject2.shop_id;

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

  function checkImageURI(imageURI) {
    var str = imageURI;
    var res = str.match(/shopping/g);
    if (res) {
      return "found";
    } else {
      return "notfound";
    }
  }

  $scope.btnConfirmOwner = function() {
    var number = /^[0-9]+$/;
    if (($scope.cfmOwner.firstname != null) && ($scope.cfmOwner.firstname != "")) {
      if (($scope.cfmOwner.lastname != null) && ($scope.cfmOwner.lastname != "")) {
        if (($scope.cfmOwner.mobile != null) && ($scope.cfmOwner.mobile != "")) {
          if (number.test($scope.cfmOwner.mobile)) {
            var img = document.getElementById('IDCard');
            var imageURI = img.src;
            var chkImageURI = checkImageURI(imageURI);
            if (chkImageURI == "found") {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "รูปบัตรประชาชนไม่ถูกต้อง !",
                    content: "กรุณาอัพโหลดรูปบัตรประชาชน",
                    ok: "ตกลง"
                  }
                }
              });
            } else {
              var server = myService.configAPI.webserviceURL + 'webservices/uploadIDCard.php';
              var trustHosts = true;
              var options2 = {
                fileKey: "myCameraImg",
                fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                chunkedMode: false
              };
              $cordovaFileTransfer.upload(server, imageURI, options2)
                .then(function(response) {
                  $scope.IDCardImgName = response.response;
                  $scope.IDCardImgName = $scope.IDCardImgName.replace(/\s/g, '');
                  var img2 = document.getElementById('OwnerCard');
                  var imageURI2 = img2.src;
                  var chkImageURI2 = checkImageURI(imageURI2);
                  if (chkImageURI2 == "found") {
                    $http({
                      url: myService.configAPI.webserviceURL + 'webservices/confirmOwnerNotHavePic.php',
                      method: 'POST',
                      data: {
                        var_memberid: $scope.member_id,
                        var_shopid: $scope.shop_id,
                        var_firstname: $scope.cfmOwner.firstname,
                        var_lastname: $scope.cfmOwner.lastname,
                        var_mobile: $scope.cfmOwner.mobile,
                        var_idcardimgname: $scope.IDCardImgName
                      }
                    }).then(function(response) {
                      console.log(response);
                      $mdDialog.show({
                        controller: 'DialogController',
                        templateUrl: 'confirm-dialog.html',
                        locals: {
                          displayOption: {
                            title: "ยืนยันตนเป็นเจ้าของร้านค้าสำเร็จ !",
                            content: "คุณยืนยันตนเป็นเจ้าของร้านค้าสำเร็จ ทางทีมงานจะยืนยันให้เร็วที่สุด",
                            ok: "ตกลง"
                          }
                        }
                      }).then(function() {
                        $state.go('app2.home');
                      });
                    }, function(error) {
                      console.log(error);
                    });
                  } else {
                    server = myService.configAPI.webserviceURL + 'webservices/uploadOwnerCard.php';
                    trustHosts = true;
                    options3 = {
                      fileKey: "myCameraImg",
                      fileName: imageURI2.substr(imageURI2.lastIndexOf('/') + 1),
                      mimeType: "image/jpeg",
                      chunkedMode: false
                    };
                    $cordovaFileTransfer.upload(server, imageURI2, options3)
                      .then(function(response) {
                        $scope.OwnerCardImgName = response.response;
                        $scope.OwnerCardImgName = $scope.OwnerCardImgName.replace(/\s/g, '');
                        $http({
                          url: myService.configAPI.webserviceURL + 'webservices/confirmOwner.php',
                          method: 'POST',
                          data: {
                            var_memberid: $scope.member_id,
                            var_shopid: $scope.shop_id,
                            var_firstname: $scope.cfmOwner.firstname,
                            var_lastname: $scope.cfmOwner.lastname,
                            var_mobile: $scope.cfmOwner.mobile,
                            var_idcardimgname: $scope.IDCardImgName,
                            var_ownercardimgname: $scope.OwnerCardImgName
                          }
                        }).then(function(response) {
                          console.log(response);
                          $mdDialog.show({
                            controller: 'DialogController',
                            templateUrl: 'confirm-dialog.html',
                            locals: {
                              displayOption: {
                                title: "ยืนยันตนเป็นเจ้าของร้านค้าสำเร็จ !",
                                content: "คุณยืนยันตนเป็นเจ้าของร้านค้าสำเร็จ ทางทีมงานจะยืนยันให้เร็วที่สุด",
                                ok: "ตกลง"
                              }
                            }
                          }).then(function() {
                            $state.go('app2.home');
                          });
                        }, function(error) {
                          console.log(error);
                        });
                      });
                  }
                });
            }
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "เบอร์โทรศัพท์ไม่ถูกต้อง !",
                  content: "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น",
                  ok: "ตกลง"
                }
              }
            });
          }
        } else {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เบอร์โทรศัพท์ไม่ถูกต้อง !",
                content: "กรุณากรอกเบอร์โทรศัพท์ตามรูปแบบที่กำหนด",
                ok: "ตกลง"
              }
            }
          });
        }
      } else {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "นามสกุลไม่ถูกต้อง !",
              content: "กรุณากรอกนามสกุล",
              ok: "ตกลง"
            }
          }
        });
      }
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ชื่อจริงไม่ถูกต้อง !",
            content: "กรุณากรอกชื่อจริง",
            ok: "ตกลง"
          }
        }
      });
    }
  };

  $scope.btnIDCardPicByGallery = function() {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(options).then(function(imageURI) {
      var image = document.getElementById('IDCard');
      image.src = imageURI;
    }, function(err) {
      console.log(err);
    });
  };

  $scope.btnOwnerCardPicByGallery = function() {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(options).then(function(imageURI) {
      var image = document.getElementById('OwnerCard');
      image.src = imageURI;
    }, function(err) {
      console.log(err);
    });
  };
});

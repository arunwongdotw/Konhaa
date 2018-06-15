appControllers.controller('shopregisterCtrl', function($state, $scope, $mdDialog, $http, myService, $cordovaFileTransfer, $cordovaCamera, deviceService, $rootScope) {
  $scope.shop = {};
  $scope.member_id = myService.passDataObject.member_id;

  $scope.btnRegister = function() {
    var number = /^[0-9]+$/;
    if (($scope.shop.shop_name != null) && ($scope.shop.shop_name != "")) {
      if (($scope.shop.shop_desc != null) && ($scope.shop.shop_desc != "")) {
        if (($scope.shop.owner_firstname != null) && ($scope.shop.owner_firstname != "")) {
          if (($scope.shop.owner_lastname != null) && ($scope.shop.owner_lastname != "")) {
            if (($scope.shop.mobile_number != null) && ($scope.shop.mobile_number != "")) {
              if (number.test($scope.shop.mobile_number)) {
                $http({
                  url: myService.configAPI.webserviceURL + 'webservices/registerShop.php',
                  method: 'POST',
                  data: {
                    var_shopname: $scope.shop.shop_name,
                    var_shopdesc: $scope.shop.shop_desc,
                    var_firstname: $scope.shop.owner_firstname,
                    var_lastname: $scope.shop.owner_lastname,
                    var_mobile: $scope.shop.mobile_number,
                    var_id: $scope.member_id,
                    var_latitude: $scope.latitude,
                    var_longitude: $scope.longitude
                  }
                }).then(function(response) {
                  if (response.data.results == 'success_insert') {
                    var img = document.getElementById('myImage');
                    var imageURI = img.src;
                    var server = myService.configAPI.webserviceURL + 'webservices/uploadShopPic.php?member_id=' + $scope.member_id;
                    var trustHosts = true;
                    var options2 = {
                      fileKey: "myCameraImg",
                      fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                      mimeType: "image/jpeg",
                      chunkedMode: false
                    };
                    $cordovaFileTransfer.upload(server, imageURI, options2);
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: "ยินดีด้วย คุณลงทะเบียนร้านค้าสำเร็จ !",
                          content: "คุณลงทะเบียนร้านค้าสำเร็จ พร้อมที่จะใช้งานระบบร้านค้า",
                          ok: "ตกลง"
                        }
                      }
                    }).then(function(response) {
                      $state.go('app2.home');
                    });
                  }
                }, function(error) {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "เกิดข้อผิดพลาด !",
                        content: "เกิดข้อผิดพลาด btnRegister ใน shopregisterController ระบบจะปิดอัตโนมัติ",
                        ok: "ตกลง"
                      }
                    }
                  }).then(function(response) {
                    ionic.Platform.exitApp();
                  });
                });
              } else {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เบอร์โทรศัพท์มือถือไม่ถูกต้อง !",
                      content: "เบอร์โทรศัพท์มือถือต้องเป็นตัวเลขเท่านั้น",
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
                    title: "เบอร์โทรศัพท์มือถือไม่ถูกต้อง !",
                    content: "กรุณากรอกเบอร์โทรศัพท์มือถือ",
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
                  title: "นามสกุลเจ้าของร้านไม่ถูกต้อง !",
                  content: "กรุณากรอกนามสกุลเจ้าของร้าน",
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
                title: "ชื่อเจ้าของร้านไม่ถูกต้อง !",
                content: "กรุณากรอกชื่อเจ้าของร้าน",
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
              title: "รายละเอียดร้านค้าไม่ถูกต้อง !",
              content: "กรุณากรอกรายละเอียดร้าน",
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
            title: "ชื่อร้านไม่ถูกต้อง !",
            content: "กรุณากรอกชื่อร้านค้า",
            ok: "ตกลง"
          }
        }
      });
    }
  };

  $scope.btnShopPicByGallery = function() {
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
      var image = document.getElementById('myImage');
      image.src = imageURI;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnShopPicByGallery ใน shopregisterController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  deviceService.checkGPS(function(status) {
    if (status == 'GPS_OFF') {
      deviceService.checkPlatform(function(device) {
        if (device == 'android') {
          deviceService.androidGpsSetting(function(status) {
            if (status == 'force_gps') {
              deviceService.currentLocation(function(data) {
                if (data != 'ERROR_POSITION') {
                  $rootScope.currentLocation = data;
                  $scope.mapStatus = true;
                }
              });
            } else {
              deviceService.openSetting(function(status) {});
            }
          });
        } else if (device == 'ios') {
          deviceService.openSetting(function(status) {
            if (status == 'OPENED_SETTING') {
              deviceService.currentLocation(function(data) {
                if (data != 'ERROR_POSITION') {
                  $rootScope.currentLocation = data;
                  $scope.mapStatus = true;
                }
              });
            }
          });
        } else {
          alert('ERROR Deivice not in ios & android');
        }
      });
    } else {
      deviceService.currentLocation(function(data) {
        if (data != 'ERROR_POSITION') {
          $rootScope.currentLocation = data;
          $scope.mapStatus = true;
          $scope.latitude = data.latitude;
          $scope.longitude = data.longitude;
        }
      });
    }
  });

  $scope.btnLaunchMap = function() {
    deviceService.launchMap($rootScope.currentLocation, $scope.myDataArray[3].position);
  };
});

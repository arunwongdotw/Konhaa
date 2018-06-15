appControllers.controller('shopReviewCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, myService, deviceService, $cordovaCamera, $rootScope, $cordovaFileTransfer, $cordovaImagePicker, $http, $mdDialog) {
  $scope.toggleLeft = buildToggler('left');
  $scope.member_id = myService.passDataObject.member_id;
  $scope.form = {};
  $scope.shop = {};

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

  var i = 0;
  var j = 0;

  function checkImageURI(imageURI) {
    var str = imageURI;
    var res = str.match(/shopping/g);
    if (res) {
      return "found";
    } else {
      return "notfound";
    }
  }

  $scope.getImageSaveContact = function() {
    var options3 = {
      maximumImagesCount: 4, // Max number of selected images, I'm using only one for this example
      width: 500,
      height: 500,
      quality: 80 // Higher is better
    };

    $cordovaImagePicker.getPictures(options3)
      .then(function(results) {
        var i;
        var j;
        for (i = 0; i < results.length; i++) {
          var image = document.getElementById('myImage' + i);
          image.src = results[i];
        }
        var remain = 4 - results.length;
        for (j = 0; j < remain; j++) {
          var image = document.getElementById('myImage' + i);
          image.src = "img/shopping.png";
          i = i + 1;
        }
        var keep = results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getPictures ใน shopReviewController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  function updateProductPic(callback) {
    if (i < 4) {
      var img = document.getElementById('myImage' + i);
      var imageURI = img.src;
      var server = myService.configAPI.webserviceURL + 'webservices/picProduct.php';
      var trustHosts = true;
      var options2 = {
        fileKey: "myCameraImg",
        fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
        mimeType: "image/jpeg",
        chunkedMode: false
      };
      chkImageURI = checkImageURI(imageURI);
      if (chkImageURI == "notfound") {
        if (i == 0) {
          $cordovaFileTransfer.upload(server, imageURI, options2)
            .then(function(response) {
              $scope.imgname = response.response;
              $scope.imgname = $scope.imgname.replace(/\s/g, '');
              $http({
                url: myService.configAPI.webserviceURL + 'webservices/insertpro2.php',
                method: 'POST',
                data: {
                  var_memberid: $scope.member_id,
                  var_shopname: $scope.shop.shop_name,
                  var_shopdesc: $scope.shop.shop_desc,
                  var_imgname: $scope.imgname,
                  var_productname: $scope.form.txt_productname,
                  var_detailproduct: $scope.form.txt_detailproduct
                }
              }).then(function(response) {
                i = i + 1;
                updateProductPic(callback);
              }, function(error) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เกิดข้อผิดพลาด !",
                      content: "เกิดข้อผิดพลาด updateProductPic ใน shopReviewController ระบบจะปิดอัตโนมัติ",
                      ok: "ตกลง"
                    }
                  }
                }).then(function(response) {
                  ionic.Platform.exitApp();
                });
              });
            }, function(error) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เกิดข้อผิดพลาด !",
                    content: "เกิดข้อผิดพลาด updateProductPic ใน shopReviewController ระบบจะปิดอัตโนมัติ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                ionic.Platform.exitApp();
              });
            });
        } else {
          $cordovaFileTransfer.upload(server, imageURI, options2)
            .then(function(response) {
              $scope.imgname = response.response;
              $scope.imgname = $scope.imgname.replace(/\s/g, '');
              $http({
                url: myService.configAPI.webserviceURL + 'webservices/updateImgProduct.php',
                method: 'POST',
                data: {
                  var_imgname: $scope.imgname,
                  var_productname: $scope.form.txt_productname,
                  var_detailproduct: $scope.form.txt_detailproduct
                }
              }).then(function(response) {
                i = i + 1;
                updateProductPic(callback);
              }, function(error) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เกิดข้อผิดพลาด !",
                      content: "เกิดข้อผิดพลาด updateProductPic ใน shopReviewController ระบบจะปิดอัตโนมัติ",
                      ok: "ตกลง"
                    }
                  }
                }).then(function(response) {
                  ionic.Platform.exitApp();
                });
              });
            }, function(error) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เกิดข้อผิดพลาด !",
                    content: "เกิดข้อผิดพลาด updateProductPic ใน shopReviewController ระบบจะปิดอัตโนมัติ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                ionic.Platform.exitApp();
              });
            });
        }
      }
    }
  }

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
            content: "เกิดข้อผิดพลาด btnShopPicByGallery ใน shopReviewController ระบบจะปิดอัตโนมัติ",
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

  $scope.btnShopReview = function() {
    var number = /^[0-9]+$/;
    if (($scope.shop.shop_name != null) && ($scope.shop.shop_name != "")) {
      if (($scope.shop.shop_desc != null) && ($scope.shop.shop_desc != "")) {
        if (($scope.shop.mobile_number != null) && ($scope.shop.mobile_number != "")) {
          if (number.test($scope.shop.mobile_number)) {
            if (($scope.form.txt_productname != null) && ($scope.form.txt_productname != "")) {
              if (($scope.form.txt_detailproduct != null) && ($scope.form.txt_detailproduct != "")) {
                $http({
                  url: myService.configAPI.webserviceURL + 'webservices/registerShop2.php',
                  method: 'POST',
                  data: {
                    var_shopname: $scope.shop.shop_name,
                    var_shopdesc: $scope.shop.shop_desc,
                    var_mobile: $scope.shop.mobile_number,
                    var_id: $scope.member_id,
                    var_latitude: $scope.latitude,
                    var_longitude: $scope.longitude
                  }
                }).then(function(response) {
                  if (response.data.results == 'success_insert') {
                    var img = document.getElementById('myImage');
                    var imageURI = img.src;
                    var server = myService.configAPI.webserviceURL + 'webservices/uploadShopPic2.php?member_id=' + $scope.member_id;
                    var trustHosts = true;
                    var options2 = {
                      fileKey: "myCameraImg",
                      fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                      mimeType: "image/jpeg",
                      chunkedMode: false
                    };
                    $cordovaFileTransfer.upload(server, imageURI, options2)
                      .then(function(response) {
                        if (response.response == '{"result":"success_insert_img"}') {
                          console.log('in if result');
                          var img = document.getElementById('myImage0');
                          var imageURI = img.src;
                          var server = myService.configAPI.webserviceURL + 'webservices/picProduct.php';
                          var trustHosts = true;
                          var options4 = {
                            fileKey: "myCameraImg",
                            fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                            mimeType: "image/jpeg",
                            chunkedMode: false
                          };
                          var chkImageURI = checkImageURI(imageURI);
                          if (chkImageURI == "found") {
                            $cordovaFileTransfer.upload(server, imageURI, options4)
                              .then(function(response) {
                                $scope.imgname = response.response;
                                $scope.imgname = $scope.imgname.replace(/\s/g, '');
                                $http({
                                  url: myService.configAPI.webserviceURL + 'webservices/insertpro2.php',
                                  method: 'POST',
                                  data: {
                                    var_memberid: $scope.member_id,
                                    var_shopname: $scope.shop.shop_name,
                                    var_shopdesc: $scope.shop.shop_desc,
                                    var_imgname: $scope.imgname,
                                    var_productname: $scope.form.txt_productname,
                                    var_detailproduct: $scope.form.txt_detailproduct
                                  }
                                }).then(function(response) {
                                  $mdDialog.show({
                                    controller: 'DialogController',
                                    templateUrl: 'confirm-dialog.html',
                                    locals: {
                                      displayOption: {
                                        title: "รีวิวร้านค้าสำเร็จ !",
                                        content: "คุณได้ทำการรีวิวร้านค้าสำเร็จ",
                                        ok: "ตกลง"
                                      }
                                    }
                                  }).then(function(response) {
                                    $state.go('app2.home');
                                  });
                                }, function(error) {
                                  console.log(error);
                                });
                              }, function(error) {
                                console.log(error);
                              });
                          } else {
                            updateProductPic(function(status) {});
                            $mdDialog.show({
                              controller: 'DialogController',
                              templateUrl: 'confirm-dialog.html',
                              locals: {
                                displayOption: {
                                  title: "รีวิวร้านค้าสำเร็จ !",
                                  content: "คุณได้ทำการรีวิวร้านค้าสำเร็จ",
                                  ok: "ตกลง"
                                }
                              }
                            }).then(function(response) {
                              $state.go('app2.home');
                            });
                          }
                        }
                      });
                  }
                }, function(error) {
                  console.log(error);
                });
              } else {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "รายละเอียดสินค้าไม่ถูกต้อง !",
                      content: "กรุณากรอกรายละเอียดสินค้า",
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
                    title: "ชื่อสินค้าไม่ถูกต้อง !",
                    content: "กรุณากรอกชื่อสินค้า",
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
});

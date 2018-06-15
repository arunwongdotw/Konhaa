appControllers.controller('shopdetailCtrl', function($state, $scope, $mdDialog, $http, myService, $cordovaFileTransfer, $cordovaCamera) {
  $scope.member_id = myService.passDataObject.member_id;
  $scope.mdSelectValue = "1";
  $scope.mdSelectValue2 = "1";
  $scope.mdSelectValue3 = "1";
  $scope.shop = {};

  $http({
    url: myService.configAPI.webserviceURL + 'webservices/getShopDetail.php',
    method: 'POST',
    data: {
      var_id: $scope.member_id
    }
  }).then(function(response) {
    $scope.shop = response.data.results[0];
    if ($scope.shop.province_id) {
      $scope.mdSelectValue = $scope.shop.province_id;
      $http.get('http://1did.net/centerapp/webservices/showprovince.php')
        .then(function(response) {
          $scope.provinceArray = response.data.results;
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด showprovince.php ใน shopdetailController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
    } else {
      $http.get('http://1did.net/centerapp/webservices/showprovince.php')
        .then(function(response) {
          $scope.provinceArray = response.data.results;
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด showprovince.php ใน shopdetailController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
    }
    if ($scope.shop.amphur_id) {
      $scope.mdSelectValue2 = $scope.shop.amphur_id;
      $http.get('http://1did.net/centerapp/webservices/showamphur.php?province_id=' + $scope.mdSelectValue)
        .then(function(response) {
          $scope.amphurArray = response.data.results;
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด showamphur.php ใน shopdetailController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
    } else {
      $http.get('http://1did.net/centerapp/webservices/showamphur.php?province_id=' + $scope.mdSelectValue)
        .then(function(response) {
          $scope.amphurArray = response.data.results;
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด showamphur.php ใน shopdetailController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
    }
    if ($scope.shop.district_id) {
      $scope.mdSelectValue3 = $scope.shop.district_id;
      $http.get('http://1did.net/centerapp/webservices/showdistrict.php?amphur_id=' + $scope.mdSelectValue2)
        .then(function(response) {
          $scope.districtArray = response.data.results;
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด showdistrict.php ใน shopdetailController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
    } else {
      $http.get('http://1did.net/centerapp/webservices/showdistrict.php?amphur_id=' + $scope.mdSelectValue2)
        .then(function(response) {
          $scope.districtArray = response.data.results;
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด showdistrict.php ใน shopdetailController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
    }
    $scope.imgname = response.data.results[0].img;
    $scope.shop.img = myService.configAPI.webserviceURL + 'img/img_shop/' + response.data.results[0].img + '?random+\=' + Math.random();
  });

  $scope.amphur = function(province_id, min_amphur, min_district) {
    $scope.mdSelectValue = province_id;
    $scope.mdSelectValue2 = min_amphur;
    $scope.mdSelectValue3 = min_district;

    $http.get('http://1did.net/centerapp/webservices/showamphur.php?province_id=' + province_id)
      .then(function(response) {
        $scope.amphurArray = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด showamphur.php ใน shopdetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });

    $http.get('http://1did.net/centerapp/webservices/showdistrict.php?amphur_id=' + min_amphur)
      .then(function(response) {
        $scope.districtArray = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด showdistrict.php ใน shopdetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.district = function(amphur, min_district) {
    $scope.mdSelectValue2 = amphur;
    $scope.mdSelectValue3 = min_district;

    $http.get('http://1did.net/centerapp/webservices/showdistrict.php?amphur_id=' + amphur)
      .then(function(response) {
        $scope.districtArray = response.data.results;
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด showdistrict.php ใน shopdetailController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };

  $scope.district2 = function(district) {
    $scope.mdSelectValue3 = district;
  };

  $scope.btnUpdate = function() {
    var number = /^[0-9]+$/;
    if (($scope.shop.title != null) && ($scope.shop.title != "")) {
      if (($scope.shop.detail != null) && ($scope.shop.detail != "")) {
        if (($scope.shop.firstname != null) && ($scope.shop.firstname != "")) {
          if (($scope.shop.lastname != null) && ($scope.shop.lastname != "")) {
            if (($scope.shop.mobile != null) && ($scope.shop.mobile != "")) {
              if (number.test($scope.shop.mobile)) {
                if (($scope.shop.address != null) && ($scope.shop.address != "")) {
                  if (($scope.shop.postalcode != null) && ($scope.shop.postalcode != "")) {
                    if (number.test($scope.shop.postalcode)) {
                      if (($scope.shop.activetime != null) && ($scope.shop.activetime != "")) {
                        if (($scope.shop.closeday != null) && ($scope.shop.closeday != "")) {
                          $http({
                            url: myService.configAPI.webserviceURL + 'webservices/updateShop.php',
                            method: 'POST',
                            data: {
                              var_id: $scope.shop.shop_id,
                              var_title: $scope.shop.title,
                              var_detail: $scope.shop.detail,
                              var_firstname: $scope.shop.firstname,
                              var_lastname: $scope.shop.lastname,
                              var_mobile: $scope.shop.mobile,
                              var_telephone: $scope.shop.telephone,
                              var_address: $scope.shop.address,
                              var_province: $scope.mdSelectValue,
                              var_amphur: $scope.mdSelectValue2,
                              var_district: $scope.mdSelectValue3,
                              var_postalcode: $scope.shop.postalcode,
                              var_activetime: $scope.shop.activetime,
                              var_closeday: $scope.shop.closeday,
                              var_website: $scope.shop.website,
                              var_facebook: $scope.shop.facebook,
                              var_line: $scope.shop.line,
                              var_instagram: $scope.shop.instagram
                            }
                          }).then(function(response) {
                            if (response.data.results == 'success_update') {
                              var img = document.getElementById('myShop');
                              var imageURI = img.src;
                              var server = myService.configAPI.webserviceURL + 'webservices/updateShopPic.php?shop_id=' + $scope.shop.shop_id + '&img_name=' + $scope.imgname;
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
                                    title: "แก้ไขข้อมูลร้านค้าสำเร็จ !",
                                    content: "คุณได้ทำการแก้ไข และบันทึกข้อมูลร้านค้าสำเร็จ",
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
                                  content: "เกิดข้อผิดพลาด btnUpdate ใน shopdetailController ระบบจะปิดอัตโนมัติ",
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
                                title: "วันหยุดทำการไม่ถูกต้อง !",
                                content: "กรุณากรอกวันหยุดทำการ",
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
                              title: "เวลาเปิดทำการไม่ถูกต้อง !",
                              content: "กรุณากรอกวันเปิดทำการ",
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
                            title: "รหัสไปรษณีย์ไม่ถูกต้อง !",
                            content: "รหัสไปรษณีย์ต้องเป็นตัวเลขเท่านั้น",
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
                          title: "รหัสไปรษณีย์ไม่ถูกต้อง !",
                          content: "กรุณากรอกรหัสไปรษณีย์",
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
                        title: "ที่อยู่ไม่ถูกต้อง !",
                        content: "กรุณากรอกที่อยู่",
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
      var image = document.getElementById('myShop');
      image.src = imageURI;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnShopPicByGallery ใน shopdetailController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };
});

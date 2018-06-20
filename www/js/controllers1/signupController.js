appControllers.controller('signupCtrl', function($scope, $mdDialog, $http, myService, $state, $cordovaFileTransfer, $mdBottomSheet, $cordovaCamera, $ionicModal, $cordovaDevice) {
  $scope.form = {};

  $scope.btnSignup = function() {
    var englishnumber = /^[0-9a-zA-Z]+$/;
    var number = /^[0-9]+$/;
    if (($scope.form.txt_username != null) && ($scope.form.txt_username != "")) {
      if (englishnumber.test($scope.form.txt_username)) {
        if (($scope.form.txt_password != null) && ($scope.form.txt_password != "")) {
          if (englishnumber.test($scope.form.txt_password)) {
            if ($scope.form.txt_password == $scope.form.txt_cfmpassword) {
              if (($scope.form.txt_firstname != null) && ($scope.form.txt_firstname != "")) {
                if (($scope.form.txt_lastname != null) && ($scope.form.txt_lastname != "")) {
                  if (($scope.form.txt_mobile != null) && ($scope.form.txt_mobile != "")) {
                    if (number.test($scope.form.txt_mobile)) {
                      if (($scope.form.txt_email != null) && ($scope.form.txt_email != "")) {
                        var img = document.getElementById('myImage');
                        var imageURI = img.src;
                        var server = myService.configAPI.webserviceURL + 'webservices/uploadMemberPic.php?username=' + $scope.form.txt_username;
                        var trustHosts = true;
                        var options2 = {
                          fileKey: "myCameraImg",
                          fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                          mimeType: "image/jpeg",
                          chunkedMode: false
                        };
                        $cordovaFileTransfer.upload(server, imageURI, options2);
                        $http({
                          url: myService.configAPI.webserviceURL + 'webservices/signupMember.php',
                          method: 'POST',
                          data: {
                            var_username: $scope.form.txt_username,
                            var_password: $scope.form.txt_password,
                            var_firstname: $scope.form.txt_firstname,
                            var_lastname: $scope.form.txt_lastname,
                            var_mobile: $scope.form.txt_mobile,
                            var_email: $scope.form.txt_email
                          }
                        }).then(function(response) {
                          if (response.data.results == 'duplicate_username') {
                            $mdDialog.show({
                              controller: 'DialogController',
                              templateUrl: 'confirm-dialog.html',
                              locals: {
                                displayOption: {
                                  title: "ชื่อผู้ใช้ไม่ถูกต้อง !",
                                  content: "พบชื่อผู้ใช้มีอยู่ในระบบแล้ว กรุณาเปลี่ยนชื่อผู้ใช้",
                                  ok: "ตกลง"
                                }
                              }
                            });
                          } else {
                            $http.get('http://1did.net/centerapp/php_qrcode/index.php?data=' + $scope.form.txt_username + '&level=high&size=10');
                            $mdDialog.show({
                              controller: 'DialogController',
                              templateUrl: 'confirm-dialog.html',
                              locals: {
                                displayOption: {
                                  title: "ลงทะเบียนสำเร็จ !",
                                  content: "ยินดีด้วย คุณลงทะเบียนสำเร็จ ระบบจะเข้าสู่ระบบให้อัตโนมัติ",
                                  ok: "ตกลง"
                                }
                              }
                            }).then(function(response) {
                              var notify_id = $cordovaDevice.getUUID();
                              $http({
                                url: myService.configAPI.webserviceURL + 'webservices/loginMember.php',
                                method: 'POST',
                                data: {
                                  var_username: $scope.form.txt_username,
                                  var_password: $scope.form.txt_password,
                                  var_notifyid: notify_id
                                }
                              }).then(function(response) {
                                window.localStorage.username = $scope.form.txt_username;
                                myService.passDataObject = response.data.results[0];
                                $state.go('app2.home');
                              }, function(error) {
                                $mdDialog.show({
                                  controller: 'DialogController',
                                  templateUrl: 'confirm-dialog.html',
                                  locals: {
                                    displayOption: {
                                      title: "เกิดข้อผิดพลาด !",
                                      content: "เกิดข้อผิดพลาด btnSignup ใน signupController ระบบจะปิดอัตโนมัติ",
                                      ok: "ตกลง"
                                    }
                                  }
                                }).then(function(response) {
                                  ionic.Platform.exitApp();
                                });
                              });
                            });
                          }
                        }, function(error) {
                          $mdDialog.show({
                            controller: 'DialogController',
                            templateUrl: 'confirm-dialog.html',
                            locals: {
                              displayOption: {
                                title: "เกิดข้อผิดพลาด !",
                                content: "เกิดข้อผิดพลาด btnSignup ใน signupController ระบบจะปิดอัตโนมัติ",
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
                              title: "อีเมลไม่ถูกต้อง !",
                              content: "กรุณากรอกอีเมลตามรูปแบบที่กำหนด",
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
            } else {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "ยืนยันรหัสผ่านไม่ถูกต้อง !",
                    content: "กรุณากรอกยืนยันรหัสผ่านให้ตรงกับรหัสผ่าน",
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
                  title: "รหัสผ่านไม่ถูกต้อง !",
                  content: "รหัสผ่านต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น",
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
                title: "รหัสผ่านไม่ถูกต้อง !",
                content: "กรุณากรอกรหัสผ่านตามรูปแบบที่กำหนด",
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
              title: "ชื่อผู้ใช้ไม่ถูกต้อง !",
              content: "ชื่อผู้ใช้ต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น",
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
            title: "ชื่อผู้ใช้ไม่ถูกต้อง !",
            content: "กรุณากรอกชื่อผู้ใช้ตามรูปแบบที่กำหนด",
            ok: "ตกลง"
          }
        }
      });
    }
  };

  $scope.btnProfilePicByGallery = function() {
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
            content: "เกิดข้อผิดพลาด btnProfilePicByGallery ใน signupController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };
});

appControllers.controller('ShopinsertController', function(myService, $scope, $cordovaFileTransfer, $cordovaCamera, $http, $mdDialog, $state, $ionicHistory, $cordovaImagePicker, $timeout) {
  $scope.form = {};
  $scope.member_id = myService.passDataObject.member_id;
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
              content: "เกิดข้อผิดพลาด getPictures ใน ShopinsertController ระบบจะปิดอัตโนมัติ",
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
                url: myService.configAPI.webserviceURL + 'webservices/insertpro.php',
                method: 'POST',
                data: {
                  var_memberid: $scope.member_id,
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
                      content: "เกิดข้อผิดพลาด updateProductPic ใน ShopinsertController ระบบจะปิดอัตโนมัติ",
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
                    content: "เกิดข้อผิดพลาด updateProductPic ใน ShopinsertController ระบบจะปิดอัตโนมัติ",
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
                      content: "เกิดข้อผิดพลาด updateProductPic ใน ShopinsertController ระบบจะปิดอัตโนมัติ",
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
                    content: "เกิดข้อผิดพลาด updateProductPic ใน ShopinsertController ระบบจะปิดอัตโนมัติ",
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

  $scope.btninsert = function() {
    var englishnumber = /^[0-9a-zA-Z]+$/;
    var number = /^[0-9]+$/;
    if (($scope.form.txt_productname != null) && ($scope.form.txt_productname != "")) {
      if (($scope.form.txt_detailproduct != null) && ($scope.form.txt_detailproduct != "")) {
        var img = document.getElementById('myImage0');
        var imageURI = img.src;
        var server = myService.configAPI.webserviceURL + 'webservices/picProduct.php';
        var trustHosts = true;
        var options2 = {
          fileKey: "myCameraImg",
          fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
          mimeType: "image/jpeg",
          chunkedMode: false
        };
        var chkImageURI = checkImageURI(imageURI);
        if (chkImageURI == "found") {
          $cordovaFileTransfer.upload(server, imageURI, options2)
            .then(function(response) {
              $scope.imgname = response.response;
              $scope.imgname = $scope.imgname.replace(/\s/g, '');
              $http({
                url: myService.configAPI.webserviceURL + 'webservices/insertpro.php',
                method: 'POST',
                data: {
                  var_memberid: $scope.member_id,
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
                      title: "เพิ่มข้อมูลสินค้าสำเร็จ !",
                      content: "คุณได้ทำการเพิ่มข้อมูลสินค้าสำเร็จ",
                      ok: "ตกลง"
                    }
                  }
                }).then(function(response) {
                  $state.go('app2.shop');
                });
              }, function(error) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เกิดข้อผิดพลาด !",
                      content: "เกิดข้อผิดพลาด btninsert ใน ShopinsertController ระบบจะปิดอัตโนมัติ",
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
                    content: "เกิดข้อผิดพลาด btninsert ใน ShopinsertController ระบบจะปิดอัตโนมัติ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                ionic.Platform.exitApp();
              });
            });
        } else {
          updateProductPic(function(status) {});
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เพิ่มข้อมูลสินค้าสำเร็จ !",
                content: "คุณได้ทำการเพิ่มข้อมูลสินค้าสำเร็จ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            $state.go('app2.shop');
          });
        }
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
  };
});

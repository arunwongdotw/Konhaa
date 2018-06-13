appControllers.controller('editProductController', function(myService, $scope, $cordovaFileTransfer, $cordovaCamera, $http, $mdDialog, $state, $ionicHistory, $cordovaImagePicker) {
  $scope.form = {};
  $scope.fullname0 = myService.editproduct.product_pic0;
  $scope.fullname1 = "";
  $scope.fullname2 = "";
  $scope.fullname3 = "";
  $scope.form.productname = myService.editproduct.product_name;
  $scope.form.productid = myService.editproduct.product_id;
  $scope.form.productdetail = myService.editproduct.product_detail;
  $scope.form.shopid = myService.editproduct.shop_id;
  $scope.form.productpic0 = myService.configAPI.webserviceURL + 'img/img_product/' + myService.editproduct.product_pic0 + '?random+\=' + Math.random();
  var i = 0;
  var j = 0;

  if (myService.editproduct.product_pic1 == "") {
    $scope.form.productpic1 = "img/shopping.png";
  } else {
    $scope.form.productpic1 = myService.configAPI.webserviceURL + 'img/img_product/' + myService.editproduct.product_pic1 + '?random+\=' + Math.random();
    $scope.fullname1 = myService.editproduct.product_pic1;
  }

  if (myService.editproduct.product_pic2 == "") {
    $scope.form.productpic2 = "img/shopping.png";
  } else {
    $scope.form.productpic2 = myService.configAPI.webserviceURL + 'img/img_product/' + myService.editproduct.product_pic2 + '?random+\=' + Math.random();
    $scope.fullname2 = myService.editproduct.product_pic2;
  }

  if (myService.editproduct.product_pic3 == "") {
    $scope.form.productpic3 = "img/shopping.png";
  } else {
    $scope.form.productpic3 = myService.configAPI.webserviceURL + 'img/img_product/' + myService.editproduct.product_pic3 + '?random+\=' + Math.random();
    $scope.fullname3 = myService.editproduct.product_pic3;
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
        var i, j;
        for (i = 0; i < results.length; i++) {
          var image = document.getElementById('myImage' + i);
          image.src = results[i];
        }
        var remain = 4 - results.length;
        for(j = 0; j < remain; j++){
          var image = document.getElementById('myImage' + i);
          image.src = "img/shopping.png";
          i = i + 1;
        }
        var keep = results;
      }, function(error) {
        console.log('Error: ' + JSON.stringify(error)); // In case of error
      });
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

  function updateProductPic(callback) {
    if (i < 4) {
      console.log(i);
      console.log('come in updateProductPic');
      var server;
      var img = document.getElementById('myImage' + i);
      var imageURI = img.src;
      var trustHosts = true;
      var options2 = {
        fileKey: "myCameraImg",
        fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
        mimeType: "image/jpeg",
        chunkedMode: false
      };
      var chkImageURI = checkImageURI(imageURI);
      if (chkImageURI == "notfound") {
        if (i == 0) {
          console.log('come in i = 0');
          server = myService.configAPI.webserviceURL + 'webservices/updatePicproduct.php?imgname=' + $scope.fullname0;
          $cordovaFileTransfer.upload(server, imageURI, options2);
          $http({
            url: myService.configAPI.webserviceURL + 'webservices/updateProduct.php',
            method: 'POST',
            data: {
              var_id: $scope.form.productid,
              var_productname: $scope.form.productname,
              var_productdetail: $scope.form.productdetail,
              var_shopid: $scope.form.shopid
            }
          }).then(function(response) {
            i = i + 1;
            updateProductPic(callback);
          }, function(error) {
            console.log(error);
          });
        } else {
          if (($scope['fullname'+i]) != "") {
            console.log('fullname not null');
            server = myService.configAPI.webserviceURL + 'webservices/updatePicproduct.php?imgname=' + $scope.fullname + i;
            $scope.imagename[i] = $scope['fullname'+i];
            $cordovaFileTransfer.upload(server, imageURI, options2);
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/updateProduct.php',
              method: 'POST',
              data: {
                var_id: $scope.form.productid,
                var_productname: $scope.form.productname,
                var_productdetail: $scope.form.productdetail,
                var_shopid: $scope.form.shopid
              }
            }).then(function(response) {
              i = i + 1;
              updateProductPic(callback);
            }, function(error) {
              console.log(error);
            });
          } else {
            console.log('fullname null');
            server = myService.configAPI.webserviceURL + 'webservices/updatePicproduct2.php';
            $cordovaFileTransfer.upload(server, imageURI, options2)
              .then(function(response) {
                $scope.imgname = response.response;
                $scope.imgname = $scope.imgname.replace(/\s/g, '');
                $http({
                  url: myService.configAPI.webserviceURL + 'webservices/updateProduct2.php',
                  method: 'POST',
                  data: {
                    var_id: $scope.form.productid,
                    var_productname: $scope.form.productname,
                    var_productpic: $scope.imgname,
                    var_productdetail: $scope.form.productdetail,
                    var_shopid: $scope.form.shopid
                  }
                }).then(function(response) {
                  i = i + 1;
                  updateProductPic(callback);
                }, function(error) {
                  console.log(error);
                });
              }, function(error) {
                console.log(error);
              });
          }
        }
      } else {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/updatePicproduct3.php',
          method: 'POST',
          data: {
            var_productid: $scope.form.productid,
            var_picname: myService.editproduct['product_pic' + i],
            var_i: i
          }
        }).then(function(response) {
          console.log(response);
          i = i + 1;
          updateProductPic(callback);
        }, function(error){
          console.log(error);
        });
      }
    }
  }

  $scope.btnUpdate = function() {
    if (($scope.form.productname != null) && ($scope.form.productname != "")) {
      if (($scope.form.productdetail != null) && ($scope.form.productdetail != "")) {
        updateProductPic(function(status) {});
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "แก้ไขข้อมูลสินค้าสำเร็จ !",
              content: "คุณได้ทำการแก้ไข และบันทึกข้อมูลสินค้าสำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $state.go('app2.shop');
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
  };
});

appControllers.controller('profileCtrl', function(myService, $scope, $cordovaFileTransfer, $cordovaCamera, $http, $mdDialog, $state, $ionicHistory) {
  $scope.form = {};
  $scope.form.profilepic = myService.configAPI.webserviceURL + 'img/img_profile/' + myService.passDataObject.member_username + '.jpg?random+\=' + Math.random();
  $scope.form.txt_id = myService.passDataObject.member_id;
  $scope.form.txt_username = myService.passDataObject.member_username;
  $scope.form.txt_firstname = myService.passDataObject.member_firstname;
  $scope.form.txt_lastname = myService.passDataObject.member_lastname;
  $scope.form.txt_mobile = myService.passDataObject.member_mobile;
  $scope.form.txt_email = myService.passDataObject.member_email;
  $scope.form.txt_facebook = myService.passDataObject.member_facebook;
  $scope.form.txt_line = myService.passDataObject.member_line;

  $scope.btnUpdate = function() {
    var englishnumber = /^[0-9a-zA-Z]+$/;
    var number = /^[0-9]+$/;
    if (($scope.form.txt_firstname != null) && ($scope.form.txt_firstname != "")) {
      if (($scope.form.txt_mobile != null) && ($scope.form.txt_mobile != "")) {
        if (number.test($scope.form.txt_mobile)) {
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
            url: myService.configAPI.webserviceURL + 'webservices/updateMember.php',
            method: 'POST',
            data: {
              var_id: $scope.form.txt_id,
              var_username: $scope.form.txt_username,
              var_password: $scope.form.txt_password,
              var_firstname: $scope.form.txt_firstname,
              var_lastname: $scope.form.txt_lastname,
              var_mobile: $scope.form.txt_mobile,
              var_email: $scope.form.txt_email,
              var_facebook: $scope.form.txt_facebook,
              var_line: $scope.form.txt_line
            }
          }).then(function(response) {
            myService.passDataObject = response.data.results[0];
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "บันทึกโปรไฟล์สำเร็จ !",
                  content: "คุณได้ทำการแก้ไข และบันทึกโปรไฟล์สำเร็จ",
                  ok: "ตกลง"
                }
              }
            }).then(function(response) {
              $state.go('app2.home');
            });
          }, function(error) {
            console.log(error);
          });
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
            title: "ชื่อจริงไม่ถูกต้อง !",
            content: "กรุณากรอกชื่อจริง",
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
    }, function(err) {
      // error
    });
  };
});

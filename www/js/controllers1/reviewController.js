appControllers.controller('reviewCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, myService, $mdDialog, $http, $stateParams, $ionicNavBarDelegate, $cordovaCamera, $cordovaFileTransfer) {
  $scope.toggleLeft = buildToggler('left');
  $scope.review = {};
  $scope.star = 0;

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

  $scope.btnReviewShop = function() {
    if (($scope.review.detail != null) && ($scope.review.detail != "")) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/checkReview.php',
        method: 'POST',
        data: {
          var_memberid: myService.passDataObject.member_id,
          var_shopid: myService.passDataObject2.shop_id
        }
      }).then(function(response) {
        if (response.data.results == 'nothave_review') {
          var img = document.getElementById('myImage');
          var imageURI = img.src;
          var chkImageURI = checkImageURI(imageURI);
          if (chkImageURI == "notfound") {
            var server = myService.configAPI.webserviceURL + 'webservices/uploadReviewPic.php';
            var trustHosts = true;
            var options2 = {
              fileKey: "myCameraImg",
              fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
              mimeType: "image/jpeg",
              chunkedMode: false
            };
            $cordovaFileTransfer.upload(server, imageURI, options2)
              .then(function(response) {
                $scope.imgname = response.response;
                $scope.imgname = $scope.imgname.replace(/\s/g, '');
                $http({
                  url: myService.configAPI.webserviceURL + 'webservices/addReviewHavePic.php',
                  method: 'POST',
                  data: {
                    var_memberid: myService.passDataObject.member_id,
                    var_shopid: myService.passDataObject2.shop_id,
                    var_reviewdetail: $scope.review.detail,
                    var_rating: $scope.star,
                    var_imgname: $scope.imgname
                  }
                }).then(function(response) {
                  $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    locals: {
                      displayOption: {
                        title: "รีวิวร้านค้าสำเร็จ !",
                        content: "รีวิวร้านค้าสำเร็จ ระบบจะนำไปสู่หน้ารีวิวร้านค้า",
                        ok: "ตกลง"
                      }
                    }
                  }).then(function(response) {
                    $state.go('app2.detail');
                  }, function(error) {
                    console.log(error);
                  });
                }, function(error) {
                  console.log(error);
                });
              }, function(error) {
                console.log(error);
              });
          } else {
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/addReview.php',
              method: 'POST',
              data: {
                var_memberid: myService.passDataObject.member_id,
                var_shopid: myService.passDataObject2.shop_id,
                var_reviewdetail: $scope.review.detail,
                var_rating: $scope.star
              }
            }).then(function(response) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "รีวิวร้านค้าสำเร็จ !",
                    content: "รีวิวร้านค้าสำเร็จ ระบบจะนำไปสู่หน้ารีวิวร้านค้า",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                $state.go('app2.detail');
              }, function(error) {
                console.log(error);
              });
            }, function(error) {
              console.log(error);
            });
          }
        } else {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "รีวิวร้านค้าไม่ถูกต้อง !",
                content: "คุณได้ทำการรีวิวร้านค้านี้ไปแล้ว",
                ok: "ตกลง"
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
            title: "ข้อความรีวิวร้านค้าไม่ถูกต้อง !",
            content: "กรุณากรอกข้อความรีวิวร้านค้า",
            ok: "ตกลง"
          }
        }
      });
    }
  };

  $scope.myTitle = 'IONIC RATINGS DEMO';

  $scope.ratingsObject = {
    iconOn: 'ion-ios-star', //Optional
    iconOff: 'ion-ios-star-outline', //Optional
    iconOnColor: 'rgb(200, 200, 100)', //Optional
    iconOffColor: 'rgb(200, 100, 100)', //Optional
    rating: 0, //Optional
    minRating: 0, //Optional
    readOnly: false, //Optional
    callback: function(rating, index) { //Mandatory
      $scope.ratingsCallback(rating, index);
    }
  };

  $scope.ratingsCallback = function(rating, index) {
    console.log('Selected rating is : ', rating, ' and index is ', index);
    $scope.star = rating;
  };

  $scope.btnReviewPicByGallery = function() {
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
      console.log(err);
    });
  };
});

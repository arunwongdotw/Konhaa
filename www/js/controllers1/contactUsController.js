appControllers.controller('contactUsCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, $mdDialog, myService, $ionicModal, $ionicScrollDelegate, $http) {
  $scope.toggleLeft = buildToggler('left');
  $scope.contactus = {};

  $http({
    url: myService.configAPI.webserviceURL + 'webservices/getReportList.php',
    method: 'POST',
    data: {
      var_memberid: myService.passDataObject.member_id
    }
  }).then(function(response) {
    $scope.reportArrayList = response.data.results;
  }, function(error) {
    console.log(error);
  });

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

  $scope.btnReport = function() {
    if (($scope.contactus.title != null) && ($scope.contactus.title != "")) {
      if (($scope.contactus.detail != null) && ($scope.contactus.detail != "")) {
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/addReport.php',
          method: 'POST',
          data: {
            var_memberid: myService.passDataObject.member_id,
            var_title: $scope.contactus.title,
            var_detail: $scope.contactus.detail
          }
        }).then(function(response) {
          if (response.data.results == "report_full") {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "รายงานปัญหาเกินจำนวนที่กำหนด !",
                  content: "ชื่อผู้ใช้นี้รายงานปัญหาเกินจำนวนที่กำหนด กรุณารายงานใหม่ภายหลัง",
                  ok: "ตกลง"
                }
              }
            });
          } else {
            $mdDialog.show({
              controller: 'DialogController',
              templateUrl: 'confirm-dialog.html',
              locals: {
                displayOption: {
                  title: "รายงานปัญหาสำเร็จ !",
                  content: "คุณได้รายงานปัญหาสำเร็จ",
                  ok: "ตกลง"
                }
              }
            }).then(function(){
              $state.reload();
            }, function(){

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
              title: "รายละเอียดไม่ถูกต้อง !",
              content: "กรุณากรอกรายละเอียดปัญหา",
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
            title: "หัวข้อไม่ถูกต้อง !",
            content: "กรุณากรอกหัวข้อรายงานปัญหา",
            ok: "ตกลง"
          }
        }
      });
    }
  };

  $scope.ownerImage = [{
    src: 'http://www.smartonline.info/images/logo.jpg'
  }];

  $scope.zoomMin = 1;

  $scope.showOwnerImages = function(index) {
    $scope.activeSlide = index;
    $scope.showModal('templates/templates1/ownerzoomview.html');
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

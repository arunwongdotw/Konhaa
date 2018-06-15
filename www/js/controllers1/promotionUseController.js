appControllers.controller('promotionUseCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, $http, myService, $ionicModal, $mdDialog, $cordovaBarcodeScanner) {
  $scope.toggleLeft = buildToggler('left');
  $scope.check = {};
  $scope.add = {};
  $scope.show1 = false;
  $scope.show2 = false;
  $scope.show3 = false;

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

  $scope.btnCheckPromotion = function() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkPromotionMember.php',
      method: 'POST',
      data: {
        var_username: $scope.check.username,
        var_shopmemberid: myService.passDataObject.member_id
      }
    }).then(function(response) {
      if (response.data.results == null) {
        $scope.PromotionListArray = {};
        $scope.show1 = true;
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/getMemberidInCaseNotHavePromotion.php',
          method: 'POST',
          data: {
            var_username: $scope.check.username
          }
        }).then(function(response) {
          myService.memberidInCaseMemberNotHavePromotion = response.data.results[0].member_id;
          $scope.show2 = true;
        });
      } else if (response.data.results == "checkPromotionMember_notfound") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ไม่พบชื่อผู้ใช้ (Username) นี้อยู่ในระบบ !",
              content: "ชื่อผู้ใช้ (Username) ที่กรอก ไม่มีอยู่ในระบบ กรุณากรอกใหม่",
              ok: "ตกลง"
            }
          }
        });
        $scope.PromotionListArray = {};
        $scope.show1 = false;
      } else {
        $scope.PromotionListArray = response.data.results;
        $scope.today = new Date();
        for (var i = 0; i < $scope.PromotionListArray.length; i++) {
          var enddate = new Date($scope.PromotionListArray[i].promotion_end_date);
          enddate.setHours(enddate.getHours() + 17);
          $scope.PromotionListArray[i].enddate = enddate;
        }
        $scope.show1 = false;
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnCheckPromotion ใน promotionUseController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  function btnCheckPromotion() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkPromotionMember.php',
      method: 'POST',
      data: {
        var_username: $scope.check.username,
        var_shopmemberid: myService.passDataObject.member_id
      }
    }).then(function(response) {
      if (response.data.results == null) {
        $scope.PromotionListArray = {};
        $scope.show1 = true;
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/getMemberidInCaseNotHavePromotion.php',
          method: 'POST',
          data: {
            var_username: $scope.check.username
          }
        }).then(function(response) {
          myService.memberidInCaseMemberNotHavePromotion = response.data.results[0].member_id;
          $scope.show2 = true;
        });
      } else if (response.data.results == "checkPromotionMember_notfound") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ไม่พบชื่อผู้ใช้ (Username) นี้อยู่ในระบบ !",
              content: "ชื่อผู้ใช้ (Username) ที่กรอก ไม่มีอยู่ในระบบ กรุณากรอกใหม่",
              ok: "ตกลง"
            }
          }
        });
        $scope.PromotionListArray = {};
        $scope.show1 = false;
      } else {
        $scope.PromotionListArray = response.data.results;
        $scope.show1 = false;
      }
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnCheckPromotion ใน promotionUseController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  $scope.btnAddFreq = function(promotion_id, member_id, member_promotion_id, mp_frequency) {
    var obj = {
      member_promotion_id: member_promotion_id,
      mp_frequency: mp_frequency
    };
    myService.mpFrequency = obj;
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/getDetailToAddFreq.php',
      method: 'POST',
      data: {
        var_promotionid: promotion_id,
      }
    }).then(function(response) {
      myService.addFreqDetail = response.data.results[0];
      $state.go('app2.addfreq');
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด btnAddFreq ใน promotionUseController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.btnUsePromotion = function(member_promotion_id, mp_frequency, promotion_frequency) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ใช้สิทธิ์โปรโมชั่นนี้ ?",
          content: "คุณแน่ใจที่จะใช้สิทธิ์โปรโมชั่นนี้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      $http({
        url: myService.configAPI.webserviceURL + 'webservices/usePromotion.php',
        method: 'POST',
        data: {
          var_memberpromotionid: member_promotion_id,
          var_mpfrequency: mp_frequency,
          var_frequency: promotion_frequency
        }
      }).then(function(response) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ใช้สิทธิ์โปรโมชั่นสำเร็จ !",
              content: "คุณได้ใช้สิทธิ์โปรโมชั่นสำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function() {
          $state.reload();
        });
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnUsePromotion ใน promotionUseController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
    });
  };

  $scope.btnCheckCode = function() {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/checkCode.php',
      method: 'POST',
      data: {
        var_code: $scope.check.code
      }
    }).then(function(response) {
      if (response.data.results == "checkCode_notfound") {
        $scope.show3 = false;
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "โค้ดแนะนำร้านค้าไม่ถูกต้อง !",
              content: "ไม่พบโค้ดแนะนำร้านค้าที่ท่านกรอก กรุณากรอกใหม่",
              ok: "ตกลง"
            }
          }
        });
      } else {
        $scope.codememberid = response.data.results[0].member_id;
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/getPromotionType3.php',
          method: 'POST',
          data: {
            var_shopid: myService.shopid.shop_id
          }
        }).then(function(response) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "โค้ดแนะนำร้านค้าถูกต้อง !",
                content: "พบโค้ดแนะนำร้านค้าระบบ กรุณาเลือกโปรโมชั่นที่ต้องการใช้โค้ด",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            if (response.data.results == "getPromotionType3_notfound") {
              $scope.show3 = true;
              $scope.promotionType3Array = {};
            } else {
              $scope.show3 = false;
              $scope.promotionType3Array = response.data.results;
            }
          });
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด btnCheckCode ใน promotionUseController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
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
            content: "เกิดข้อผิดพลาด btnCheckCode ใน promotionUseController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.btnUseCode = function(promotion_id) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/addCode.php',
      method: 'POST',
      data: {
        var_promotionid: promotion_id,
        var_code: $scope.check.code,
        var_codememberid: $scope.codememberid
      }
    }).then(function(response) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ใช้งานโค้ดแนะนำร้านค้าสำเร็จ !",
            content: "คุณใช้งานโค้ดแนะนำร้านค้าสำเร็จ",
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
            content: "เกิดข้อผิดพลาด btnCheckCode ใน promotionUseController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  };

  $scope.btnAddPromotionToMember = function() {
    $state.go('app2.addpromotiontomember');
  };

  $scope.btnScan = function() {
    $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        $scope.check.username = barcodeData.text;
        btnCheckPromotion();
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด btnScan ใน promotionUseController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  };
});

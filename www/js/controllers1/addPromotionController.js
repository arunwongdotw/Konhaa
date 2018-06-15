appControllers.controller('addPromotionCtrl', function(ionicDatePicker, $scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, $http, myService, $mdDialog) {
  $scope.member_id = myService.passDataObject.member_id;
  $scope.promotion = {};
  $scope.mdSelectValue = "1";
  $scope.freqname = "จำนวนชิ้น/ครั้ง ที่ได้รับโปรโมชั่น (ซื้อครบ...ชิ้น/ครั้ง)";
  $scope.freqplaceholder = "จำนวนชิ้น/ครั้ง (ตัวอย่างการกรอก 10) *";
  $scope.freename = "โปรโมชั่น ฟรี (ฟรี...ชิ้น/ครั้ง)";
  $scope.freeplaceholder = "จำนวนชิ้น/ครั้ง (ตัวอย่างการกรอก 1) *";
  $scope.selectedDate = "เลือกวันหมดอายุโปรโมชั่น *";

  $http.get('http://1did.net/centerapp/webservices/getPromotionType.php')
    .then(function(response) {
      $scope.promotionTypeArray = response.data.results;
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getPromotionType.php ใน addPromotionController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });

  $scope.setDetail = function(promotion_type_id) {
    if (promotion_type_id == "1") {
      $scope.mdSelectValue = promotion_type_id;
      $scope.freqname = "จำนวนชิ้น/ครั้ง ที่ได้รับโปรโมชั่น (ซื้อครบ...ชิ้น/ครั้ง)";
      $scope.freqplaceholder = "จำนวนชิ้น/ครั้ง (ตัวอย่างการกรอก 10) *";
      $scope.freename = "โปรโมชั่น ฟรี (ฟรี...ชิ้น/ครั้ง)";
      $scope.freeplaceholder = "จำนวนชิ้น/ครั้ง (ตัวอย่างการกรอก 1) *";
    } else if (promotion_type_id == "2") {
      $scope.mdSelectValue = promotion_type_id;
      $scope.freqname = "จำนวนเงิน ที่ได้รับโปรโมชั่น (ซื้อครบ...บาท)";
      $scope.freqplaceholder = "บาท (ตัวอย่างการกรอก 2000) *";
      $scope.freename = "โปรโมชั่น ฟรี (ฟรี...)";
      $scope.freeplaceholder = "สิ่งที่ฟรี/จำนวน (ตัวอย่างการกรอก พัดลม 1 ตัว) *";
    } else {
      $scope.mdSelectValue = promotion_type_id;
      $scope.freqname = "จำนวนครั้งที่แนะนำร้านค้า";
      $scope.freqplaceholder = "จำนวนครั้ง (ตัวอย่างการกรอก 10) *";
      $scope.freename = "โปรโมชั่น ฟรี (ฟรี...)";
      $scope.freeplaceholder = "สิ่งที่ฟรี/จำนวน (ตัวอย่างการกรอก พัดลม 1 ตัว) *";
    }
  };

  var ipObj1 = {
    callback: function(val) { //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.promotion.enddate = new Date(val + 25200000).toISOString().slice(0, 19).replace('T', ' ');
    },
    from: new Date(2018, 1, 1), //Optional
    to: new Date(2020, 10, 30), //Optional
    inputDate: new Date(), //Optional
    mondayFirst: true, //Optional
    // disableWeekdays: [0],       //Optional
    closeOnSelect: false, //Optional
    templateType: 'popup' //Optional
  };

  $scope.openDatePicker = function() {
    ionicDatePicker.openDatePicker(ipObj1);
  };

  $scope.btnAddPromotion = function() {
    var number = /^[0-9]+$/;
    if ($scope.mdSelectValue == 1) {
      if (($scope.promotion.name != null) && ($scope.promotion.name != "")) {
        if (($scope.promotion.detail != null) && ($scope.promotion.detail != "")) {
          if (($scope.promotion.freq != null) && ($scope.promotion.freq != "")) {
            if (number.test($scope.promotion.freq)) {
              if (($scope.promotion.free != null) && ($scope.promotion.free != "")) {
                if (number.test($scope.promotion.free)) {
                  if (($scope.promotion.enddate != null) && ($scope.promotion.enddate != "")) {
                    $http({
                      url: myService.configAPI.webserviceURL + 'webservices/addPromotion.php',
                      method: 'POST',
                      data: {
                        var_memberid: $scope.member_id,
                        var_name: $scope.promotion.name,
                        var_detail: $scope.promotion.detail,
                        var_freq: $scope.promotion.freq,
                        var_free: $scope.promotion.free,
                        var_enddate: $scope.promotion.enddate,
                        var_promotiontypeid: $scope.mdSelectValue
                      }
                    }).then(function(response) {
                      $mdDialog.show({
                        controller: 'DialogController',
                        templateUrl: 'confirm-dialog.html',
                        locals: {
                          displayOption: {
                            title: "เพิ่มโปรโมชั่นสำเร็จ !",
                            content: "คุณเพิ่มโปรโมชั่นให้กับร้านค้าสำเร็จ",
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
                            content: "เกิดข้อผิดพลาด btnAddPromotion ใน addPromotionController ระบบจะปิดอัตโนมัติ",
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
                          title: "วันหมดเขตโปรโมชั่นไม่ถูกต้อง !",
                          content: "กรุณากรอกวันหมดเขตโปรโมชัน",
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
                        title: "โปรโมชั่น ฟรี ไม่ถูกต้อง !",
                        content: "โปรโมชั่น ฟรี ต้องเป็นตัครั้งต้องเป็นตัวเลขเท่านั้น",
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
                      title: "โปรโมชั่น ฟรี ไม่ถูกต้อง !",
                      content: "กรุณากรอกโปรโมชั่น ฟรี",
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
                    title: "จำนวนชิ้น/ครั้ง ไม่ถูกต้อง !",
                    content: "จำนวนชิ้น/ครั้งต้องเป็นตัวเลขเท่านั้น",
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
                  title: "จำนวนชิ้น/ครั้ง ไม่ถูกต้อง !",
                  content: "กรุณากรอกจำนวนชิ้น/ครั้ง",
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
                title: "คำอธิบายโปรโมชั่นไม่ถูกต้อง !",
                content: "กรุณากรอกคำอธิบายโปรโมชั่นง",
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
              title: "ชื่อโปรโมชั่นไม่ถูกต้อง !",
              content: "กรุณากรอกชื่อโปรโมชั่น",
              ok: "ตกลง"
            }
          }
        });
      }
    } else if ($scope.mdSelectValue == 2) {
      if (($scope.promotion.name != null) && ($scope.promotion.name != "")) {
        if (($scope.promotion.detail != null) && ($scope.promotion.detail != "")) {
          if (($scope.promotion.freq != null) && ($scope.promotion.freq != "")) {
            if (number.test($scope.promotion.freq)) {
              if (($scope.promotion.free != null) && ($scope.promotion.free != "")) {
                if (($scope.promotion.enddate != null) && ($scope.promotion.enddate != "")) {
                  $http({
                    url: myService.configAPI.webserviceURL + 'webservices/addPromotion.php',
                    method: 'POST',
                    data: {
                      var_memberid: $scope.member_id,
                      var_name: $scope.promotion.name,
                      var_detail: $scope.promotion.detail,
                      var_freq: $scope.promotion.freq,
                      var_free: $scope.promotion.free,
                      var_enddate: $scope.promotion.enddate,
                      var_promotiontypeid: $scope.mdSelectValue
                    }
                  }).then(function(response) {
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: "เพิ่มโปรโมชั่นสำเร็จ !",
                          content: "คุณเพิ่มโปรโมชั่นให้กับร้านค้าสำเร็จ",
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
                          content: "เกิดข้อผิดพลาด btnAddPromotion ใน addPromotionController ระบบจะปิดอัตโนมัติ",
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
                        title: "วันหมดเขตโปรโมชั่นไม่ถูกต้อง !",
                        content: "กรุณากรอกวันหมดเขตโปรโมชัน",
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
                      title: "โปรโมชั่น ฟรี ไม่ถูกต้อง !",
                      content: "กรุณากรอกโปรโมชั่น ฟรี",
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
                    title: "จำนวนชิ้น/ครั้ง ไม่ถูกต้อง !",
                    content: "จำนวนชิ้น/ครั้งต้องเป็นตัวเลขเท่านั้น",
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
                  title: "จำนวนชิ้น/ครั้ง ไม่ถูกต้อง !",
                  content: "กรุณากรอกจำนวนชิ้น/ครั้ง",
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
                title: "คำอธิบายโปรโมชั่นไม่ถูกต้อง !",
                content: "กรุณากรอกคำอธิบายโปรโมชั่นง",
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
              title: "ชื่อโปรโมชั่นไม่ถูกต้อง !",
              content: "กรุณากรอกชื่อโปรโมชั่น",
              ok: "ตกลง"
            }
          }
        });
      }
    } else {
      if (($scope.promotion.name != null) && ($scope.promotion.name != "")) {
        if (($scope.promotion.detail != null) && ($scope.promotion.detail != "")) {
          if (($scope.promotion.freq != null) && ($scope.promotion.freq != "")) {
            if (number.test($scope.promotion.freq)) {
              if (($scope.promotion.free != null) && ($scope.promotion.free != "")) {
                if (($scope.promotion.enddate != null) && ($scope.promotion.enddate != "")) {
                  $http({
                    url: myService.configAPI.webserviceURL + 'webservices/addPromotion.php',
                    method: 'POST',
                    data: {
                      var_memberid: $scope.member_id,
                      var_name: $scope.promotion.name,
                      var_detail: $scope.promotion.detail,
                      var_freq: $scope.promotion.freq,
                      var_free: $scope.promotion.free,
                      var_enddate: $scope.promotion.enddate,
                      var_promotiontypeid: $scope.mdSelectValue
                    }
                  }).then(function(response) {
                    $mdDialog.show({
                      controller: 'DialogController',
                      templateUrl: 'confirm-dialog.html',
                      locals: {
                        displayOption: {
                          title: "เพิ่มโปรโมชั่นสำเร็จ !",
                          content: "คุณเพิ่มโปรโมชั่นให้กับร้านค้าสำเร็จ",
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
                          content: "เกิดข้อผิดพลาด btnAddPromotion ใน addPromotionController ระบบจะปิดอัตโนมัติ",
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
                        title: "วันหมดเขตโปรโมชั่นไม่ถูกต้อง !",
                        content: "กรุณากรอกวันหมดเขตโปรโมชัน",
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
                      title: "โปรโมชั่น ฟรี ไม่ถูกต้อง !",
                      content: "กรุณากรอกโปรโมชั่น ฟรี",
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
                    title: "จำนวนชิ้น/ครั้ง ไม่ถูกต้อง !",
                    content: "จำนวนชิ้น/ครั้งต้องเป็นตัวเลขเท่านั้น",
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
                  title: "จำนวนชิ้น/ครั้ง ไม่ถูกต้อง !",
                  content: "กรุณากรอกจำนวนชิ้น/ครั้ง",
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
                title: "คำอธิบายโปรโมชั่นไม่ถูกต้อง !",
                content: "กรุณากรอกคำอธิบายโปรโมชั่นง",
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
              title: "ชื่อโปรโมชั่นไม่ถูกต้อง !",
              content: "กรุณากรอกชื่อโปรโมชั่น",
              ok: "ตกลง"
            }
          }
        });
      }
    }
  };

  $scope.detailExplain = function() {
    if ($scope.mdSelectValue == 1) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "คำอธิบายโปรโมชั่น",
            content: "ควรอธิบายโปรโมชั่นให้ลูกค้าเข้าใจอย่างละเอียด (ตัวอย่าง ซื้อน้ำหอมครบ 10 ชิ้น ฟรีน้ำหอม 1 ชิ้น)",
            ok: "ตกลง"
          }
        }
      });
    } else if ($scope.mdSelectValue == 2) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "คำอธิบายโปรโมชั่น",
            content: "ควรอธิบายโปรโมชั่นให้ลูกค้าเข้าใจอย่างละเอียด (ตัวอย่าง ซื้อสินค้าครบ 1000 บาท ฟรีพัดลม 1 ตัว)",
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
            title: "คำอธิบายโปรโมชั่น",
            content: "ควรอธิบายโปรโมชั่นให้ลูกค้าเข้าใจอย่างละเอียด (ตัวอย่าง แนะนำร้านค้าครบ 10 ครั้ง ฟรีสินค้า 1 ชิ้น)",
            ok: "ตกลง"
          }
        }
      });
    }
  };

  $scope.typeExplain = function() {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ประเภทโปรโมชั่น",
          content: "ควรเลือกโปรโมชั่นให้ตรงตามความต้องการ",
          ok: "ตกลง"
        }
      }
    });
  };

  $scope.freqExplain = function() {
    if ($scope.mdSelectValue == 1) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เงื่อนไขในการรับโปรโมชั่น",
            content: "จำนวนครั้งของการซื้อสินค้า/จำนวนครั้งของการซื้อบริการ (ตัวอย่าง ซื้อน้ำหอม 10 ชิ้น)",
            ok: "ตกลง"
          }
        }
      });
    } else if ($scope.mdSelectValue == 2) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เงื่อนไขในการรับโปรโมชั่น",
            content: "จำนวนเงินของการซื้อสินค้า/บริการ (ตัวอย่าง ซื้อสินค้าครบ 1000 บาท)",
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
            title: "เงื่อนไขในการรับโปรโมชั่น",
            content: "จำนวนครั้งของการแนะนำร้านค้า (ตัวอย่าง แนะนำร้านครบ 10 ครั้ง)",
            ok: "ตกลง"
          }
        }
      });
    }
  };

  $scope.freeExplain = function() {
    if ($scope.mdSelectValue == 1) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "สิ่งที่ได้จากโปรโมชั่น",
            content: "สิ่งที่ได้จากการครบเงื่อนไขรับโปรโมชั่น (ตัวอย่าง ฟรี สินค้า/บริการ 1 ชิ้น/ครั้ง)",
            ok: "ตกลง"
          }
        }
      });
    } else if ($scope.mdSelectValue == 2) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "สิ่งที่ได้จากโปรโมชั่น",
            content: "สิ่งที่ได้จากการครบเงื่อนไขรับโปรโมชั่น (ตัวอย่าง ฟรี สินค้า/บริการ 1 ชิ้น/ครั้ง)",
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
            title: "สิ่งที่ได้จากโปรโมชั่น",
            content: "สิ่งที่ได้จากการครบเงื่อนไขรับโปรโมชั่น (ตัวอย่าง ฟรี สินค้า/บริการ 1 ชิ้น/ครั้ง)",
            ok: "ตกลง"
          }
        }
      });
    }
  };

  $scope.btnBack = function() {
    navigator.app.backHistory();
  };
});

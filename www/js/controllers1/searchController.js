appControllers.controller('searchController', function($scope, $state, $http, myService, deviceService, $rootScope, $ionicPopup, $ionicPlatform, $mdDialog, $timeout, $mdSidenav, $ionicHistory, $stateParams) {
  var k = 0;
  var i = 0;
  var iloopp = 0;
  var jloopp = 0;
  var randomnumber;
  var randomarray = [];
  $scope.form = {};
  $scope.current = {};
  $scope.apiresponse = {};
  $scope.shopdistance = {};
  $scope.shopdistancevalue = {};
  $scope.mapStatus = false;
  $scope.form.txt_Search = deviceService.passValueFromHome;
  $scope.currState = $state;
  var currentState = $state.current.name;

  $scope.btnRefresh = function() {
    $state.reload();
  };

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

  $scope.btnBack = function() {
    if ($state.current.name == "app1.search") {
      $scope.navigateTo('app1.home');
    } else {
      $scope.navigateTo('app2.home');
    }
  };

  function getSearchList(callback) {
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/ws_se.php',
      method: 'POST',
      data: {
        var_txt_Search: $scope.form.txt_Search
      }
    }).then(function(response) {
      $scope.items = response.data.results;
      for (var i = 0; i < $scope.items.length; i++) {
        $scope.items[i].img = myService.configAPI.webserviceURL + 'img/img_shop/' + $scope.items[i].img + '?random+\=' + Math.random();
      }
      callback($scope.items);
    }, function(error) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "เกิดข้อผิดพลาด !",
            content: "เกิดข้อผิดพลาด getSearchList ใน searchController ระบบจะปิดอัตโนมัติ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        ionic.Platform.exitApp();
      });
    });
  }

  function getCurrentLocation(callback) {
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
                    $scope.current.latitude = data.latitude;
                    $scope.current.longitude = data.longitude;
                    callback($scope.current);
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
                    $scope.current.latitude = data.latitude;
                    $scope.current.longitude = data.longitude;
                    callback($scope.current);
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
            $scope.current.latitude = data.latitude;
            $scope.current.longitude = data.longitude;
            callback($scope.current);
          }
        });
      }
    });
  }

  function getShopDistance(callback) {
    if (i < $scope.items.length) {
      var unit = "metric";
      var key = "AIzaSyB7S3HpwvFsXvFSzX2usM1aC-uxdJXSMbM";
      var origins = $scope.current.latitude + "," + $scope.current.longitude;
      var destinations = $scope.items[i].latitude + "," + $scope.items[i].longitude;
      $http.get('https://maps.googleapis.com/maps/api/distancematrix/json?unit=' + unit + '&origins=' + origins + '&destinations=' + destinations + '&key=' + key)
        .then(function(response) {
          $scope.shopdistance = response.data.rows[0].elements[0].distance.text;
          $scope.shopdistancevalue = response.data.rows[0].elements[0].distance.value;
          callback($scope.shopdistance, $scope.shopdistancevalue);
          i = i + 1;
          getShopDistance(callback);
        }, function(error) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "เกิดข้อผิดพลาด !",
                content: "เกิดข้อผิดพลาด getShopDistance ใน searchController ระบบจะปิดอัตโนมัติ",
                ok: "ตกลง"
              }
            }
          }).then(function(response) {
            ionic.Platform.exitApp();
          });
        });
    }
  }

  function addDistanceInItems(callback) {
    $scope.items[k].distancetext = $scope.shopdistance;
    $scope.items[k].distancevalue = $scope.shopdistancevalue;
    k = k + 1;
    callback($scope.items);
  }

  function sortItems(callback) {
    var n = $scope.items.length;
    for (var iloop = 0; iloop < n - 1; iloop++) {
      for (var jloop = 0; jloop < n - iloop - 1; jloop++) {
        if ($scope.items[jloop].distancevalue > $scope.items[jloop + 1].distancevalue) {
          var temp = $scope.items[jloop];
          $scope.items[jloop] = $scope.items[jloop + 1];
          $scope.items[jloop + 1] = temp;
        }
      }
    }
    callback($scope.items);
  }

  function getShopAdvertise(callback) {
    var key = "AIzaSyDgxSTLg26FVJeB8OQl1-WTjqOcZ4a8GKM";
    $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.current.latitude + ',' + $scope.current.longitude + '&key=' + key)
      .then(function(response) {
        for (var length = 0; length < response.data.results[0].address_components.length; length++) {
          if (response.data.results[0].address_components[length].types == "postal_code") {
            var postalcode = response.data.results[0].address_components[length].short_name;
            var twocharpostalcode = postalcode.substring(0, 2);
            $http({
              url: myService.configAPI.webserviceURL + 'webservices/getAdvertiseInMyProvince.php',
              method: 'POST',
              data: {
                var_provincecode: twocharpostalcode
              }
            }).then(function(response) {
              $scope.items2 = response.data.results;
              for (var i = 0; i < $scope.items2.length; i++) {
                $scope.items2[i].img = myService.configAPI.webserviceURL + 'img/img_shop/' + $scope.items2[i].img + '?random+\=' + Math.random();
              }
              callback($scope.items2);
            }, function(error) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เกิดข้อผิดพลาด !",
                    content: "เกิดข้อผิดพลาด getShopAdvertise ใน searchController ระบบจะปิดอัตโนมัติ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                ionic.Platform.exitApp();
              });
            });
          }
        }
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getShopAdvertise ใน searchController ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  function insertAdvertiseInShop(callback) {
    var n = $scope.items.length;
    var lengthofitems2 = $scope.items2.length;
    for (var iloop = 0; iloop <= n; iloop++) {
      // console.log("iloop -> " + iloop);
      if ((iloop % 3 == 0) && (iloop != 0)) {
        console.log(randomarray);
        randomnumber = Math.floor(Math.random() * lengthofitems2);
        console.log("random number -> " + randomnumber);
        for (var jloop = 0; jloop < randomarray.length; jloop++) {
          if (randomarray[jloop] == randomnumber) {
            randomnumber = Math.floor(Math.random() * lengthofitems2);
            console.log("new random number -> " + randomnumber);
          }
        }
        $scope.items2[randomnumber].advertise = "true";
        $scope.items.splice(iloop, 0, $scope.items2[randomnumber]);
        randomarray.push(randomnumber);
      }
    }
    callback($scope.items);
  }

  getSearchList(function(status) {
    if ($scope.items.length > 0) {
      getCurrentLocation(function(status) {
        getShopAdvertise(function(status) {
          getShopDistance(function(status) {
            addDistanceInItems(function(status) {
              sortItems(function(status) {});
            });
          });
        });
      });
      $timeout(function() {
        insertAdvertiseInShop(function(status) {});
      }, 8000);
    } else {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ไม่พบร้านค้าที่ค้นหา !",
            content: "ไม่พบร้านค้าที่คุณค้นหาในระบบ ลองค้นหาใหม่อีกครั้ง",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        if (Object.keys(myService.passDataObject).length === 0) {
          $state.go('app1.home');
        } else {
          $state.go('app2.home');
        }
      });
    }
  });

  $scope.btnDetail = function(record) {
    myService.passDataObject2 = record;
    if ($state.current.name == "app1.search") {
      $state.go('app1.detail');
    } else {
      $state.go('app2.detail');
    }
  };

  $scope.showMap = function(data) {
    $rootScope.gpsLocation = data;
    $rootScope.currentLocation = {
      cLatitude: $scope.current.latitude,
      cLongtitude: $scope.current.longitude
    };
    if (window.cordova) {
      deviceService.checkOnline(function(status) {
        if (status == 'online') {
          if (Object.keys(myService.passDataObject).length === 0) {
            $state.go('app1.map');
          } else {
            $state.go('app2.map');
          }
        }
      });
    } else {
      if (Object.keys(myService.passDataObject).length === 0) {
        $state.go('app1.map');
      } else {
        $state.go('app2.map');
      }
    }
  };

  // $scope.btnCurrentLocation = function() {
  //   deviceService.checkGPS(function(status) {
  //     if (status == 'GPS_OFF') {
  //       deviceService.checkPlatform(function(device) {
  //         if (device == 'android') {
  //           deviceService.androidGpsSetting(function(status) {
  //             if (status == 'force_gps') {
  //               deviceService.currentLocation(function(data) {
  //                 if (data != 'ERROR_POSITION') {
  //                   $rootScope.currentLocation = data;
  //                   $scope.mapStatus = true;
  //                   $ionicPopup.alert({
  //                     title: 'ตำแหน่งปัจจุบัน',
  //                     template: "lat : " + data.latitude +
  //                       "<br>" +
  //                       "lng : " + data.longitude
  //                   });
  //                 }
  //               });
  //             } else {
  //               deviceService.openSetting(function(status) {
  //                 console.log("openSetting -> " + status);
  //               });
  //             }
  //           });
  //         } else if (device == 'ios') {
  //           deviceService.openSetting(function(status) {
  //             if (status == 'OPENED_SETTING') {
  //               deviceService.currentLocation(function(data) {
  //                 if (data != 'ERROR_POSITION') {
  //                   $rootScope.currentLocation = data;
  //                   $scope.mapStatus = true;
  //                   $ionicPopup.alert({
  //                     title: 'ตำแหน่งปัจจุบัน',
  //                     template: "lat : " + data.latitude +
  //                       "<br>" +
  //                       "lng : " + data.longitude
  //                   });
  //                 }
  //               });
  //             }
  //           });
  //         } else {
  //           alert('ERROR Deivice not in ios & android');
  //         }
  //       });
  //     } else {
  //       deviceService.currentLocation(function(data) {
  //         if (data != 'ERROR_POSITION') {
  //           $rootScope.currentLocation = data;
  //           $scope.mapStatus = true;
  //           $ionicPopup.alert({
  //             title: 'ตำแหน่งปัจจุบัน',
  //             template: "lat : " + data.latitude +
  //               "<br>" +
  //               "lng : " + data.longitude
  //           });
  //         }
  //       });
  //     }
  //   });
  // };

  $scope.btnLaunchMap = function() {
    deviceService.launchMap($rootScope.currentLocation, $scope.myDataArray[3].position);
  };

  $ionicPlatform.registerBackButtonAction(function() {
    if (($state.current.name == "app1.home") || ($state.current.name == "app2.home")) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "คุณต้องการออกจากแอปพลิเคชัน ?",
            content: "คุณแน่ใจที่จะออกจากแอปพลิเคชันนี้",
            ok: "ตกลง",
            cancel: "ยกเลิก"
          }
        }
      }).then(function() {
        navigator.app.exitApp();
      }, function() {

      });
    } else {
      if (Object.keys(myService.passDataObject).length === 0) {
        $scope.navigateTo('app1.home');
      } else {
        $scope.navigateTo('app2.home');
      }
    }
  }, 100);
});

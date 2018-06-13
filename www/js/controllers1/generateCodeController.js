appControllers.controller('generateCodeCtrl', function($scope, $mdUtil, $mdSidenav, $timeout, $ionicHistory, $state, $http, myService, $cordovaClipboard, $mdDialog) {
  $scope.toggleLeft = buildToggler('left');

  $http({
    url: myService.configAPI.webserviceURL + 'webservices/getCodeList.php',
    method: 'POST',
    data: {
      var_memberid: myService.passDataObject.member_id
    }
  }).then(function(response) {
    console.log(response.data.results);
    $scope.codeArrayList = response.data.results;
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

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  $scope.btnCodeGenerate = function() {
    var date = new Date();
    var startdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    $http({
      url: myService.configAPI.webserviceURL + 'webservices/countCode.php',
      method: 'POST',
      data: {
        var_memberid: myService.passDataObject.member_id,
        var_startdate: startdate
      }
    }).then(function(response) {
      console.log(response.data.results);
      if (response.data.results == "countRow_moreThan10") {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "โค้ดที่สร้างเกินจำนวนที่กำหนด !",
              content: "คุณสามารถสร้างโค้ดแนะนำร้านค้าได้ 10 โค้ดต่อวัน",
              ok: "ตกลง"
            }
          }
        });
      } else {
        $scope.code = makeid();
        var enddate = date.getFullYear() + "-" + (date.getMonth() + 1 + 3) + "-" + date.getDate();
        $http({
          url: myService.configAPI.webserviceURL + 'webservices/recordCode.php',
          method: 'POST',
          data: {
            var_memberid: myService.passDataObject.member_id,
            var_code: $scope.code,
            var_startdate: startdate,
            var_enddate: enddate
          }
        }).then(function(response) {
          $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            locals: {
              displayOption: {
                title: "สร้างโค้ดแนะนำร้านค้าสำเร็จ !",
                content: "คุณสร้างโค้ดแนะนำร้านค้าสำเร็จ สามารถกดปุ่ม COPY ข้างล่างเพื่อนำไปใช้งานได้",
                ok: "ตกลง"
              }
            }
          });
        }, function(error){
          console.log(error);
        });
      }
    }, function(error){
      console.log(error);
    });
  };

  $scope.copyText = function(value) {
    $cordovaClipboard.copy(value)
      .then(function() {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "คัดลอกโค้ดสำเร็จ !",
              content: "คุณคัดลอกโค้ดสำเร็จ สามารถนำไปใช้งานได้",
              ok: "ตกลง"
            }
          }
        });
      }, function() {
        console.error('error');
      });
  };
});

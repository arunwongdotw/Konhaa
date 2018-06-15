appControllers.controller('listChat2Ctrl', function($scope, $state, $ionicPopup, $ionicScrollDelegate, myService, $http, $mdBottomSheet, $mdDialog) {
  $ionicScrollDelegate.scrollBottom(true);
  $scope.member_id = window.localStorage.username;
  var array = {};
  var array2 = [];
  var i = 0;

  $scope.btnChat = function(data) {
    myService.passDataObject2.shop_id = data;
    $state.go('app2.chatfirebase');
  };

  $scope.btnDelShopChat = function(record) {
    $mdDialog.show({
      controller: 'DialogController',
      templateUrl: 'confirm-dialog.html',
      locals: {
        displayOption: {
          title: "ลบประวัติการแชทกับร้านค้านี้ ?",
          content: "คุณแน่ใจที่จะลบประวัติการแชทกับร้านค้านี้",
          ok: "ตกลง",
          cancel: "ยกเลิก"
        }
      }
    }).then(function(response) {
      var node = myService.passDataObject.member_username + '-' + record.shop_id;
      var fbdelete = new Firebase("https://konhaaapp.firebaseio.com/");
      var nodedelete = fbdelete.child('chat').child(node).remove();
      var fbdelete2 = new Firebase("https://konhaaapp.firebaseio.com/chatlist").orderByChild('shop_id').equalTo(record.shop_id);
      fbdelete2.once('value', function(snapshot) {
        snapshot.forEach(function(itemSnapshot) {
          if (itemSnapshot.val().member_id == myService.passDataObject.member_username) {
            var nodedelete2 = fbdelete.child('chatlist').child(itemSnapshot.key()).remove();
          }
        });
      });
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ลบประวัติการแชทกับร้านค้านี้สำเร็จ !",
            content: "คุณได้ทำการลบประวัติการแชทกับร้านค้านี้สำเร็จ",
            ok: "ตกลง"
          }
        }
      }).then(function(response) {
        $state.reload();
      });
    });
  };

  $scope.backMessage = function() {
    navigator.app.backHistory();
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

  // var fb1 = new Firebase("https://mymap-ebb16.firebaseio.com/chatlist").orderByChild('member_id').equalTo($scope.member_id);
  var fb1 = new Firebase("https://konhaaapp.firebaseio.com/chatlist").orderByChild('member_id').equalTo($scope.member_id);
  listenToFirebase();
  var input = $('input');
  var p = $('p');
  var text = input.val();

  (function($) {
    $.sanitize = function(input) {
      var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
      replace(/<[\/\!]*?[^<>]*?>/gi, '').
      replace(/<style[^>]*?>.*?<\/style>/gi, '').
      replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
      return output;
    };
  })(jQuery);

  function listenToFirebase() {
    fb1.once('value', function(snapshot) {
      var listchat = snapshot.val();
      var j = 0;
      if (listchat !== null) {
        $.each(listchat, function(index, c) {
          var s = c.shop_id;
          var shop_id = s;
          $http.get(myService.configAPI.webserviceURL + '/webservices/getshopdetail2.php?shop_id=' + shop_id)
            .then(function(response) {
              array2.push({
                shop_id: response.data.results[0].shop_id,
                title: response.data.results[0].title,
                img: 'http://1did.net/centerapp/img/img_shop/' + response.data.results[0].img,
                detail: response.data.results[0].detail
              });
              $scope.items2 = array2;
            }, function(error) {
              $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                locals: {
                  displayOption: {
                    title: "เกิดข้อผิดพลาด !",
                    content: "เกิดข้อผิดพลาด listenToFirebase ใน listchat2Controller ระบบจะปิดอัตโนมัติ",
                    ok: "ตกลง"
                  }
                }
              }).then(function(response) {
                ionic.Platform.exitApp();
              });
            });
        });
      }
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $scope.member_id2 = myService.passDataObject.member_id;
  var shop_id;
  var array4 = {};
  var array5 = [];
  var ii = 0;

  $scope.btnDelCusChat = function(record) {
    getShopDetail(function(status) {
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'confirm-dialog.html',
        locals: {
          displayOption: {
            title: "ลบประวัติการแชทกับลูกค้านี้ ?",
            content: "คุณแน่ใจที่จะลบประวัติการแชทกับลูกค้านี้",
            ok: "ตกลง",
            cancel: "ยกเลิก"
          }
        }
      }).then(function(response) {
        // var node = record.member_username + '-' + shop_id;
        var node = shop_id + '-' + record.member_username;
        var fbdelete = new Firebase("https://konhaaapp.firebaseio.com/");
        var nodedelete = fbdelete.child('chat').child(node).remove();
        var fbdelete2 = new Firebase("https://konhaaapp.firebaseio.com/chatlist").orderByChild('member_id').equalTo(shop_id);
        fbdelete2.once('value', function(snapshot) {
          snapshot.forEach(function(itemSnapshot) {
            if (itemSnapshot.val().shop_id == record.member_username) {
              var nodedelete2 = fbdelete.child('chatlist').child(itemSnapshot.key()).remove();
            }
          });
        });
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "ลบประวัติการแชทกับลูกค้านี้สำเร็จ !",
              content: "คุณได้ทำการลบประวัติการแชทกับลูกค้านี้สำเร็จ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          $state.reload();
        });
      });
    });
  };

  function getShopDetail(callback) {
    $http.get(myService.configAPI.webserviceURL + '/webservices/getShopForListChat.php?member_id=' + myService.passDataObject.member_id)
      .then(function(response) {
        $scope.title = response.data.results[0].title;
        shop_id = response.data.results[0].shop_id;
        callback($scope.title, shop_id);
      }, function(error) {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'confirm-dialog.html',
          locals: {
            displayOption: {
              title: "เกิดข้อผิดพลาด !",
              content: "เกิดข้อผิดพลาด getShopDetail ใน listchat2Controller ระบบจะปิดอัตโนมัติ",
              ok: "ตกลง"
            }
          }
        }).then(function(response) {
          ionic.Platform.exitApp();
        });
      });
  }

  getShopDetail(function(status) {
    // var fb2 = new Firebase("https://mymap-ebb16.firebaseio.com");
    // var fb3 = new Firebase("https://mymap-ebb16.firebaseio.com/chatlist").orderByChild('shop_id').equalTo(shop_id);
    var fb2 = new Firebase("https://konhaaapp.firebaseio.com/");
    var fb3 = new Firebase("https://konhaaapp.firebaseio.com/chatlist").orderByChild('member_id').equalTo(shop_id);
    listenToFirebase2();
    var input1 = $('input');
    var p1 = $('p');
    var text1 = input1.val();

    (function($) {
      $.sanitize = function(input1) {
        var output = input1.replace(/<script[^>]*?>.*?<\/script>/gi, '').
        replace(/<[\/\!]*?[^<>]*?>/gi, '').
        replace(/<style[^>]*?>.*?<\/style>/gi, '').
        replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
        return output;
      };
    })(jQuery);

    function listenToFirebase2() {
      fb3.once('value', function(snapshot) {
        var listchat = snapshot.val();
        var i = 1;
        var j = 0;
        if (listchat !== null) {
          $.each(listchat, function(index, c) {
            var member_username = c.shop_id;
            $http.get(myService.configAPI.webserviceURL + '/webservices/getmemberdetail2.php?member_username=' + member_username)
              .then(function(response) {
                array5.push({
                  member_id: response.data.results[0].member_id,
                  member_firstname: response.data.results[0].member_firstname,
                  member_username: response.data.results[0].member_username,
                  member_img: 'http://1did.net/centerapp/img/img_profile/' + response.data.results[0].member_username + '.jpg'
                });
                $scope.items3 = array5;
              }, function(error) {
                $mdDialog.show({
                  controller: 'DialogController',
                  templateUrl: 'confirm-dialog.html',
                  locals: {
                    displayOption: {
                      title: "เกิดข้อผิดพลาด !",
                      content: "เกิดข้อผิดพลาด listenToFirebase2 ใน listchat2Controller ระบบจะปิดอัตโนมัติ",
                      ok: "ตกลง"
                    }
                  }
                }).then(function(response) {
                  ionic.Platform.exitApp();
                });
              });
          });
        }
      });
    }
  });

  $scope.btnChat2 = function(data) {
    myService.firebaseUser = data;
    myService.shop_id = shop_id;
    myService.title = $scope.title;
    $state.go('app2.chat');
  };
});

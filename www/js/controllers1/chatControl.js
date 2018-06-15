appControllers.controller('ChatCtrl', function($scope, $state, $ionicPopup, $ionicScrollDelegate, myService, $http) {
  $ionicScrollDelegate.scrollBottom(true);
  // $scope.shop_id = myService.shopid.shop_id;
  // console.log($scope.shop_id);
  // $scope.title = myService.shopDataObject.title;
  // console.log($scope.title);
  // $scope.shop_name = $scope.title;
  // console.log($scope.shop_name);
  $scope.shop_id = myService.shop_id;
  $scope.title = myService.title;
  $scope.shop_name = $scope.title;
  $scope.firebaseuser = myService.firebaseUser.member_username;
  // var fb = new Firebase("https://mymap-ebb16.firebaseio.com/");
  var fb = new Firebase("https://konhaaapp.firebaseio.com/");
  var name = $scope.firebaseuser;
  var member_id = $scope.firebaseuser;
  var shopname = $scope.shop_name;
  var shop_id = $scope.shop_id;
  // console.log($scope.shop_name);
  // var xxx = name + "-" + $scope.shop_id;
  var xxx = $scope.shop_id + "-" + name;
  var s2c = name + "-" + $scope.shop_id;
  var chat = "chat";
  var chatlist = "chatlist";
  var messages = fb.child(chat).child(xxx);
  var messages2 = fb.child(chat).child(s2c);
  var username = fb.child(chatlist);
  var ref = fb.ref();
  var fb1 = new Firebase("https://konhaaapp.firebaseio.com/chatlist").orderByChild('shop_id').equalTo(shop_id);

  ref.once("value")
    .then(function(snapshot) {
      var key = snapshot.key; // "ada"
      var childKey = snapshot.child("name/last").key; // "last"
    });

  var btn = $('button');
  var wrap = $('.wrapper');
  var input = $('input.message');
  var usernameInput = "222";
  var user = [];

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
      var i = 0;
      var j = 0;
      if (listchat !== null) {
        $.each(listchat, function(index, c) {
          var s = c.member_id;
          if (s == member_id) {
            i = i + 1;
          }
        });
        if (i < 1) {
          username.push({
            member_id: member_id,
            shop_id: shop_id
          });
          username.push({
            member_id: shop_id,
            shop_id: member_id
          });
        }
        // add there lines after change db from p'nu to new db
      } else {
        var found = false;
        var searchChatList = new Firebase("https://konhaaapp.firebaseio.com/chatlist").orderByChild('member_id').equalTo(member_id);
        searchChatList.once('value', function(snapshot) {
          if (snapshot.val() == null) {
            username.push({
              member_id: member_id,
              shop_id: shop_id
            });
          } else {
            snapshot.forEach(function(itemSnapshot) {
              if (itemSnapshot.val().shop_id == shop_id) {
                found = true;
              }
            });
            if (found == false) {
              username.push({
                member_id: member_id,
                shop_id: shop_id
              });
            }
          }
        });
        var found2 = false;
        var searchChatList2 = new Firebase("https://konhaaapp.firebaseio.com/chatlist").orderByChild('shop_id').equalTo(member_id);
        searchChatList2.once('value', function(snapshot) {
          if (snapshot.val() == null) {
            username.push({
              member_id: shop_id,
              shop_id: member_id
            });
          } else {
            snapshot.forEach(function(itemSnapshot) {
              if (itemSnapshot.val().member_id == shop_id) {
                found2 = true;
              }
            });
            if (found2 == false) {
              username.push({
                member_id: shop_id,
                shop_id: member_id
              });
            }
          }
        });
      }
    });
  }

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

  $scope.btnUp2 = function() {
    var curUsername = $scope.shop_name;
    var shop_id2 = $scope.shop_id;
    if (input.val().length > 0) {
      var getTxt = input.val();
      messages.push({
        user: curUsername,
        message: getTxt
        // shop_id: shop_id2
      });
      messages2.push({
        user: curUsername,
        message: getTxt
      });
      listenToFirebase();
      input.val('');
      $http.get(myService.configAPI.webserviceURL + 'php_push/push_s2c.php?memberusername=' + $scope.firebaseuser + '&message=' + getTxt + '&title=' + $scope.shop_name);
    }
  };

  input.on('keyup', function(e) {
    var curUsername = $scope.shop_name;
    var shop_id2 = $scope.shop_id;
    if (e.keyCode === 13 && input.val().length > 0) {
      var getTxt = input.val();
      messages.push({
        user: curUsername,
        message: getTxt
        // shop_id: shop_id2
      });
      messages2.push({
        user: curUsername,
        message: getTxt
      });
      listenToFirebase();
      input.val('');
      $http.get(myService.configAPI.webserviceURL + 'php_push/push_s2c.php?memberusername=' + $scope.firebaseuser + '&message=' + getTxt + '&title=' + $scope.shop_name);
    }
  });

  messages.on("child_added", function(snap) {
    if ($scope.shop_name != $.sanitize(snap.val().user)) {
      wrap.append('<h4 style="margin-left: 10px;"><span><font size="2" color="teal"><b>' + $.sanitize(snap.val().user) + ' :</b></font> </span><font size="2" color="#2f4f4f"> ' + $.sanitize(snap.val().message) + '</font></h4>');
    } else {
      wrap.append('<h4 align="right" style="margin-right: 10px;"><font size="2" color="#2f4f4f">' + $.sanitize(snap.val().message) + '</font><span><font size="2" color="teal"><b> : ' + $.sanitize(snap.val().user) + '</b></font> </span></h4>');
    }
    $ionicScrollDelegate.scrollBottom();
  });
});

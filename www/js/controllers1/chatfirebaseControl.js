appControllers.controller('ChatfirebaseCtrl', function($scope, $state, $ionicPopup, $ionicScrollDelegate, myService, $http) {
  $ionicScrollDelegate.scrollBottom(true);
  console.log('ChatfirebaseCtrl start...');
  // var fb = new Firebase("https://mymap-ebb16.firebaseio.com/");
  var fb = new Firebase("https://konhaaapp.firebaseio.com/");
  var shop_id = myService.passDataObject2.shop_id;
  var member_id = window.localStorage.username;
  var firstname = myService.passDataObject.member_firstname;
  var xxx = member_id + "-" + shop_id;
  var c2s = shop_id + "-" + member_id;
  var chat = "chat";
  var chatlist = "chatlist";
  var messages = fb.child(chat).child(xxx);
  var messages2 = fb.child(chat).child(c2s);
  var username = fb.child(chatlist);
  var array = {};
  var array2 = [];
  // var fb1 = new Firebase("https://mymap-ebb16.firebaseio.com/chatlist").orderByChild('shop_id').equalTo(shop_id);
  var fb1 = new Firebase("https://konhaaapp.firebaseio.com/chatlist").orderByChild('shop_id').equalTo(shop_id);
  // listenToFirebase();
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
        } else {
          var foundInFB1 = false;
          var searchChatListInCaseFB1NotNull = new Firebase("https://konhaaapp.firebaseio.com/chatlist").orderByChild('member_id').equalTo(shop_id);
          searchChatListInCaseFB1NotNull.once('value', function(snapshot) {
            if (snapshot.val() == null) {
              username.push({
                member_id: shop_id,
                shop_id: member_id
              });
            } else {
              snapshot.forEach(function(itemSnapshot) {
                if (itemSnapshot.val().shop_id == member_id) {
                  foundInFB1 = true;
                }
              });
              if (foundInFB1 == false) {
                username.push({
                  member_id: member_id,
                  shop_id: shop_id
                });
              }
            }
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

  var btn = $('button');
  var wrap = $('.wrapper');
  var input = $('input.message');
  var usernameInput = "222";
  var user = [];

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
    var curUsername = firstname;
    if (input.val().length > 0) {
      var getTxt = input.val();
      messages.push({
        user: curUsername,
        message: getTxt
      });
      messages2.push({
        user: curUsername,
        message: getTxt
      });
      listenToFirebase();
      input.val('');
      $http.get(myService.configAPI.webserviceURL + 'php_push/push_c2s.php?shopid=' + shop_id + '&message=' + getTxt + '&memberusername=' + myService.passDataObject.member_username);
    }
  };

  input.on('keyup', function(e) {
    var curUsername = firstname;
    if (e.keyCode === 13 && input.val().length > 0) {
      var getTxt = input.val();
      messages.push({
        user: curUsername,
        message: getTxt
      });
      messages2.push({
        user: curUsername,
        message: getTxt
      });
      listenToFirebase();
      input.val('');
      $http.get(myService.configAPI.webserviceURL + 'php_push/push_c2s.php?shopid=' + shop_id + '&message=' + getTxt + '&memberusername=' + myService.passDataObject.member_username);
    }
  });

  messages.on("child_added", function(snap) {
    if (firstname != $.sanitize(snap.val().user)) {
      wrap.append('<h4 style="margin-left: 10px;"><span><font size="2" color="teal"><b>' + $.sanitize(snap.val().user) + ' :</b></font> </span><font size="2" color="#2f4f4f"> ' + $.sanitize(snap.val().message) + '</font></h4>');
    } else {
      wrap.append('<h4 align="right" style="margin-right: 10px;"><font size="2" color="#2f4f4f">' + $.sanitize(snap.val().message) + '</font><span><font size="2" color="teal"><b> : ' + $.sanitize(snap.val().user) + '</b></font> </span></h4>');
    }
    $ionicScrollDelegate.scrollBottom();
  });
});

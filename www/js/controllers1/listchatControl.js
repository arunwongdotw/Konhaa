appControllers.controller('listChatCtrl', function($scope, $state, $ionicPopup, $ionicScrollDelegate, myService, $http) {
  $ionicScrollDelegate.scrollBottom(true);

  $scope.title = myService.shopDataObject.title;
  $scope.member_id = myService.passDataObject.member_id;
  var shop_id = myService.shopid.shop_id;
  var array = {};
  var array2 = [];
  var i = 0;

  $scope.btnChat = function(data) {
    myService.firebaseUser = data;
    $state.go('app2.chat');
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

  var fb = new Firebase("https: //mymap-ebb16.firebaseio.com");
  var fb1 = new Firebase("https://mymap-ebb16.firebaseio.com/chatlist").orderByChild('shop_id').equalTo(shop_id);
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
      var i = 1;
      var j = 0;
      if (listchat !== null) {
        $.each(listchat, function(index, c) {
          var s = c.member_id;
          var member_username = s;
          $http.get(myService.configAPI.webserviceURL + '/webservices/getmemberdetail2.php?member_username=' + member_username)
            .then(function(response) {
              array2.push({
                member_id: response.data.results[0].member_id,
                member_firstname: response.data.results[0].member_firstname,
                member_username: response.data.results[0].member_username,
                member_img: 'http://1did.net/centerapp/img/img_profile/' + response.data.results[0].member_username + '.jpg'
              });
              $scope.items2 = array2;
            }, function(error) {
              console.log(error);
            });
        });
      }
    });
  }
});

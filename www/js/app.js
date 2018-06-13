//
//Welcome to app.js
//This is main application config of project. You can change a setting of :
//  - Global Variable
//  - Theme setting
//  - Icon setting
//  - Register View
//  - Spinner setting
//  - Custom style
//
//Global variable use for setting color, start page, message, oAuth key.
var db = null; //Use for SQLite database.
var url = null;
var state = null;
// route application if window.localStorage.username has value
if ((window.localStorage.username == "") || (window.localStorage.username == null)) {
  url = "/app1/home";
  state = "app1.home";
} else {
  url = "/app2/home";
  state = "app2.home";
}
window.globalVariable = {
  //custom color style variable
  color: {
    appPrimaryColor: "",
    dropboxColor: "#017EE6",
    facebookColor: "#3C5C99",
    foursquareColor: "#F94777",
    googlePlusColor: "#D73D32",
    instagramColor: "#517FA4",
    wordpressColor: "#0087BE"
  }, // End custom color style variable
  startPage: {
    url: url,
    state: state
    // url: "/app2/detail", //Url of start page.
    // state: "app2.detail" //State name of start page.
  },
  message: {
    errorMessage: "Technical error please try again later." //Default error message.
  },
  oAuth: {
    dropbox: "your_api_key", //Use for Dropbox API clientID.
    // facebook: "203876557017434",
    facebook: "your_api_key", //Use for Facebook API appID.
    foursquare: "your_api_key", //Use for Foursquare API clientID.
    instagram: "your_api_key", //Use for Instagram API clientID.
    googlePlus: "your_api_key", //Use for Google API clientID.
  },
  adMob: "your_api_key" //Use for AdMob API clientID.
}; // End Global variable


angular.module('starter', ['ionic', 'ngIOS9UIWebViewPatch', 'starter.controllers', 'starter.services', 'ngMaterial', 'ngMessages', 'ngCordova', 'ngCordovaOauth', 'ionic-datepicker', 'ionic-ratings'])
  .run(function($ionicPlatform, $cordovaSQLite, $rootScope, $ionicHistory, $state, $mdDialog, $mdBottomSheet, myService, $cordovaPushV5, $cordovaDevice, notifyService, $ionicPopup) {
    $ionicPlatform.ready(function() {
      if (window.Connection) {
        if (navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
            title: "ไม่มีการเชื่อมต่ออินเทอร์เน็ต !",
            content: "โทรศัพท์ของคุณยังไม่ได้เชื่อมต่ออินเทอร์เน็ต กรุณาเชื่อมต่ออินเทอร์เน็ตก่อนใช้งาน"
          }).then(function(result) {
            ionic.Platform.exitApp();
          });
        }
      }
    });

    // function getUserDetailFromLocalStorage(callback) {
    //   $http({
    //     url: myService.configAPI.webserviceURL + 'webservices/getUserDetail.php',
    //     method: 'POST',
    //     data: {
    //       var_username: window.localStorage.username
    //     }
    //   }).then(function(response) {
    //     myService.passDataObject = response.data.results[0];
    //     console.log(myService.passDataObject);
    //     callback(myService.passDataObject);
    //   }, function(error) {
    //     console.log(error);
    //   });
    // }


    //Create database table of contracts by using sqlite database.
    //Table schema :
    //Column	   Type	     Primary key
    //  id	        Integer	    Yes
    //  firstName	Text	    No
    //  lastName	Text	    No
    //  telephone	Text	    No
    //  email	    Text	    No
    //  note	    Text	    No
    //  createDate	DateTime	No
    //  age	        Integer	    No
    //  isEnable	Boolean	    No

    // function initialSQLite() {
    //   db = window.cordova ? $cordovaSQLite.openDB("contract.db") : window.openDatabase("contract.db", "1.0", "IonicMaterialDesignDB", -1);
    //   $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS contracts " +
    //     "( id           integer primary key   , " +
    //     "  firstName    text                  , " +
    //     "  lastName     text                  , " +
    //     "  telephone    text                  , " +
    //     "  email        text                  , " +
    //     "  note         text                  , " +
    //     "  createDate   dateTime              , " +
    //     "  age          integer               , " +
    //     "  isEnable     Boolean)                ");
    // }
    // End creating SQLite database table.

    // Create custom defaultStyle.
    function getDefaultStyle() {
      return "" +
        ".material-background-nav-bar { " +
        "   background-color        : " + appPrimaryColor + " !important; " +
        "   border-style            : none;" +
        "}" +
        ".md-primary-color {" +
        "   color                     : " + appPrimaryColor + " !important;" +
        "}";
    } // End create custom defaultStyle

    // Create custom style for product view.
    function getProductStyle() {
      return "" +
        ".material-background-nav-bar { " +
        "   background-color        : " + appPrimaryColor + " !important;" +
        "   border-style            : none;" +
        "   background-image        : url('img/background_cover_pixels.png') !important;" +
        "   background-size         : initial !important;" +
        "}" +
        ".md-primary-color {" +
        "   color                     : " + appPrimaryColor + " !important;" +
        "}";
    } // End create custom style for product view.

    // Create custom style for contract us view.
    function getContractUsStyle() {
      return "" +
        ".material-background-nav-bar { " +
        "   background-color        : transparent !important;" +
        "   border-style            : none;" +
        "   background-image        : none !important;" +
        "   background-position-y   : 4px !important;" +
        "   background-size         : initial !important;" +
        "}" +
        ".md-primary-color {" +
        "   color                     : " + appPrimaryColor + " !important;" +
        "}";
    } // End create custom style for contract us view.

    // Create custom style for Social Network view.
    function getSocialNetworkStyle(socialColor) {
      return "" +
        ".material-background-nav-bar {" +
        "   background              : " + socialColor + " !important;" +
        "   border-style            : none;" +
        "} " +
        "md-ink-bar {" +
        "   color                   : " + socialColor + " !important;" +
        "   background              : " + socialColor + " !important;" +
        "}" +
        "md-tab-item {" +
        "   color                   : " + socialColor + " !important;" +
        "}" +
        " md-progress-circular.md-warn .md-inner .md-left .md-half-circle {" +
        "   border-left-color       : " + socialColor + " !important;" +
        "}" +
        " md-progress-circular.md-warn .md-inner .md-left .md-half-circle, md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
        "    border-top-color       : " + socialColor + " !important;" +
        "}" +
        " md-progress-circular.md-warn .md-inner .md-gap {" +
        "   border-top-color        : " + socialColor + " !important;" +
        "   border-bottom-color     : " + socialColor + " !important;" +
        "}" +
        "md-progress-circular.md-warn .md-inner .md-right .md-half-circle {" +
        "  border-right-color       : " + socialColor + " !important;" +
        " }" +
        ".spinner-android {" +
        "   stroke                  : " + socialColor + " !important;" +
        "}" +
        ".md-primary-color {" +
        "   color                   : " + socialColor + " !important;" +
        "}" +
        "a.md-button.md-primary, .md-button.md-primary {" +
        "   color                   : " + socialColor + " !important;" +
        "}";
    } // End create custom style for Social Network view.


    function initialRootScope() {
      $rootScope.appPrimaryColor = appPrimaryColor; // Add value of appPrimaryColor to rootScope for use it to base color.
      $rootScope.isAndroid = ionic.Platform.isAndroid(); // Check platform of running device is android or not.
      $rootScope.isIOS = ionic.Platform.isIOS(); // Check platform of running device is ios or not.
    }

    function hideActionControl() {
      //For android if user tap hardware back button, Action and Dialog should be hide.
      $mdBottomSheet.cancel();
      $mdDialog.cancel();
    }


    // createCustomStyle will change a style of view while view changing.
    // Parameter :
    // stateName = name of state that going to change for add style of that page.
    function createCustomStyle(stateName) {
      var customStyle =
        ".material-background {" +
        "   background-color          : " + appPrimaryColor + " !important;" +
        "   border-style              : none;" +
        "}" +
        ".spinner-android {" +
        "   stroke                    : " + appPrimaryColor + " !important;" +
        "}";

      switch (stateName) {
        case "app.productList":
        case "app.productDetail":
        case "app.productCheckout":
        case "app.clothShop":
        case "app.catalog":
          customStyle += getProductStyle();
          break;
        case "app.dropboxLogin":
        case "app.dropboxProfile":
        case "app.dropboxFeed":
          customStyle += getSocialNetworkStyle(window.globalVariable.color.dropboxColor);
          break;
        case "app.facebookLogin":
        case "app.facebookProfile":
        case "app.facebookFeed":
        case "app.facebookFriendList":
          customStyle += getSocialNetworkStyle(window.globalVariable.color.facebookColor);
          break;
        case "app.foursquareLogin":
        case "app.foursquareProfile":
        case "app.foursquareFeed":
          customStyle += getSocialNetworkStyle(window.globalVariable.color.foursquareColor);
          break;
        case "app.googlePlusLogin":
        case "app.googlePlusProfile":
        case "app.googlePlusFeed":
          customStyle += getSocialNetworkStyle(window.globalVariable.color.googlePlusColor);
          break;
        case "app.instagramLogin":
        case "app.instagramProfile":
        case "app.instagramFeed":
          customStyle += getSocialNetworkStyle(window.globalVariable.color.instagramColor);
          break;
        case "app.wordpressLogin":
        case "app.wordpressFeed":
        case "app.wordpressPost":
          customStyle += getSocialNetworkStyle(window.globalVariable.color.wordpressColor);
          break;
        case "app.contractUs":
          customStyle += getContractUsStyle();
          break;
        default:
          customStyle += getDefaultStyle();
          break;
      }
      return customStyle;
    } // End createCustomStyle

    // Add custom style while initial application.
    $rootScope.customStyle = createCustomStyle(window.globalVariable.startPage.state);

    $ionicPlatform.ready(function() {
      if (window.cordova) {
        var options = {
          android: {
            senderID: "1003832017518"
          },
          ios: {
            alert: "true",
            badge: "true",
            sound: "true"
          },
          windows: {}
        };

        // initialize
        $cordovaPushV5.initialize(options)
          .then(function() {
            $cordovaPushV5.onNotification();
            $cordovaPushV5.onError();
            $cordovaPushV5.register()
              .then(function(registrationId) {
                var dataSend = {
                  uid: $cordovaDevice.getUUID(),
                  regid: registrationId
                };
                // service เรียกใช้ฟังก์ชั่น notifyService ส่งค่าไปยัง server
                notifyService.setNotify(dataSend)
                  .then(function(response) {
                    // ทดสอบแสดงค่าว่าบันทึกสำเร็จหรือไม่
                  });
                // save `registrationId` somewhere;
              });
          });

        var message = '';
        var message_id = '';
        // triggered every time notification received
        $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data) {
          if (data.additionalData.foreground == true) {
            console.log('app open');
          } else {
            if ((message == '') && (message_id == '')) {
              console.log('if 1');
              message = data.message;
              message_id = data.additionalData['google.message_id'];
              $state.go('app2.listchat2');
            } else if ((message != data.message) || (message_id != data.additionalData['google.message_id'])) {
              console.log('if 2');
              message = data.message;
              message_id = data.additionalData['google.message_id'];
              $state.go('app2.listchat2');
            }
          }
        });

        // triggered every time error occurs
        $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e) {
          console.log(e);
          // e.message
        });
      }

      ionic.Platform.isFullScreen = true;
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      // initialSQLite();
      initialRootScope();

      //Checking if view is changing it will go to this function.
      $rootScope.$on('$ionicView.beforeEnter', function() {
        //hide Action Control for android back button.
        hideActionControl();
        // Add custom style ti view.
        $rootScope.customStyle = createCustomStyle($ionicHistory.currentStateName());
      });
    });

  })

  .config(function(ionicDatePickerProvider, $ionicConfigProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdColorPalette, $mdIconProvider, $mdGestureProvider) {

    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);

    $mdGestureProvider.skipClickHijack();

    // Use for change ionic spinner to android pattern.
    $ionicConfigProvider.spinner.icon("android");
    $ionicConfigProvider.views.swipeBackEnabled(false);

    // mdIconProvider is function of Angular Material.
    // It use for reference .SVG file and improve performance loading.
    $mdIconProvider
      .icon('facebook', 'img/icons/facebook.svg')
      .icon('twitter', 'img/icons/twitter.svg')
      .icon('mail', 'img/icons/mail.svg')
      .icon('message', 'img/icons/message.svg')
      .icon('share-arrow', 'img/icons/share-arrow.svg')
      .icon('more', 'img/icons/more_vert.svg');

    //mdThemingProvider use for change theme color of Ionic Material Design Application.
    /* You can select color from Material Color List configuration :
     * red
     * pink
     * purple
     * purple
     * deep-purple
     * indigo
     * blue
     * light-blue
     * cyan
     * teal
     * green
     * light-green
     * lime
     * yellow
     * amber
     * orange
     * deep-orange
     * brown
     * grey
     * blue-grey
     */
    //Learn more about material color patten: https://www.materialpalette.com/
    //Learn more about material theme: https://material.angularjs.org/latest/#/Theming/01_introduction
    $mdThemingProvider
      .theme('default')
      .primaryPalette('teal')
      .accentPalette('deep-purple');

    appPrimaryColor = $mdColorPalette[$mdThemingProvider._THEMES.default.colors.primary.name]["500"]; //Use for get base color of theme.

    //$stateProvider is using for add or edit HTML view to navigation bar.
    //
    //Schema :
    //state_name(String)      : Name of state to use in application.
    //page_name(String)       : Name of page to present at localhost url.
    //cache(Bool)             : Cache of view and controller default is true. Change to false if you want page reload when application navigate back to this view.
    //html_file_path(String)  : Path of html file.
    //controller_name(String) : Name of Controller.
    //
    //Learn more about ionNavView at http://ionicframework.com/docs/api/directive/ionNavView/
    //Learn more about  AngularUI Router's at https://github.com/angular-ui/ui-router/wiki
    $stateProvider
      .state('app', {
        url: "/app",
        cache: false,
        abstract: true,
        templateUrl: "templates/menu/html/menu.html",
        controller: 'menuCtrl'
      })

      .state('app1', {
        url: "/app1",
        cache: false,
        reload: true,
        abstract: true,
        templateUrl: "templates/templates1/notloginmenu.html",
        controller: 'notloginmenuCtrl'
      })
      .state('app2', {
        url: "/app2",
        cache: false,
        reload: true,
        abstract: true,
        templateUrl: "templates/templates1/loginmenu.html",
        controller: 'loginmenuCtrl'
      })
      .state('app1.login', {
        url: "/login",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/login.html",
            controller: 'loginCtrl'
          }
        }
      })
      .state('app1.signup', {
        url: "/signup",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/signup.html",
            controller: 'signupCtrl'
          }
        }
      })
      .state('app1.home', {
        url: "/home",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/home.html",
            controller: "homeController"
          }
        }
      })
      .state('app1.search', {
        url: "/search",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/search.html",
            controller: "searchController"
          }
        }
      })
      .state('app1.map', {
        url: '/map',
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/templates1/map.html',
            controller: 'mapController',
            cache: false
          }
        }
      })
      .state('app2.home', {
        url: "/home",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/home.html",
            controller: "homeController"
          }
        }
      })
      .state('app2.search', {
        url: "/search",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/search.html",
            controller: "searchController"
          }
        }
      })
      .state('app2.shopInsert', {
        url: "/shopInsert",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/shopInsert.html",
            controller: "ShopinsertController"
          }
        }
      })
      .state('app1.detail', {
        url: "/detail",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/detail.html",
            controller: 'detailCtrl'
          }
        }
      })
      .state('app1.forgotpassword', {
        url: "/forgotpassword",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/forgotpassword.html",
            controller: "forgotPasswordCtrl"
          }
        }
      })
      .state('app1.userprofile', {
        url: "/userprofile",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/userprofile.html",
            controller: 'userProfileCtrl'
          }
        }
      })
      .state('app2.detail', {
        url: "/detail",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/detail.html",
            controller: 'detailCtrl'
          }
        }
      })

      .state('app2.productdetail', {
        url: "/productdetail",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/productdetail.html",
            controller: 'ProductController'
          }
        }
      })
      .state('app2.editproduct', {
        url: "/editproduct",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/editproduct.html",
            controller: 'editProductController'
          }
        }
      })
      .state('app2.commentlist', {
        url: "/commentlist",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/commentlist.html",
            controller: 'CommentControllers'
          }
        }
      })
      .state('app2.commentdetail', {
        url: "/commentdetail",
        cache: false,
        reload: true,
        params: {
          isAnimated: false,
          noteDetail: null,
          actionDelete: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/comment-detail.html",
            controller: 'CommentDetailController'
          }
        }
      })
      .state('app2.commentsetting', {
        url: "/commentsetting",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/comment-setting.html",
            controller: 'CommentSettingCtrl'
          }
        }
      })
      .state('app2.map', {
        url: '/map',
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/templates1/map.html',
            controller: 'mapController',
            cache: false
          }
        }
      })
      .state('app2.profile', {
        url: "/profile",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/profile.html",
            controller: "profileCtrl"
          }
        }
      })
      .state('app2.shopregister', {
        url: "/shopregister",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/shopregister.html",
            controller: "shopregisterCtrl"
          }
        }
      })
      .state('app2.shop', {
        url: "/shop",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/shop.html",
            controller: "shopController"
          }
        }
      })
      .state('app2.shopdetail', {
        url: "/shopdetail",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/shopdetail.html",
            controller: "shopdetailCtrl"
          }
        }
      })
      .state('app2.promotion', {
        url: "/promotion",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/promotion.html",
            controller: "promotionCtrl"
          }
        }
      })
      .state('app2.addpromotion', {
        url: "/addpromotion",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/addpromotion.html",
            controller: "addPromotionCtrl"
          }
        }
      })
      .state('app2.editpromotion', {
        url: "/editpromotion",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/editpromotion.html",
            controller: "editPromotionCtrl"
          }
        }
      })
      .state('app2.promotionuse', {
        url: "/promotionuse",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/promotionuse.html",
            controller: "promotionUseCtrl"
          }
        }
      })
      .state('app2.addfreq', {
        url: "/addfreq",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/addfreq.html",
            controller: "addFreqCtrl"
          }
        }
      })
      .state('app2.addpromotiontomember', {
        url: "/addpromotiontomember",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/addpromotiontomember.html",
            controller: "addPromotionToMemberCtrl"
          }
        }
      })
      .state('app2.generatecode', {
        url: "/generatecode",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/generatecode.html",
            controller: "generateCodeCtrl"
          }
        }
      })
      .state('app2.termandcondition', {
        url: "/termandcondition",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/termandcondition.html",
            controller: "termAndConditionCtrl"
          }
        }
      })
      .state('app2.promotionlist', {
        url: "/promotionlist",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/promotionlist.html",
            controller: "promotionListCtrl"
          }
        }
      })
      .state('app2.qrcode', {
        url: "/qrcode",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/qrcode.html",
            controller: "qrCodeCtrl"
          }
        }
      })
      .state('app2.chatfirebase', {
        url: "/chatfirebase",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/chatfirebase.html",
            controller: 'ChatfirebaseCtrl'
          }
        }
      })
      .state('app2.chat', {
        url: "/chat",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/chat.html",
            controller: 'ChatCtrl'
          }
        }
      })
      .state('app2.listchat', {
        url: "/listchat",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/listchat.html",
            controller: 'listChatCtrl'
          }
        }
      })
      .state('app2.listchat2', {
        url: "/listchat2",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/listchat2.html",
            controller: 'listChat2Ctrl'
          }
        }
      })
      .state('app2.review', {
        url: "/review",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/review.html",
            controller: 'reviewCtrl'
          }
        }
      })
      .state('app2.reviewlist', {
        url: "/reviewlist",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/reviewlist.html",
            controller: 'reviewListCtrl'
          }
        }
      })
      .state('app2.ratinglist', {
        url: "/ratinglist",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/ratinglist.html",
            controller: 'ratingListCtrl'
          }
        }
      })
      .state('app2.userprofile', {
        url: "/userprofile",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/userprofile.html",
            controller: 'userProfileCtrl'
          }
        }
      })
      .state('app2.contactus', {
        url: "/contactus",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/contactus.html",
            controller: 'contactUsCtrl'
          }
        }
      })
      .state('app2.reviewlistuser', {
        url: "/reviewlistuser",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/reviewlistuser.html",
            controller: 'reviewListUserCtrl'
          }
        }
      })
      .state('app2.shopreview', {
        url: "/shopreview",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/shopreview.html",
            controller: 'shopReviewCtrl'
          }
        }
      })
      .state('app2.reply', {
        url: "/reply",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/reply.html",
            controller: 'replyCtrl'
          }
        }
      })
      .state('app2.confirmowner', {
        url: "/confirmowner",
        cache: false,
        reload: true,
        params: {
          isAnimated: false
        },
        views: {
          'menuContent': {
            templateUrl: "templates/templates1/confirmowner.html",
            controller: 'confirmOwnerCtrl'
          }
        }
      });
    // End $stateProvider

    //Use $urlRouterProvider.otherwise(Url);
    $urlRouterProvider.otherwise(window.globalVariable.startPage.url);

  });

angular.module('starter')
  .service('notifyService', function($http, $q) { // สร้าง service
    // กำหนด url ของ ไฟล์ api ของเรา
    //var url = "http://localhost/php_push/token.php";
    var url = "http://1did.net/centerapp/php_push/token.php";
    return { // ในที่นี้เราจะใช้การส่งค่าแบบ post
      setNotify: function(dataSend) {
        var deferred = $q.defer();
        $http.post(url, dataSend)
          .success(deferred.resolve)
          .error(deferred.reject);
        return deferred.promise;
      },
      updateNotify: function(dataSend) {
        var deferred = $q.defer();
        $http.post(url, dataSend)
          .success(deferred.resolve)
          .error(deferred.reject);
        return deferred.promise;
      }
    };
  })

  .service('myService', function() {
    this.configAPI = {
      version: '@testapp v0.0.1',
      webserviceURL: 'http://1did.net/centerapp/'
    };
    this.passDataObject = {};
    this.passDataObject2 = {};
    this.passDataObject3 = {};

    this.shopid = {};
    this.editproduct = {};
    this.promotionDetail = {};
    this.addFreqDetail = {};
    this.mpFrequency = {};
    this.memberidInCaseMemberNotHavePromotion = {};

    this.firebaseUser = {}; //shop_id
    this.shopDataObject = {}; //shop_detail

    this.userDetailFromReview = {};

    this.shop_id = {};
    this.title = {};

    this.memberidFromReview = {};
    this.commentidForReply = {};
  });

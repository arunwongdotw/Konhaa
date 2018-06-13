appControllers.controller('home2Controller',function($scope,$state,$rootScope,deviceService,$ionicPopup,$http,deviceService){
  console.log('home2');
      //Config
      $scope.mapStatus = false;
      $scope.showPokemonGo = true;


    $http.get('http://1did.net/www_web_api/servicemap/list_shop.php')
      .then(

        function(response){
          console.log(response);
          $scope.items = response.data.results;
          //console.log($scope.items);
        },
        function(error){
          console.log(error);
        }
      )
    /*$scope.myDataArray = [

          {
              title:'บริษัท สมาร์ท ออนไลน์ จำกัด',
              desc:'นายรุ่งโรจน์ เกตุโรจน์',
              img:'pic0.jpg',
              position:{
                  latitude:'8.43403',
                  longitude:'99.93679'
              }
          },{
              title:'เชียงใหม่',
              desc:'ภาคเหนือ',
              img:'pic2.jpg',
              position:{
                  latitude:'18.7608905',
                  longitude:'98.9624297'
              }
          },{
              title:'กำแพงเพชร',
              desc:'ภาคเหนือ',
              img:'pic3.jpg',
              position:{
                  latitude:'16.4781811',
                  longitude:'99.5060569'
              }
          },{
              title:'สยามพารากอน',
              desc:'ศูนย์การค้า',
              img:'pic4.jpg',
              position:{
                  latitude:'13.7198747',
                  longitude:'100.4897777'
              }
          },{
              title:'พุทธมณฑล',
              desc:'ภาคกลาง',
              img:'pic5.jpg',
              position:{
                  latitude:'13.7678906',
                  longitude:'100.3103978'
              }
          }
      ];*/

      $scope.btnMultiMarker = function () {
          $state.go('mapMultiMarker');
      };

      $scope.showMap = function(data){
          $rootScope.gpsLocation = data;

          if(window.cordova){
              deviceService.checkOnline(function (status) {
                  if(status == 'online'){
                      $state.go('app.map');
                  }
              });
          }else{
              $state.go('app.map');
          }

      };

      $scope.btnCheckGPS = function(){
          console.log('btnCheckGPS');
          deviceService.checkGPS(function (status) {
              console.log(status);
          })
      };

      $scope.btnOpenSetting = function(){
          console.log('btnOpenSetting');
          deviceService.openSetting(function (status) {
              console.log(status);
          })
      };

    $scope.btnCurrentLocationTest = function () {
      $state.go('app.location');
    };
      $scope.btnCurrentLocation = function(){
          console.log('btnCurrentLocation');

          deviceService.checkGPS(function (status) {
             console.log(status);
              if(status =='GPS_OFF'){

                  deviceService.checkPlatform(function (device) {
                      if(device == 'android'){

                          deviceService.androidGpsSetting(function (status) {
                              if(status == 'force_gps'){
                                  deviceService.currentLocation(function (data) {
                                      console.log(data);
                                      if(data !='ERROR_POSITION'){

                                          $rootScope.currentLocation = data;
                                          $scope.mapStatus = true;

                                          $ionicPopup.alert({
                                              title:'ตำแหน่งปัจจุบัน',
                                              template:
                                              "lat0 : "+data.latitude+
                                              "<br>"+
                                              "lng0 : "+data.longitude+
                                            "22222222"
                                          });
                                      }
                                  });
                              }else{
                                  deviceService.openSetting(function (status) {
                                      console.log(status);
                                  });
                              }
                          })

                      }else if(device == 'ios'){
                          deviceService.openSetting(function (status) {
                              console.log(status);
                              if(status == 'OPENED_SETTING'){
                                  deviceService.currentLocation(function (data) {
                                      console.log(data);
                                      if(data !='ERROR_POSITION'){

                                          $rootScope.currentLocation = data;
                                          $scope.mapStatus = true;

                                          $ionicPopup.alert({
                                              title:'ตำแหน่งปัจจุบัน',
                                              template:
                                              "lat1 : "+data.latitude+
                                              "<br>"+
                                              "lng1 : "+data.longitude
                                          });
                                      }
                                  });
                              }
                          });
                      }else{
                          alert('ERROR Deivice not in ios & android');
                      }
                  })


              }else{
                  deviceService.currentLocation(function (data) {
                      console.log(data);
                      if(data !='ERROR_POSITION'){

                          $rootScope.currentLocation = data;
                          $scope.mapStatus = true;

                          $ionicPopup.alert({
                              title:'ตำแหน่งปัจจุบัน',
                              template:
                              //"lat2 : "+data.latitude+
                              "<input type='text' placeholder='"+data.latitude+"' ng-model='form.txt_remark'>"+
                              "<br>"+
                              //"lng2 : "+data.longitude+
                              "<input type='text' placeholder='"+data.longitude+"' ng-model='form.txt_remark'>"+
                              "<br>"+
                              "<input type='text' placeholder='เพิ่มชื่อร้าน' ng-model='form.txt_remark'>"
                          });
                      }
                  })
              }
          });


      };

      $scope.btnLaunchMap = function() {
          console.log('btnLaunchMap');

          deviceService.launchMap($rootScope.currentLocation,$scope.myDataArray[3].position);
      }

  });

appControllers.controller('locationController',function($scope,$state,$rootScope,deviceService,$ionicPopup,$http){

    console.log('up2Controller.....');
       $scope.form = {};
      $scope.mapStatus = true;
      $scope.showPokemonGo = true;





      $scope.btnInsert = function () {
        deviceService.currentLocation(function (data) {
          console.log(data);
          if(data !='ERROR_POSITION'){

            $rootScope.currentLocation = data;
            $scope.mapStatus = true;

            $scope.latitude = data.latitude;
            $scope.longitude = data.longitude;
          }
        })

        $http({
          //url:'http://localhost/servicemap/location.php',
          url:deviceService.configAPI.webserviceURL+'/servicemap/location.php',
          method:'POST',
          data:{
            var_latitude:$scope.latitude,
            var_longitude:$scope.longitude,
            var_business:$scope.form.business
          }
        }).then(function(response){
          console.log(response);
          if(response.data.results == 'success_insert'){
            //----------------- alert ----
            var alertPopup = $ionicPopup.alert({
              title: 'ผลการดำเนินการ',
              template: 'เพิ่มธุรกิจคุณบนแผนที่เรียบร้อย'
            });
            alertPopup.then(function(response) {
              $state.go('app.home');
            });
            ////------------- /alert ---
            //
          }
        },function(error){
          console.log('ERROR!!!.');
          console.log(error);
        })
      };
/*
      $scope.showMap = function(data){
          $rootScope.gpsLocation = data;

          if(window.cordova){
              deviceService.checkOnline(function (status) {
                  if(status == 'online'){
                      $state.go('map');
                  }
              });
          }else{
              $state.go('map');
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
      };*/

     // $scope.btnCurrentLocation = function(){
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

                                         /* $ionicPopup.alert({
                                              title:'ตำแหน่งปัจจุบัน',
                                              template:
                                              "lat0 : "+data.latitude+
                                              "<br>"+
                                              "lng0 : "+data.longitude+
                                            "22222222"
                                          });*/
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

                                          /*$ionicPopup.alert({
                                              title:'ตำแหน่งปัจจุบัน',
                                              template:
                                              "lat1 : "+data.latitude+
                                              "<br>"+
                                              "lng1 : "+data.longitude
                                          });*/
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

                          $scope.latitude = data.latitude;
                          $scope.longitude = data.longitude;
                          /*$ionicPopup.alert({
                              title:'ตำแหน่งปัจจุบัน',
                              template:
                              //"lat2 : "+data.latitude+
                              "<input type='text' placeholder='"+data.latitude+"' ng-model='form.txt_remark'>"+
                              "<br>"+
                              //"lng2 : "+data.longitude+
                              "<input type='text' placeholder='"+data.longitude+"' ng-model='form.txt_remark'>"+
                              "<br>"+
                              "<input type='text' placeholder='เพิ่มชื่อร้าน' ng-model='form.txt_remark'>"
                          });*/
                      }
                  })
              }
          });


      //};

      $scope.btnLaunchMap = function() {
          console.log('btnLaunchMap');

          deviceService.launchMap($rootScope.currentLocation,$scope.myDataArray[3].position);
      }

  });




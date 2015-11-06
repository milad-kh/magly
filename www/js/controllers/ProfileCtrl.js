(function(root, ng, _, $){
  ng
  .module('profileController', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])

.controller('ProfileCtrl', function($ionicLoading, $rootScope, $ionicPopup, $scope, $localstorage, $state, $http, checkUserAuth ) {

  $scope.settings = $localstorage.getObject('settings');
  console.info($scope.settings);

  $scope.$on('$ionicView.afterEnter', function(){
    $scope.showSignIn = checkUserAuth.isUserLogin();
    $scope.info = $localstorage.getObject('userInfo');
    if(_.isEmpty($scope.info))
    {
      $scope.info = {};
    }
  });

  $scope.$watch('settings.numberOfPostDownloadedFirstTime', function(newVal, oldVal){
    console.info(newVal);
    $scope.settings.numberOfPostDownloadedFirstTime = newVal;
    $localstorage.setObject('settings', $scope.settings);
  });

  $scope.$watch('settings.numberOfPostDownloaded', function(newVal, oldVal){
    console.info(newVal);
    $scope.settings.numberOfPostDownloaded = newVal;
    $localstorage.setObject('settings', $scope.settings);
  });

  $scope.$watch('settings.vibrateWhenNewPostsDownloaded', function(newVal, oldVal){
    console.info(newVal);
    $scope.settings.vibrateWhenNewPostsDownloaded = newVal;
    $localstorage.setObject('settings', $scope.settings);
  });

  $scope.$watch('settings.beepWhenNewPostsDownloaded', function(newVal, oldVal){
      console.info(newVal);
      $scope.settings.beepWhenNewPostsDownloaded = newVal;
      $localstorage.setObject('settings', $scope.settings);
    });

  $scope.$watch('settings.scrollSpeed', function(newVal, oldVal){
      console.info(newVal);
      $scope.settings.scrollSpeed = newVal;
      $localstorage.setObject('settings', $scope.settings);
    });

  $scope.showForgetPassModal = function()
  {
    $scope.data = {};
    var info = $localstorage.getObject('userInfo');
    console.log(info);
    var myPopup = $ionicPopup.show({
    template: '<div><input autofocus type="password" ng-model="data.newPassword" class="yekan" style="direction:rtl" placeHolder="کلمه عبور جدید"></div><div><input style="direction:rtl" class="yekan" type="password" placeHolder="تکرار کلمه عبور" ng-model="data.confirmPassword"></div>',
    title: '<span class=yekan>تعویض کلمه عبور</span>',

    scope: $scope,
    buttons: [
      { text: '<span class=yekan>بستن</span>' },
      {
        text: '<span class=yekan><b>عوض کن</b></span>',
        type: 'button-positive',
        onTap: function(e) {
      if ($scope.data.newPassword == $scope.data.confirmPassword)
          {
            $ionicLoading.show({
                      template:'<span class="yekan">...لطفا شکیبا باشید</span>'
                    });
                    if ($scope.data.newPassword != '')
                    {
                      console.log($scope.data);
                      console.log(info);
                      $http({
                        method: 'GET',
                        url:'http://www.magly.ir/HybridAppAPI/updatePassword.php?newPassword=' + encodeURIComponent($scope.data.newPassword) + '&userID=' + info.ID
                      }).success(function(data,status,headers,config){
                        $ionicLoading.hide();
                         var alertPopup = $ionicPopup.alert({
                           title:'<span class="yekan">پروفایل</span>',
                           template: '<span class="yekan" >کلمه عبور با موفقیت به روز شد.</span>'
                         });
                         alertPopup.then(function(res) {
                           console.log('Thank you for not eating my delicious ice cream cone');
                         });
                      }).error(function(data,status,headers,config){
                        var alertPopup = $ionicPopup.alert({
                          // title: 'Don\'t eat that!',
                          template: '<span class="yekan">خطا در اتصال به اینترنت</span>'
                        });
                        alertPopup.then(function(res) {
                          console.log('Thank you for not eating my delicious ice cream cone');
                        });

                      });
                    }
                    else
                    {
                      console.warn('ye moshkeli hast');
                    }
                    }
                    else
                    {
                      var alertPopup = $ionicPopup.alert({
                       title: '<span class="yekan">خطا</span>',
                       template: '<span class="yekan">ورودی ها یکسان نیستند</span>'
                     });
                     alertPopup.then(function(res) {
                       console.log('Thank you for not eating my delicious ice cream cone');
                     });
                    }
        }

      }
    ]
  });

  }

  $scope.goToSignup = function()
  {
    $state.go('signup');
  }

  $scope.signOut = function()
  {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('favoritePosts');
    $scope.showSignIn = true;
    $scope.info = {};
    $rootScope.$broadcast('signOutOfApp');
  }

  $scope.info = $localstorage.getObject('userInfo');
  if (!$scope.info)
    $scope.info={};
  console.log($scope.info);
  console.log('umad b search:');
  // console
  $scope.signin = function()
  {
    $ionicLoading.show({
      template:'<span class="yekan">... لطفا شکیبا باشید</span>'
    });
    console.log($scope.info);
    $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/signin.php?username='+$scope.info.username+'&password='+encodeURIComponent($scope.info.password),
        cache: false
      }).success(function(data,status,headers,config){
        console.log(data);
        if(data.status == 'ok')
        {
          var categories = $localstorage.getObject('categories');
          var settings = $localstorage.getObject('settings');
          window.localStorage.clear();
          $localstorage.setObject('categories', categories);
          $localstorage.setObject('settings', settings);
          /////////////////////////////////////////
          $ionicLoading.hide();
          $localstorage.setObject('userInfo',data.info);
          $scope.showSignIn = !$scope.showSignIn;
          $state.go('tab.chats');
        }
        else
        {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            // title: 'Don\'t eat that!',
            template: '<span class="yekan">نام کاربری یا کلمه ی عبور اشتباه است</span>'
          });
          alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
          });
        }
      }).error(function(data,status,headers,config){
          var alertPopup = $ionicPopup.alert({
            // title: 'Don\'t eat that!',
            template: '<span class="yekan">خطا در اتصال به اینترنت</span>'
          });
          alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
          });
      });
  }
})

}
)(this, this.angular, this._, this.jQuery);

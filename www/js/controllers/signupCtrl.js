(function(root, ng, _, $){
  ng
  .module('signupController', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])

.controller('signupCtrl', function($ionicLoading,$ionicHistory, $state, $ionicPopup, $localstorage, $rootScope, $scope, $http, checkUserAuth){
  console.warn('signupCtrl initialized');

  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  }

  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
    })
  $scope.$on('$ionicView.afterEnter', function(){
    $scope.info = {};
  });
  $scope.showSignIn = checkUserAuth.isUserLogin();
  console.warn('signinCtrl initialized');

  $scope.signup = function()
    {
      $ionicLoading.show({
        template:'<span class="yekan">... لطفا شکیبا باشید</span>'
      });
      console.log($scope.info);
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/signup.php?fullName='+$scope.info.fullName+'&niceName='+$scope.info.niceName+'&email='+$scope.info.email+'&password='+encodeURIComponent($scope.info.password),
        cache: false
        }).success(function(data,status,headers,config){
          console.log(data);
          if (data[1] == 'ok')
          {
          $ionicLoading.hide();
          // delete extra information
          localStorage.removeItem('posts');
          localStorage.removeItem('userInfo');
          //
          $localstorage.setObject('userInfo', data[0]);
          // show a message to user

           var alertPopup = $ionicPopup.alert({
             title: '<span class="yekan">تبریک</span>',
             template: '<span class="yekan">شما با موفقیت ثبت نام شدید</span>'
           });
           alertPopup.then(function(res) {

             $state.go('tab.chats');
           });
         }
         if (data[1] == 'repeat')
         {
          $ionicLoading.hide();
           var alertPopup = $ionicPopup.alert({
             title: '<span class="yekan">خطا</span>',
             template: '<span class="yekan">کاربری با این ایمیل وجود دارد</span>'
           });

           alertPopup.then(function(res) {
             $scope.info = {};
           });
         }
          //

        }).error(function(data,status,headers,config){
          console.log('error in get categories');
        });
    }
})

}
)(this, this.angular, this._, this.jQuery);

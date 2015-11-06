(function(root, ng, _, $){
  ng
  .module('dashController', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])
  .controller('DashCtrl', function($interval, $cordovaToast, $cordovaNetwork, $cordovaDialogs, $cordovaVibration, $ionicLoading, $cordovaSocialSharing, $rootScope, $localstorage, $scope, $http, $state,checkUserAuth, generalActions) {
  // $interval(refreshCategoryImages, 4000);
  var categories = $localstorage.getObject('categories');
  var categoriesArray = [];
  ng.forEach(categories, function(row){
    ng.forEach(row, function(category){
      if (!_.isEmpty(category))
        categoriesArray.push(category);
    });
  });
  function refreshCategoryImages()
  {
    var randomCategory = Math.floor((Math.random() * categoriesArray.length-1) + 1);
    var targetCategory = categoriesArray[randomCategory];
    $http({
       method: 'GET',
       cache:false,
       url:'http://www.magly.ir/HybridAppAPI/getCategoryImage.php?catID=' + targetCategory.cat_ID + '&oldImage=' + document.getElementById(targetCategory.cat_ID).src + '&data=' + new Date()
     }).success(function(data,status,headers,config){
        console.warn(targetCategory.cat_ID);
        console.warn(document.getElementById(targetCategory.cat_ID).src);
        console.warn(data);
        console.warn('...................................................');
        if(!_.isEmpty(data) && data != 'http://magly.ir/wp-includes/images/media/default.png')
        {
          $("#"+targetCategory.cat_ID).fadeOut();
          document.getElementById(targetCategory.cat_ID).src = data[0];
          $("#"+targetCategory.cat_ID).fadeIn();
        }
     }).error(function(data,status,headers,config){
          console.info('error in internet');
     });
  };

  $scope.$on('$ionicView.afterEnter', function(){
    $scope.categories = $localstorage.getObject('categories');
    if (_.isEmpty($scope.categories))
      {
      $ionicLoading.show({
          template: '<span class=yekan>... بارگذاری دسته ها</span>'
        });
        }
    $scope.showCategories();
  });

  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
    });

  console.warn('DashCtrl initialized');

  $scope.filterPostsByCategory = function(catID)
  {
    console.log(catID);
    $localstorage.setObject('cat', catID);
    $localstorage.setObject('orginalCat', catID);
    $state.go('tab.chats');
    $rootScope.$broadcast('scrollToTop');
  };

  $scope.whatClassIsIt = function(index)
  {
    if (index % 2 == 0)
      return 'item-thumbnail-left rtl'
    else
      return 'item-thumbnail-right'
  }

  $scope.showCategories = function()
  {
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/showCategoryList.php'
    }).success(function(data,status,headers,config){

      $scope.categories = data;
      console.info($scope.categories);
      $localstorage.setObject('categories', $scope.categories);
      $ionicLoading.hide();
    }).error(function(data,status,headers,config){
      console.log('error in get categories');
      $ionicLoading.hide();

    });
  };
})

}
)(this, this.angular, this._, this.jQuery);

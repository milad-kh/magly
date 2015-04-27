// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(ng, _)
{
  var

  /**
   * [init description]
   * @return {[type]} [description]
   */
  init = function ()
  {
    ng
    .module('starter', ['localStorage', 'ui.router', 'ionic'])
    .run(function($ionicPlatform)
    {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    })
    .controller('controller', ['$state', Controller])
    .config(function($stateProvider, $urlRouterProvider) {
      // console.log($state);
      $stateProvider
      
      .state('home', {
        url: '/home',
        views: {
          'home': {
            templateUrl: 'templates/home.html',
            controller: Controller
            }
        }
      })

      .state('contactus', {
        url: '/contactus',
        views: {
          'contactus': {
            templateUrl: 'templates/contactus.html'
            }
        }
      })

      .state('aboutus', {
        url: '/aboutus',
        views: {
          'aboutus': {
            templateUrl: 'templates/aboutus.html'
            }
        }
      })

      .state('signup', {
        url: '/signup',
        views: {
          'signup': {
            templateUrl: 'templates/signup.html'
            }
        }
      })
      
      .state('ourservices', {
        url: '/ourservices',
        views: {
          'ourservices': {
            templateUrl: 'templates/ourservices.html'
            }
        }
      })

      $urlRouterProvider.otherwise('/home');
    });
  },
  
  /**
   * [Controller description]
   * @param {[type]} $localstorage [description]
   * @param {[type]} $scope        [description]
   * @param {[type]} $http         [description]
   */
  Controller = function($state, $localstorage, $scope, $http, $ionicActionSheet, $timeout, $ionicSideMenuDelegate)
  {
     
    $scope.vaz = true;
    //console.log($ionicSideMenuDelegate);
    $scope.toggleSidemenu = function()
    {
      $ionicSideMenuDelegate.toggleLeft();
    }

    $scope.showActionsheet = function() {    
       // Show the action sheet
      $ionicActionSheet.show({
         buttons: [
           { text: 'درباره ی ما' },
           { text: 'ثبت نام' },
           { text: 'خدمات ما برای شما' },
           { text: 'دسه های مقالات' },
           { text: 'به روز رسانی برنامه' }
         ],
         // destructiveText: 'Delete',
         titleText: 'قصد انجام چه کاری دارید؟',
         cancelText: 'Cancel',
         buttonClicked: function(index) {
           switch (index)
           {
              case 0:
                $state.go('aboutus');
              break;
              case 1:
                $state.go('signup');
              break;
              case 2:
                $state.go('ourservices');
              break;
              case 3:
                console.log('آپدیت مقالات');
              break;
              case 4:
                console.log('آپدیت مقالات');
              break;
           }
           console.log(index);
           return true;
         }
       });
    };

    $scope.showCategories = function()
    {
      $http({
        method: 'GET',
        url:'http://www.summits.ir/apiToMobile/showCategoryList.php'
      }).success(function(data,status,headers,config){
        $scope.categories = data;
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });
    };

    $scope.showCategories();
    
    /**
     * [doesLocalHasData description]
     * @return {[type]} [description]
     */
    $scope.doesLocalHasData = function()
    {
      var localData = $localstorage.getObject('posts');
      if (_.isEmpty(localData))
        return false;
      else
        return true;
    };

    if ($scope.doesLocalHasData())
    {
      console.log('local is full of data');
      $scope.posts = $localstorage.getObject('posts');
      $scope.showUpdateMessage = false;
      $scope.showArticleList = true;
    }
    else
    {
      console.log('local is empty');
      $scope.showUpdateMessage = true;
      $scope.showArticleList = false;
    }

    /**
     * [isUpdateAvailable description]
     * @return {Boolean} [description]
     */
    $scope.isUpdateAvailable = function()
    {
      var
      lastPostIdInLocal = 2000 ;//$localstorage.getObject('posts')[0].ID;
      console.log('biggest ID on browser storage is %s', lastPostIdInLocal);
      // we should- find last article ID in summits.ir
      $http({
      method: 'GET',
      url:'http://www.summits.ir/apiToMobile/lastPostID.php'
      }).success(function(data,status,headers,config){
        console.log('biggest ID on net is : '+data);
        if (data > lastPostIdInLocal)
        {
          console.log('alan umad b true');
          $scope.showUpdateButton = true;
        }
        else
        {
          console.log('alan umad b false');
          $scope.showUpdateButton = true;
        }
      }).error(function(data,status,headers,config){
        console.log('error in check update');
      });
    };
    $scope.isUpdateAvailable();

    /**
     * [updateArticles description]
     * @return {[type]} [description]
     */
    $scope.updateArticles = function()
    {
      var
      lastPostIdInLocal = $localstorage.getObject('posts')[0].ID;
      console.log('last post id:', lastPostIdInLocal);
      $http({
        method: 'GET',
        url:'http://www.summits.ir/apiToMobile/updateMyPosts.php?startPostID='+lastPostIdInLocal
      }).success(function(data,status,headers,config){
        console.log('new data is :',data);
        var newPosts = data.concat($scope.posts);
        $scope.posts = newPosts;
        $localstorage.setObject('posts', $scope.posts);
      }).error(function(data,status,headers,config){
        console.log('error in update!');
      });
    };

    /**
     * [fillLocalWithData description]
     * @return {[type]} [description]
     */
    $scope.fillLocalWithData = function()
    {
      $http({
        method: 'GET',
        url:'http://www.summits.ir/apiToMobile/showPostList.php?catID=0'
      }).success(function(data,status,headers,config){
        
        $localstorage.setObject('posts', data);
        $scope.posts = $localstorage.getObject('posts');
        
        console.log('local is full of data');
        $scope.showUpdateMessage = false;
        $scope.showArticleList = true;

      }).error(function(data,status,headers,config){
        console.log('error in get posts');
      });
    },

    $scope.filterPostsByCategory = function(input)
    {
      if (input == 'all')
      {
        $scope.posts = $localstorage.getObject('posts');
      }
      else
      {
        $scope.posts = $localstorage.getObject('posts');
        var catID = input;
        var currentCategoryPosts = [];
        ng.forEach($scope.posts, function(article){
          ng.forEach(article.catId, function(oneOfCatId){
            if (catID == oneOfCatId.cat_ID)
            {
              console.log('ok');
              currentCategoryPosts.push(article);
            }
          })
        });
        $scope.posts = currentCategoryPosts;
      }
      $ionicSideMenuDelegate.toggleLeft();
    }
  }
  ;
  
  init();
})(this.angular, this._);
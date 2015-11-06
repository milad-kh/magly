// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('wpapp', ['localStorage', 'ionic', 'controllers', 'ngCordova'])

.run(function($localstorage, $ionicPlatform, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
      $("ion-header-bar").addClass("yekan");

    //$cordovaSplashscreen.hide();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      /////
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

  });
  if (_.isEmpty($localstorage.getObject('settings')))
  {
    $localstorage.setObject('settings', {
      scrollSpeed:2,
      numberOfPostDownloaded : 3,
      numberOfPostDownloadedFirstTime :5,
      vibrateWhenNewPostsDownloaded : true,
      beepWhenNewPostsDownloaded : true
    });
  }
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $sceDelegateProvider) {

  $ionicConfigProvider.tabs.position('bottom');
  // $ionicConfigProvider.platform.android.scrolling.jsScrolling(false);
  // $ionicConfigProvider.views.forwardCache(true);
  // $ionicConfigProvider.views.maxCache(0);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: function(checkUserAuth, $scope, $rootScope)
    {
      $scope.$on('$ionicView.afterEnter', function(){
      $scope.showSignIn = checkUserAuth.isUserLogin();
      $scope.$on('signOutOfApp', function(){
        $scope.checkUserLogin();
      });
      $scope.checkUserLogin = function()
      {
        $scope.showSignIn = checkUserAuth.isUserLogin();
        if (!$scope.showSignIn)
        {
          console.info('logine agha');
          return "ng-show";
        }
        else
        {
          return "ng-hide";
        }
      }
      });
      $scope.$on('$ionicView.afterEnter', function(){
        $('span.tab-title').addClass('yekan');
      });
    }
  })

  .state('signup', {
      url: "/signup",
      templateUrl: "templates/signup.html",
      controller: 'signupCtrl'
    })

  .state('comment', {
      url: "/comment/:postID",
      templateUrl: "templates/comment.html",
      controller: 'commentCtrl'
    })

  // Each tab has its own nav history stack:
.state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })

  .state('tab.most', {
      url: '/most',
      views: {
        'tab-most': {
          templateUrl: 'templates/tab-most.html',
          controller: 'MostCtrl'
        }
      }
    })

    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.favoriteList', {
    url: '/favoriteList',
    views: {
      'tab-favoriteList': {
        templateUrl: 'templates/favoriteList.html',
        controller: 'favoriteCtrl'
      }
    }
  })

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'searchCtrl'
      }
    }
  })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/chats');

});

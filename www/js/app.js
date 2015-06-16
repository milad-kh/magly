// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {

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
    //// function of cordova
    
    //
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
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
      });
      $rootScope.$on('signOutOfApp', function(args){
        $scope.showSignIn = checkUserAuth.isUserLogin();        
      });
    }

  })
  
  .state('signin', {
      url: "/signin",
      templateUrl: "templates/signin.html",
      controller: 'signinCtrl'
    })

  .state('signup', {
      url: "/signup",
      templateUrl: "templates/signup.html",
      controller: 'signupCtrl'
    })

  .state('aboutus', {
      url: "/aboutus",
      templateUrl: "templates/aboutus.html"
    })

  .state('comment', {
      url: "/post/:postID/comment",
      templateUrl: "templates/comments.html"
    })

  .state('contactus', {
      url: "/contactus",
      templateUrl: "templates/contactus.html"
    })

  .state('material', {
      url: "/material/:postID",
      templateUrl: "templates/material.html",
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
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/chats');

});

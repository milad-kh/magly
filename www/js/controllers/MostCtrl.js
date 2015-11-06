(function(root, ng, _, $){
  ng
  .module('mostController', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])

.controller('MostCtrl', function(generalActions,$ionicScrollDelegate, $state, $ionicLoading, $localstorage, $rootScope, $scope, $http, $ionicPopup, $cordovaSocialSharing){
  console.warn('MostCtrl initialized');
  $scope.$on('$ionicView.afterEnter', function(){
    $scope.posts = $localstorage.getObject('most');
    $localstorage.setObject('cat','most');
    if (_.isEmpty($scope.posts))
    {
      $ionicLoading.show({
        template:'<span class="yekan">... در حال بارگذاری</span>'
      });
    }
    $scope.fillMostPosts();
    var settings = $localstorage.getObject('settings');
    // $ionicScrollDelegate.getScrollView().options.speedMultiplier = settings.scrollSpeed;
  });

  $scope.shareToSocial = function(postID)
  {
    generalActions.shareToSocial(postID);
  };

  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
    })

  $scope.goToComment = function(postID)
  {
    $state.go('comment',({postID:postID}))
  }

  $scope.sendLike = function(postID)
  {
   generalActions.sendLike(postID);
    $scope.$on('updatePostsForLike', function(){
      console.log('updatePostsForLike done!');
      $scope.posts = $localstorage.getObject('most');
    });
  };

   $scope.addToFavorite = function(postID)
  {
    generalActions.addToFavorite(postID)
    $scope.$on('updatePosts', function(data){
      console.log('dar in lahze update shod');
      $scope.posts = $localstorage.getObject($localstorage.getObject('cat'));
    });
  };

  $scope.mailArticleToFriend = function(postID) {
    generalActions.mailArticleToFriend(postID);
  };
  $scope.ch = function(id)
  {
    console.log(id);
    $state.go('tab.chat-detail', ({chatId:id}));
  }
  var userInfo = $localstorage.getObject('userInfo');
  $scope.fillMostPosts = function()
  {
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/mostVisitedPosts.php?userID='+userInfo.ID,
      cache: false
    }).success(function(data,status,headers,config){
      console.log(data);
      $scope.posts = data;
      $localstorage.setObject('most', $scope.posts);
      $ionicLoading.hide();
    }).error(function(data,status,headers,config){
      console.log('error in get categories');
      $ionicLoading.hide();
    });
  }
})

}
)(this, this.angular, this._, this.jQuery);

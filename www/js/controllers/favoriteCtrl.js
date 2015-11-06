(function(root, ng, _, $){
  ng
  .module('favoriteController', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])
  .controller('favoriteCtrl', function(generalActions,$ionicScrollDelegate, $ionicLoading, $scope, $localstorage, $http, $ionicPopup, $cordovaSocialSharing, $state, checkUserAuth){
    console.warn('favoriteCtrl initialized');
    $scope.ch = function(id)
    {
      console.log(id);
      $state.go('tab.chat-detail', ({chatId:id}));
    };

    $scope.isPostInCollection = function(postId, collection)
    {
      var
      flag = false;
      ng.forEach(collection, function(post){
        if (postId == post.ID)
          flag = true;
      });
      if (flag)
        return true;
    }

    $scope.$on('$ionicView.afterEnter', function(){
      $localstorage.setObject('cat', 'favoritePosts');
      $ionicScrollDelegate.scrollTop();
      if (_.isEmpty($localstorage.getObject('favoritePosts')))
        $ionicLoading.show({
            template: '<span class=yekan>... بارگذاری</span>'
          });
      else
        $scope.favoritePosts = $localstorage.getObject('favoritePosts');
      $scope.info = $localstorage.getObject('userInfo');
      if (_.isEmpty($scope.info[0]))
        $scope.userID = $scope.info.ID;
      else
        $scope.userID = $scope.info[0].ID;
      console.info($scope.userID);
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/listMyFavoritePosts.php?userID='+$scope.userID
      }).success(function(data,status,headers,config){
        console.info(data);
        if(!_.isEmpty(data) && data != 'null')
        {
          $localstorage.setObject('favoritePosts', data);
          $scope.favoritePosts = $localstorage.getObject('favoritePosts');
        }

        console.info($scope.favoritePosts);
        $ionicLoading.hide();
      }).error(function(data,status,headers,config){
        console.log('error in update!');
      });
      var settings = $localstorage.getObject('settings');
      // $ionicScrollDelegate.getScrollView().options.speedMultiplier = settings.scrollSpeed;
    });

    $scope.shareToSocial = function(postID)
    {
      generalActions.shareToSocial(postID);
    };

    $scope.addToFavorite = function(postID)
    {
      generalActions.addToFavorite(postID)
      $scope.$on('updatePosts', function(){
        $scope.favoritePostsTemps=[];
        console.log('dar in lahze update shod');
        $scope.favoritePosts = $localstorage.getObject($localstorage.getObject('cat'));
        console.log($scope.favoritePosts);
        ng.forEach($scope.favoritePosts, function(post){
          if(post.isFavorite)
            $scope.favoritePostsTemps.push(post);
        })

        $scope.favoritePosts = $scope.favoritePostsTemps;
        $localstorage.setObject('favoritePosts', $scope.favoritePosts);
        $ionicScrollDelegate.resize();
        if(_.isEmpty($scope.favoritePosts))
          delete $scope.favoritePosts;
      });
    };

    $scope.sendLike = function(postID)
    {
      generalActions.sendLike(postID);
    };

    $scope.goToComment = function(postID)
    {
      $state.go('comment',({postID:postID}))
    }

    $scope.mailArticleToFriend = function(postID) {
      generalActions.mailArticleToFriend(postID);
    };
  });

  }
)(this, this.angular, this._, this.jQuery);

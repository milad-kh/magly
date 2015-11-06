(function(root, ng, _, $){
  ng
  .module('ChatsController', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])

.controller('ChatsCtrl', function(generalActions, $window, $ionicScrollDelegate, $ionicLoading, $cordovaToast, $cordovaDialogs, $cordovaVibration, $ionicPopup, $rootScope, $ionicModal, $cordovaSocialSharing, $ionicLoading, $localstorage, $http, $scope, $state,  $ionicActionSheet, checkUserAuth) {
  console.warn('ChatsCtrl initialized', $window);

  $scope.t=[];
  for (var x=0;x<5000;x++)
  {
    $scope.t.push(x);
  }

  $scope.scrollScreen = function(dir)
  {

   if (dir == 'up')
      $ionicScrollDelegate.scrollTop(true);
    else
      $ionicScrollDelegate.scrollBottom(true);
  };

  $scope.shareToSocial = function(postID)
  {
    generalActions.shareToSocial(postID);
  };

  $scope.$on('$ionicView.beforeLeave', function(){
    if ($localstorage.getObject('cat') == 'all' || _.isEmpty($localstorage.getObject('cat')))
      {
        console.info('akharin posta: ', $scope.posts);
      }
  });

  $scope.$on('$ionicView.afterEnter', function(){
    if($localstorage.getObject('cat') != $localstorage.getObject('orginalCat'))
      $localstorage.setObject('cat', $localstorage.getObject('orginalCat'));
    $scope.settings = $localstorage.getObject('settings');
    var catID = $localstorage.getObject('cat');

    if (_.isEmpty($localstorage.getObject('cat')))
    {
      $localstorage.setObject('orginalCat', 'all');
      $localstorage.setObject('cat', 'all');
    }
    ng.forEach($localstorage.getObject('categories'), function(category){
      if (catID == category.cat_ID)
        $scope.categoryName = category.name;
    });
    $scope.showSignIn = checkUserAuth.isUserLogin();
    var cat = $localstorage.getObject('cat');
    if(_.isEmpty($localstorage.getObject('cat')))
    {
      $localstorage.setObject('cat', 'all');
      $scope.categoryName = 'همه مقالات';
      $scope.doesLocalHaveData('all');
    }
    else
    {
      if (cat == 'all')
      {
        console.info('injast alan');
        $scope.posts = $localstorage.getObject('all');
        if (_.isEmpty($scope.posts))
          $scope.doesLocalHaveData('all');
      }
      else
      {
        if(_.isEmpty($localstorage.getObject(cat)))
          $scope.doesLocalHaveData(cat);
        else
          $scope.posts = $localstorage.getObject(cat);
      }
    }
    $ionicScrollDelegate.resize();
    var settings = $localstorage.getObject('settings');
    $ionicScrollDelegate.getScrollView().options.speedMultiplier = settings.scrollSpeed;
      $ionicScrollDelegate.getScrollView().options.penetrationDeceleration = 0.08;
  });

  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
    })

  $scope.showSignIn = checkUserAuth.isUserLogin();
  $scope.showSearchItem = true;

  $scope.goToComment = function(postID)
  {
    $state.go('comment',({postID:postID}));
  };

  $scope.sendLike = function(postID)
  {
    generalActions.sendLike(postID);
    $scope.$on('updatePostsForLike', function(){
      console.log('updatePostsForLike done!');
      $scope.posts = $localstorage.getObject('all');
    });
  };

  $scope.mailArticleToFriend = function(postID) {
    generalActions.mailArticleToFriend(postID);
  };

  $scope.addToFavorite = function(postID)
  {
    generalActions.addToFavorite(postID)
    $scope.$on('updatePosts', function(data){
      console.log('dar in lahze update shod');
      $scope.posts = $localstorage.getObject($localstorage.getObject('cat'));
    });
  };

  $scope.getMaxOfArray = function(numArray) {
      return Math.max.apply(null, numArray);
    }

    $scope.getMinOfArray = function(numArray) {
      return Math.min.apply(null, numArray);
    }
  $scope.loadMoreDataForTop = function()
    {
      var userInfo = $localstorage.getObject('userInfo');
      var cat = $localstorage.getObject('cat');
      newPosts = {};
      console.log('top');
      console.log(cat);

      var biggestIDinPosts = $scope.posts[0].ID;
      console.info('biggestIDinPosts', biggestIDinPosts);

      var postsInLocal = $localstorage.getObject(cat);
      console.info(postsInLocal);
      var biggestIDinLocal = postsInLocal[0];
      console.info('biggestIDinLocal', biggestIDinLocal.ID);

      var i = 0;
      biggestIDinPosts ++ ;
      while (biggestIDinPosts <= biggestIDinLocal.ID && i < $scope.settings.numberOfPostDownloaded)
      {
        ng.forEach(postsInLocal, function(post){
          if (post.ID == biggestIDinPosts)
          {
            newPosts[newPosts.length] = _.union(newPosts, post);
            i ++;
          }
          biggestIDinPosts ++;
        });
      }

      console.info('enghad az local giremun umad', newPosts);

      if(newPosts.length == undefined)
        newPosts.length = 0;
      console.log(newPosts.length);

      remainsPostsToGet = $scope.settings.numberOfPostDownloaded - newPosts.length;
      console.info('in tedad ro byad az net begirim ', remainsPostsToGet);
      if(remainsPostsToGet <= $scope.settings.numberOfPostDownloaded)
      {
        $http({
          method: 'GET',
          url:'http://www.magly.ir/HybridAppAPI/loadMoreDataForTop.php?biggestIDinLocal=' + biggestIDinLocal.ID +'&userID=' + userInfo.ID + '&numberToGetPost=' + remainsPostsToGet + '&category=' + cat,
          cache: false
        }).success(function(data,status,headers,config){
          if (!_.isEmpty(data))
            data = data.reverse()
          $scope.posts = _.union(data, newPosts, $scope.posts);

          localStorage.removeItem(cat);
          $localstorage.setObject(cat,$scope.posts);
          if (!_.isEmpty(data))
          {
            if ($scope.settings.vibrateWhenNewPostsDownloaded)
            {
              console.info('vibrate');
              // $cordovaVibration.vibrate(700);
            }
            if($scope.settings.beepWhenNewPostsDownloaded)
            {
              console.info('beep');
              // $cordovaDialogs.beep(1);
            }
          }
          $scope.$broadcast('scroll.refreshComplete');
          console.warn('haji amaliat b payan resid', data);

        }).error(function(data,status,headers,config){
          console.log('error in get data for top');
        });
      }
      else
      {
        $scope.posts = _.union(newPosts, $scope.posts);
        $scope.$broadcast('scroll.refreshComplete');
      }
};

    // check the number of posts in RAM

$scope.isPostInCollection = function(post, collection)
{
  var
  flag = false;
  ng.forEach(collection, function(collectionPost){
    if (post.ID == collectionPost.ID)
      flag = true;
  });
  if (flag)
    return true;
}

  $scope.loadMoreDataForDown = function()
  {
    var
    cat,
    newPosts = {};
    var category = $localstorage.getObject('cat');
    if (category == 'all')
      cat = 'all';
    else
      cat = category;
      var userInfo = $localstorage.getObject('userInfo');
    ///////////////////
    var smallestIDinPosts = $scope.posts [$scope.posts.length - 1];
    console.info('smallestIDinPosts', smallestIDinPosts.ID);

    var postsInLocal = $localstorage.getObject(cat);
    console.info(postsInLocal);
    var smallestIDinLocal = postsInLocal[postsInLocal.length - 1];
    console.info('smallestIDinLocal', smallestIDinLocal.ID);
    //////////////////
    smallestIDinPosts --;
    while (smallestIDinPosts >= smallestIDinLocal && i < $scope.settings.numberOfPostDownloaded)
    {
      ng.forEach(postsInLocal, function(post){
        if (post.ID == smallestIDinPosts)
        {
          newPosts[newPosts.length] = _.union(newPosts, post);
          i ++;
        }
        smallestIDinPosts --;
      });
    }
    if(newPosts.length == undefined)
      newPosts.length = 0;
    console.log(newPosts.length);
    if (newPosts.length <= $scope.settings.numberOfPostDownloaded)
    {
      var remainsPostsToGet = $scope.settings.numberOfPostDownloaded - newPosts.length;
      console.info('in tedad ro byad az net begirim ', remainsPostsToGet);

      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/loadMoreDataForDown.php?smallestIDinLocal=' + smallestIDinLocal.ID +'&userID='+userInfo.ID + '&numberToGetPost=' + remainsPostsToGet + '&category=' + cat,
        cache: false
      }).success(function(data,status,headers,config){
        if (!_.isEmpty(data))
        {
          $ionicLoading.hide();
        if ($scope.settings.vibrateWhenNewPostsDownloaded)
          {
            console.info('vibrate');
            // $cordovaVibration.vibrate(700);
          }
          if($scope.settings.beepWhenNewPostsDownloaded)
          {
            console.info('beep');
            // $cordovaDialogs.beep(1);
          }
        }
        console.info('data', data);
        newPosts = _.union(newPosts, data);
        $scope.posts = _.union($scope.posts, newPosts);
        $localstorage.setObject(cat, $scope.posts);
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
      }).error(function(data,status,headers,config){
        console.log('error in get posts for down');
        $ionicLoading.hide();
      });
    }
    else
    {
      $scope.posts = _.union($scope.posts, newPosts);
      $localstorage.setObject(cat, $scope.posts);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $ionicLoading.hide();
    }
    // $ionicLoading.hide();
  };

  $scope.ch = function(id)
  {
    $state.go('tab.chat-detail', ({chatId:id}));
  }
  $scope.fillLocalWithData = function(category)
    {
      var catID = $localstorage.getObject('cat');
      ng.forEach($localstorage.getObject('categories'), function(category){
        if (catID == category.cat_ID)
          $scope.categoryName = category.name;
      });
      if(_.isEmpty($scope.categoryName))
        $scope.categoryName = 'همه مقالات';
      console.info($scope.categoryName);
      $ionicLoading.show({
        template:'<span class="yekan"> در حال بارگذاری ' + $scope.categoryName + '</span><div class="yekan">لطفا شکیبا باشید</div>'
      });
      var userInfo = $localstorage.getObject('userInfo');
      $scope.posts = [];
      var randomInt = new Date().getTime();
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/showPostList.php?randomInt=' + randomInt + '&userID=' + userInfo.ID + '&category=' + category + '&numberOfPostDownloadedFirstTime=' + $scope.settings.numberOfPostDownloadedFirstTime,
        cache: false
      }).success(function(data,status,headers,config){
      console.info(data);
        $scope.posts = data;
        $localstorage.setObject(category, data);
        $ionicScrollDelegate.scrollTop();
        $ionicLoading.hide();
      }).error(function(data,status,headers,config){
        console.log('error in get posts');
        $ionicLoading.hide();
      });
    };

    $scope.doesLocalHaveData = function(category)
    {
      $scope.fillLocalWithData(category);
    };
})

}
)(this, this.angular, this._, this.jQuery);

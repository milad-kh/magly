(function(root, ng, _, $){
  ng
  .module('ChatDetailController', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])

.controller('ChatDetailCtrl', function(generalActions, $ionicScrollDelegate, $ionicHistory, $sce, $ionicLoading, $rootScope, $http, $ionicPopup, $cordovaSocialSharing, $ionicModal, $localstorage, $scope, $stateParams, $state, checkUserAuth) {
  console.warn('ChatDetailCtrl initialized');
  $scope.stripTag = function(str, tag)
  {
    var a, parent, div = document.createElement('div');
    div.innerHTML = str;
    a = div.getElementsByTagName( tag );
    while( a[0] ) {
        parent = a[0].parentNode;
        while (a[0].firstChild) {
            parent.insertBefore(a[0].firstChild, a[0]);
        }
        parent.removeChild(a[0]);
    }
    return div.innerHTML;
  };
  $scope.$on('$ionicView.afterEnter', function(){
    $scope.showSignIn = checkUserAuth.isUserLogin();
  });
  $scope.shareToSocial = function(postID)
  {
    generalActions.shareToSocial(postID);
  };

  $scope.scrollScreen = function(dir)
  {
    if (dir == 'up')
      $ionicScrollDelegate.scrollTop(true);
    else
      $ionicScrollDelegate.scrollBottom(true);
  };

  $scope.showSignIn = checkUserAuth.isUserLogin();
  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  }
  $scope.goToComment = function()
  {
    $state.go('comment',({postID:$stateParams.chatId}))
  }

  $scope.sendLike = function(postID) // we MUST GET postID from $stateParams
  {
    generalActions.sendLike(postID);
    $scope.$on('updatePostsForLike', function(){
      console.log('updatePostsForLike done!');
      $scope.posts = $localstorage.getObject($localstorage.getObject('cat'));
    });
  };

  $scope.mailArticleToFriend = function(postID) {
    generalActions.mailArticleToFriend(postID); // get from $stateParams

  };

  $scope.addToFavorite = function(postID)
  {
    generalActions.addToFavorite(postID)
    $scope.$on('updatePosts', function(data){
      console.log('dar in lahze update shod');
      $scope.posts = $localstorage.getObject($localstorage.getObject('cat'));
    });
  };

  var stateName = $ionicHistory.backView().stateName;
  console.info(stateName);
  if(stateName == 'tab.search')
    $scope.posts = $localstorage.getObject('search');
  if(stateName == 'tab.chat-detail')
    $scope.posts = $localstorage.getObject('relatedPosts');
  if(stateName == 'tab.most')
    $scope.posts = $localstorage.getObject('most');
  if(stateName == 'tab.favoriteList')
    $scope.posts = $localstorage.getObject('favoriteList');

  if (_.isEmpty($scope.posts))
  {
    var cat = $localstorage.getObject('cat');
    $scope.posts = $localstorage.getObject(cat);
    if(_.isEmpty($scope.posts))
    {
      $scope.posts = $localstorage.getObject('posts');
    }
  }

  angular.forEach($scope.posts, function(post){
    if (post.ID == $stateParams.chatId)
    {
      console.info(post);
      $ionicLoading.hide();
      $scope.targetPost = post;
      x = $sce.trustAsHtml($scope.targetPost.post_content);
      $scope.targetPost.post_content = x;
    }
  });

  // sample related post
  $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/relatedPosts.php?postID='+$stateParams.chatId
    }).success(function(data,status,headers,config){
        $scope.relatedPosts = data;
        $localstorage.setObject('relatedPosts', $scope.relatedPosts);
      // re-make scope.posts and localStorage
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
})

}
)(this, this.angular, this._, this.jQuery);

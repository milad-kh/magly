(function(root, ng, _, $){
  ng
  .module('searchController', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])
.controller('searchCtrl', function(generalActions, $ionicScrollDelegate, $ionicHistory, $stateParams, $rootScope, $ionicLoading, $scope, $localstorage, $ionicPopup, $http, $state, $cordovaSocialSharing){

  $scope.ch = function(id)
  {
    $state.go('tab.chat-detail', ({chatId:id}));
  };

  $scope.shareToSocial = function(postID)
  {
    generalActions.shareToSocial(postID);
  };

  $scope.$on('$ionicView.afterEnter', function(){
    if(!_.isEmpty($localstorage.getObject('search')))
      $scope.posts = $localstorage.getObject('search');
    console.info($scope.posts);
    $localstorage.setObject('cat', 'search');
    $scope.data = {};
    var settings = $localstorage.getObject('settings');
    // $ionicScrollDelegate.getScrollView().options.speedMultiplier = settings.scrollSpeed;
  });

  $scope.search = function()
  {
    if(_.isEmpty($scope.data.searchKey))
      $scope.data.searchKey = ' ';
    $scope.info = $localstorage.getObject('userInfo');
    if (_.isEmpty($scope.info[0]))
      $scope.userID = $scope.info.ID;
    else
      $scope.userID = $scope.info[0].ID;
    if($scope.data.searchKey.length > 3)
    {
      $ionicLoading.show({
        template: '<span class="yekan">... در حال جستجو</span><div class="yekan">لطفا شکیبا باشید</div>'
      });
      console.warn($scope);
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/search.php?searchKey='+$scope.data.searchKey+'&userID='+$scope.userID
      }).success(function(data,status,headers,config){
        console.log(data);
        //////////////////// update 'isLike' attr
        var localStorageLength = window.localStorage.length;
          var localstorageItemArray = [];
          for (var i = 0; i< localStorageLength; i++)
          {
            localstorageItemArray.push(window.localStorage.key(i));
          }
          ng.forEach(localstorageItemArray, function(localstorageObjectName){
            item = $localstorage.getObject(localstorageObjectName);
            ng.forEach(item, function(post){
              ng.forEach(data, function(searchedPost){
                if (post.ID == searchedPost.ID)
                  searchedPost.isLike = post.isLike;
              })
            });
          });
        /////////////////////
        $localstorage.setObject('search', data);
        $scope.posts = data;
        $ionicLoading.hide();
      }).error(function(data,status,headers,config){
        console.log('اصن خراه');
        $ionicLoading.hide();
      });
    }
    else
    {
      var alertPopup = $ionicPopup.alert({
        title: '<span class="yekan">راهنمایی</span>',
        template: '<span class="yekan">عبارت مورد جستجو باید بیشتر از 4 حرف داشته باشد</span>'
      });
      alertPopup.then(function(res) {
        console.log('Thank you for not eating my delicious ice cream cone');
      });
     $scope.data.searchKey ='';
    }
  }

  $scope.goToComment = function(postID)
  {
    $state.go('comment',({postID:postID}))
  }

  $scope.addToFavorite = function(postID)
  {
    generalActions.addToFavorite(postID)
  };
  $scope.$on('updatePosts', function(){
    console.log('dar in lahze update shod search');
    $scope.posts = $localstorage.getObject('search');
    console.info($scope.posts);
  });

  $scope.sendLike = function(postID)
  {
    generalActions.sendLike(postID);
    $scope.$on('updatePostsForLike', function(){
      console.log('updatePostsForLike done!');
      $scope.posts = $localstorage.getObject('search');
    });
  }

  $scope.mailArticleToFriend = function(postID)
  {
    generalActions.mailArticleToFriend(postID)
  };
})

}
)(this, this.angular, this._, this.jQuery);

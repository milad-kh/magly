(function(ng, _){
  ng
  .module('starter.controllers', ['localStorage', 'ngCordova'])

  .controller('DashCtrl', function($scope, $http, $state) {

  $scope.filterPostsByCategory = function(cat)
    {
      console.log(cat);
      $state.go('tab.chats');
      /*if (input == 'all')
      {
        console.log('hamaro neshun bede');
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
      }*/
      
    };

  $scope.showCategories = function()
    {
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/showCategoryList.php'
      }).success(function(data,status,headers,config){
        $scope.categories = data;
        console.log($scope.categories);
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });
    };

    $scope.showCategories();
})

.controller('ChatsCtrl', function($cordovaSocialSharing, $ionicLoading, $ionicPopover, $localstorage, $http, $scope, Chats, $state) {
   
  $ionicLoading.show({
    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
  });

  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.shareToSocial = function()
  {
    $cordovaSocialSharing
    .share('message', 'subject', 'file', 'link')
    .then(function(result) {
      console.log('successfully shared');
    }, function(err) {
      console.log('failed');
    });                
  }
  

  $scope.navigateToState = function(state)
  {
    $state.go(state);
    $scope.popover.hide();
  };
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.getMaxOfArray = function(numArray) {
      return Math.max.apply(null, numArray);
    }    

    $scope.getMinOfArray = function(numArray) {
      return Math.min.apply(null, numArray);
    }
  $scope.loadMoreDataForTop = function()
    {
      console.log('top');
      var IDarray = [];
      // step 1 : find biggest post ID in local
      ng.forEach($scope.posts, function(value){
        IDarray.push(value.ID);        
      });
      var biggestID = $scope.getMaxOfArray(IDarray);      
      // step 2 : Ajax request to server
        $http({
          method: 'GET',
          url:'http://www.magly.ir/HybridAppAPI/loadMoreDataForTop.php?biggestIDinLocal='+biggestID,
          cache: false
        }).success(function(data,status,headers,config){    
          var kol = _.union(data, $scope.posts);
          $scope.topData = data;
          $scope.posts = kol;
          localStorage.removeItem('posts');
          $localstorage.setObject('posts', $scope.posts);
          // also replace localStorage posts lists with new lists

        }).error(function(data,status,headers,config){
          console.log('error in get data for top');
        }).finally(function() {
       // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
        });      
      // step 4 : Arrange scope.posts object ASC
       // $scope.reArrangePosts();
    };

  $scope.loadMoreDataForDown = function()
    {      
      console.log('ejra');
      var IDarray = [];      
      ng.forEach($scope.posts, function(value){
        IDarray.push(value.ID);        
      });
      var smallestID = $scope.getMinOfArray(IDarray);
        $http({
          method: 'GET',
          url:'http://www.magly.ir/HybridAppAPI/loadMoreDataForDown.php?smallestIDinLocal=' + smallestID,
          cache: false
        }).success(function(data,status,headers,config){          
          var kol = _.union($scope.posts,data);                   
          $scope.posts = kol;
          console.log(kol);
          localStorage.removeItem('posts');
          $localstorage.setObject('posts',$scope.posts);
          $scope.$broadcast('scroll.infiniteScrollComplete');                    
        }).error(function(data,status,headers,config){
          console.log('error in get categories');
        });       
    };

  $scope.ch = function(id)
  {
    console.log(id);
    $state.go('tab.chat-detail', ({chatId:id}));
  }
  $scope.fillLocalWithData = function()
    {
      var randomInt = new Date().getTime();
      console.log(randomInt);
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/showPostList.php?catID=0&randomInt=' + randomInt,
        cache: true
      }).success(function(data,status,headers,config){                
        $scope.posts = data;
        $ionicLoading.hide();        
        $localstorage.setObject('posts', data);
      }).error(function(data,status,headers,config){
        console.log('error in get posts');
      });
    };

    $scope.fillLocalWithData();  
    ionic.material.ink.displayEffect();
})

.controller('ChatDetailCtrl', function($localstorage, $scope, $stateParams) {
  
  $scope.posts = $localstorage.getObject('posts');
  angular.forEach($scope.posts, function(post){
    if (post.ID == $stateParams.chatId)
      $scope.targetPost = post;
  });
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('favoriteCtrl' , function($state, $scope, $http, $localstorage){
  //

  $scope.displaySinglePost = function(postID)
  {      
    $state.go('post',({
      postID:postID
    }));
  }

  $scope.favoritePosts = {};
  $scope.info = $localstorage.getObject('userInfo');
  $http({
    method: 'GET',
    url:'http://www.magly.ir/HybridAppAPI/listMyFavoritePosts.php?userID='+15,
    cache: false
    }).success(function(data,status,headers,config){          
      console.log(data);        
      $scope.FavoritePosts = data;
    }).error(function(data,status,headers,config){
      console.log('error in get categories');
    });

    $scope.goHome = function()
    {
      $state.go('home');
    }

    ionic.material.ink.displayEffect();
  //
});

}
)(this.angular, this._);
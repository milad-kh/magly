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
        $scope.categories = [['milad','hasan'],['ali','taghi'],['naghi','jafar']];        
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });
    };

    $scope.showCategories();
})

.controller('MostCtrl', function($scope, $http, $ionicPopover){
  console.warn('MostCtrl initialized');
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/mostVisitedPosts.php',
      cache: false
    }).success(function(data,status,headers,config){          
      console.log(data);
      $scope.posts = data;          
    }).error(function(data,status,headers,config){
      console.log('error in get categories');
    });    
})

.controller('ChatsCtrl', function($cordovaSocialSharing, $ionicLoading, $ionicPopover, $localstorage, $http, $scope, Chats, $state) {
   
  $ionicLoading.show({
    template: '<span class=yekan>... بارگذاری مطالب</span>'
  });

  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
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
    // ionic.material.ink.displayEffect();
})

.controller('signupCtrl', function($scope, $ionicPopover){
  console.warn('signinCtrl initialized');

  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.signup = function()
    {
      console.log($scope.info);    
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/signup.php?fullName='+$scope.info.fullName+'&niceName='+$scope.info.niceName+'&email='+$scope.info.email+'&password='+encodeURIComponent($scope.info.password),
        cache: false
        }).success(function(data,status,headers,config){          
          console.log(data);
          
        }).error(function(data,status,headers,config){
          console.log('error in get categories');
        });      
    }
})

.controller('signinCtrl', function($scope, $ionicPopover){
  console.warn('signinCtrl initialized');
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.signin = function()
    {      
      console.log($scope.info);
      $http({
          method: 'GET',
          url:'http://www.magly.ir/HybridAppAPI/signin.php?username='+$scope.info.username+'&password='+encodeURIComponent($scope.info.password)+'&a=1',
          cache: false
        }).success(function(data,status,headers,config){          
          console.log(data);
          if(data.status == 'ok')
          {
            $localstorage.setObject('userInfo',data.info);
            $state.go('home');
          }
        }).error(function(data,status,headers,config){
          console.log('error in get categories');
        });
    }
})

.controller('ChatDetailCtrl', function($ionicPopup, $cordovaSocialSharing, $ionicModal, $localstorage, $scope, $stateParams, $state) {


  $scope.showPopup = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="text" autofocus ng-model="data.email">',
    title: '<span class=yekan>ایمیل را وارد کنید</span>',
    // subTitle: 'your friend email',
    scope: $scope,
    buttons: [
      { text: '<span class=yekan>لغو</span>' },
      {
        text: '<span class=yekan><b>بفرست</b></span>',
        type: 'button-positive',
        onTap: function(e) {
          if ($scope.data.email != '')
          {
            $http({
              method: 'GET',
              url:'http://www.magly.ir/HybridAppAPI/emailToAFriend.php?postID='+$stateParams.postID+'&email='+$scope.data.email
            }).success(function(data,status,headers,config){
              console.log(data);
            }).error(function(data,status,headers,config){
              console.log('error in update!');
            });                            
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    if ($scope.data.email == '')
      console.log('Tapped!', res);
  });
};

  $scope.shareToSocial = function()
  {
    $cordovaSocialSharing
    .shareViaTwitter('message', 'http://magly.ir/wp-content/uploads/2015/05/rear.jpg', 'http://magly.ir/%D8%B7%D8%B1%D8%A7%D8%AD%DB%8C-%D9%85%D8%AC%D8%AF%D8%AF-%D9%81%D8%B6%D8%A7%DB%8C-%D8%AF%D8%A7%D8%AE%D9%84%DB%8C-%D9%85%D8%AD%D9%84-%DA%A9%D8%A7%D8%B1-%D9%88-%D8%B2%D9%86%D8%AF%DA%AF%DB%8C%D8%8C-%D8%A8/')
    .then(function(result) {
      console.log('successfully shared');
    }, function(err) {
      console.log('failed');
    });                
  }

  $scope.addToFavorite = function()
  {                                 
    if (_.isEmpty($localstorage.getObject('userInfo')))
    {
      alert('شما لاگین نیستید');
    }
    else
    {          
      $scope.info = $localstorage.getObject('userInfo');   
      console.log($scope.info);     
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/addToFavorite.php?userID='+$scope.info.ID+'&postID='+$stateParams.postID,
        cache: false
      }).success(function(data,status,headers,config){          
        console.log(data);
        var alertPopup = $ionicPopup.alert({
          title: 'نتیجه',
          template: 'به لیست دلخواه اضافه شد'
        });
        // we can do more here
        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        }); 

      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });                     
    };
                                    
                  
  };

  $scope.sendLike = function()
  {
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/sendLike.php?postID=4672'
    }).success(function(data,status,headers,config){
      console.log(data);
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
  };


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

.controller('commentCtrl', function($localstorage, $scope, $ionicModal, $stateParams){
  
  var postID = $stateParams.postID;
  var posts = $localstorage.getObject('posts');
  ng.forEach(posts, function(post){
    if (post.ID == postID)
      $scope.comments = post.comments;
  });

  $scope.sendComment = function()
  {
    console.log('sent comment...');

    var randomInt = new Date().getTime();
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/sendComment.php?postID=' + $stateParams.postID + '&randomInt=' + randomInt + '&name='+$scope.commentObject.name + '&email=' + $scope.commentObject.email + '&url=' + $scope.commentObject.url + '&comment=' + $scope.commentObject.comment
    }).success(function(data,status,headers,config){
      var tempObject = {
        comment_author : $scope.commentObject.name,
        comment_content : $scope.commentObject.comment
      };
      $scope.currentComment = _.union($scope.currentComment, tempObject);
      console.log(data);
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
  };
  console.log($scope.comments);
  $ionicModal.fromTemplateUrl('templates/sendCommentForm.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  // ionic.material.ink.displayEffect();
})

.controller('favoriteCtrl' , function($ionicPopover, $state, $scope, $http, $localstorage){
  
  console.warn('signinCtrl initialized');
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.removeFromFavorite = function()
  {
    alert('remove this post');
  }

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

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

    // ionic.material.ink.displayEffect();
  //
});

}
)(this.angular, this._);
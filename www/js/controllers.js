(function(ng, _, $){
  ng
  .module('starter.controllers', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])
  
  .controller('DashCtrl', function($interval, $cordovaToast, $cordovaNetwork, $cordovaDialogs, $cordovaVibration, $ionicLoading, $cordovaSocialSharing, $rootScope, $localstorage, $scope, $http, $state,checkUserAuth, generalActions) {
  
  // $interval(refreshCategoryImages, 4000);
  var categories = $localstorage.getObject('categories');
  var categoriesArray = [];
  ng.forEach(categories, function(row){
    ng.forEach(row, function(category){
      if (!_.isEmpty(category))
        categoriesArray.push(category);
    });
  });
  function refreshCategoryImages()
  {
    var randomCategory = Math.floor((Math.random() * categoriesArray.length-1) + 1);
    var targetCategory = categoriesArray[randomCategory];
    // console.info(targetCategory.cat_ID);
    // console.info(document.getElementById(targetCategory.cat_ID).src);
    $http({
       method: 'GET',
       cache:false,
       url:'http://www.magly.ir/HybridAppAPI/getCategoryImage.php?catID=' + targetCategory.cat_ID + '&oldImage=' + document.getElementById(targetCategory.cat_ID).src + '&data=' + new Date()
     }).success(function(data,status,headers,config){
        console.warn(targetCategory.cat_ID);
        console.warn(document.getElementById(targetCategory.cat_ID).src);
        console.warn(data);
        console.warn('...................................................');
        if(!_.isEmpty(data) && data != 'http://magly.ir/wp-includes/images/media/default.png')          
        {
          $("#"+targetCategory.cat_ID).fadeOut();
          document.getElementById(targetCategory.cat_ID).src = data[0];
          $("#"+targetCategory.cat_ID).fadeIn();
        }
     }).error(function(data,status,headers,config){
          console.info('error in internet');
     });
  };

  $scope.$on('$ionicView.afterEnter', function(){
    $scope.categories = $localstorage.getObject('categories');
    if (_.isEmpty($scope.categories))
      {
      $ionicLoading.show({
          template: '<span class=yekan>... بارگذاری دسته ها</span>'
        });
        }
    $scope.showCategories();
  });

  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
    });

  console.warn('DashCtrl initialized');

  $scope.filterPostsByCategory = function(catID)
  {
    console.log(catID);
    $localstorage.setObject('cat', catID);
    $state.go('tab.chats');
    $rootScope.$broadcast('scrollToTop');
  };


  $scope.whatClassIsIt = function(index)
  {
    if (index % 2 == 0)
      return 'item-thumbnail-left rtl'
    else
      return 'item-thumbnail-right'
  }

  $scope.showCategories = function()
  {
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/showCategoryList.php'      
    }).success(function(data,status,headers,config){    
      
      $scope.categories = data;
      console.info($scope.categories);
      $localstorage.setObject('categories', $scope.categories);
      $ionicLoading.hide();
    }).error(function(data,status,headers,config){
      console.log('error in get categories');
      $ionicLoading.hide();

    });
  };
})

.controller('MostCtrl', function(generalActions, $state, $ionicLoading, $localstorage, $rootScope, $scope, $http, $ionicPopup, $cordovaSocialSharing){
  console.warn('MostCtrl initialized');
  
  $scope.$on('$ionicView.afterEnter', function(){
    $scope.posts = $localstorage.getObject('most');    
    if (_.isEmpty($scope.posts))
    {    
      $ionicLoading.show({
        template:'<span class="yekan">... در حال بارگذاری</span>'
      });
    }
    $scope.fillMostPosts();    
  });
  
  $scope.shareToSocial = function(postID, host)
  {
    generalActions.shareToSocial(postID, host);
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
    $scope.posts = $localstorage.getObject('most');
    console.info($scope.posts);
  };

   $scope.addToFavorite = function(postID)
  {
    generalActions.addToFavorite(postID);
    $scope.posts = $localstorage.getObject('most');                                                  
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

  $scope.shareToSocial = function(postID, host)
  {
    generalActions.shareToSocial(postID, host);
  };

  $scope.$on('$ionicView.beforeLeave', function(){
    if ($localstorage.getObject('cat') == 'all' || _.isEmpty($localstorage.getObject('cat')))
      {
        console.info('akharin posta: ', $scope.posts);
      }
  });

  $scope.$on('$ionicView.afterEnter', function(){
    var catID = $localstorage.getObject('cat');
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
    $scope.posts = $localstorage.getObject('posts');
  };

  $scope.mailArticleToFriend = function(postID) {    
    generalActions.mailArticleToFriend(postID);
  };

  $scope.addToFavorite = function(postID)
  {
    generalActions.addToFavorite(postID);
    $scope.posts = $localstorage.getObject('posts');    
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
      while (biggestIDinPosts <= biggestIDinLocal.ID && i < 3)
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

      remainsPostsToGet = 3 - newPosts.length;
      console.info('in tedad ro byad az net begirim ', remainsPostsToGet);
      if(remainsPostsToGet <= 3)
      {
        $http({
          method: 'GET',
          url:'http://www.magly.ir/HybridAppAPI/loadMoreDataForTop.php?biggestIDinLocal=' + biggestIDinLocal.ID +'&userID=' + userInfo.ID + '&numberToGetPost=' + remainsPostsToGet + '&category=' + cat,
          cache: false
        }).success(function(data,status,headers,config){
          $scope.posts = _.union(data, newPosts, $scope.posts);          
          
          localStorage.removeItem(cat);
          $localstorage.setObject(cat,$scope.posts);

         /* $cordovaVibration.vibrate(700);
          $cordovaDialogs.beep(1);*/
          
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
    while (smallestIDinPosts >= smallestIDinLocal && i < 3)
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
    if (newPosts.length <= 3)
    {
      var remainsPostsToGet = 3 - newPosts.length;
      console.info('in tedad ro byad az net begirim ', remainsPostsToGet);
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/loadMoreDataForDown.php?smallestIDinLocal=' + smallestIDinLocal.ID +'&userID='+userInfo.ID + '&numberToGetPost=' + remainsPostsToGet + '&category=' + cat,
        cache: false
      }).success(function(data,status,headers,config){          
        console.info('data', data);
        newPosts = _.union(newPosts, data);          
        $scope.posts = _.union($scope.posts, newPosts);
        $localstorage.setObject(cat, $scope.posts);
        $scope.$broadcast('scroll.infiniteScrollComplete');                          
      }).error(function(data,status,headers,config){
        console.log('error in get posts for down');
      });
    }
    else
    {
      $scope.posts = _.union($scope.posts, newPosts);                   
      $localstorage.setObject(cat, $scope.posts);
      $scope.$broadcast('scroll.infiniteScrollComplete');                          
    } 
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
      console.info($scope.categoryName);
      $ionicLoading.show({
        template:'<span class="yekan"> در حال بارگذاری ' + $scope.categoryName + '</span><div class="yekan">لطفا شکیبا باشید</div>'
      });
      var userInfo = $localstorage.getObject('userInfo');
      $scope.posts = [];
      var randomInt = new Date().getTime();
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/showPostList.php?randomInt=' + randomInt + '&userID=' + userInfo.ID + '&category=' + category, 
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

.controller('signupCtrl', function($ionicLoading,$ionicHistory, $state, $ionicPopup, $localstorage, $rootScope, $scope, $http, checkUserAuth){
  console.warn('signupCtrl initialized');
  
  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  }

  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
    })
  $scope.$on('$ionicView.afterEnter', function(){    
    $scope.info = {};    
  });
  $scope.showSignIn = checkUserAuth.isUserLogin(); 
  console.warn('signinCtrl initialized');

  $scope.signup = function()
    {
      $ionicLoading.show({
        template:'<span class="yekan">... لطفا شکیبا باشید</span>'
      });
      console.log($scope.info);    
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/signup.php?fullName='+$scope.info.fullName+'&niceName='+$scope.info.niceName+'&email='+$scope.info.email+'&password='+encodeURIComponent($scope.info.password),
        cache: false
        }).success(function(data,status,headers,config){          
          console.log(data);
          if (data[1] == 'ok')
          {            
          $ionicLoading.hide();  
          // delete extra information
          localStorage.removeItem('posts');
          localStorage.removeItem('userInfo');
          //
          $localstorage.setObject('userInfo', data[0]);
          // show a message to user
          
           var alertPopup = $ionicPopup.alert({
             title: '<span class="yekan">تبریک</span>',
             template: '<span class="yekan">شما با موفقیت ثبت نام شدید</span>'
           });
           alertPopup.then(function(res) {

             $state.go('tab.chats');
           });
         }
         if (data[1] == 'repeat')
         {
          $ionicLoading.hide();           
           var alertPopup = $ionicPopup.alert({
             title: '<span class="yekan">خطا</span>',
             template: '<span class="yekan">کاربری با این ایمیل وجود دارد</span>'
           });

           alertPopup.then(function(res) {
             $scope.info = {};
           });
         }
          //
          
        }).error(function(data,status,headers,config){
          console.log('error in get categories');
        });      
    }
})
.controller('searchCtrl', function(generalActions, $rootScope, $ionicLoading, $scope, $localstorage, $ionicPopup, $http, $state, $cordovaSocialSharing){
  
  $scope.ch = function(id)
  {
    $state.go('tab.chat-detail', ({chatId:id}));
  };

  $scope.shareToSocial = function(postID, host)
  {
    generalActions.shareToSocial(postID, host);                
  };

  $scope.$on('$ionicView.afterEnter', function(){  
    $scope.data = {};
  });

  $scope.search = function()
  {
    if(_.isEmpty($scope.data.searchKey))
      $scope.data.searchKey = ' ';
    if($scope.data.searchKey.length > 4)
    {
      $ionicLoading.show({
        template: '<span class="yekan">... در حال جستجو</span><div class="yekan">لطفا شکیبا باشید</div>'
      });
      console.warn($scope);
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/search.php?searchKey='+$scope.data.searchKey
      }).success(function(data,status,headers,config){
        console.log(data);
        $localstorage.setObject('search', data);
        $scope.posts = data;
        $ionicLoading.hide();
      }).error(function(data,status,headers,config){
        console.log('error in update!');
        $ionicLoading.hide();
      });
    }
    else
    {
      var alertPopup = $ionicPopup.alert({
        title: '<span class="yekan">خطا در جستجو</span>',
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
    generalActions.addToFavorite(postID);      
    $scope.posts = $localstorage.getObject('search');
  };
  
  $scope.sendLike = function(postID)
  {
    generalActions.sendLike(postID);
  }

  $scope.mailArticleToFriend = function(postID)
  {
    generalActions.mailArticleToFriend(postID)
  };    
})

.controller('ChatDetailCtrl', function(generalActions,$ionicHistory, $sce, $ionicLoading, $rootScope, $http, $ionicPopup, $cordovaSocialSharing, $ionicModal, $localstorage, $scope, $stateParams, $state, checkUserAuth) {
  console.warn('ChatDetailCtrl initialized');
  $scope.shareToSocial = function(postID)
  {
    generalActions.shareToSocial(postID);
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
    $scope.targetPost.isLike = !$scope.targetPost.isLike;
  };

  $scope.mailArticleToFriend = function(postID) {
    generalActions.mailArticleToFriend(postID); // get from $stateParams

  };

  $scope.addToFavorite = function(postID)
  {            
    generalActions.addToFavorite(postID); // get postID from $stateParams  
    $scope.targetPost.isFavorite = !$scope.targetPost.isFavorite;
  };

  var stateName = $ionicHistory.backView().stateName;
  console.info(stateName);
  if(stateName == 'tab.search')
    $scope.posts = $localstorage.getObject('search');
  if(stateName == 'tab.chat-detail')
    $scope.posts = $localstorage.getObject('relatedPosts');
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
        $localstorage.setObject('relatedPosts', data);
      // re-make scope.posts and localStorage
        // $scope.posts = _.union($scope.posts,data);                   
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });

  //

})

.controller('ProfileCtrl', function($ionicLoading, $rootScope, $ionicPopup, $scope, $localstorage, $state, $http, checkUserAuth ) {
  
  $scope.$on('$ionicView.afterEnter', function(){
    $scope.showSignIn = checkUserAuth.isUserLogin();
    $scope.info = $localstorage.getObject('userInfo');    
    if(_.isEmpty($scope.info))
    {
      $scope.info = {};
    }
  });  
  
  $scope.showForgetPassModal = function()
  {
    $scope.data = {};
    var info = $localstorage.getObject('userInfo');
    console.log(info);
    var myPopup = $ionicPopup.show({
    template: '<div><input autofocus type="password" ng-model="data.newPassword" class="yekan" style="direction:rtl" placeHolder="کلمه عبور جدید"></div><div><input style="direction:rtl" class="yekan" type="password" placeHolder="تکرار کلمه عبور" ng-model="data.confirmPassword"></div>',
    title: '<span class=yekan>تعویض کلمه عبور</span>',
    
    scope: $scope,
    buttons: [
      { text: '<span class=yekan>بستن</span>' },
      {
        text: '<span class=yekan><b>عوض کن</b></span>',
        type: 'button-positive',        
        onTap: function(e) {
      if ($scope.data.newPassword == $scope.data.confirmPassword)
          {
            $ionicLoading.show({
                      template:'<span class="yekan">...لطفا شکیبا باشید</span>'
                    });
                    if ($scope.data.newPassword != '')
                    {
                      console.log($scope.data);
                      console.log(info);
                      $http({
                        method: 'GET',
                        url:'http://www.magly.ir/HybridAppAPI/updatePassword.php?newPassword=' + encodeURIComponent($scope.data.newPassword) + '&userID=' + info.ID
                      }).success(function(data,status,headers,config){
                        $ionicLoading.hide();              
                         var alertPopup = $ionicPopup.alert({
                           title:'<span class="yekan">پروفایل</span>',
                           template: '<span class="yekan" >کلمه عبور با موفقیت به روز شد.</span>'
                         });
                         alertPopup.then(function(res) {
                           console.log('Thank you for not eating my delicious ice cream cone');
                         });                            
                      }).error(function(data,status,headers,config){
                        var alertPopup = $ionicPopup.alert({
                          // title: 'Don\'t eat that!',
                          template: '<span class="yekan">خطا در اتصال به اینترنت</span>'
                        });
                        alertPopup.then(function(res) {
                          console.log('Thank you for not eating my delicious ice cream cone');
                        });   
          
                      });                            
                    }
                    else
                    {
                      console.warn('ye moshkeli hast');
                    }
                    }
                    else
                    {
                      var alertPopup = $ionicPopup.alert({
                       title: '<span class="yekan">خطا</span>',
                       template: '<span class="yekan">ورودی ها یکسان نیستند</span>'
                     });
                     alertPopup.then(function(res) {
                       console.log('Thank you for not eating my delicious ice cream cone');
                     });
                    }
        }

      }
    ]
  });
  
  }

  $scope.goToSignup = function()
  {
    $state.go('signup');
  }

  $scope.signOut = function()
  {
    localStorage.removeItem('userInfo'); 
    localStorage.removeItem('categories'); 
    localStorage.removeItem('most'); 
    localStorage.removeItem('posts'); 
    localStorage.removeItem('cat'); 
    localStorage.removeItem('favoritePosts'); 
    localStorage.removeItem('search'); 
    $scope.showSignIn = true;
    $scope.info = {};
    $rootScope.$broadcast('signOutOfApp');
  }

  $scope.info = $localstorage.getObject('userInfo');
  if (!$scope.info)
    $scope.info={};
  console.log($scope.info);
  console.log('umad b search:');
  // console
  $scope.signin = function()
  {      
    $ionicLoading.show({
      template:'<span class="yekan">... لطفا شکیبا باشید</span>'
    });
    console.log($scope.info);
    $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/signin.php?username='+$scope.info.username+'&password='+encodeURIComponent($scope.info.password),
        cache: false
      }).success(function(data,status,headers,config){          
        console.log(data);
        if(data.status == 'ok')
        {
          localStorage.removeItem('cat'); 
          localStorage.removeItem('favoritePosts'); 
          localStorage.removeItem('posts'); 

          $ionicLoading.hide();
          $localstorage.setObject('userInfo',data.info);  
          $scope.showSignIn = !$scope.showSignIn;        
          $state.go('tab.chats');
        }
        else
        {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            // title: 'Don\'t eat that!',
            template: '<span class="yekan">نام کاربری یا کلمه ی عبور اشتباه است</span>'
          });
          alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
          });
        }
      }).error(function(data,status,headers,config){
          var alertPopup = $ionicPopup.alert({
            // title: 'Don\'t eat that!',
            template: '<span class="yekan">خطا در اتصال به اینترنت</span>'
          });
          alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
          });                
      });
  }
})

.controller('commentCtrl', function($ionicTabsDelegate,$ionicHistory, $ionicLoading, $state, $rootScope,$http, $localstorage, $scope, $ionicModal, $stateParams){
  console.log('comments controller initialized');
  $scope.$on('$ionicView.afterEnter', function(){
    var userInfo = $localstorage.getObject('userInfo');  

    $scope.commentObject.name = userInfo.display_name;
    $scope.commentObject.email = userInfo.user_email;
    $scope.commentObject.url = userInfo.user_url;

    var postID = $stateParams.postID;
    var posts = $localstorage.getObject('posts');
    ng.forEach(posts, function(post){
      if (post.ID == postID)
      { 

        $scope.comments = post.comments;
      }
    });
    console.log($scope.comments);
  });
  $scope.commentObject = {};
  
  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  }

  $scope.sendComment = function()
  {
    
    console.log('sent comment...');
    $ionicLoading.show({
      template:'<span><div class="yekan">در حال ارسال نظر</div><div class="yekan">لطفا شکیبا باشید</div></span>'
    });
    var randomInt = new Date().getTime();    
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/sendComment.php?postID=' + $stateParams.postID + '&randomInt=' + randomInt + '&name='+$scope.commentObject.name + '&email=' + $scope.commentObject.email + '&url=' + $scope.commentObject.url + '&comment=' + $scope.commentObject.comment
    }).success(function(data,status,headers,config){          
      console.log(data);
      $scope.comments = data;
      $scope.posts = $localstorage.getObject('posts');
      ng.forEach($scope.posts, function(post){
        if (post.ID == $stateParams.postID)
        {
          post.comments = data;
        }
      });
      $localstorage.setObject('posts',$scope.posts);
      $ionicLoading.hide();
      $scope.commentObject = {};
      $ionicTabsDelegate.select(0);
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
  };

  $scope.openModal = function() {
    $scope.modal.show();
  };  
})

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

  $scope.$on('$ionicView.enter', function(){
    $ionicScrollDelegate.scrollTop();
    if($scope.favoritePosts != 'null' || !_.isEmpty($scope.favoritePosts))
      $scope.favoritePosts = $localstorage.getObject('favoritePosts');
    if (_.isEmpty($scope.favoritePosts))
      $ionicLoading.show({
          template: '<span class=yekan>... بارگذاری</span>'
        });
    $scope.info = $localstorage.getObject('userInfo');
    if (_.isEmpty($scope.info[0]))
      $scope.userID = $scope.info.ID;
    else
      $scope.userID = $scope.info[0].ID;
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/listMyFavoritePosts.php?userID='+$scope.userID
    }).success(function(data,status,headers,config){  

      if(!_.isEmpty(data))
      {
        $localstorage.setObject('favoritePosts', data);      
        $scope.favoritePosts = $localstorage.getObject('favoritePosts');
      }
      $ionicLoading.hide();
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
    $localstorage.setObject('favoritePosts', $scope.favoritePosts);
  });
  
  $scope.shareToSocial = function(postID, host)
  {
    generalActions.shareToSocial(postID, host);
  };

  $scope.addToFavorite = function(postID)
  {
    generalActions.addToFavorite(postID);
    $scope.favoritePosts = $localstorage.getObject('favoritePosts');
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
)(this.angular, this._, this.jQuery);
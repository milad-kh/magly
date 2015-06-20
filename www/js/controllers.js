(function(ng, _){
  ng
  .module('starter.controllers', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])
  
  .controller('DashCtrl', function($cordovaToast, $cordovaNetwork, $cordovaDialogs, $cordovaVibration, $ionicLoading, $cordovaSocialSharing, $rootScope, $localstorage, $scope, $http, $state, $ionicPopover,checkUserAuth, generalActions) {
  
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
      $scope.popover.hide();
    });

  console.warn('DashCtrl initialized');
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
  });
  
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $scope.filterPostsByCategory = function(catID)
  {
    console.log(catID);
    $localstorage.setObject('cat', catID);
    $state.go('tab.chats');
    $rootScope.$broadcast('scrollToTop');
  };

  $scope.showCategories = function()
  {
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/showCategoryList.php'      
    }).success(function(data,status,headers,config){    
      var arr = new Array();
      var tempArr = new Array();                  
      for(var i = 0;i<data[0].length;i++)
      {
        tempArr.push(data[0][i]);
        if(tempArr.length == 2)
        {
          arr.push(tempArr);
          tempArr = [];
        }
      }
      console.log(arr);
      $scope.categories = arr;
      $localstorage.setObject('categories', $scope.categories);
      $scope.all = data[1];
      console.log($scope.all);
      $ionicLoading.hide();
    }).error(function(data,status,headers,config){
      console.log('error in get categories');
      $ionicLoading.hide();
    });
  };
})

.controller('MostCtrl', function($state, $ionicLoading, $localstorage, $rootScope, $scope, $http, $ionicPopover, $ionicPopup, $cordovaSocialSharing){
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

  var
    message,
    title,
    link
  ;
  $scope.shareToSocial = function(postID)
  {
    console.info(postID);
    // fetch target post content
    _.each($scope.posts, function(post){
      if (post.ID == postID)
      {
        console.info('peida shod');
        message = post.summary[0];
        title = post.post_title;
        link = post.guid;
      }
    });    
    $cordovaSocialSharing
    .share(message, title, null, link)
    .then(function(result) {
      console.log('successfully shared');
    }, function(err) {
      console.log('failed');
    });                
  };

  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
      $scope.popover.hide();
    })

  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  $scope.goToComment = function(postID)
  {    
    $state.go('material',({postID:postID}))
  }

  $scope.sendLike = function(postID)
  {
    console.log('send like');
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/sendLike.php?postID='+postID
    }).success(function(data,status,headers,config){
      console.log(data);
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
    var posts = $localstorage.getObject('posts');
    console.log(posts);
    ng.forEach(posts, function(post){
      if (post.ID == postID)
      {
        post.isLike = ! post.isLike;
      }
    });
  localStorage.removeItem('posts');
  $localstorage.setObject('posts', posts);
  $scope.posts = $localstorage.getObject('posts');     
  };

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

   $scope.addToFavorite = function(postID)
  {
    $ionicLoading.show({
      template:'<span class="yekan">... لطفا شکیبا باشید</span>'
    });
    if (_.isEmpty($localstorage.getObject('userInfo')))
    {
      alert('شما لاگین نیستید');
    }
    else
    {         
      $scope.info = $localstorage.getObject('userInfo');   
      console.log(postID);
      console.log($scope.info);     
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/addToFavorite.php?userID='+$scope.info.ID+'&postID='+postID,
        cache: false
      }).success(function(data,status,headers,config){          
        console.log(data);
        ng.forEach($scope.posts, function(post){
          if(post.ID == postID)
            post.isFavorite = !post.isFavorite;
        })
        $localstorage.setObject('posts',$scope.posts);
        $ionicLoading.hide();
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });                     
    };
                                              
  };

  $scope.mailArticleToFriend = function(postID) {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input style="direction:ltr" type="text" autofocus ng-model="data.email">',
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
              url:'http://www.magly.ir/HybridAppAPI/emailToAFriend.php?postID='+postID+'&email='+$scope.data.email
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

.controller('ChatsCtrl', function($ionicScrollDelegate, $ionicLoading, $cordovaToast, $cordovaDialogs, $cordovaVibration, $ionicPopup, $rootScope, $ionicModal, $cordovaSocialSharing, $ionicLoading, $ionicPopover, $localstorage, $http, $scope, $state,  $ionicActionSheet, checkUserAuth) {
  console.warn('ChatsCtrl initialized');
  var
    message,
    title,
    link
  ;

  $scope.shareToSocial = function(postID)
  {
    console.info(postID);
    // fetch target post content
    _.each($scope.posts, function(post){
      if (post.ID == postID)
      {
        console.info('peida shod');
        message = post.summary[0];
        title = post.post_title;
        link = post.guid;
      }
    });    
    $cordovaSocialSharing
    .share(message, title, null, link)
    .then(function(result) {
      console.log('successfully shared');
    }, function(err) {
      console.log('failed');
    });                
  };
  $scope.$on('$ionicView.afterEnter', function(){
    $scope.showSignIn = checkUserAuth.isUserLogin();
    if (!_.isEmpty($localstorage.getObject('cat')))
    {
      ///////////////////
      if ($localstorage.getObject('cat') == 'all')
      {
        $scope.posts = $localstorage.getObject('posts');                      
      }
      else
      {
        console.warn('ye category');
        $scope.posts = $localstorage.getObject('posts');
        var currentCategoryPosts = [];
        ng.forEach($scope.posts, function(article){
          ng.forEach(article.catId, function(oneOfCatId){
            if ($localstorage.getObject('cat') == oneOfCatId.cat_ID)
            {              
              currentCategoryPosts.push(article);
            }
          })
        });        
        $scope.posts = currentCategoryPosts; 
        console.warn('inaram bayad neshun bede', $scope.posts);                     
      }
      ///////////////////
    }
    else
    {
      $scope.posts = $localstorage.getObject('posts');
      console.warn('alan bayad', $scope.posts);
      $scope.posts = $localstorage.getObject('posts');
    }
    if(_.isEmpty($localstorage.getObject('posts')))
      $scope.doesLocalHaveData();
    else
    {
      $ionicLoading.hide();
    }
    $scope.$on('scrollToTop', function(){

      console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.info($rootScope.prevState);
      if($rootScope.prevState == 'tab.dash')
      {
        console.info('bero bala');
      }
      else
      {
        $ionicScrollDelegate.scrollToTop(); 
      }
    });
  });

  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');                
    })

  $scope.showSignIn = checkUserAuth.isUserLogin(); 
  $scope.showSearchItem = true;

  $ionicModal.fromTemplateUrl('templates/my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.goToComment = function(postID)
  {    
    $state.go('material',({postID:postID}))
  }

  $scope.sendLike = function(postID)
  {
    console.log('send like');
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/sendLike.php?postID='+postID
    }).success(function(data,status,headers,config){
      console.log(data);
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
    var posts = $localstorage.getObject('posts');
    console.log(posts);
    ng.forEach(posts, function(post){
      if (post.ID == postID)
      {
        post.isLike = ! post.isLike;
      }
    });
  localStorage.removeItem('posts');
  $localstorage.setObject('posts', posts);
  $scope.posts = $localstorage.getObject('posts');     
  };

  $scope.mailArticleToFriend = function(postID) {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input style="direction:ltr" type="text" autofocus ng-model="data.email">',
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
              url:'http://www.magly.ir/HybridAppAPI/emailToAFriend.php?postID='+postID+'&email='+$scope.data.email
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

    $scope.addToFavorite = function(postID)
  {
    $ionicLoading.show({
      template:'<span class="yekan">... لطفا شکیبا باشید</span>'
    });
    $ionicLoading.show({
      template:'<span class="yekan">... لطفا شکیبا باشید</span>'
    });
    if (_.isEmpty($localstorage.getObject('userInfo')))
    {
      alert('شما لاگین نیستید');
    }
    else
    {         
      $scope.info = $localstorage.getObject('userInfo');   
      console.log(postID);
      console.log($scope.info);     
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/addToFavorite.php?userID='+$scope.info.ID+'&postID='+postID,
        cache: false
      }).success(function(data,status,headers,config){          
        console.log(data);
        ng.forEach($scope.posts, function(post){
          if(post.ID == postID)
            post.isFavorite = !post.isFavorite;
        })
        $localstorage.setObject('posts',$scope.posts);
        $ionicLoading.hide();
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });                     
    };
                                              
  };

  $scope.signOut = function()
  {
    localStorage.removeItem('userInfo'); 
    $scope.showSignIn = true; 
    $scope.popover.hide();           
  }

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $ionicLoading.show({
    template: '<span class=yekan>... بارگذاری مطالب</span>'
  });
  $scope.con = function()
  {
    $rootScope.$broadcast('searchTextchange', this.query);
  }

  $scope.$on('searchTextchange', function(event, args){
    $scope.query = args;
    console.log($scope.query);
  });

  $scope.$on('changeCategory', function(event, args){
    console.warn('badaz avaz shodan alan ina umadan inja baradar', args);
    $scope.posts = args;
    console.info('motaviate alane scope.posts:',$scope.posts);
  });

  
  

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
      if ($localstorage.getObject('cat') == 'all' || _.isEmpty($localstorage.getObject('cat')))
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
        if(data != null)
        {
          var kol = _.union(data, $scope.posts);
          $scope.topData = data;
          $scope.posts = kol;
          localStorage.removeItem('posts');
          $localstorage.setObject('posts', $scope.posts);          

          $cordovaVibration.vibrate(700);
          $cordovaDialogs.beep(1);

        }
        else
        {           
          $cordovaToast.show('داده ی جدید موجود نیست', 'long', 'top');         
         };        
          // also replace localStorage posts lists with new lists
        
        }).error(function(data,status,headers,config){
          console.log('error in get data for top');
        }).finally(function() {
       // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
         console.warn('haji amaliat b payan resid');
        });      
      // step 4 : Arrange scope.posts object ASC
       // $scope.reArrangePosts();
       }
    };

  $scope.loadMoreDataForDown = function()
    {    
    if ($localstorage.getObject('cat') == 'all' || _.isEmpty($localstorage.getObject('cat')))
    {  
      console.log('down');
      var userInfo = $localstorage.getObject('userInfo');
      console.log('inam data:', userInfo.ID);
      var IDarray = [];      
      ng.forEach($scope.posts, function(value){
        IDarray.push(value.ID);        
      });
      var smallestID = $scope.getMinOfArray(IDarray);
        $http({
          method: 'GET',
          url:'http://www.magly.ir/HybridAppAPI/loadMoreDataForDown.php?smallestIDinLocal=' + smallestID +'&userID='+userInfo.ID,
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
      }
    };

  $scope.ch = function(id)
  {
    console.log(id);
    $state.go('tab.chat-detail', ({chatId:id}));
  }
  $scope.fillLocalWithData = function()
    {
      $ionicLoading.show({
        template:'<span class="yekan">... در حال بارگذاری مطالب</span>'
      });
      var userInfo = $localstorage.getObject('userInfo');
      console.log('userInfo:', userInfo);
      $scope.posts = [];
      var randomInt = new Date().getTime();
      console.log(randomInt);
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/showPostList.php?catID=0&randomInt=' + randomInt + '&userID='+userInfo.ID,
        cache: false
      }).success(function(data,status,headers,config){                
        console.log(data);
        $scope.posts = data;
        $ionicLoading.hide();        
        $localstorage.setObject('posts', data);
      }).error(function(data,status,headers,config){
        console.log('error in get posts');
        $ionicLoading.hide();
      });
    };

    $scope.doesLocalHaveData = function()
    {
      var sign = $localstorage.getObject('posts');
      if(_.isEmpty(sign))
        {

        $scope.fillLocalWithData();    
        }
      else
        {
          $scope.posts = sign;
          console.log($scope.posts);                
        }

    };      

})

.controller('signupCtrl', function($ionicLoading, $state, $ionicPopup, $localstorage, $rootScope, $scope, $ionicPopover, $http, checkUserAuth){
  console.warn('signupCtrl initialized');
  
  $scope.backToHome = function()
  {
    $state.go('tab.chats');
  }

  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
      $scope.popover.hide();
    })
  $scope.$on('$ionicView.afterEnter', function(){    
    $scope.info = {};    
  });
  $scope.showSignIn = checkUserAuth.isUserLogin(); 
  console.warn('signinCtrl initialized');
  $scope.signOut = function()
  {
    localStorage.removeItem('userInfo');
  }
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
.controller('searchCtrl', function($ionicLoading, $scope, $localstorage, $ionicPopup, $http, $state, $cordovaSocialSharing){
  
  $scope.data = {};
  var
    message,
    title,
    link
  ;
  // $scope.searchKey = '';
  $scope.shareToSocial = function(postID)
  {
    console.info(postID);
    // fetch target post content
    _.each($scope.posts, function(post){
      if (post.ID == postID)
      {
        console.info('peida shod');
        message = post.summary[0];
        title = post.post_title;
        link = post.guid;
      }
    });    
    $cordovaSocialSharing
    .share(message, title, null, link)
    .then(function(result) {
      console.log('successfully shared');
    }, function(err) {
      console.log('failed');
    });                
  };

  $scope.$on('$ionicView.afterEnter', function(){  
    // $scope.posts = $localstorage.getObject('posts');
    // $scope.info = $localstorage.getObject('userInfo');
  });

  $scope.search = function()
  {
    $ionicLoading.show({
      template: '<span class="yekan">... در حال جستجو</span>'
    });
    console.warn($scope);
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/search.php?searchKey='+$scope.data.searchKey
    }).success(function(data,status,headers,config){
      console.log(data);
      $scope.posts = data;
      $ionicLoading.hide();
    }).error(function(data,status,headers,config){
      console.log('error in update!');
      $ionicLoading.hide();
    });
  }

  $scope.ch = function(id)
  {
    console.log(id);
    $state.go('tab.chat-detail', ({chatId:id}));
  }
  
  $scope.goToComment = function(postID)
  {    
    $state.go('material',({postID:postID}))
  }

  $scope.addToFavorite = function(postID)
  {
    $ionicLoading.show({
      template:'<span class="yekan">... لطفا شکیبا باشید</span>'
    });
    if (_.isEmpty($localstorage.getObject('userInfo')))
    {
      alert('شما لاگین نیستید');
    }
    else
    {         
      $scope.info = $localstorage.getObject('userInfo');   
      console.log(postID);
      console.log($scope.info);     
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/addToFavorite.php?userID='+$scope.info.ID+'&postID='+postID,
        cache: false
      }).success(function(data,status,headers,config){          
        console.log(data);
        var posts = $localstorage.getObject('posts');
        ng.forEach(posts, function(post){
          if(post.ID == postID)
          {
            post.isFavorite = !post.isFavorite;
          }
        });
        $localstorage.setObject('posts', posts);
        var posts = $localstorage.getObject('posts');
        $scope.posts = posts;
        $ionicLoading.hide();
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });                     
    };
                                              
  };
  
  $scope.sendLike = function(postID)
  {
    console.log('send like');
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/sendLike.php?postID='+postID
    }).success(function(data,status,headers,config){
      console.log(data);
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });

    var posts = $localstorage.getObject('posts');
    console.log(posts);
    ng.forEach(posts, function(post){
      if (post.ID == postID)
      {
        post.isLike = !post.isLike;
      }
    });
  localStorage.removeItem('posts');
  $localstorage.setObject('posts', posts);
  $scope.posts = $localstorage.getObject('posts');
  }

  $scope.mailArticleToFriend = function(postID) {
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
              url:'http://www.magly.ir/HybridAppAPI/emailToAFriend.php?postID='+postID+'&email='+$scope.data.email
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
})
.controller('signinCtrl', function($ionicLoading, $rootScope, $scope, $ionicPopover, $http, $localstorage, $state, checkUserAuth){
  console.warn('signinCtrl initialized');
  
  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      $scope.popover.hide();
    });

  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
      $scope.popover.hide();

    })

  $scope.info={};
  $scope.showSignIn = checkUserAuth.isUserLogin();
  $scope.init = function()
  {
    console.log('inja anjam midim');
  }

  $scope.signOut = function()
  {
    localStorage.removeItem('userInfo'); 
    $scope.showSignIn = false;
  }
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
      console.log($scope);
      $http({
          method: 'GET',
          url:'http://www.magly.ir/HybridAppAPI/signin.php?username='+$scope.info.username+'&password='+encodeURIComponent($scope.info.password)+'&a=1',
          cache: false
        }).success(function(data,status,headers,config){          
          console.log(data);
          if(data.status == 'ok')
          {
            $localstorage.setObject('userInfo',data.info);
            
            $state.go('tab.chats');

          }
        }).error(function(data,status,headers,config){
          console.log('error in get categories');
        });
    }
})

.controller('ChatDetailCtrl', function($ionicLoading, $rootScope, $http, $ionicPopup, $cordovaSocialSharing, $ionicModal, $localstorage, $scope, $stateParams, $state, checkUserAuth) {
  console.warn('ChatDetailCtrl initialized');
  
  var
    message,
    title,
    link
  ;
  $scope.shareToSocial = function(postID)
  {
    console.info(postID);
    // fetch target post content
    _.each($scope.posts, function(post){
      if (post.ID == postID)
      {
        console.info('peida shod');
        message = post.summary[0];
        title = post.post_title;
        link = post.guid;
      }
    });    
    $cordovaSocialSharing
    .share(message, title, null, link)
    .then(function(result) {
      console.log('successfully shared');
    }, function(err) {
      console.log('failed');
    });
  };


  $scope.showSignIn = checkUserAuth.isUserLogin();
  $scope.goBack = function()
  {
    $state.go('tab.chats');
  }  
  $scope.goToComment = function()
  {    
    $state.go('material',({postID:$stateParams.chatId}))
  }

  $scope.sendLike = function()
  {
    console.log('send like');
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/sendLike.php?postID='+$stateParams.postID
    }).success(function(data,status,headers,config){
      console.log(data);
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
  };

  $scope.mailArticleToFriend = function() {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input style="direction:ltr" type="text" autofocus ng-model="data.email">',
    title: '<span class=yekan>ایمیل را وارد کنید</span>',    
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
              url:'http://www.magly.ir/HybridAppAPI/emailToAFriend.php?postID='+$stateParams.chatId+'&email='+$scope.data.email
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

  $scope.addToFavorite = function()
  {            
  $ionicLoading.show({
      template:'<span class="yekan">... لطفا شکیبا باشید</span>'
    });      

    if (_.isEmpty($localstorage.getObject('userInfo')))
    {
      alert('شما لاگین نیستید');
    }
    else
    {         
      $scope.info = $localstorage.getObject('userInfo');   
      console.log($scope.info);    
      console.log($stateParams);    

      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/addToFavorite.php?userID='+$scope.info.ID+'&postID='+$stateParams.chatId,
        cache: false
      }).success(function(data,status,headers,config){          
        // re-make posts object
        ng.forEach($scope.posts, function(post){
          if(post.ID == $stateParams.chatId)
            post.isFavorite = !post.isFavorite;
        })
        
        $localstorage.setObject('posts',$scope.posts);
        //
        var alertPopup = $ionicPopup.alert({
          title: 'نتیجه',
          template: 'به لیست دلخواه اضافه شد'
        });
        // we can do more here
        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        }); 
        $ionicLoading.hide();
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });                     
    };
                                              
  };

  $scope.posts = $localstorage.getObject('posts');
  angular.forEach($scope.posts, function(post){
    if (post.ID == $stateParams.chatId)
    {
      $ionicLoading.hide();
      $scope.targetPost = post;
    }    
  });
  console.info('alan', $scope.targetPost);
  if (_.isEmpty($scope.targetPost))    
  {
    $ionicLoading.show({
      template:'<span class="yekan">...در حال دریافت مقاله ی مورد نظر</span>'
    });
    // here we get a post that does not in our list ($scope.posts)
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/getOnePost.php?postID='+$stateParams.chatId
    }).success(function(data,status,headers,config){ 
        console.info('inam yeki jadid', data);
        $ionicLoading.hide();
        $scope.targetPost = data;
      // re-make scope.posts and localStorage
        var kol = _.union($scope.posts,data);                   
        $scope.posts = kol;
        console.log(kol);
        localStorage.removeItem('posts');
        $localstorage.setObject('posts',$scope.posts);
      //                 
      console.log('target posts got :P');            
      console.log(data);            
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
  }

  // sample related post
  $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/relatedPosts.php?postID='+$stateParams.chatId
    }).success(function(data,status,headers,config){  
        $scope.relatedPosts = data;
      // re-make scope.posts and localStorage
        var kol = _.union($scope.posts,data);                   
        $scope.posts = kol;
        console.log(kol);
        localStorage.removeItem('posts');
        $localstorage.setObject('posts',$scope.posts);
      //                 
      console.log('related posts');            
      console.log(data);            
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
  
  $rootScope.$on('signOutOfApp', function(){
    console.info('fahmidim');
    $scope.showSignIn = true;
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

.controller('commentCtrl', function($ionicTabsDelegate, $ionicLoading, $state, $rootScope,$http, $localstorage, $scope, $ionicModal, $stateParams){
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
    console.log('mot',$stateParams);
    $state.go('tab.chat-detail',{chatId:$stateParams.postID});
  }

  $scope.sendComment = function()
  {
    $scope.modal.hide();
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
  $ionicModal.fromTemplateUrl('templates/sendCommentForm.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };  
})

.controller('favoriteCtrl', function($ionicLoading, $scope, $localstorage, $http, $ionicPopup, $cordovaSocialSharing, $state, checkUserAuth){
  console.warn('favoriteCtrl initialized');
  
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
  $scope.$on('$ionicView.enter', function(){
  $scope.info = $localstorage.getObject('userInfo');
  console.info($scope.info);
  $scope.showSignIn = checkUserAuth.isUserLogin();
  console.warn($localstorage);    
  var sign = $localstorage.getObject('favoritePosts');
  if (_.isEmpty(sign))
  {
    $scope.favoritePosts = [];
    console.warn('khalie');
    
    // get some posts from current posts
    ng.forEach($localstorage.getObject('posts'), function(post){
      if(post.isFavorite)
        $scope.favoritePosts.push(post);
    });
    // get some post from server
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/listMyFavoritePosts.php?userID='+$scope.info.ID
    }).success(function(data,status,headers,config){  
      ng.forEach(data, function(post){
        if(!$scope.isPostInCollection(post, $scope.favoritePosts))
          $scope.favoritePosts.push(post);
      });
      $localstorage.setObject('favoritePosts', $scope.favoritePosts);      
      // 
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
    
    $localstorage.setObject('favoritePosts', $scope.favoritePosts);
  }
  else
  {
    console.warn('dare ye chizayee');
    $scope.favoritePosts = $localstorage.getObject('favoritePosts');
    ng.forEach($localstorage.getObject('posts'), function(post){
      if(post.isFavorite && !$scope.isPostInCollection(post, $scope.favoritePosts))        
        $scope.favoritePosts.push(post);
    });
    // 
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/listMyFavoritePosts.php?userID='+$scope.info.ID
    }).success(function(data,status,headers,config){      
      ng.forEach(data, function(post){
        if(!$scope.isPostInCollection(post, $scope.favoritePosts))
          $scope.favoritePosts.push(post);
      });
      $localstorage.setObject('favoritePosts', $scope.favoritePosts);
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
    // 
    $localstorage.setObject('favoritePosts', $scope.favoritePosts);    
  }
  console.info($scope.favoritePosts);
  });
  
  var
    message,
    title,
    link
  ;
  $scope.shareToSocial = function(postID)
  {

    console.info(postID);
    // fetch target post content
    _.each($scope.posts, function(post){
      if (post.ID == postID)
      {
        console.info('peida shod');
        message = post.summary[0];
        title = post.post_title;
        link = post.guid;
      }
    });    
    $cordovaSocialSharing
    .share(message, title, null, link)
    .then(function(result) {
      console.log('successfully shared');
    }, function(err) {
      console.log('failed');
    });                
  };

  $scope.addToFavorite = function(postID)
  {
    $ionicLoading.show({
      template:'<span class="yekan">... لطفا شکیبا باشید</span>'
    });
    if (_.isEmpty($localstorage.getObject('userInfo')))
    {
      alert('شما لاگین نیستید');
    }
    else
    {         
      $scope.info = $localstorage.getObject('userInfo');   
         
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/addToFavorite.php?userID='+$scope.info.ID+'&postID='+postID,
        cache: false
      }).success(function(data,status,headers,config){          
        console.log(data);
        var posts = $localstorage.getObject('posts');
        ng.forEach(posts, function(post){
          if(post.ID == postID)
          {
            post.isFavorite = !post.isFavorite;
          }
        });
        $localstorage.setObject('posts', posts);
        // var posts = $localstorage.getObject('posts');
        // $scope.favoritePosts =[];
        // list favorite posts
        
        ng.forEach($scope.favoritePosts, function(post){
          if (post.ID == postID)
            post.isFavorite = false;
        });

        $scope.tempFavorite = [];
        ng.forEach($scope.favoritePosts, function(post){
          if (post.isFavorite)
            $scope.tempFavorite.push(post);
        });        

        $scope.favoritePosts = $scope.tempFavorite;

        $localstorage.setObject('favoritePosts', $scope.favoritePosts);
        $ionicLoading.hide();
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });                     
    };
                                              
  };

  $scope.sendLike = function(postID)
  {
    console.log('send like');
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/sendLike.php?postID='+postID
    }).success(function(data,status,headers,config){
      console.log(data);
    }).error(function(data,status,headers,config){
      console.log('error in update!');
    });
    var favoritePosts = $localstorage.getObject('favoritePosts');
    console.log(favoritePosts);
    ng.forEach(favoritePosts, function(post){
      if (post.ID == postID)
      {
        post.isLike = ! post.isLike;
      }
    });
  localStorage.removeItem('favoritePosts');
  $localstorage.setObject('favoritePosts', favoritePosts);
  $scope.favoritePosts = $localstorage.getObject('favoritePosts');     
  };

  $scope.goToComment = function(postID)
  {    
    $state.go('material',({postID:postID}))
  }

  $scope.mailArticleToFriend = function(postID) {
  $scope.data = {}

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input style="direction:ltr" type="text" autofocus ng-model="data.email">',
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
              url:'http://www.magly.ir/HybridAppAPI/emailToAFriend.php?postID='+postID+'&email='+$scope.data.email
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
});

}
)(this.angular, this._);
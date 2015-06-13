(function(ng, _){
  ng
  .module('starter.controllers', ['localStorage', 'user-auth', 'ngCordova'])
  
  .controller('DashCtrl', function($cordovaDeviceMotion, $cordovaDeviceOrientation, $cordovaToast, $cordovaNetwork, $cordovaDialogs, $cordovaVibration, $ionicLoading, $cordovaSocialSharing, $rootScope, $localstorage, $scope, $http, $state, $ionicPopover,checkUserAuth) {
// watch Acceleration
    var options = { frequency: 10000 };
    var watch = $cordovaDeviceMotion.watchAcceleration(options);
    watch.then(
      null,
      function(error) {
      // An error occurred
      },
      function(result) {
        var X = result.x;
        var Y = result.y;
        var Z = result.z;
        var timeStamp = result.timestamp;
        
        alert('x:', X);
        alert('y:', Y);
        alert('z:', Z);
    });
    
//
  $scope.$on('$ionicView.afterEnter', function(){
    $scope.categories = $localstorage.getObject('categories');
    console.info('alan umad b cat');
    $scope.showCategories();    
  });

  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
      $scope.popover.hide();
    })

  $scope.vibrate = function()
  {
    console.info('umad inja');
    $cordovaVibration.vibrate(200);
    $cordovaDialogs.beep(1);
    if ($cordovaNetwork.isOnline())
      alert('online');
    else
      alert('offline');
    $cordovaToast.show('داده ی جدید موجود نیست', 'long', 'top');
    //
      
    //
    //
    /*  var options = {
      frequency: 3000,
      filter: true     // if frequency is set, filter is ignored
    }

    var watch = $cordovaDeviceOrientation.watchHeading(options).then(
      null,
      function(error) {
        // An error occurred
      },
      function(result) {   // updates constantly (depending on frequency value)
        var magneticHeading = result.magneticHeading;
        var trueHeading = result.trueHeading;
        var accuracy = result.headingAccuracy;
        var timeStamp = result.timestamp;
        alert(magneticHeading);
        alert(trueHeading);
        alert(accuracy);
        alert(timeStamp);
      });*/
    //
  }

  console.warn('DashCtrl initialized');
  // $scope.showSearchItem = true; 
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
  };

  $scope.showCategories = function()
  {
  /*if(_.isEmpty($localstorage.getObject('categories')))
  {
    $ionicLoading.show({
      template: '<span class="yekan">... در حال بارگذاری دسته ها</span>'
    });    
  }*/
    
    // $scope.categories = $localstorage.getObject('categories');
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/test.php'      
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

    //$scope.showCategories();
})

.controller('MostCtrl', function($localstorage, $rootScope, $scope, $http, $ionicPopover, $ionicPopup, $cordovaSocialSharing){
  console.warn('MostCtrl initialized');
  $scope.posts = $localstorage.getObject('most');
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
        /*var alertPopup = $ionicPopup.alert({
          title: 'نتیجه',
          template: 'به لیست دلخواه اضافه شد'
        });
        // we can do more here
        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        }); 
      */
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });                     
    };
                                              
  };

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
  var userInfo = $localstorage.getObject('userInfo');
  $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/mostVisitedPosts.php?userID='+userInfo.ID,
      cache: false
    }).success(function(data,status,headers,config){          
      console.log(data);
      $scope.posts = data;          
      $localstorage.setObject('most', $scope.posts);
    }).error(function(data,status,headers,config){
      console.log('error in get categories');
    });
})

.controller('ChatsCtrl', function($cordovaVibration, $ionicPopup, $rootScope, $ionicModal, $cordovaSocialSharing, $ionicLoading, $ionicPopover, $localstorage, $http, $scope, Chats, $state,  $ionicActionSheet, checkUserAuth) {
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
      console.warn('alan bayad', $scope.posts);
      $scope.posts = $localstorage.getObject('posts');
    }
  });

  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.prevState = fromState.name;
      console.info('state avaz shod');
      $scope.popover.hide();
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
        /*var alertPopup = $ionicPopup.alert({
          title: 'نتیجه',
          template: 'به لیست دلخواه اضافه شد'
        });
        // we can do more here
        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        }); 
      */
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

  
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope    
  }).then(function(popover) {
    $scope.popover = popover;
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

  $scope.openPopover = function($event) {
    $scope.popover.show($event);    
  };

  

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
        if(data != null)
        {
          var kol = _.union(data, $scope.posts);
          $scope.topData = data;
          $scope.posts = kol;
          localStorage.removeItem('posts');
          $localstorage.setObject('posts', $scope.posts);          
          $cordovaVibration.vibrate(200);
        }          
        else
        {           
         var alertPopup = $ionicPopup.alert({
           title: '<span class="yekan">بانک اطلاعات</span>',
           template: '<span class="yekan">مطلب جدیدی وجود ندارد</span>'
         });
         alertPopup.then(function(res) {
           console.log('Thank you for not eating my delicious ice cream cone');
         });
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
    };

  $scope.loadMoreDataForDown = function()
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
    };

  $scope.ch = function(id)
  {
    console.log(id);
    $state.go('tab.chat-detail', ({chatId:id}));
  }
  $scope.fillLocalWithData = function()
    {
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
          $ionicLoading.hide();          
        }

    };

    $scope.doesLocalHaveData();      

})

.controller('signupCtrl', function($state, $ionicPopup, $localstorage, $rootScope, $scope, $ionicPopover, $http, checkUserAuth){
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
      console.log($scope.info);    
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/signup.php?fullName='+$scope.info.fullName+'&niceName='+$scope.info.niceName+'&email='+$scope.info.email+'&password='+encodeURIComponent($scope.info.password),
        cache: false
        }).success(function(data,status,headers,config){          
          console.log(data);
          if (data[1] == 'ok')
          {
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
.controller('searchCtrl', function($scope, $localstorage, $ionicPopup, $http, $state, $cordovaSocialSharing){
  
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
    $scope.posts = $localstorage.getObject('posts');
    $scope.info = $localstorage.getObject('userInfo');
  });
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
.controller('signinCtrl', function($rootScope, $scope, $ionicPopover, $http, $localstorage, $state, checkUserAuth){
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

.controller('ChatDetailCtrl', function($rootScope, $http, $ionicPopup, $cordovaSocialSharing, $ionicModal, $localstorage, $scope, $stateParams, $state, checkUserAuth) {
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
    $state.go($rootScope.prevState);
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

      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });                     
    };
                                              
  };

  $scope.posts = $localstorage.getObject('posts');
  angular.forEach($scope.posts, function(post){
    if (post.ID == $stateParams.chatId)
      $scope.targetPost = post;
  });

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

.controller('ProfileCtrl', function($rootScope, $ionicPopup, $scope, $localstorage, $state, $http, checkUserAuth ) {
  $scope.$on('$ionicView.afterEnter', function(){
    $scope.showSignIn = checkUserAuth.isUserLogin();
    $scope.info = $localstorage.getObject('userInfo');
    console.log($scope.showSignIn);    
  });  
  
  
  $scope.showForgetPassModal = function()
  {
    $scope.data = {};
    var info = $localstorage.getObject('userInfo');
    console.log(info);
    var myPopup = $ionicPopup.show({
    template: '<div><input ng-model="data.currentPassword" style="direction:rtl" type="password" class="yekan" placeHolder="کلمه عبور فعلی"></div><div><input type="password" autofocus ng-model="data.newPassword" class="yekan" style="direction:rtl" placeHolder="کلمه عبور جدید"></div><div><input style="direction:rtl" class="yekan" type="password" placeHolder="تکرار کلمه عبور" autofocus ng-model="data.confirmPassword"></div>',
    title: '<span class=yekan>تعویض کلمه عبور</span>',
    // subTitle: 'your friend email',
    scope: $scope,
    buttons: [
      { text: '<span class=yekan>بستن</span>' },
      {
        text: '<span class=yekan><b>عوض کن</b></span>',
        type: 'button-positive',
        onTap: function(e) {
          if ($scope.data.newPassword != '')
          {
            console.log($scope.data);
            console.log(info);
            $http({
              method: 'GET',
              url:'http://www.magly.ir/HybridAppAPI/updatePassword.php?newPassword=' + encodeURIComponent($scope.data.newPassword) + '&userID=' + info.ID
            }).success(function(data,status,headers,config){
              console.log(data);
            }).error(function(data,status,headers,config){
              console.log('error in update!');
            });                            
          }
          else
          {
            console.warn('ye moshkeli hast');
          }
        }
      }
    ]
  });
  /*myPopup.then(function(res) {
    if ($scope.data.newPassword == '')
      console.log('Tapped!', res);
      console.warn('ye moshkeli hast');
  });*/
  }

  $scope.goToSignup = function()
  {
    $state.go('signup');
  }
  $scope.signOut = function()
  {
    localStorage.removeItem('userInfo'); 
    $scope.showSignIn = !$scope.showSignIn;
    $scope.info = {};
    $rootScope.$broadcast('signOutOfApp',true);
  }
  $scope.info = $localstorage.getObject('userInfo');
  if (!$scope.info)
    $scope.info={};
  console.log($scope.info);
  console.log('umad b search:');
  // console
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
          $scope.showSignIn = !$scope.showSignIn;        
          $state.go('tab.chats');
        }
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });
  }
})

.controller('commentCtrl', function($state, $rootScope,$http, $localstorage, $scope, $ionicModal, $stateParams){
  console.log('comments controller initialized');
  var postID = $stateParams.postID;
  var posts = $localstorage.getObject('posts');
  ng.forEach(posts, function(post){
    if (post.ID == postID)
    { 

      $scope.comments = post.comments;
    }
  });
  console.log($scope.comments);

  $scope.commentObject = {};
  
  $scope.goBack = function()
  {
    console.log('mot',$stateParams);
    $state.go('tab.chat-detail',{chatId:$stateParams.postID});
  }

  $scope.closeSendCommentForm = function()
  {
    $scope.modal.hide();
  };

  $scope.sendComment = function()
  {
    $scope.modal.hide();
    console.log('sent comment...');
    var randomInt = new Date().getTime();
    $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/sendComment.php?postID=' + $stateParams.postID + '&randomInt=' + randomInt + '&name='+$scope.commentObject.name + '&email=' + $scope.commentObject.email + '&url=' + $scope.commentObject.url + '&comment=' + $scope.commentObject.comment
    }).success(function(data,status,headers,config){          
      console.log(data);
      $scope.comments = data;
      $scope.posts = $localstorage.getObject('posts');
      ng.forEach($scope.posts, function(post){
        if (post.ID == postID)
        {
          post.comments = data;
        }
      });
      $localstorage.setObject('posts',$scope.posts);
      //$scope.posts = $localstorage.getObject('posts');
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

.controller('favoriteCtrl' , function($ionicPopup, $rootScope, $ionicPopover, $state, $scope, $http, $localstorage, $cordovaSocialSharing){  
  console.warn('favoriteCtrl initialized');

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
        post.isLike = !post.isLike;
      }
    });
  localStorage.removeItem('posts');
  $localstorage.setObject('posts', posts);
  $scope.posts = $localstorage.getObject('posts'); 
  //
    $scope.favoritePosts = {};
    var userInfo = $localstorage.getObject('userInfo');
    var posts = $localstorage.getObject('posts');
    $scope.FavoritePosts =[];
    // list favorite posts
    ng.forEach(posts, function(post){
      if (post.isFavorite)
        $scope.FavoritePosts.push(post);
    });
  //    
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

   $scope.addToFavorite = function(postID)
  {
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
        $scope.FavoritePosts =[];
        // list favorite posts
        ng.forEach(posts, function(post){
          if (post.isFavorite)
            $scope.FavoritePosts.push(post);
        });
        /*var alertPopup = $ionicPopup.alert({
          title: 'نتیجه',
          template: 'به لیست دلخواه اضافه شد'
        });
        // we can do more here
        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        }); 
      */
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });                     
    };
                                              
  };

  $scope.signOut = function()
  {
    localStorage.removeItem('userInfo');   
  }

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

  $scope.$on('$ionicView.afterEnter', function(){
    $scope.favoritePosts = {};
    var userInfo = $localstorage.getObject('userInfo');
    var posts = $localstorage.getObject('posts');
    $scope.FavoritePosts =[];
    // list favorite posts
    ng.forEach(posts, function(post){
      if (post.isFavorite)
        $scope.FavoritePosts.push(post);
    });
  });

    $scope.goHome = function()
    {
      $state.go('home');
    }

  //
});

}
)(this.angular, this._);
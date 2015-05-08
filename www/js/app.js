// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(ng, _)
{
  var

  /**
   * [init description]
   * @return {[type]} [description]
   */
  init = function ()
  {
    ng
    .module('starter', ['localStorage', 'ui.router', 'ionic', 'ngCordova'])
    .run(function($ionicPlatform)
    {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    })
    .controller('controller', ['$state', Controller])
    .config(function($stateProvider, $urlRouterProvider) {
      // console.log($state);
      $stateProvider
      
      .state('home', {
        url: '/home',
        views: {
          'home': {
            templateUrl: 'templates/home.html',
            controller: Controller
            }
        }
      })

      .state('favoriteList', {
        url: '/favoriteList',
        views: {
          'favoriteList': {
            templateUrl: 'templates/favoriteList.html',
            controller: Controller
            }
        }
      })

      .state('signin', {
        url: '/signin',
        views: {
          'signin': {
            templateUrl: 'templates/signin.html',
            controller: signinController
            }
        }
      })

      .state('search', {
        url: '/search',
        views: {
          'search': {
            templateUrl: 'templates/search.html',
            controller: Controller
            }
        }
      })

      .state('contactus', {
        url: '/contactus',
        views: {
          'contactus': {
            templateUrl: 'templates/contactus.html'
            }
        }
      })

      .state('comment', {
        url: '/post/:postID/comment',
        views: {
          'comment': {
            templateUrl: 'templates/comments.html',
            controller: function($stateParams, $scope, $localstorage, $http)
            {
              var comment;
              $scope.commentObject = {};              
              var posts = $localstorage.getObject('posts');
              ng.forEach(posts, function(post){                
                if(post.ID == $stateParams.postID)
                  comment = (post.comments);
              });
              $scope.currentComment = comment;
              console.log(comment);

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
            }
          }
        }
      })

      .state('post', {
        url: '/post/:postID',
        views: {
          'post': {
            templateUrl: 'templates/post.html',
            controller: function($state, $cordovaSocialSharing, $http, $scope, $stateParams, $ionicActionSheet, $localstorage, $ionicPopup, $timeout){
                              
                $scope.goToCommentState = function()
                {
                  $state.go('comment',({postID:$stateParams.postID}));
                };

                $scope.likeThisPost = function()
                {
                  
                  $http({
                    method: 'GET',
                    url:'http://www.magly.ir/HybridAppAPI/sendLike.php.php?PostID=' + postID
                  }).success(function(data,status,headers,config){
                    console.log(data);
                  }).error(function(data,status,headers,config){
                    console.log('error in update!');
                  });

                  var alertPopup = $ionicPopup.alert({
                    title: 'Don\'t eat that!',
                    template: 'It might taste good'
                  });
                  alertPopup.then(function(res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                 });
                };

                $scope.showPopup = function() {
                $scope.data = {}

                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                  template: '<input type="text" autofocus ng-model="data.email">',
                  title: 'ایمیل را وارد کنید',
                  // subTitle: 'your friend email',
                  scope: $scope,
                  buttons: [
                    { text: 'لغو' },
                    {
                      text: '<b>بفرست</b>',
                      type: 'button-positive',
                      onTap: function(e) {
                        if ($scope.data.email != '')
                        {
                          $http({
                            method: 'GET',
                            url:'http://www.magly.ir/HybridAppAPI/emailToAFriend.php?PostID='+$stateParams.postID+'&email='+$scope.data.email
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

              $scope.shareAnywhere = function() {
                console.log($cordovaSocialSharing);
                $cordovaSocialSharing.shareViaEmail('hi','subject','a.gmail.com','b@gmail.com','e@gmail.com');
              };

              $scope.addToFavorite = function(event)
              {                       
                // event.preventDefault();
                // event.stopPropagation();
                // show the message    
                var alertPopup = $ionicPopup.alert({
                  title: 'Added to favorites!',
                  template: 'this article added to your favorite list :)'
                });
                // we can do more here
                alertPopup.then(function(res) {
                  console.log('Thank you for not eating my delicious ice cream cone');
                });               
              };

              console.log($stateParams);              
              $scope.posts = $localstorage.getObject('posts');
              console.log($scope.posts);
              _.each($scope.posts, function(value){
                if (value.ID == $stateParams.postID)
                {
                  $scope.post = value;
                  console.log($scope.post);
                }
              })
              $scope.showActionsheetForPost = function() {    
       // Show the action sheet
      $ionicActionSheet.show({
         buttons: [
           { text: 'like' },
           { text: 'کامنت' },
           { text: 'اضافه به لیست دلخواه' }           
         ],
         // destructiveText: 'Delete',
         titleText: 'قصد انجام چه کاری دارید؟',
         cancelText: 'بستن',
         buttonClicked: function(index) {
           switch (index)
           {
              case 0:
                $state.go('aboutus');
              break;
              case 1:
                $state.go('signup');
              break;
              case 2:
                $state.go('ourservices');
              break;
              case 3:
                console.log('آپدیت مقالات');
              break;
              case 4:
                console.log('آپدیت مقالات');
              break;
           }
           console.log(index);
           return true;
         }
       });
    };

            }
            }
        }
      })

      .state('aboutus', {
        url: '/aboutus',
        views: {
          'aboutus': {
            templateUrl: 'templates/aboutus.html'
            }
        }
      })

      .state('signup', {
        url: '/signup',
        views: {
          'signup': {
            templateUrl: 'templates/signup.html',
            controller: signupController
            }
        }
      })
      
      .state('ourservices', {
        url: '/ourservices',
        views: {
          'ourservices': {
            templateUrl: 'templates/ourservices.html'
            }
        }
      })

      $urlRouterProvider.otherwise('/home');
    });
  },
  
  signupController = function ()
  {
    $scope.username = 'milad';
    $scope.password = '123';
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/signup.php?username='+$scope.username+'&password='+$scope.password,
        cache: false
        }).success(function(data,status,headers,config){          
          console.log(data);
          
        }).error(function(data,status,headers,config){
          console.log('error in get categories');
        });
  },

  signinController = function($scope)
  {
    $scope.signin = function()
    {
      $scope.username = 'milad';
      $scope.password = '123';
      $http({
          method: 'GET',
          url:'http://www.magly.ir/HybridAppAPI/signin.php?username='+$scope.username+'&password='+$scope.password,
          cache: false
        }).success(function(data,status,headers,config){          
          console.log(data);
          
        }).error(function(data,status,headers,config){
          console.log('error in get categories');
        });
    }
  },

  /**
   * [Controller description]
   * @param {[type]} $localstorage [description]
   * @param {[type]} $scope        [description]
   * @param {[type]} $http         [description]
   */
  Controller = function($ionicPopup, $ionicBackdrop, $state, $localstorage, $scope, $http, $ionicActionSheet, $timeout, $ionicSideMenuDelegate)
  {
    $scope.$watch('topData', function(newval, oldval) {
      if (newval == 'null')
      {
        var alertPopup = $ionicPopup.alert({
          title: 'Not any more data!',
          template: 'dear user your database is update:)'
        });
        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
       });
      }
    });

    $scope.mostVisitedPosts = function()
    {
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
    }

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
    }

    $scope.reArrangePosts = function()
    {
      // here we should Arrange by ASC
    }

    $scope.toggleSidemenu = function()
    {
      $ionicSideMenuDelegate.toggleLeft();
    }

    $scope.displaySinglePost = function(postID)
    {      
      $state.go('post',({
        postID:postID
      }));
    }

    $scope.showActionsheet = function() {    
       // Show the action sheet
      $ionicActionSheet.show({
         buttons: [
           { text: 'درباره ی ما' },
           { text: 'ثبت نام' },
           { text: 'نمایش اسکوپ' },
           { text: 'دسته های مقالات' },
           { text: 'به روز رسانی برنامه' },
           { text: 'مشاهده لیست دلخواه' },
           { text: 'داده های بالا' },
           { text: 'داده های پایین' },
           { text: 'تست' }

         ],
         // destructiveText: 'Delete',
         titleText: 'قصد انجام چه کاری دارید؟',
         cancelText: 'Cancel',
         buttonClicked: function(index) {
           switch (index)
           {
              case 0:
                $state.go('aboutus');
              break;
              case 1:
                $state.go('signup');
              break;
              case 2:
                console.log($scope);
              break;
              case 3:
                console.log('آپدیت مقالات');
              break;
              case 4:
                console.log('آپدیت مقالات');
              break;
              case 5:
                $state.go('favoriteList');
              break;
              case 6:
                $scope.loadMoreDataForTop();
              break;
              case 7:
                //$scope.loadMoreDataForDown();
              break;
              case 8:
                $scope.test();
              break;
           }
           console.log(index);
           return true;
         }
       });
    };

    $scope.showCategories = function()
    {
      $http({
        method: 'GET',
        url:'http://www.magly.ir/HybridAppAPI/showCategoryList.php'
      }).success(function(data,status,headers,config){
        $scope.categories = data;
      }).error(function(data,status,headers,config){
        console.log('error in get categories');
      });
    };

    $scope.showCategories();
    
    /**
     * [doesLocalHasData description]
     * @return {[type]} [description]
     */
    $scope.doesLocalHasData = function()
    {
      var localData = $localstorage.getObject('posts');
      if (_.isEmpty(localData))
        return false;
      else
        return true;      
    };

    if ($scope.doesLocalHasData())
    {
      console.log('local is full of data');
      $scope.posts = $localstorage.getObject('posts');
      $scope.showUpdateMessage = false;
      $scope.showArticleList = true;
    }
    else
    {
      console.log('local is empty');
      $scope.showUpdateMessage = true;
      $scope.showArticleList = false;
    }

    /**
     * [isUpdateAvailable description]
     * @return {Boolean} [description]
     */
    $scope.isUpdateAvailable = function()
    {
      var
      lastPostIdInLocal = 2000 ;//$localstorage.getObject('posts')[0].ID;
      console.log('biggest ID on browser storage is %s', lastPostIdInLocal);
      // we should- find last article ID in summits.ir
      $http({
      method: 'GET',
      url:'http://www.magly.ir/HybridAppAPI/lastPostID.php'
      }).success(function(data,status,headers,config){
        console.log('biggest ID on net is : '+data);
        if (data > lastPostIdInLocal)
        {
          console.log('alan umad b true');
          $scope.showUpdateButton = true;
        }
        else
        {
          console.log('alan umad b false');
          $scope.showUpdateButton = true;
        }
      }).error(function(data,status,headers,config){
        console.log('error in check update');
      });
    };
    $scope.isUpdateAvailable();

    /**
     * [fillLocalWithData description]
     * @return {[type]} [description]
     */
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
        console.log('dataye avalie :',data); 
        console.log('type of data :',typeof(data));
        $localstorage.setObject('posts', data);        
        $scope.showUpdateMessage = false;
        $scope.showArticleList = true;
      }).error(function(data,status,headers,config){
        console.log('error in get posts');
      });
    },

    $scope.filterPostsByCategory = function(input)
    {
      if (input == 'all')
      {
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
      }
      $ionicSideMenuDelegate.toggleLeft();
    }
  }
  ;
  
  init();
})(this.angular, this._);
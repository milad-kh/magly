(function(root, ng, _, $){
  ng
  .module('commentController', ['localStorage', 'user-auth', 'ngCordova', 'general-actions'])

.controller('commentCtrl', function($ionicTabsDelegate, $ionicScrollDelegate, $ionicHistory, $ionicLoading, $state, $rootScope,$http, $localstorage, $scope, $ionicModal, $stateParams){
  console.log('comments controller initialized');
  $scope.$on('$ionicView.afterEnter', function(){
    var userInfo = $localstorage.getObject('userInfo');

    $scope.commentObject.name = userInfo.display_name;
    $scope.commentObject.email = userInfo.user_email;
    $scope.commentObject.url = userInfo.user_url;

    var postID = $stateParams.postID;
    var posts = $localstorage.getObject($localstorage.getObject('cat'));
    ng.forEach(posts, function(post){
      if (post.ID == postID && !_.isEmpty(post.comments))
      {
        $scope.comments = post.comments;
        console.log(post);
      }
    });
    console.log($scope.comments);
    var settings = $localstorage.getObject('settings');
    // $ionicScrollDelegate.getScrollView().options.speedMultiplier = settings.scrollSpeed;
  });
  $scope.commentObject = {};

  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  }

  $scope.setCommentClass = function(index)
  {
    if(index % 2 == 0)
      return "background-highlight-in-comment";
  }

  $scope.activeSendCommentTab = function(index)
  {
    $ionicTabsDelegate.select(index);
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

}
)(this, this.angular, this._, this.jQuery);

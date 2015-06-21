(function(ng, _)
{
	'use strict';
	var

	init = function()
	{
		ng
		.module('general-actions',['localStorage'])
		.factory('generalActions', ['$localstorage', factoryProvider])
	},

	factoryProvider = function($localstorage)
	{
		var generalActions = {
			addToFavorite : function(){
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
			},
			shareToSocial : function(postID)
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
			},
			sendLike : function(postID)
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
			},
			mailArticleToFriend : function(postID)
			{
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
			}
		}
		return generalActions;
	}
	;
	init();
})(this.angular, this._);
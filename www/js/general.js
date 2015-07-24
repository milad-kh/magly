(function(ng, _)
{
	'use strict';
	var

	init = function()
	{
		ng
		.module('general-actions',['localStorage'])
		.factory('generalActions', ['$cordovaSocialSharing', '$rootScope', '$localstorage', '$ionicPopup', '$http', '$ionicLoading', factoryProvider])
	},

	factoryProvider = function($cordovaSocialSharing, $rootScope, $localstorage, $ionicPopup, $http, $ionicLoading)
	{
		// console.info($scope);
		var generalActions = {
			addToFavorite : function(postID){
				console.info('oh umad inja');
				$ionicLoading.show({
		      template:'<span class="yekan">... لطفا شکیبا باشید</span>'
		    });			    		
	      var info = $localstorage.getObject('userInfo'); 
	      var userID, item;
	      if (_.isEmpty(info[0]))
      		userID = info.ID;
		    else
		      userID = info[0].ID;  	
	      $http({
	        method: 'GET',
	        url:'http://www.magly.ir/HybridAppAPI/addToFavorite.php?userID='+userID+'&postID='+postID,
	        cache: false
	      }).success(function(data,status,headers,config){          
	        console.log(data);			    
	        //// update all the keys in our storage
	      	// first : create list of localstorage target item
			  var localStorageLength = window.localStorage.length;
		      var localstorageItemArray = [];
		      for (var i = 0; i< localStorageLength; i++)
		      {
		      	localstorageItemArray.push(window.localStorage.key(i));
		      }
		      console.info(localstorageItemArray);
		      ng.forEach(localstorageItemArray, function(localstorageObjectName){
		      	item = $localstorage.getObject(localstorageObjectName);
		      	ng.forEach(item, function(post){
		      		if (post.ID == postID)
		      			post.isFavorite = !post.isFavorite;
		      	});

		      	$localstorage.setObject(localstorageObjectName, item);		      	
		      	if(localstorageObjectName == $localstorage.getObject('cat'))
		      		$rootScope.$broadcast('updatePosts');		        				  
		      });
	        ///////////////////////////////////////////////////
			  	$ionicLoading.hide();	        
	      }).error(function(data,status,headers,config){
	        console.log('error in get categories');
	        $ionicLoading.hide();
	      });
			},

			shareToSocial : function(postID)
			{
				console.info('injast');
				var
			    message,
			    title,
			    link,
			    xxx
			  ;		    

		    _.each($localstorage.getObject($localstorage.getObject('cat')), function(post){
		      if (post.ID == postID)
		      {
		        console.info('peida shod');
		        message = post.summary[0];
		        title = post.post_title;
		        link = post.guid;
		        xxx= post;
		      }
		    });
		    console.log(message, title, link);

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
				var item;
		    console.log('send like');
		    $http({
		      method: 'GET',
		      url:'http://www.magly.ir/HybridAppAPI/sendLike.php?postID='+postID
		    }).success(function(data,status,headers,config){
		      console.log(data);
		      var localStorageLength = window.localStorage.length;
		      var localstorageItemArray = [];
		      for (var i = 0; i< localStorageLength; i++)
		      {
		      	localstorageItemArray.push(window.localStorage.key(i));
		      }
		      console.info(localstorageItemArray);
		      ng.forEach(localstorageItemArray, function(localstorageObjectName){
		      	item = $localstorage.getObject(localstorageObjectName);
		      	ng.forEach(item, function(post){
		      		if (post.ID == postID)
		      			post.isLike = !post.isLike;
		      	});
		      	$localstorage.setObject(localstorageObjectName, item);
      			$rootScope.$broadcast('updatePostsForLike');		      
		      });
			   
		    }).error(function(data,status,headers,config){
		      console.log('error in update!');
		    });
			},

			mailArticleToFriend : function(postID)
			{			  
			  // An elaborate, custom popup
			  var myPopup = $ionicPopup.show({
			    template: '<input style="direction:ltr" type="text" id="emailP">',
			    title: '<span class=yekan>ایمیل را وارد کنید</span>',
			    // subTitle: 'your friend email',
			    //scope: $scope,
			    buttons: [
			      { text: '<span class=yekan>لغو</span>' },
			      {
			        text: '<span class=yekan><b>بفرست</b></span>',
			        type: 'button-positive',
			        onTap: function(e) {
			        	var email = $("#emailP").val();
			          if (email != '')
			          {
			            $http({
			              method: 'GET',
			              url:'http://www.magly.ir/HybridAppAPI/emailToAFriend.php?postID='+postID+'&email='+email
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
			  myPopup.then(function(res, email) {
			    if (email == '')
			      console.log('Tapped!', res);
			  });
			}
		}
		return generalActions;
	}
	;
	init();
})(this.angular, this._);
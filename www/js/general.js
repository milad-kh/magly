(function(ng, _)
{
	'use strict';
	var

	init = function()
	{
		ng
		.module('general-actions',['localStorage'])
		.factory('generalActions', ['$rootScope', '$localstorage', '$ionicPopup', '$http', '$ionicLoading', factoryProvider])
	},

	factoryProvider = function($rootScope, $localstorage, $ionicPopup, $http, $ionicLoading)
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
		      	if ($localstorage.getObject('cat') == localstorageObjectName)
				      {
				      	window.localStorage.removeItem($localstorage.getObject('cat'));
  				      $localstorage.setObject($localstorage.getObject('cat'), item);
		      			$rootScope.$broadcast('updatePosts', item);		      
  				    }
		      });
	        ///////////////////////////////////////////////////
			  	$ionicLoading.hide();	        
	      }).error(function(data,status,headers,config){
	        console.log('error in get categories');
	        $ionicLoading.hide();
	      });
	      
	      

	      var localstorageObjects = ['posts', 'most', 'favoritePosts', 'search'];
	        
	        console.info('then');
			},

			shareToSocial : function(postID, host)
			{
				var
			    message,
			    title,
			    link,
			    xxx
			  ;		    
		    _.each($localstorage.getObject(host), function(post){
		      if (post.ID == postID)
		      {
		        console.info('peida shod');
		        message = post.summary[0];
		        title = post.post_title;
		        link = post.guid;
		        xxx= post;
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

			    // update all the keys in our storage
			    var localstorageObjects = ['posts', 'most', 'favoritePosts', 'search'];
			    ng.forEach(localstorageObjects, function(localstorageObject){
			    	console.info('alan: ', localstorageObject);
			    	var collection = $localstorage.getObject(localstorageObject);
				    ng.forEach(collection, function(post){
				      if (post.ID == postID)
				      {
				        post.isLike = !post.isLike;
				      }
				    });		
			  	localStorage.removeItem(localstorageObject);
			  	$localstorage.setObject(localstorageObject, collection);				    	    	
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
(function(ng, _)
{
	'use strict';
	var

	init = function()
	{
		ng
		.module('general-actions',['localStorage'])
		.factory('generalActions', ['$localstorage', '$ionicPopup', '$http', factoryProvider])
	},

	factoryProvider = function($localstorage, $ionicPopup, $http, $ionicLoading)
	{
		var generalActions = {
			addToFavorite : function(){
				$ionicLoading.show({
		      template:'<span class="yekan">... لطفا شکیبا باشید</span>'
		    });			    		

	      var 
	      	info = $localstorage.getObject('userInfo');   
	      console.log(postID);
	      console.log(info);     
	      $http({
	        method: 'GET',
	        url:'http://www.magly.ir/HybridAppAPI/addToFavorite.php?userID='+info.ID+'&postID='+postID,
	        cache: false
	      }).success(function(data,status,headers,config){          
	        console.log(data);

			    var localstorageObjects = ['posts', 'most', 'favoritePosts', 'search'];
	        ng.forEach(localstorageObjects, function(localstorageObject){
			    	var collection = $localstorage.getObject(localstorageObject);	        	
		        ng.forEach(collection, function(post){
		          if(post.ID == postID)
		            post.isFavorite = !post.isFavorite;
		        });	 
		        localStorage.removeItem(localstorageObject);
			  		$localstorage.setObject(localstorageObject, collection);       	
	        });
	        $ionicLoading.hide();
	      }).error(function(data,status,headers,config){
	        console.log('error in get categories');
	      });                     			    
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
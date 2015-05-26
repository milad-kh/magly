(function(ng, _)
{
	'use strict';
	var

	init = function()
	{
		ng
		.module('user-auth',['localStorage'])
		.factory('checkUserAuth', ['$localstorage', factoryProvider])
	},

	factoryProvider = function($localstorage)
	{
		var checkUserAuth = {
			isUserLogin : function(){
				var flag = $localstorage.getObject('userInfo');
				console.log(flag);
				if (_.isEmpty(flag))
				{
					console.log('check shod natije: ', 'true');
					return true;
				}
				else
				{
					console.log('check shod natije: ', 'false');
					return false;
				}
			}
		}
		return checkUserAuth;
	}
	;
	init();
})(this.angular, this._);
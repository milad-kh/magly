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
				
				if (_.isEmpty(flag))
				{
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
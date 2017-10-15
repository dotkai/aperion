(function(){
	'use strict';

	angular.module('apeiron').factory('userAuthApi', userAuthApi);

	userAuthApi.$inject = ['$window', 'ApiFactory'];
	function userAuthApi($window, ApiFactory){
		var calls = [{
			name: 'finishSignup',
			url: '/auth/signup',
			call: 'post',
			method: 'POST'
		},{
			name: 'logout',
			url: '/auth/logout',
			call: 'post',
			method: 'POST'
		}];

		var factory = {
			$facebookAuth: function(){ pingPath("/auth/facebook"); },
			$facebookConnect: function(){ pingPath("/connect/facebook"); },
			$facebookUnlink: function(){ pingPath("/unlink/facebook"); },

			$twitterAuth: function(){ pingPath("/auth/twitter"); },
			$twitterConnect: function(){ pingPath("/connect/twitter"); },
			$twitterUnlink: function(){ pingPath("/unlink/twitter"); },

			$googleAuth: function(){ pingPath("/auth/google"); },
			$googleConnect: function(){ pingPath("/connect/google"); },
			$googleUnlink: function(){ pingPath("/unlink/google"); },
		};

		angular.extend(factory, ApiFactory(calls));

		return factory;

		function pingPath(path){
			$window.location = $window.location.protocol + "//" + $window.location.host + path;
		}
	}

})();
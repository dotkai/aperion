(function(){
	'use strict';

	angular.module('apeiron')
		.factory('ApiFactory', ApiFactory);

	ApiFactory.$inject = ['$resource', '$q'];
	function ApiFactory($resource, $q){
		
		return makeFactory;

		function makeFactory(apiCallList){
			var f = {};
			angular.forEach(apiCallList, function(val){
				f['$'+val.name] = callSource(val);
			});
			return f;
		}

		function callSource(val){
			var temp = {};
			temp[val.call] = (val.action)? val.action : { method: val.method };			
			var apiCall = $resource(val.url, val.config, temp);

			if(val.params){
				return function(params){
					var defer = $q.defer();
					apiCall[val.call](params).$promise.then(defer.resolve, defer.reject);
					return defer.promise;
				};
			} else {
				return function(params){
					var defer = $q.defer();
					apiCall[val.call](params).$promise.then(defer.resolve, defer.reject);
					return defer.promise;
				};
			}
		}
	}

})();
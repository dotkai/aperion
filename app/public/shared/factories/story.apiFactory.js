(function(){
	'use strict';

	angular.module('apeiron').factory('storyApi', storyApi);

	storyApi.$inject = ['ApiFactory'];
	function storyApi(ApiFactory){
		var GET = 'GET';
		var calls = [{
			name: 'getBlogInfo',
			url: '/apeiron/info',
			call: 'get',
			method: GET
		}, {
			name: 'getChapterData',
			url: '/apeiron/postinfo/:path/:chpt/:part',
			call: 'get',
			method: GET
		}, {
			name: 'getPoll',
			url: '/apeiron/poll/:path/:chapter/:part',
			call: 'get',
			method: GET
		}];

		return ApiFactory(calls);
	}

})();
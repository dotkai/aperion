(function(){
	'use strict';

	angular.module('apeiron').factory('accountApi', accountApi);

	accountApi.$inject = ['ApiFactory'];
	function accountApi(ApiFactory){
		var GET = 'GET', POST = 'POST';
		var calls = [{
			name: 'getAccount',
			url: '/api/account',
			call: 'get',
			method: GET
		}, {
			name: 'updateAccount',
			url: '/api/account/update',
			call: 'post',
			method: POST
		}, {
			name: 'updateChapterBookmark',
			url: '/api/account/setchapter',
			call: 'post',
			method: POST
		}, {
			name: 'getVote',
			url: '/api/account/selectedVote/:pollID',
			call: 'get',
			method: GET
		}, {
			name: 'vote',
			url: '/api/vote',
			call: 'post',
			method: POST
		}, {
			name: 'undoVote',
			url: '/api/undoVote',
			call: 'post',
			method: POST
		}, {
			name: 'submitSurvey',
			url: '/api/submitSurvey',
			call: 'post',
			method: POST
		}];

		return ApiFactory(calls);
	}

})();
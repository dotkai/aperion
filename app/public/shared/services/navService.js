(function(){
	'use strict';

	angular.module('apeiron').service('navService', navService);

	navService.$inject = ['$q', 'storyApi', 'ngDialog', 'accountApi'];
	function navService($q, storyApi, ngDialog, accountApi){
		var blogPromise = $q.defer();

		var service = {
			blogLoaded: blogLoaded,
			getBlogInfo: getBlogInfo,
			getChapterData: getChapterData,
			updateChapter: updateChapter
		};

		return service;

		function blogLoaded(){
			return blogPromise.promise;
		}

		function getBlogInfo(){
			storyApi.$getBlogInfo().then(function(data){
				blogPromise.resolve({
					chapters: data.chapters,
					characters: data.characters,
					genderMapping: data.genderMap
				});
			}, function (error){
				blogPromise.reject();
			});
		}

		function getChapterData(path, chpt, part){
			var defer = $q.defer();
			storyApi.$getPoll({
				path: path,
				chapter: chpt,
				part: part
			}).then(function(data){
				defer.resolve(data);
			}, defer.reject);
			return defer.promise;
		}

		function updateChapter(userMaxChapter, params){			
			var defer = $q.defer();
			// check if user bookmark is less than chapter
			if(userMaxChapter+1 === params.chapter){
				accountApi.$updateChapterBookmark(params)
				.then(function(data){
					defer.resolve(true);
				}, defer.reject);
			} else {
				defer.resolve(false);
			}
			return defer.promise;
		}
	}

})();
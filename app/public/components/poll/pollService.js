(function(){
	'use strict';

	angular.module('apeiron').service('pollService', pollService);

	pollService.$inject = ['$q', '$log', 'accountApi', 'storyApi', 'userService'];
	function pollService($q, $log, accountApi, storyApi, userService){

		var pollPromise = $q.defer();

		var service = {
			pollSet: false,
			pollLoaded: pollLoaded,
			setPoll: setPoll,

			getUserVote: getUserVote,
			vote: vote,
			undoVote: undoVote,
			submitSurvey: submitSurvey
		};

		return service;


		function pollLoaded(){
			return pollPromise.promise;
		}

		function setPoll(val){
			pollPromise = (service.pollSet)? $q.defer() : pollPromise;
			service.pollSet = true;
			pollPromise.resolve(val);
		}

		function getUserVote(pollID, type){
			var defer = $q.defer();
			userService.userLoaded().then(function(user){
				accountApi.$getVote({ pollID: pollID, type: type }).then(function(userVote){
					if(userVote.pollID){
						defer.resolve(userVote);
					} else {
						defer.reject();
					}
				}, function(){
					defer.reject();
				});
			}, defer.reject);			
			return defer.promise;
		}

		function vote(pollID, optionID){
			var defer = $q.defer();						
			accountApi.$vote({
				pollID: pollID,
				optionID: optionID
			}).then(function(){
				// Update the poll promise
				service.pollSet = false;
				setPoll({ 
					pollID: pollID,
					optionID: optionID
				});
				defer.resolve();
			}, function(err){
				$log.error(err);	
				defer.reject();				
			});
			return defer.promise;
		}

		function undoVote(pollID, optionID){
			var defer = $q.defer();
			accountApi.$undoVote({
				pollID: pollID,
				optionID: optionID
			}).then(function(){
				// Update the poll promise
				service.pollSet = false;
				setPoll(undefined);
				defer.resolve();
			}, function(err){
				$log.error(err);	
				defer.reject();						
			});
			return defer.promise;
		}

		function submitSurvey(pollID, answers){
			var defer = $q.defer();
			accountApi.$submitSurvey({
				pollID: pollID,
				answers: answers
			}).then(function(){
				defer.resolve();
			}, function(err){
				$log.error(err);	
				defer.reject();	
			});
			return defer.promise;
		}

	}

})();
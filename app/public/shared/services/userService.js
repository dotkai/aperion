(function(){
	'use strict';

	angular.module('apeiron').service('userService', userService);

	userService.$inject = ['$q', 'ngDialog', '$state', 'accountApi', '$window', 'userAuthApi'];
	function userService($q, ngDialog, $state, accountApi, $window, userAuthApi){
		// Initialize Firebase
		var userPromise = $q.defer();

		var service = {
			data: {
				userSet: false,
				maxChapter: 0
			},
			userLoaded: userLoaded,

			initConnection: initConnection,
			updateCharacters: updateCharacters,
			submitTerms: submitTerms,

			showTerms: showTerms,
			fbSignup: fbSignup,
			googleSignup: googleSignup,
			signout: signout
		};

		return service;


		function initConnection(cb){
      		accountApi.$getAccount().then(function(user) {
      			// User is signed in
				setUser(user);
				if(cb){ cb(); }
			}, function(error){
				userPromise.reject();		
			});  		
		}

		function userLoaded(){
			return userPromise.promise;
		}

		function setUser(user){
			if(service.data.userSet){
				userPromise = $q.defer();
			}
			userPromise.resolve({
				needTerms: user.needTerms,
				email: user.email,
				characters: user.characters,
				chapters: user.chapters
			});
			service.data.userSet = !!user;
			service.data.maxChapter = user.chapters
		}

		// UPDATE CHARACTER STUFF
		function updateCharacters(nuPronouns){
			var defer = $q.defer();
			accountApi.$updateAccount({ characters: nuPronouns }).then(function(){
				initConnection(defer.resolve);
			}, function(){
				defer.reject();
			});
			return defer.promise;
		}

		// TERMS AND CONDITIONS
		function showTerms(){
			ngDialog.open({
				template: '<complete-account closefn="closeThisDialog()"></complete-account>',
				plain: true,
				showClose: false,
				closeByEscape: false,
				closeByNavigation: false,
				closeByDocument: false
			});
		}

		function submitTerms(params){
			var defer = $q.defer();
			userAuthApi.$finishSignup(params).then(defer.resolve, defer.reject);
			return defer.promise;
		}


		// LOGIN, LOGOUT STUFF
		function fbSignup(){
			userAuthApi.$facebookAuth();
		}

		function googleSignup(){
			userAuthApi.$googleAuth();
		}

		function signout(){
			userAuthApi.$logout().then(function(){
				// Sign-out successful
				// Reload app to reset the pages
				$window.location.reload();
			}, function(error){
				showError(error);
			});
		}

		function showError(error){
			console.log(error);
			ngDialog.open({
				template: '<msgpopup msg="'+error.message+'" close="closeThisDialog()"></msgpopup>',
				plain: true
			});
		}
	}

})();
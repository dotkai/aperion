(function(){
	'use strict';

	angular.module('apeiron').component('storyPage', {
		controller: storyPageController,
		controllerAs: 'vm',
		templateUrl: '/views/story',
		bindings: {
			path: '@',
			chapter: '<',
			part: '<'
		}
	});

	storyPageController.$inject = ['navService', '$state', 'ngDialog', 'userService'];
	function storyPageController(navService, $state, ngDialog, userService){
		var vm = this;

		angular.extend(vm, {
			showPoll: false
		});

		vm.$onInit = init;

		function init(){
			userService.userLoaded().then(function(user){
				navService.blogLoaded().then(function(data){

					if(vm.chapter < 0 || vm.chapter === undefined || !vm.part){
						goToMostRecent(data.chapters.go);
						return;
					}				

					navService.getChapterData(vm.path, vm.chapter, vm.part).then(function(chptData){
						vm.chptData = chptData;
						setMissingCharacters(chptData.chars, data.characters);
					})
				});
			});
		}

		function goToMostRecent(allChapters){
			var last = allChapters[allChapters.length-1];
			$state.go('story', { chapter: last.chapter, part: last.parts });
		}

		function setMissingCharacters(newChars, allChars){
			userService.userLoaded().then(function(user){
				// Get characters the user hasn't specified yet
				var charList = [];
				angular.forEach(newChars, function(item){
					if(!user.characters || !user.characters[item]){
						charList.push(allChars[item]);
					}
				});

				if(charList.length === 0){ return; }

				ngDialog.open({
					template: '<newchar-dialog closefn="closeThisDialog()" char-list="dg.charList"></newchar-dialog>',
					className: 'ngdialog ngdialog-theme-default dialog-wide',
					plain: true,
					showClose: false,
					closeByEscape: false,
					closeByNavigation: false,
					closeByDocument: false,
					controllerAs: 'dg',
					controller: [function(){
						this.charList = charList;
					}]
				});
			});
		}
	}

})();
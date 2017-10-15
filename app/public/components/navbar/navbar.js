(function(){
	'use strict';

	angular.module('apeiron').component('navbar', {
		templateUrl: '/views/navbar',
		controller: navbarController,
		controllerAs: 'vm'
	});

	navbarController.$inject = ['userService', 'navService', '$stateParams', '$state'];
	function navbarController(userService, navService, $stateParams, $state){
		var vm = this;

		angular.extend(vm, {
			path: 'go',
			data: userService.data,
			chapterData: [],

			getCurrentChapter: getCurrentChapter,
			next: getNext,
			prev: getPrev,
			goToPage: goToPage,
			hasNext: hasNext,
			hasPrevious: hasPrevious,

			fbSignup: userService.fbSignup,
			//twitterSignup: twitterSignup,
			googleSignup: userService.googleSignup,
			logout: userService.signout
		});

		vm.$onInit = init;

		function init(){
			navService.blogLoaded().then(function(data){
				var currentChapter = parseInt($stateParams.chapter),
					currentPart = parseInt($stateParams.part),
					selectedIndex;

				vm.chapterPartList = [];
				vm.chapterData = data.chapters.go;

				for(var i=vm.chapterData.length-1; i >= 0; i--){
					var item = vm.chapterData[i];
					for(var j=item.parts; j > 0; j--){
						vm.chapterPartList.push({
							chapter: item.chapter,
							part: j
						});

						if(item.chapter === currentChapter && j === currentPart){
							selectedIndex = vm.chapterPartList.length-1;
						}
					}
				}

				vm.currentChapterModel = vm.chapterPartList[selectedIndex];
			});
		}

		function goToPage(selected){
			$state.go('story', { chapter: vm.currentChapterModel.chapter, part: vm.currentChapterModel.part });
		}

		function getCurrentChapter(){
			if($stateParams.chapter){
				vm.chapter = $stateParams.chapter;
				vm.lastChapter = $stateParams.chapter;
			} else {
				vm.chapter = vm.lastChapter;
			}

			if($stateParams.part){
				vm.part = $stateParams.part;
				vm.lastPart = $stateParams.part;
			} else {
				vm.part = vm.lastPart;
			}

			return 'Chapter ' + vm.chapter + '('+ vm.part +')';
		}

		function getNext(){
			navService.blogLoaded().then(function(data){
				var currentChapter = parseInt($stateParams.chapter),
					currentPart = parseInt($stateParams.part),
					chapterData = data.chapters.go[currentChapter],
					part, chapter;

				if(currentPart === chapterData.parts){
					// On last part of this chapter, go to next
					chapter = currentChapter+1;
					part = 1;
				} else {
					chapter = currentChapter;
					part = currentPart+1;
				}

				updateAutoSelect(chapter, part);	
				$state.go('story', { chapter: chapter, part: part });
			});
		}

		function getPrev(){
			navService.blogLoaded().then(function(data){
				var currentChapter = parseInt($stateParams.chapter),
					currentPart = parseInt($stateParams.part),
					chapter, part;

				if(currentPart > 1){
					chapter = currentChapter;
					part = currentPart - 1;
				} else if(currentPart === 1 && currentChapter!==0) {
					// Chapters ~== position in array
					// Example: ch1 = 0, c2 = 1, etc.
					var previousChapter = data.chapters.go[currentChapter-1];
					chapter = previousChapter.chapter;
					part = previousChapter.parts;
				}	

				updateAutoSelect(chapter, part);	
				$state.go('story', { chapter: chapter, part: part });		
			});
		}

		function updateAutoSelect(chapter, part){
			for(var i=0; i < vm.chapterPartList.length; i++){
				if(vm.chapterPartList[i].chapter === chapter){
					if(vm.chapterPartList[i].part == part){
						vm.currentChapterModel = vm.chapterPartList[i];
						return;
					}
				}
			}
		}


		function hasNext(){
			if(vm.chapterData){
				var currentChapter = parseInt($stateParams.chapter),
					currentPart = parseInt($stateParams.part),
					lastChapterData = vm.chapterData[vm.chapterData.length-1];

				if(!lastChapterData){ return false; }
					
				return currentPart < lastChapterData.parts || lastChapterData.chapter !== currentChapter;
			}
			return false;
		}

		function hasPrevious(){
			var currentChapter = parseInt($stateParams.chapter),
				currentPart = parseInt($stateParams.part);

			return !(currentChapter === 0 && currentPart === 1);
		}

	}

})();
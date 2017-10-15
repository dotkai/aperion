(function(){
	'use strict';

	angular.module('apeiron').component('settingsPage', {
		templateUrl: '/views/settings',
		controller: settingsPageController,
		controllerAs: 'vm'
	})
	.filter('searchFilter', searchFilter);

	settingsPageController.$inject = ['$state', 'navService', 'userService', '$filter'];
	function settingsPageController($state, navService, userService, $filter){

		var vm = this
			, changeCue = {};

		angular.extend(vm, {
			characters: {},
			filteredCharacters: {},
			saveLoading: false,

			noChanges: noChanges,
			clearChanges: clearChanges,
			updateSearchFilter: updateSearchFilter,
			saveChar: saveChar,
			saveChanges: saveChanges
		});

		vm.$onInit = init;

		function init(){
			changeCue = {};
			navService.blogLoaded().then(function(data){
				userService.userLoaded().then(function(user){
					// Add user defined pronouns
					angular.forEach(user.characters, function(val, key){
						data.characters[key].val = val;
					});
					// Set the list in the template
					vm.characters = data.characters;
					updateSearchFilter();
					vm.saveLoading = false;
				});
			});
		}

		function noChanges(){
			return Object.keys(changeCue).length === 0;
		}

		function clearChanges(){
			$state.reload();
		}

		function updateSearchFilter(name){
			vm.filteredCharacters = $filter('searchFilter')(vm.characters, name);
		}

		function saveChar(params){
			vm.characters[params.chr].val = params.val;
			changeCue[params.chr] = params.val;
		}

		function saveChanges(){
			vm.saveLoading = true;
			userService.userLoaded().then(function(user){
				// Update the character list reference elsewhere
				userService.updateCharacters(changeCue).then(init);
			});
		}
	}

	function searchFilter(){
		return function(list, name){
			if(name === undefined){
				return list;
			} else {
				var nu = [];
				angular.forEach(list, function(item){
					if(item.name.toLowerCase().indexOf(name.toLowerCase()) > -1){
						nu.push(item);
					}
				});
				return nu
			}
			
		}
	}

})();
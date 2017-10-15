(function(){
	'use strict';

	angular.module('apeiron').component('newcharDialog', {
		templateUrl: '/views/newchars',
		controller: Controller,
		controllerAs: 'vm',
		bindings: {
			charList: '<',
			closefn: '&'
		}
	});

	Controller.$inject = ['$state', 'navService', 'userService'];
	function Controller($state, navService, userService){

		var vm = this,
			changeCue = {};

		angular.extend(vm, {
			saveLoading: false,

			noChanges: noChanges,
			saveChar: saveChar,
			saveChanges: saveChanges,
			randomize: randomize
		});

		vm.$onInit = init;

		function init(){
			vm.saveLoading = false;
		}

		function noChanges(){
			return Object.keys(changeCue).length !== Object.keys(vm.charList).length;
		}

		function saveChar(params){
			changeCue[params.chr] = params.val;
		}

		function saveChanges(){
			vm.saveLoading = true;
			userService.userLoaded().then(function(user){
				// Update the character list reference elsewhere
				userService.updateCharacters(changeCue).then(function(){
					vm.closefn();
					$state.reload();
				});
			});
		}

		function randomize(){
			angular.forEach(vm.charList, function(item){
				item.val = Math.floor(Math.random() * 3) + 1;
				changeCue[item.key] = item.val;
			});
		}
	}

})();
(function(){
	'use strict';

	angular.module('apeiron').component('contactMe', {
		controller: Controller,
		controllerAs: 'vm',
		templateUrl: '/views/contact'
	});

	Controller.$inject = ['userService'];
	function Controller(userService){
		var vm = this;

		vm.$onInit = init;

		function init(){
			userService.userLoaded().then(function(user){
				vm.email = user.email;
			});
		}

	}

})();
(function(){
	'use strict';

	angular.module('apeiron').component('loginPopup', {
		templateUrl: '/views/login',
		controller: loginController,
		controllerAs: 'vm'
	});

	loginController.$inject = ['$state', 'userService'];
	function loginController($state, userService){

		var vm = this;

	}


})();
(function(){
	'use strict';

	angular.module('apeiron').component('completeAccount', {
		templateUrl: '/views/login/completeAccount',
		controller: loginController,
		controllerAs: 'vm',
		bindings: {
			closefn: '&'
		}
	});

	loginController.$inject = ['$state', 'userService', 'ngDialog', '$window', '$log'];
	function loginController($state, userService, ngDialog, $window, $log){

		var vm = this;

		angular.extend(vm, {
			open: open,
			submit: submit
		});

		function open(type){
			ngDialog.open({
				className:'ngdialog ngdialog-theme-default dialog-wide',
				template: '<about-page style="overflow: auto" type="'+type+'"></about-page>'
					+'<div class="button-row"><button class="btn btn-primary" ng-click="closeThisDialog()">Ok</button></div>',
				plain: true,
				showClose: false,
				closeByEscape: false,
				closeByNavigation: false,
				closeByDocument: false
			})
		}


		function submit(){
			vm.saveLoading = true;
			userService.submitTerms({
				termsSignup: !!vm.acceptTerms,
				emailSignup: !!vm.mailingList
			}).then(function(){
				vm.saveLoading = false;
				$window.location.reload();
			}, function(err){
				$log.error(err);
				vm.err = 'Error: Unable to complete account. Please contact Kai to report the issue.';
			});
		}
	}


})();
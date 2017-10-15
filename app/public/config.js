(function(){
	'use strict';

	angular.module('apeiron').config(configApp).run(runApp);

	configApp.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'laddaProvider'];
	function configApp($stateProvider, $urlRouterProvider, $locationProvider, laddaProvider){

		laddaProvider.setOption({ /* optional */
			style: 'expand-left',
			spinnerSize: 35,
			spinnerColor: '#ffffff'
		});

		//$urlRouterProvider.deferIntercept();
		$urlRouterProvider.otherwise("/");


		$stateProvider
			.state('home', {
				url: '/',
				template: '<login-popup class="login"></login-popup>'
			})
			.state('story', {
				url: '/go/:chapter/:part',
				template: function(stateParams){
					return '<story-page path="go" chapter="'+stateParams.chapter+'" part="'+stateParams.part+'"></story-page>';
				},
				authRequired: true
			})
			.state('faq', {
				url: '/faq',
				template: '<about-page type="faq"></about-page>'
			})
			.state('rules', {
				url: '/rules',
				template: '<about-page type="rules"></about-page>'
			})
			.state('terms', {
				url: '/agreement',
				template: '<about-page type="terms" class="normal"></about-page>'
			})
			.state('privacy', {
				url: '/privacy_policy',
				template: '<about-page type="privacy" class="normal"></about-page>'
			})
			.state('settings', {
				url: '/characters',
				template: '<settings-page></settings-page>',
				authRequired: true
			})
			.state('contact', {
				url: '/contact',
				template: '<contact-me></contact-me>'
			});

		$locationProvider.html5Mode(true);
	}

	runApp.$inject = ['userService', 'navService', '$state', '$transitions'];
	function runApp(userService, navService, $state, $transitions){
		userService.initConnection();

		$transitions.onStart({}, function(trans){
			if(trans.$to().self.authRequired){
				userService.userLoaded().then(function(user){
					if(user.needTerms){
						userService.showTerms();
						return;
					}
					navService.getBlogInfo();
				}, function(){
					// User must be signed in to access page
						$state.go('home');
				});
			}
		});
	}

})();
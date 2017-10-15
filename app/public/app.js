(function(){
	'use strict';
	angular.module('apeiron', ['apeiron.core']);

	// CORE - app management and features
	angular.module('apeiron.core',
		['ngRoute', 'ngResource', 'ui.router', 'ngCookies', 'ngSanitize', 'ngDialog', 'angular-ladda']);
})();

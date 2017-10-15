(function(){
	'use strict';

	angular.module('apeiron').directive('pronounWrap', pronounWrap);

	pronounWrap.$inject = ['userService', 'navService'];
	function pronounWrap(userService, navService){
		return {
			restrict: 'A',
			template: '<div ng-include="vm.getActivePage()" onload="vm.updatePronouns()"></div>',
			link: pronounLink,
			bindToController: true,
			controllerAs: 'vm',
			controller: PronounWrapCtrl,
			scope: {
				path: '=',
				chapter: '=',
				part: '='
			}
		}

		function pronounLink(scope, elem, attrs, ctrl){
			var characters, mapping;

			ctrl.updatePronouns = updatePronouns;

			function updatePronouns(){
				// Update the replacer to update text in correct child
				var post = elem[0].children[0];

				userService.userLoaded().then(function(userData){
					navService.blogLoaded().then(function(blogData){
						characters = userData.characters || {};
						mapping = blogData.genderMapping;

						var myString = post.innerText;
						var myRegexp = /(\[\[)[\w\.]+(\]\])/g;
						var match = myRegexp.exec(myString);

						while (match != null) {
						  // matched text: match[0]
						  // match start: match.index
						  // capturing group n: match[n]
						  var pronoun = getPronounFix(match[0], userData.characters, blogData);
						  post.innerText = post.innerText.replace(match[0], pronoun);
						  match = myRegexp.exec(myString);
						}
					});
				});
			}

			function getPronounFix(str, userData, blogData){
				var topar = str.substring(str.lastIndexOf('[')+1, str.lastIndexOf(']')-1).split('.');
				var isCaps = (topar[1][0].toUpperCase() === topar[1][0]);

				var matchType = topar[1].toLowerCase();
				var charUse = characters[topar[0]];
				var pronoun = mapping[matchType][charUse-1];

				if(!pronoun) return '';

				return (isCaps)? pronoun[0].toUpperCase()+pronoun.substring(1) : pronoun;
			}

		}
	}

	function PronounWrapCtrl(){
		var vm = this;

		angular.extend(vm, {
			getActivePage: getActivePage
		})

		function getActivePage(){
			return (vm.path && vm.chapter >= 0 && vm.part)? '/apeiron/post/'+vm.path+'/'+vm.chapter+'/'+vm.part : '/pending';
		}
	}


})();
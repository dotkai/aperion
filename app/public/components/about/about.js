(function(){
	'use strict';

	angular.module('apeiron').component('aboutPage', {
		templateUrl: template,
		controller: Controller,
		controllerAs: 'vm'
	});

	template.$inject = ['$element', '$attrs'];
	function template($elem, $attrs){
		return '/about/'+$attrs.type;
	}

	Controller.$inject = ['$anchorScroll', '$location'];
	function Controller($anchorScroll, $location){

		var vm = this;

		angular.extend(vm, {
			tags: [{
				text: 'What is Apeiron?',
				anchor: 'what'
			}, {
				text: 'Where does Apeiron take place?',
				anchor: 'where'
			}, {
				text: 'How does chapter release work?',
				anchor: 'chapter'
			}, {
				text: 'What is the Readship Agreement and where can I read it?',
				anchor: 'terms'
			}, {
				text: 'Why pronouns?',
				anchor: 'why'
			}, {
				text: 'What is a story path?',
				anchor: 'path'
			}, {
				text: 'Who and what are the MC?',
				anchor: 'mc'
			}, {
				text: 'What happens if there is a tie?',
				anchor: 'ties'
			}, {
				text: 'What determines what voting options there are on the poll?',
				anchor: 'questions'
			}, {
				text: 'Is there a "correct" option in the poll?',
				anchor: 'correct'
			}, {
				text: 'How do I petition for a story rule change?',
				anchor: 'rules'
			}, {
				text: 'Do you know what pronouns I\'ve assigned the characters?',
				anchor: 'pronouns'
			}, {
				text: 'Who is the author?',
				anchor:'author'
			}, {
				text: 'I discovered typos, grammar errors, lack of clarity, etc.. How can I contact you to fix them?',
				anchor: 'errors'
			}/*, {
				text: 'I\'m offended this project exists.',
				anchor: 'offended'
			}*/],
			gotoAnchor: gotoAnchor
		});


		function gotoAnchor(x) {
			$location.hash(x);
			$anchorScroll();
		};

	}


})();
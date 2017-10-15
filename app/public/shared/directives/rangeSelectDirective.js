(function(){
	'use strict';

	angular.module('apeiron').directive('rangeSelect', rangeSelect);

	rangeSelect.$inject = [];
	function rangeSelect(){
		return {
			restrict: 'A',
			controller: rangeSelectController,
			controllerAs: 'vm',
			bindToController: true,
			template: '<div class="radio-row">'
					+'<div class="lrg-radio" ng-class="{\'checked\':vm.ngModel===1}">'
						+'<input type="radio" name="button{{::vm.chr}}" ng-model="vm.ngModel" value="1"/>'
						+'<label ng-click="vm.updateValue(1)" class="check"><span class="inside"></span></label>'
					+'</div>'
					+'<div class="lrg-radio" ng-class="{\'checked\':vm.ngModel===2}">'
						+'<input type="radio" name="button{{::vm.chr}}" ng-model="vm.ngModel" value="2"/>'
						+'<label ng-click="vm.updateValue(2)" class="check"><span class="inside"></span></label>'
					+'</div>'
					+'<div class="lrg-radio" ng-class="{\'checked\':vm.ngModel===3}">'
						+'<input type="radio" name="button{{::vm.chr}}" ng-model="vm.ngModel" value="3"/>'
						+'<label ng-click="vm.updateValue(3)" class="check"><span class="inside"></span></label>'
					+'</div>'
				+'</div>',
			scope: {
				ngModel: '=',
				onSwitch: '&',
				chr: '@'
			}
		}
	}

	function rangeSelectController(){
		var vm = this;

		vm.updateValue = updateValue;

		function updateValue(val){
			console.log('UPDATING', vm.ngModel);
			vm.ngModel = val;
			vm.onSwitch({ parms: { chr: vm.chr, val: vm.ngModel } });
		}

	}

})();
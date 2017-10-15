(function(){
	'use strict';

	angular.module('apeiron').directive('surveyRange', rangeSelect);

	rangeSelect.$inject = [];
	function rangeSelect(){
		return {
			restrict: 'A',
			controller: function(){},
			controllerAs: 'vm',
			bindToController: true,
			template: function(elem, attrs){
				var count = parseInt(attrs.count),
					str = '';

				for(var i=0; i < count; i++){
					str += '<div class="lrg-radio">'
								+'<input type="radio" name="'+attrs.name+'" ng-model="vm.ngModel" value="'+ (i+1) +'"/>'
								+'<label class="check"><span class="inside"></span></label>'
							+'</div>';
				}

				return '<div class="start-label">'+attrs.startLabel+'</div>' + str + '<div>'+attrs.endLabel+'</div>'
			},
			scope: {
				ngModel: '=',
				onSwitch: '&'
			}
		}
	}

})();
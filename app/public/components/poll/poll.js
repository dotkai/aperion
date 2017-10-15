(function(){
	'use strict';

	angular.module('apeiron').component('apPoll', {
		controller: pollController,
		controllerAs: 'vm',
		templateUrl: '/views/poll',
		bindings: {
			path: '<',
			chapter: '<',
			part: '<',
			pollOptions: '<'
		}
	});

	pollController.$inject = ['pollService', 'ngDialog'];
	function pollController(pollService, ngDialog){
		var vm = this,
			TODAY = new Date(),
			MAX_DAYS_ACTIVE = 5,
			DAYS_SHOW_POLL_AFTER_DEACTIVE = 2;

		angular.extend(vm, {
			selectedVote: undefined,
			alreadyVoted: true,
			vote: vote,
			unvote: unvote,
			canUndoVote: canUndoVote,
			saveChanges: saveChanges,
			noChanges: noChanges
		});

		vm.$onChanges = onChanges;

		function onChanges(changes){
			if(changes.pollOptions && !!changes.pollOptions.currentValue){
				var poll = changes.pollOptions.currentValue;

				// Get the poll and view
				vm.pollID = poll._id;
				vm.options = poll.options;
				vm.showType = getShowType(poll);

				if(!vm.showWinner){
					getUserVote(poll);
				}
			}
		}

		// DISPLAY

		function getShowType(poll){
			if(poll.ptype === 'survey'){
				vm.pollText = poll.text;
				return 'survey';
			}

			var ima = new Date(),
				showDayCount = (poll.extend)? poll.extend + MAX_DAYS_ACTIVE : MAX_DAYS_ACTIVE,
				startTime = new Date(poll.start),
				endTime = addDays(startTime, showDayCount),
				resultTime = addDays(startTime, showDayCount + DAYS_SHOW_POLL_AFTER_DEACTIVE);

			vm.resultDate = resultTime.toDateString();

			if(startTime <= ima && ima <= endTime){
				if(!poll.active){ return 'none';  }
				return 'poll';
			} else if(endTime < ima && ima <= resultTime) {
				if(!poll.active){ return 'none';  }
				return 'pending';
			} else {
				vm.winnerIndex = poll.winner;
				return 'result';
			}
		}

		function addDays(date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		}


		// VOTING

		function getUserVote(pollOptionList){
			// Get the vote of the user
			pollService.getUserVote(pollOptionList._id, pollOptionList.ptype).then(function(voteOption){
				vm.alreadyVoted = true;
				vm.selectedVote = voteOption.optionID;
				vm.lastVoted = new Date(voteOption.timestamp);
			
				if(vm.showType === 'survey'){
					voteOption.input.forEach(function(item, index){
						vm.options[index].value = item.value;
					});
				}

			}, function(error){
				// Unauthorized is a valid error as the user not logged in
				vm.alreadyVoted = false;
				vm.selectedVote = undefined;
			});
		}

		function vote(optionID){
			vm.pending = true;
			pollService.vote(vm.pollID, optionID).then(function(){
				// Update controller values
				vm.pending = false;
				vm.alreadyVoted = true;
				vm.selectedVote = optionID;
				vm.lastVoted = new Date();
				showVoteRecorded();	
			});
		}

		function unvote(){
			vm.pending = true;
			pollService.undoVote(vm.pollID, vm.selectedVote).then(function(){
				// Update controller values
				vm.pending = false;
				vm.alreadyVoted = false;
				vm.selectedVote = undefined;
			});
		}

		function canUndoVote(){
			return vm.alreadyVoted && (vm.lastVoted && getTimeDiff());
		}

		function getTimeDiff(){
			return timeConvert(TODAY) - timeConvert(vm.lastVoted) > 1;
		}

		function timeConvert(val){
			return val.getTime()/(1000*60*60*24);
		}

		function showVoteRecorded(){
			var endtime = addDays(vm.pollOptions.start, 7);

			ngDialog.open({
				template: '/views/poll/recorded',
				controllerAs: 'vm',
				controller: ['$interval', function($interval){
					var dg = this;

					var timeinterval = $interval(function(){
						var t = getTimeRemaining(endtime);
						dg.formatTime = t.days + ' days, ' + t.hours +':'+t.minutes+':'+t.seconds;

						if(t.total<=0){
						  $interval.cancel(timeinterval);
						}
					},1000);

					function getTimeRemaining(endtime){
						var t = Date.parse(endtime) - Date.parse(new Date());
						var seconds = Math.floor( (t/1000) % 60 );
						var minutes = Math.floor( (t/1000/60) % 60 );
						var hours = Math.floor( (t/(1000*60*60)) % 24 );
						var days = Math.floor( t/(1000*60*60*24) );
						return {
							'total': t,
							'days': days,
							'hours': hours,
							'minutes': minutes,
							'seconds': seconds
						};
					}
				}]
			});
		}


		// SURVEY

		function saveChanges(){
			vm.saveLoading = true;
			pollService.submitSurvey(vm.pollID, vm.options)
			.then(function(){
				vm.saveLoading = false;
				vm.alreadyVoted = true;
			});
		}

		function noChanges(){
			var hasEmpty = false;
			if(vm.options){
				for(var i=0; i < vm.options.length; i++){
					if(!vm.options[i].value){
						hasEmpty = true;
						return;
					}
				}
			}
			return vm.alreadyVoted || hasEmpty;
		}
	}
	
})();
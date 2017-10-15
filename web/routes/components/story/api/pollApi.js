/* API for communicating with Polls Model */
var AccountApi = require('../../account/api/accountApi.js')
	, Polls = require('../models/PollsModel.js')
	, utils = require('../../../utils.js');

module.exports = {
	getActivePoll: getActivePoll,
	votePoll: votePoll,
	undoVotePoll: undoVotePoll
};

function getActivePoll(req, res){
	utils.validPost({
		params: {
			path: 1,
			chapter: 1,
			part: 1
		}
	}, function(){
		Polls.findOne({
			path: req.params.path,
			chapter: req.params.chapter,
			part: req.params.part
		}).lean().exec(function(err, poll){
			if(err){ return res.send(err); }

			poll.winner = -1;

			// Set options
			var options = [], highest = 0;
			if(poll.active){
				// Calculate winning vote/if winning
				var ima = new Date(),
				startTime = new Date(poll.start),
				winTime = utils.addDays(startTime, 7);

				poll.options.forEach(function(item, index){
					options.push({
						_id: item._id,
						text: item.text,
						input: item.input,
						vote: (winTime < ima)? item.vote : null
					});
					// Set winner
					if(winTime < ima && highest < item.vote){
						highest = item.vote;
						poll.winner = index;
					}
				});
			}
			poll.options = options;

			res.send(poll);	
		});
	}, req, res);
}

function votePoll(req, res){
	utils.validPost({
		body: {
			pollID: 1,
			optionID: 1
		}
	}, function(){
		Polls.update({ 
			'_id': req.body.pollID,
			'options._id': req.body.optionID
		}, {
			$inc: { 'options.$.vote': 1 }
		}, function(err, poll){
			if(err){ return res.send(err); }

			AccountApi.setVote({
				accountID: req.session.accountid,
				pollID: req.body.pollID,
				optionID: req.body.optionID
			}).then(function(){
				res.sendStatus(200);
			}, function(err){
				res.sendStatus(err);
			});		
		});
	}, req, res);
}

function undoVotePoll(req, res){
	utils.validPost({
		body: {
			pollID: 1,
			optionID: 1
		}
	}, function(){
		Polls.update({ 
			'_id': req.body.pollID,
			'options._id': req.body.optionID
		}, {
			$inc: { 'options.$.vote': -1 }
		}, function(err, poll){
			if(err){ return res.send(err); }

			AccountApi.removeVote({
				accountID: req.session.accountid,
				pollID: req.body.pollID
			}).then(function(){
				res.sendStatus(200);
			}, function(err){
				res.sendStatus(err);
			});
		});
	}, req, res);
}
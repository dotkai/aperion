// Account Management
var Promise = require('promise')
	, Account = require('../models/AccountModel.js')
	, Vote = require('../models/VoteModel.js')
	, SurveyResult = require('../models/SurveyResultModel.js')
	, utils = require('../../../utils.js')
	, configAuth = require('../../userAuth/config/auth').types
	, MESSAGE = require('../../../config/messages.js');

module.exports = {
	getAccount: getAccount,
	updateAccount: updateAccount,
	updateChapterBookmark: updateChapterBookmark,

	getVote: getVote,
	setVote: setVote,
	removeVote: removeVote,
	submitSurveyResult: submitSurveyResult
};


function getAccount(req, res){
	// Gets the user based on session
	Account.findOne({ 'userid' :  req.user._id }).lean().exec(function(err, account){
		if(err){ return res.send(err); }
		if(!account){ return res.send({ needTerms: true }); }

		req.session.accountid = account._id;

		var email;
		if(req.user.login === configAuth.FACEBOOK){
			email = req.user.facebook.email;
		}

		var chaps = {};
		account.chapters.forEach(function(item){
			chaps[item.path] = item.chapter;
		});

		res.send({
			email: email,
			characters: account.characters,
			chapters: chaps
		});			
	});
}

function updateAccount(req, res){
	utils.validPost({
		body: {
			characters: 1
		}
	}, function(){
		var createSet = {};
		for(var key in req.body.characters){
			createSet['characters.'+key] = req.body.characters[key];
		}

		Account.update({
			'_id': req.session.accountid
		}, {
			$set: createSet
		}, function(err, account){
			if(err){ return res.send(err); }
			return res.sendStatus(200);
		});
	}, req, res);
}

function updateChapterBookmark(req, res){
	utils.validPost({
		body: {
			path: 1,
			chapter: 1
		}
	}, function(){
		Account.update({
			'_id': req.session.accountid,
			'chapters.path': req.body.path
		}, {
			$set: { 'chapters.$.chapter': req.body.chapter }
		}, function(err, account){
			if(err){ return res.send(err); }
			return res.sendStatus(200);
		});
	}, req, res);
}



function getVote(req, res){
	utils.validPost({
		params: {
			pollID: 1
		},
		query: {
			type: 1
		}
	}, function(){
		if(req.query.type === 'survey'){
			SurveyResult.findOne({
				accountid: req.session.accountid,
				pollid: req.params.pollID
			}).lean().exec(function(err, vote){
				if(err){ return res.send(err); }
				if(!vote){ return res.send(); }
				res.send({
					pollID: vote.pollid,
					input: vote.input,
					timestamp: vote.timestamp
				});
			});
		} else {
			Vote.findOne({
				accountid: req.session.accountid,
				pollid: req.params.pollID
			}).lean().exec(function(err, vote){
				if(err){ return res.send(err); }
				if(!vote){ return res.send(); }
				res.send({
					pollID: vote.pollid,
					optionID: vote.optionid,
					timestamp: vote.timestamp
				});
			});
		}
	}, req, res);
}

function setVote(params){
	return new Promise(function (resolve, reject){

		var vote = new Vote({
			accountid: params.accountID,
			pollid: params.pollID,
			optionid: params.optionID,
			timestamp: new Date()
		});

		vote.save(function(err){
			if(err){ return reject(err); }
			resolve();
		});

	});
}

function removeVote(params){
	return new Promise(function (resolve, reject){
		Vote.find({
			accountid: params.accountID,
			pollid: params.pollID
		}).remove(function(err){
			if(err){ return reject(err); }
			resolve();
		});

	});
}

function submitSurveyResult(req, res){
	utils.validPost({
		body: {
			pollID: 1,
			answers: 1
		}
	}, function(){
		var shrinked = [];
		req.body.answers.forEach(function(item){
			shrinked.push({
				id: item._id,
				value: item.value
			});
		});

		var vote = new SurveyResult({
			accountid: req.session.accountid,
			pollid: req.body.pollID,
			input: shrinked,
			timestamp: new Date()
		});

		vote.save(function(err){
			if(err){ return res.send(err); }
			res.sendStatus(200);
		});
	}, req, res);
}
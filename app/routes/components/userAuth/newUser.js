// Account Creation and linking
var User = require('./models/UserModel')
	, Account = require('../account/models/AccountModel.js')
	, utils = require('../../utils.js')
	, configAuth = require('./config/auth')
	, Mailchimp = require('mailchimp-api-v3')
	, listUniqueId = 'a89c2cdafa'
 	, mailchimpApi = new Mailchimp('z');;

module.exports = {
	queryUserExists: queryUserExists,
	queryUserExistsMulti: queryUserExistsMulti,
	createNewUser: createNewUser,
	acceptTerms: acceptTerms,
	linkExistingUser: linkExistingUser
}


function queryUserExists(key, match, callback, done){
	var q = {};
	q[key] = match;
	User.findOne(q, function(err, user) {
        // if there are any errors, return the error before anything else
        if(err){ return done(err); }
        return callback(err, user);
    });
}

function queryUserExistsMulti(oneOf, callback, done){
	// oneOf should be an array
	User.findOne({
		'$or': oneOf
	}, function(err, user) {
        // if there are any errors, return the error before anything else
        if(err){ return done(err); }
        return callback(err, user);
    });
}


function createNewUser(base, params, done){
	var newUser = new User();

	// Maps parameters, also sets username/displayname
	setUserParams(base, newUser, params, true);

	// save the user
	newUser.save(function(err) {
		if (err){ return done(err); }	
		return done(null, newUser);
	});
}


function acceptTerms(req, res){
	// Gets the user based on session
	// Accepted terms means an account can be created
	utils.validPost({
		body: {
			termsSignup: 1,
			emailSignup: 1
		}
	}, function(){
		if(req.body.termsSignup === false){
			return res.send(401);
		}

		User.update({ '_id' :  req.user._id }, {
			$set: { terms: new Date() }
		}, function(err, user){

			// SET NEW ACCOUNT
			var newAccount = new Account({
				userid: req.user._id,
				chapters: [{
					path: 'go',
					chapter: 1
				}]
			});

			newAccount.save(function(err){
				if (err){ return res.send(err); }
				if(!req.body.emailSignup){ return res.sendStatus(200); }

				// SIGN UP FOR MAILING LIST
				var email;
				if(req.user.login === configAuth.types.FACEBOOK){
					email = req.user.facebook.email;
				} else if(req.user.login === configAuth.types.GOOGLE){
					email = req.user.google.email;
				}

				signUpForMailingList(email, res);				
			});
		});
	}, req, res);
}

function signUpForMailingList(email, res){
	mailchimpApi.post('/lists/'+listUniqueId+'/members', {
		email_address: email,
		status: 'subscribed',
		interests: {
			'6b0239b906': true
		}
	}).then(function(resp){
		return res.sendStatus(200);
	}).catch(function(err){
		return res.send(err);
	});
}


function linkExistingUser(base, params, done){
	setUserParams(base, params.user, params);

	// save the user
	params.user.save(function(err) {
		if (err){ return done(err); }
		// Return if return required, else callback
		// If successfully linked user, return the new account
		return done(null, params.user);
	});
}

function setUserParams(base, user, params, newUser){
	// Updates/Sets credentials of the user and the username
	switch(base){
		case configAuth.types.FACEBOOK:
			user.facebook.id    = params.profile.id; 				// set the users facebook id                   
			user.facebook.token = params.token; 					// we will save the token that facebook provides to the user                    
			user.facebook.email = params.profile.emails[0].value; 	// facebook can return multiple emails so we'll take the first
			
			if(newUser){
				user.login = configAuth.types.FACEBOOK;			
			}
			break;
		case configAuth.types.TWITTER:
			user.twitter.id          = params.profile.id;
			user.twitter.token       = params.token;
			user.twitter.username    = params.profile.username;
			if(newUser){
				user.login = configAuth.types.TWITTER;
			}
			break;
		case configAuth.types.GOOGLE:
			user.google.id    = params.profile.id;
			user.google.token = params.token;
			user.google.email = params.profile.emails[0].value; // pull the first email
			if(newUser){
				user.login = configAuth.types.GOOGLE;
			}
			break;
		default:
			user.local.email = params.email;
  			user.local.password = user.generateHash(params.password);
  			if(newUser){
				user.login = configAuth.types.LOCAL;
			} else { 
				user.local.confirmed = true; 
			}
			break;
	}
}

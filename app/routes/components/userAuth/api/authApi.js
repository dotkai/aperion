// User Authentication and User Api with Passport, etc.
var passport = require('passport')
	, accountApi = require('../../account/api/accountApi.js')
	, utils = require('../../../utils.js') 
	, MESSAGE = require('../../../config/messages.js')
	, SUCCESS_URL = '/go/0/0'
	, FAIL_URL = '/';

module.exports = {
	facebookAuth: facebookAuth,
	facebookAuthCallback: facebookAuthCallback,
	twitterAuth: twitterAuth,
	twitterAuthCallback: twitterAuthCallback,
	googleAuth: googleAuth,
	googleAuthCallback: googleAuthCallback,

	connectFacebook: connectFacebook,
	connectFacebookCallback: connectFacebookCallback,
	connectTwitter: twitterAuth,
	connectTwitterCallback: twitterAuthCallback,

	unlinkFacebook: unlinkFacebook,
	unlinkTwitter: unlinkTwitter,
	unlinkGoogle: unlinkGoogle,

	logoutUser: logoutUser
};

//exports.loginSuccess = loginSuccess;
//exports.loginError = loginError;

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

function facebookAuth(req, res, next){
	passport.authenticate('facebook', { scope : 'email' })(req, res, next);
}

function facebookAuthCallback(req, res, next){
	passport.authenticate('facebook', {
        successRedirect : SUCCESS_URL,
        failureRedirect : FAIL_URL
    })(req, res, next);
}

function twitterAuth(req, res, next){
	passport.authenticate('twitter')(req, res, next);
}

function twitterAuthCallback(req, res, next){
	passport.authenticate('twitter', {
        successRedirect : SUCCESS_URL,
        failureRedirect : FAIL_URL
    })(req, res, next);
}

function googleAuth(req, res, next){
	passport.authenticate('google', { 
		scope : ['profile', 'email'] 
	})(req, res, next);
}

function googleAuthCallback(req, res, next){
	passport.authenticate('google', {
		successRedirect : SUCCESS_URL,
		failureRedirect : FAIL_URL
	})(req, res, next);
}

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

function connectFacebook(req, res, next){
	passport.authorize('facebook', { scope : 'email' })(req, res, next);
}

function connectFacebookCallback(req, res, next){	
	passport.authorize('facebook', {
	    successRedirect : SUCCESS_URL,
	    failureRedirect : FAIL_URL
	})(req, res, next);
}

function connectTwitter(req, res, next){
	passport.authorize('twitter', { scope : 'email' })(req, res, next);
}


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
function unlinkFacebook(req, res){
    var user = req.user;
    user.facebook.token = undefined;
    user.save(function(err) {
        res.redirect(SUCCESS_URL);
    });
}

function unlinkTwitter(req, res){
    var user = req.user;
    user.twitter.token = undefined;
    user.save(function(err) {
        res.redirect(SUCCESS_URL);
    });
}

function unlinkGoogle(req, res){
	var user = req.user;
    user.google.token = undefined;
    user.save(function(err) {
        res.redirect(SUCCESS_URL);
    });
}

// =============================================================================
// LOGIN / LOGOUT =============================================================
// =============================================================================

function loginAccount(user, req, res){
	// Set user session
	req.login(user, function(err){
		if(err){ return res.send(err); }

		// If user session set, return user account		
		accountApi.getAccount(req, res);
	});	 
}

function logoutUser(req, res){
	req.logout();
	res.redirect('/login');
}

function loginSuccess(success){
	//res.render('json', {data: JSON.stringify(req.user.access_token)});
}

function loginError(err){
	/*if(err) {
		res.status(400).render('error', {message: err.message});
	}*/
}
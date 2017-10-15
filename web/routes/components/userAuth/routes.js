var auth = require('./api/authApi.js')
	, newUser = require('./newUser');

module.exports = function(app, isLoggedIn){

	// First Login/Sign up --------------------------------
	//app.post('/auth/signup', auth.localSignUp);
    //app.post('/auth/login', auth.localLogin);
    app.get('/auth/facebook', auth.facebookAuth);
	app.get('/auth/facebook/callback', auth.facebookAuthCallback);
	app.get('/auth/twitter',  auth.twitterAuth);
	app.get('/auth/twitter/callback', auth.twitterAuthCallback);
	app.get('/auth/google', auth.googleAuth);
	app.get('/auth/google/callback', auth.googleAuthCallback);

	// Confirm Signup --------------------------------
	app.post('/auth/signup', newUser.acceptTerms);

	// Link Accounts --------------------------------
	//app.get('/connect/local', auth.connectLocalGet);
	//app.post('/connect/local', auth.connectLocalPost);
	app.get('/connect/facebook', auth.connectFacebook);
	app.get('/connect/twitter', auth.connectTwitter);
	app.get('/connect/google', auth.googleAuth);

	// Unlink Accounts --------------------------------
    //app.get('/unlink/local', auth.unlinkLocal);
    app.get('/unlink/facebook', auth.unlinkFacebook);
    app.get('/unlink/twitter', auth.unlinkTwitter);
    app.get('/unlink/google', auth.unlinkGoogle);

    // Logout  --------------------------------    
    app.post('/auth/logout', auth.logoutUser);    
}
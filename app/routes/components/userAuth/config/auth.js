// External API config

module.exports = {
	types: {
		LOCAL: 'LOCAL',
		FACEBOOK: 'FACEBOOK',
		TWITTER: 'TWITTER',
		GOOGLE: 'GOOGLE'
	},
	facebookAuth: {
		clientID: 'z',
		clientSecret: 'z',
		callbackURL: '/auth/facebook/callback'
	},
	
	twitterAuth: {
		consumerKey: '',
		consumerSecret: '',
		callbackURL: '/auth/twitter/callback'
	},

	googleAuth: {
		clientID:'z',
		clientSecret: 'z',
		callbackURL: '/auth/google/callback'
	},

	redditAuth: {
		
	}
};
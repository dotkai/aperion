// External API config

module.exports = {
	types: {
		LOCAL: 'LOCAL',
		FACEBOOK: 'FACEBOOK',
		TWITTER: 'TWITTER',
		GOOGLE: 'GOOGLE'
	},
	facebookAuth: {
		clientID: '291091971267525',
		clientSecret: 'b832748d3531e5d51d7162fa75ca2be7',
		callbackURL: '/auth/facebook/callback'
	},
	
	twitterAuth: {
		consumerKey: '',
		consumerSecret: '',
		callbackURL: '/auth/twitter/callback'
	},

	googleAuth: {
		clientID:'605356420169-3ea7rg9v0n392ndohpv1bvkngkjkl7di.apps.googleusercontent.com',
		clientSecret: 'xgiS0iy4UQqCx3YYfer0iMPY',
		callbackURL: '/auth/google/callback'
	},

	redditAuth: {
		
	}
};
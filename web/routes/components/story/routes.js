var story = require('./api/storyApi.js')
	, poll = require('./api/pollApi.js');

module.exports = function(app){
	
	app.get('/apeiron/info', story.getBlogInfo);
	app.get('/apeiron/post/:path/:chpt/:part', story.getStory);
	app.get('/apeiron/postinfo/:path/:chpt/:part', story.getChapterData);

	app.get('/apeiron/poll/:path/:chapter/:part', poll.getActivePoll);
	app.post('/api/vote', poll.votePoll);
	app.post('/api/undoVote', poll.undoVotePoll);
	
}
var account = require('./api/accountApi.js');

module.exports = setRoutes;

function setRoutes(app, isLoggedIn){
	
	// Account api --------------------------------     
	app.get('/api/account', isLoggedIn, account.getAccount);
	app.get('/api/account/selectedVote/:pollID', isLoggedIn, account.getVote);
    app.post('/api/account/update', isLoggedIn, account.updateAccount);
    app.post('/api/account/setchapter', isLoggedIn, account.updateChapterBookmark);
	app.post('/api/submitSurvey', account.submitSurveyResult);
}
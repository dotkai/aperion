var routes = require('../routes/index.js');

module.exports = setRoutes;


function setRoutes(app, passport) {

	//Main Site Pages
	app.get('/', routes.index);
	app.get('/login', routes.index);
	app.get('/faq', routes.index);
	app.get('/agreement', routes.index);
	app.get('/privacy_policy', routes.index);
	app.get('/characters', routes.index);
	app.get('/contact', routes.index);
	app.get('/go/:chapter/:part', routes.interceptIndex);

	app.get('/pending', routes.pending);
	app.get('/views/:view', routes.viewRender);
	app.get('/views/:view/:subview', routes.subviewRender);
	app.get('/about/:view', routes.aboutRender);

	require('./components/userAuth/routes.js')(app, isLoggedIn);
	require('./components/account/routes.js')(app, isLoggedIn);
	require('./components/story/routes.js')(app, isLoggedIn);
		
	//For HTML 5 redirect, etc.
	/*app.get('/*', function(req,res){
	  res.redirect('/');
	});*/
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated() && req.user){ return next(); }

    // if they aren't, send 401: Unauthorized
    res.sendStatus(401);
}
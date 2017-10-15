/**
* Module dependencies.
*/

var express = require('express')
  , app = express()

  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , methodOverride = require('method-override')
  , passport = require('passport')

  , mongoose = require('mongoose')
  , configDB = require('./routes/config/database.js')
  , http = require('http')
  , env = process.env.NODE_ENV || 'development';

// CONFIGURATION ======================================================================

// Connect to the database
mongoose.connect(configDB.url, { useMongoClient: true });

require('./routes/components/userAuth/passport')(passport); // pass passport for configuration

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/public');
app.set('view engine', 'pug');

//app.use(express.favicon("public/assets/images/favicon.ico"));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser(process.env.SECRET || 'fake_secret'));
app.use("/app", express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

// Setting up session
app.use(session({
  secret: process.env.SESSION_SECRET || 'onceuponthestairimetamenwhowasntthere', // should be a large unguessable string or Buffer 
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms 
  resave: true,
  saveUninitialized: true
}));

// Required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(passport.authenticate('remember-me'));

// ROUTES ======================================================================
require('./routes/routes.js')(app); // load our routes and pass in our app and fully configured passport


// LAUNCH ======================================================================

var conn = mongoose.connection; 
conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', function() {
  console.log('Connected to Mongo Database');
  // Wait for the database connection to establish, then start the app. 
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });                 
});
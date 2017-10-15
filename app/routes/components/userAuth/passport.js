var RememberMeStrategy = require('passport-remember-me').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , TwitterStrategy  = require('passport-twitter').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , User = require('./models/UserModel')
    , newUser = require('./newUser')
    , message = require('../../config/messages')
    , configAuth = require('./config/auth')
    , FACEBOOK = {
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true,
        profileFields: ['id', 'displayName', 'link', 'photos', 'emails']
    }
    , TWITTER = {
        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL
    }
    , GOOGLE = {
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
    };

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            if(user.login==='FACEBOOK'){
                user.facebook.token = undefined;                
            } else if(user.login==='GOOGLE'){
                user.google.token = undefined; 
            }
            user.save(function(err){
                done(err, user);
            });

            
        });
    });

    // =========================================================================
    // REMEMBER ME COOKIE SETUP ==================================================
    // =========================================================================
    passport.use(new RememberMeStrategy(
      function(token, done) {
        newUser.queryUserExistsMulti({
            'facebook.token': token,
            'google.token': token
        }, function(err, user){
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        });
      },
      function(user, done) {
        return done(null, user.facebook.token);
      }
    ));

       
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy(FACEBOOK, function(req, token, refreshToken, profile, done) {
        // facebook will send back the token and profile
        // asynchronous
        process.nextTick(function() {
            if(!req.user){
                // find the user in the database based on their facebook id
                newUser.queryUserExists('facebook.id', profile.id, function(err, user) {
                    // If the user is found, then log them in
                    if(user) { return done(null, user); }
                    // Else make new user
                    newUser.createNewUser(configAuth.types.FACEBOOK, {
                        profile: profile,
                        token: token
                    }, done);
                }, done);
            } else {
                // Link Existing user
                newUser.linkExistingUser(configAuth.types.FACEBOOK, {
                    user: req.user,
                    profile: profile,
                    token: token
                }, done);
            }
        });

    }));

    /*

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy(TWITTER, function(req, token, tokenSecret, profile, done) {
        process.nextTick(function() {
            if(!req.user){
                // User not logged in
                newUser.queryUserExists('twitter.id', profile.id, function(err, user){
                    // If user found, log them in
                    if(user) { return done(null, user); }
                    // Else create new user
                    newUser.createNewUser(configAuth.types.TWITTER, {
                        profile: profile,
                        token: token
                    }, done);
                }, done);
            } else {
                // User logged in, link existing user
                newUser.linkExistingUser(configAuth.types.TWITTER, {
                    user: req.user,
                    profile: profile,
                    token: token
                }, done);
            }
        });

    }));

    */

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy(GOOGLE, function(req, token, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            if(!req.user){
                newUser.queryUserExists('google.id', profile.id, function(err, user){
                    if(user) { return done(null, user); }
                    // Else create new user
                    newUser.createNewUser(configAuth.types.GOOGLE, {
                        profile: profile,
                        token: token
                    }, done);
                }, done);
            } else {
                // User logged in, link existing user
                newUser.linkExistingUser(configAuth.types.GOOGLE, {
                    user: req.user,
                    profile: profile,
                    token: token
                }, done);
            }
        });

    }));

    
};
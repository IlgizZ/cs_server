module.exports = function () {
  var express = require('express')
    , passport = require('passport')
    , util = require('util')
    , session = require('express-session')
    , SteamStrategy = require("passport-steam")
    , authRoutes = require('./routes/auth');

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new SteamStrategy({
      returnURL: 'http://localhost:5000/cs-gohavoc/us-central1/auth/steam/return',
      realm: 'http://localhost:5000/',
      apiKey: 'D00A20377C8B49B75F880F887389D958'
    },
    function(identifier, profile, done) {
      process.nextTick(function () {
        profile.identifier = identifier;
        console.log("id: " + identifier);
        console.log("profile: " +profile);
        return done(null, profile);
      });
    }
  ));

  var app = express();


  app.use(passport.initialize());

  app.get('/logout', function(req, res){
    console.log(123);
    req.logout();
    res.redirect('/');
  });

  app.use('/', authRoutes);

  return app;
}

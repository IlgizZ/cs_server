module.exports = function () {
  var express = require('express')
    , passport = require('passport')
    , util = require('util')
    , session = require('express-session')
    , SteamStrategy = require("passport-steam")
    , handleSteamLogin = require("./steam_controller")
    , authRoutes = require('./auth')
    , redirectWithToken = require("./steam_redirect")
    , session = require("express-session");
    var functions = require('firebase-functions');
    const admin = require('firebase-admin');
    const unknownUrl = "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";



  passport.serializeUser(function(user, done) {
    console.log("It is my");
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new SteamStrategy({
      returnURL: 'http://localhost:5000/cs-gohavoc/us-central1/auth/steam/return',
      realm: 'http://localhost:5000/cs-gohavoc/us-central1/',
      apiKey: 'D00A20377C8B49B75F880F887389D958'
    },
    (identifier, profile, done) => {
      handleSteamLogin(identifier, profile, done)
    }
  ));

  var app = express();
  app.use(passport.initialize());

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    name: "__session"
  }));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('http://localhost:5000/cs-gohavoc/us-central1/');
  });

  app.use('/', authRoutes);

  return app;
}

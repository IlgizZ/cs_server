module.exports = function () {
  var express = require('express')
    , passport = require('passport')
    , util = require('util')
    , SteamStrategy = require("passport-steam")
    , handleSteamLogin = require("./steam_controller")
    , authRoutes = require('./auth')
    , redirectWithToken = require("./steam_redirect")
    , admin = require('firebase-admin')
    , firebaseStore = require("connect-session-firebase")
    , cookieParser = require('cookie-parser')
    , session = require('express-session');

  const FirebaseStore = firebaseStore(session);
  const store = new FirebaseStore({
    database: admin.database()
  });

  passport.serializeUser(function(user, done) {
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

  const app = express();
  app.use(session({
    store,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
    name: "__session"
  }));
  app.use(cookieParser());
  app.use(passport.initialize());

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('http://localhost:5000/cs-gohavoc/us-central1/');
  });

  app.use('/', authRoutes);
  store.reap(() => {});
  return app;
}

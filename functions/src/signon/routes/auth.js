var express = require('express')
  , router = express.Router()
  , passport = require('passport');

router.get('/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    console.log(1234);
    res.redirect('/');
  });

router.get('/steam/return',
  function(req, res, next) {
      req.url = req.originalUrl;
      next();
  },
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    console.log(1231231);
    res.redirect('/');
  }
);

module.exports = router;

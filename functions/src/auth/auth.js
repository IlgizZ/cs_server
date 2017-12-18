var express = require('express')
  , router = express.Router()
  , passport = require('passport')
  , redirectWithToken = require("./steam_redirect");

router.get('/steam',
  (req, res, done) => {
    // if (!req.query.client_id) {
    //  res.status(400).send("Invalid client id");
    //  return;
    // }
    //
    // req.session.client_id = req.query.client_id;
    req.session.provider = "steam";
    req.session.save(done);
  },
  passport.authenticate("steam", { failureRedirect: "/fail" })
);

router.get('/',
  (req, res) => {
    res.status(200).send("<a href=\"http://localhost:5000/cs-gohavoc/us-central1/auth/steam\"> log in via steam </a>");
  }
);

router.get('/steam/return',
  function (req, res, next) {
    req.url = req.originalUrl;
    next();
  },
  passport.authenticate("steam", { failureRedirect: "http://localhost:5000/cs-gohavoc/us-central1/auth/fail" }),
  (req, res) => redirectWithToken(req, res).then(res => res.end())
);

router.get("/fail", (req, res) => {
  console.log("OAuth login failed - /fail callback called.");
  const redirectUrl = 'http://localhost:3000/auth';
  res.redirect(`${redirectUrl}?code=oauth_fail`);
});

module.exports = router;

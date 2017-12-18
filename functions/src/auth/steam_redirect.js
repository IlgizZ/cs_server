var functions = require('firebase-functions');
const admin = require('firebase-admin');
const querystring = require("querystring");

module.exports = function redirectWithToken(req, res) {

    const user = req.user;

    if (!user) {
      var error = {error: "Invalid user - not logged in?"}
      response.status(505).send(error);
      return;
    }

    const redirectUrl = 'http://localhost:3000/auth';
    // TODO
    if (!redirectUrl) {
      throw new Error("Invalid Session: Invalid client_id");
    }

    const provider = 'steam' // TODO req.session.provider;
    if (!provider) {
      throw new Error("Invalid Session: Invalid provider.");
    }

    var query = { provider }

    console.log("Creating token for user", user);

    return admin.auth().createCustomToken(user.uid).then(token => {
      query.token = token;
      const queryStr = querystring.stringify(query);
      res.redirect(301, `${redirectUrl}?${queryStr}`);
      return res;
    });

}

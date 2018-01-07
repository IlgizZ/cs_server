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
    const provider = 'steam'

    var query = { provider }

    // console.log("Creating token for user", user);

    parent = req.cookies.ref
// TODO
    res.clearCookie('ref');

    console.log(req.cookies.ref);

    var promise = new Promise((resolve, reject) => {
      resolve()
    });

    console.log(parent);
    if (parent) {
      promise = admin.app().database().ref(`profiles/${user.uid}`).once("value").then( snapshot => {
        if (snapshot.val().newUser) {
          return snapshot.ref.update({
            parent,
            newUser: null
          })
        }
      })
    }

    return promise.then(() => {
      return admin.auth()
        .createCustomToken(user.uid)
        .then(token => {
          query.token = token;
          const queryStr = querystring.stringify(query);
          res.redirect(301, `${redirectUrl}?${queryStr}`);
          return res;
        })
    })

}

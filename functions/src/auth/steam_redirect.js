var functions = require('firebase-functions');
const admin = require('firebase-admin');
const querystring = require("querystring");

module.exports = function redirectWithToken(req, res) {

    const {uid} = req.user;
console.log(uid);
    if (!req.user) {
      var error = {error: "Invalid user - not logged in?"}
      response.status(505).send(error);
      return;
    }

    const redirectUrl = 'http://localhost:3000/auth';
    const provider = 'steam'

    var query = { provider }

    // console.log("Creating token for user", user);

    parent = req.cookies.ref

    var promise = new Promise((resolve, reject) => {
      resolve()
    });

    if (parent) {
      console.log("parent referal");
      console.log(parent);

      res.clearCookie('ref');
      console.log("referal was deleted from cookie");

      promise = admin.app().database().ref(`profiles/${uid}`).once("value").then( snapshot => {
        if (snapshot.val().newUser) {
          return snapshot.ref.update({
            parent,
            newUser: null
          })
        }

      })
    }
console.log(12);
    return promise.then(() => {
      console.log('createing token for ', uid);
      return admin.auth()
        .createCustomToken(uid)
        .then(token => {
          query.token = token;
          const queryStr = querystring.stringify(query);
          res.redirect(301, `${redirectUrl}?${queryStr}`);
          return res;
        })
    })

}

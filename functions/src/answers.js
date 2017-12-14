var functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.database();

module.exports = function (e) {
    e.answers = functions.https.onRequest((request, response) => {

      return db.ref().child("answers").once('value', snapshot => {
        response.send(snapshot.val());
      });
    })
};

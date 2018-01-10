const functions = require('firebase-functions');
var bodyParser = require('body-parser');
const admin = require('firebase-admin');

var cors = require('cors')({
  origin: 'http://localhost:5000/cs-gohavoc/us-central1/',
  optionsSuccessStatus: 200
})

var equal = require('deep-equal');

var serviceAccount = require("./key/key.json");
var defaultApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cs-gohavoc.firebaseio.com/'
});

const dbRef = admin.database().ref();
const expressServer = require('./src/auth/auth_express.js')(exports);
require('./src/auth/referal.js')(exports);

exports.auth = functions.https.onRequest((request, response) => {
  const method = request.method;
  const query = request.query;
  const body = request.body;

  return expressServer(request, response)
});

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

function compareObjects(o1, o2) {
  return equal(o1, o2)
}

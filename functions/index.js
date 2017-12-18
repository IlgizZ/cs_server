const functions = require('firebase-functions');
var bodyParser = require('body-parser');
var moment = require('moment');
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


require('./src/answers.js')(exports);

exports.helloWorld = functions.https.onRequest((request, response) => {
  const method = request.method;
  const query = request.query;
  const body = request.body;

  if (checkTime()) {
    var error = {error: "we are not working:("}
    response.status(505).send(error);
    return;
  }

  response.status(200).send("\nHello!\nMethods: " + method
    + "\nQuery: " + query
    + "\nBody: " + body
  );
});

exports.auth = functions.https.onRequest((request, response) => {
  const method = request.method;
  const query = request.query;
  const body = request.body;

  const app = require('./src/auth/auth_express.js')(exports);

  return app(request, response)
});

function checkTime() {
  var time = moment()
  const hours = time.format("HH");
  const minutes = time.format("mm");

  return (hours > 1 || hours < 2)
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

function compareObjects(o1, o2) {
  return equal(o1, o2)
}

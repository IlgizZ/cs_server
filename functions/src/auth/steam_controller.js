var functions = require('firebase-functions');
const admin = require('firebase-admin');
const unknownUrl = "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";
const db = admin.database();

function addReferal(key) {
  const userRef = db.ref('profiles');
  console.log("new referal");
  return db.ref().child('users_count').once('value', snapshot => {
    var Hashids = require('hashids')
    var hashids = new Hashids("CsHavoc", 6)
    var usersCount = snapshot.val() + 1

    return snapshot.ref.set(usersCount).then(() => {
      var referalCode = hashids.encode(usersCount - 1)
      return userRef.child(key).update({
        newUser: true,
        referalCode
      })
    })
  })
}

module.exports = function handleSteamLogin(accessToken, steamProfile, done) {
  return admin.database().ref("profiles").orderByChild("steam/steamid")
    .equalTo(steamProfile.id.toString()).once("value")
    .then(snapshot => {
      const firebaseProfiles = snapshot.val();
      var existingUserId = '-1';
      if (firebaseProfiles && Object.keys(firebaseProfiles).length > 0) {
        existingUserId = Object.keys(firebaseProfiles)[0];
      }
      return existingUserId;
    })
    .then(existingUserId => {
      console.log("uid: " + existingUserId);

      return admin.auth().getUser(existingUserId)
        .then(function(userRecord) {
            return admin.auth().updateUser(existingUserId, {
              displayName: steamProfile.displayName,
              photoURL: steamProfile.photos[2].value,
            });
        })
        .catch(error => {
          console.log("new user");

          return admin.auth().createUser({
            emailVerified: false,
            email: steamProfile.id + "@steamcommunity.com",
            displayName: steamProfile.displayName,
            photoURL: steamProfile.photos[2].value,
            disabled: false
          }).then(firebaseUser => {
            let {uid} = firebaseUser
            console.log('uid: ', uid);
            return   admin.app().database().ref(`profiles/${uid}`).update({
                displayName: steamProfile.displayName,
                photoURL: (steamProfile.photos && steamProfile.photos[2] && steamProfile.photos[2].value) || unknownUrl,
                steam: steamProfile._json
              }).then(() => {

                return addReferal(uid).then(() => {
                  return admin.app().database().ref(`profiles/${uid}`).once("value").then(snapshot => {
                    userProfile = snapshot.val()
                    data = Object.assign({}, userProfile, firebaseUser)
                    console.log("exit");
                    done(undefined, data)
                  });
                })

              })
          });
        }).then(firebaseUser => {
          console.log('user loged in with uid: ', firebaseUser.uid);
          admin.app().database().ref(`profiles/${firebaseUser.uid}`).update({
            displayName: steamProfile.displayName,
            photoURL: (steamProfile.photos && steamProfile.photos[2] && steamProfile.photos[2].value) || unknownUrl,
            steam: steamProfile._json
          }).then(() => {
            return admin.app().database().ref(`profiles/${firebaseUser.uid}`).once("value").then(snapshot => {
              userProfile = snapshot.val()
              data = Object.assign({}, userProfile, firebaseUser)
              done(undefined, data)
            });

          })
        })
    })
}

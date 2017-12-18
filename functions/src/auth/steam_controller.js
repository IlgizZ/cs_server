var functions = require('firebase-functions');
const admin = require('firebase-admin');
const unknownUrl = "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";

module.exports = function handleSteamLogin(accessToken, steamProfile, done) {
  console.log("handle");
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
          });

        })
        .then(firebaseUser => {
          admin.app().database().ref(`profiles/${firebaseUser.uid}`).update({
            displayName: steamProfile.displayName,
            photoURL: (steamProfile.photos && steamProfile.photos[2] && steamProfile.photos[2].value) || unknownUrl,
            steam: steamProfile._json
          }).then(() => {
            return admin.app().database().ref(`profiles/${firebaseUser.uid}`).once("value").then(snapshot => {
              userProfile = snapshot.val()
              data = Object.assign({}, userProfile, firebaseUser)
              done(undefined, data)
              return data;
            });

          })
        })
    })
}

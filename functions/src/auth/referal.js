var functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.database();

module.exports = function (e) {
  e.newReferral = functions.database.ref('/profiles/{pushId}/parent').onCreate( snapshot => {
    const key = snapshot.params.pushId;
    console.log("Creted new referal for user with uid: " + key);

    const parent = snapshot.data.val();
    console.log("Parent: " + parent);

    const userRef = db.ref('/users/');
    var referalBonus = 50;

    return userRef.orderByChild("referal_code").equalTo(parent).once('value', snapshot => {
      var parentValue = snapshot.val();
      if (parentValue == undefined) {
        console.warn("Cannot find parent of: " + key + "!\n Parent ref: " + parent);
        return;
      }

      var parentKey = Object.keys(parentValue)[0];

      return userRef.child(key).update({
        parent: parentKey
      }).then(() => {
        console.log("Add to parent with key(" + parentKey + ") "
                      + referalBonus + " additional meteors for referal " + key);
        return snapshot.ref.child(parentKey).once('value', snapshot => {
          var parentVal = snapshot.val();

          parentVal.balance = parentVal.balance || 0;
          parentVal.balance += referalBonus;

          parentVal.child_referals = parentVal.child_referals || {}
          parentVal.child_referals[key] = {level: "1"};

          return snapshot.ref.set(parentVal);
        })
      })
    })

  });
}

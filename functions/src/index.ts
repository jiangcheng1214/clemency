import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

// cleanup recent results every 2 hours
export const cleanupRecentResults =
  functions.pubsub.schedule("0 */2 * * *").onRun((context) => {
    try {
      const resultRetentionCount = 20;
      const db = admin.database();
      db.ref("test-results").once("value").then(function(data: any) {
        console.log("results: " + JSON.stringify(data.val()));
        const resultMap = data.val();
        // eslint-disable-next-line max-len
        const resultArraySorted: any[] = Object.keys(resultMap).map(function(key) {
          return [String(key), resultMap[key]];
        }).sort((a, b) => {
          return a[1].timestamp > b[1].timestamp ? -1 : 0;
        });
        for (let i = resultRetentionCount; i < resultArraySorted.length; i++) {
          const keyToRemove = "test-results/" + resultArraySorted[i][0];
          console.log("Removing: " + resultArraySorted[i]);
          db.ref(keyToRemove).remove().then(function() {
            console.log("Removed: " + resultArraySorted[i]);
          }).catch(function(error: Error) {
            console.log("Remove error: " + error);
          });
        }
      });
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  });

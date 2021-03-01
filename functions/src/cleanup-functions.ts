/* eslint-disable */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// cleanup recent results (prod) every 24 hours
export const cleanupProdRecentResults =
  functions.pubsub.schedule("0 0 * * *").onRun(async (context) => {
    try {
      const resultRetentionCount = 3;
      const db = admin.database();
      const data = await db.ref("prod/recent-test-results-by-uuid").once("value")
      console.log("results: " + JSON.stringify(data.val()));
      const resultMap = data.val();
      const resultArraySorted: any[] = Object.keys(resultMap).map(function (key) {
        return [String(key), resultMap[key]];
      }).sort((a, b) => {
        return a[1].userTestRecord.timestamp > b[1].userTestRecord.timestamp ? -1 : 0;
      });
      await Promise.all(resultArraySorted.slice(resultRetentionCount).map(item => {
        const keyToRemove = "prod/recent-test-results-by-uuid/" + item[0];
        console.log("Removing: " + keyToRemove);
        return db.ref(keyToRemove).remove();
      }));
      console.log("Cleanup finished!")
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  });

// cleanup cache results that 3 days after (prod) - on every Sunday
export const cleanupCachedUUIDResults =
  functions.pubsub.schedule("0 0 * * 0").onRun(async (context) => {
    try {
      const maximumRetentionWindowInDays = 3;
      const db = admin.database();
      const data = await db.ref("prod/test-results-by-uuid").once("value")
      console.log("results: " + JSON.stringify(data.val()));
      const resultMap = data.val();
      const resultArrayFiltered: any[] = Object.keys(resultMap).map(key => {
        return [String(key), resultMap[key]];
      }).filter(item => {
        const timeDiffInMS = new Date().valueOf() - item[1].userTestRecord.timestamp;
        return timeDiffInMS / 1000 / 60 / 60 / 24 > maximumRetentionWindowInDays;
      });
      await Promise.all(resultArrayFiltered.map(item => {
        const keyToRemove = "prod/test-results-by-uuid/" + item[0];
        console.log("Removing: " + keyToRemove);
        return db.ref(keyToRemove).remove();
      }))
      console.log("Cleanup finished!")
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  });
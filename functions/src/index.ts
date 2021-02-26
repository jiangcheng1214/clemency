import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import {Stripe} from "stripe";
const stripeDev = new Stripe(functions.config().stripe.secret_dev, {
  apiVersion: "2020-08-27",
});
const stripeProd = new Stripe(functions.config().stripe.secret_prod, {
  apiVersion: "2020-08-27",
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

// cleanup recent results (prod) every 2 hours
export const cleanupProdRecentResults =
  functions.pubsub.schedule("0 */2 * * *").onRun((context) => {
    try {
      const resultRetentionCount = 20;
      const db = admin.database();
      db.ref("prod/recent-results").once("value").then(function(data: any) {
        console.log("results: " + JSON.stringify(data.val()));
        const resultMap = data.val();
        // eslint-disable-next-line max-len
        const resultArraySorted: any[] = Object.keys(resultMap).map(function(key) {
          return [String(key), resultMap[key]];
        }).sort((a, b) => {
          return a[1].timestamp > b[1].timestamp ? -1 : 0;
        });
        for (let i = resultRetentionCount; i < resultArraySorted.length; i++) {
          const keyToRemove = "prod/recent-results/" + resultArraySorted[i][0];
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

// cleanup recent results (dev) every 12 hours
export const cleanupDevRecentResults =
  functions.pubsub.schedule("0 */12 * * *").onRun((context) => {
    try {
      const resultRetentionCount = 20;
      const db = admin.database();
      db.ref("dev/recent-results").once("value").then(function(data: any) {
        console.log("results: " + JSON.stringify(data.val()));
        const resultMap = data.val();
        // eslint-disable-next-line max-len
        const resultArraySorted: any[] = Object.keys(resultMap).map(function(key) {
          return [String(key), resultMap[key]];
        }).sort((a, b) => {
          return a[1].timestamp > b[1].timestamp ? -1 : 0;
        });
        for (let i = resultRetentionCount; i < resultArraySorted.length; i++) {
          const keyToRemove = "dev/recent-results/" + resultArraySorted[i][0];
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

  interface paymentInfo {
    currency: string;
    amount: number;
    description: string;
    source: any;
  }

// eslint-disable-next-line max-len
export const stripeChargeDev = functions.https.onCall(async (info: paymentInfo) => {
  console.log("received charge source!");
  console.log(JSON.stringify(info));
  try {
    const response = await stripeDev.charges.create({
      amount: info.amount,
      currency: info.currency,
      source: info.source.id,
      description: info.description,
    });
    // TODO: log payment result
    if ()
    console.log(JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(JSON.stringify(error));
    return error;
  }
});

export const stripeCharge = functions.https.onCall((source) => {
  console.log("received charge source! - Prod");
  console.log(source);
  stripeProd.charges.create({
    amount: 500,
    currency: "usd",
    source: source.id,
    description: "My First Test Charge (created for API docs)",
  }).then((response) => {
    console.log("response");
    console.log(response);
    return response;
  });
});

/* eslint-disable */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { formatDate } from "@angular/common";
admin.initializeApp();

import { Stripe } from "stripe";
const stripeDev = new Stripe(functions.config().stripe.secret_dev, {
  apiVersion: "2020-08-27",
});
const stripeProd = new Stripe(functions.config().stripe.secret_prod, {
  apiVersion: "2020-08-27",
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

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


interface PaymentRequestInfo {
  currency: string;
  amount: number;
  description: string;
  source: any;
  userTestRecord: any;
  uuid: string;
}

interface PaymentRecord {
  amount: number;
  description: string | null;
  paymentType: string;
}

interface SuccessRecord {
  payment: PaymentRecord;
  userTestRecord: any;
}

async function handleStripeChargeRequest(paymentRequestInfo: PaymentRequestInfo, isProd: boolean) {
  console.log("received charge request!");
  console.log(JSON.stringify(paymentRequestInfo));
  try {
    var response;
    if (isProd) {
      response = await stripeProd.charges.create({
        amount: paymentRequestInfo.amount,
        currency: paymentRequestInfo.currency,
        source: paymentRequestInfo.source.id,
        description: paymentRequestInfo.description,
      });
    } else {
      response = await stripeDev.charges.create({
        amount: paymentRequestInfo.amount,
        currency: paymentRequestInfo.currency,
        source: paymentRequestInfo.source.id,
        description: paymentRequestInfo.description,
      });
    }
    console.log("response:" + JSON.stringify(response));
    if (response.paid && response.source && response.amount) {

      console.log("Success!");

      const successRecord: SuccessRecord = {
        payment: {
          amount: response.amount,
          description: response.description,
          paymentType: "stripe",
        },
        userTestRecord: paymentRequestInfo.userTestRecord,
      };
      console.log('successRecord: ' + JSON.stringify(successRecord));
      const db = admin.database();
      const databaseBucket = isProd ? "prod" : "dev";
      const yearMonth = formatDate(new Date(), "yyyy-MM", "en-US");
      const byMonthPath = databaseBucket + "/test-results-by-month/" + yearMonth;
      // special handling "a.b@c.com" => "a,b@c,com"
      const specialEmailAddress = paymentRequestInfo.userTestRecord.emailAddress.toLowerCase().replace(".", ",");
      const promise1 = db.ref(byMonthPath + "/" + specialEmailAddress).set(successRecord);

      const byUUIDPath = databaseBucket + "/test-results-by-uuid/" + paymentRequestInfo.uuid;
      const promise2 = db.ref(byUUIDPath).set(successRecord);

      const recentResultsPath = databaseBucket + "/recent-test-results-by-uuid/" + paymentRequestInfo.uuid;
      const promise3 = db.ref(recentResultsPath).set(successRecord);
      await Promise.all([promise1, promise2, promise3])

      return successRecord;
    } else {
      const failureResponse = {
        payment: null,
        userTestRecord: paymentRequestInfo.userTestRecord,
      };
      return failureResponse;
    }
  } catch (error) {
    console.log(JSON.stringify(error));
    return error;
  }
}

export const stripeChargeDev = functions.https.onCall(async (paymentRequestInfo: PaymentRequestInfo) => {
  console.log("started handling Strip payment (dev) ..");
  return handleStripeChargeRequest(paymentRequestInfo, false);
});

export const stripeCharge = functions.https.onCall(async (paymentRequestInfo: PaymentRequestInfo) => {
  console.log("started handling Strip payment..");
  return handleStripeChargeRequest(paymentRequestInfo, false);
});

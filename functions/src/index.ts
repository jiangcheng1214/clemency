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

// cleanup recent results (prod) every 2 hours
export const cleanupProdRecentResults =
  functions.pubsub.schedule("0 */2 * * *").onRun((context) => {
    try {
      const resultRetentionCount = 20;
      const db = admin.database();
      db.ref("prod/recent-test-results-by-uuid").once("value").then(function (data: any) {
        console.log("results: " + JSON.stringify(data.val()));
        const resultMap = data.val();
        const resultArraySorted: any[] = Object.keys(resultMap).map(function (key) {
          return [String(key), resultMap[key]];
        }).sort((a, b) => {
          return a[1].timestamp > b[1].timestamp ? -1 : 0;
        });
        for (let i = resultRetentionCount; i < resultArraySorted.length; i++) {
          const keyToRemove = "prod/recent-test-results-by-uuid/" + resultArraySorted[i][0];
          console.log("Removing: " + resultArraySorted[i]);
          db.ref(keyToRemove).remove().then(function () {
            console.log("Removed: " + resultArraySorted[i]);
          }).catch(function (error: Error) {
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
  timestamp: string;
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
    var timestamp = formatDate(new Date(), 'MM/dd/yyyy hh:mm:ss', 'en-US');
    if (response.paid && response.source && response.amount) {

      console.log("Success!");

      const successRecord: SuccessRecord = {
        payment: {
          amount: response.amount,
          description: response.description,
          paymentType: "stripe",
        },
        userTestRecord: paymentRequestInfo.userTestRecord,
        timestamp: timestamp,
      };
      console.log('successRecord: ' + JSON.stringify(successRecord));
      const db = admin.database();
      const databaseBucket = isProd ? "prod" : "dev";
      const yearMonth = formatDate(new Date(), "yyyy-MM", "en-US");
      const byMonthPath = databaseBucket + "/test-results-by-month/" + yearMonth;
      // special handling "a.b@c.com" => "a,b@c,com"
      const specialEmailAddress = paymentRequestInfo.userTestRecord.emailAddress.toLowerCase().replace(".", ",");
      const promise1 = db.ref(byMonthPath+"/"+specialEmailAddress).set(successRecord);

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
        timestamp: timestamp,
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

/* eslint-disable */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as mailFunctions from "./mail-functions";

import { Stripe } from "stripe";
const stripeDev = new Stripe(functions.config().stripe.secret_dev, {
  apiVersion: "2020-08-27",
});
const stripeProd = new Stripe(functions.config().stripe.secret_prod, {
  apiVersion: "2020-08-27",
});

interface UserTestRecord {
  pseudonym: string
  countryCode: string
  nationality: string
  emailAddress: string
  timestamp: number
  educationLevel: string
  studyField: string
  gender: string
  score: number
}

interface PaymentRequestInfo {
  currency: string;
  amount: number;
  description: string;
  source: any;
  userTestRecord: UserTestRecord;
  uuid: string;
}

interface PaymentRecord {
  amount: number;
  description: string | null;
  paymentType: string;
}

interface SuccessRecord {
  payment: PaymentRecord;
  userTestRecord: UserTestRecord;
}

async function handleStripeChargeRequest(paymentRequestInfo: PaymentRequestInfo, isProd: boolean) {
  console.log("received charge request!");
  console.log(JSON.stringify(paymentRequestInfo));
  try {
    const chargeRequestInfo = {
      amount: paymentRequestInfo.amount,
      currency: paymentRequestInfo.currency,
      source: paymentRequestInfo.source.id,
      description: paymentRequestInfo.description,
    }
    console.log("chargeRequestInfo:");
    console.log(JSON.stringify(chargeRequestInfo));
    var response;
    if (isProd) {
      response = await stripeProd.charges.create(chargeRequestInfo);
    } else {
      response = await stripeDev.charges.create(chargeRequestInfo);
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
      const year = new Date(paymentRequestInfo.userTestRecord.timestamp).getUTCFullYear()
      const month = new Date(paymentRequestInfo.userTestRecord.timestamp).getUTCMonth() + 1
      const yearMonth = year + "-" + (month < 10 ? '0' + month : month)
      const byMonthPath = databaseBucket + "/test-results-by-month/" + yearMonth;
      // special handling "a.b@c.com" => "a,b@c,com"
      const specialEmailAddress = paymentRequestInfo.userTestRecord.emailAddress.toLowerCase().replace(".", ",");
      const promise1 = db.ref(byMonthPath + "/" + specialEmailAddress).set(successRecord);

      const byUUIDPath = databaseBucket + "/test-results-by-uuid/" + paymentRequestInfo.uuid;
      const promise2 = db.ref(byUUIDPath).set(successRecord);

      const recentResultsPath = databaseBucket + "/recent-test-results-by-uuid/" + paymentRequestInfo.uuid;
      const promise3 = db.ref(recentResultsPath).set(successRecord);
      await Promise.all([promise1, promise2, promise3])
      mailFunctions.sendConfirmationMail(paymentRequestInfo.userTestRecord)
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
  return handleStripeChargeRequest(paymentRequestInfo, true);
});

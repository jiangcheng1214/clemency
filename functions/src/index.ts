/* eslint-disable */
import * as admin from "firebase-admin";
import * as cleanupFunctions from "./cleanup-functions";
import * as stripeFunctions from "./stripe-functions";
admin.initializeApp();

export const cachedResultsCleanup = cleanupFunctions.cleanupCachedUUIDResults
export const recentResultsCleanup = cleanupFunctions.cleanupProdRecentResults

export const stripeCharge = stripeFunctions.stripeCharge
export const stripeChargeDev = stripeFunctions.stripeChargeDev

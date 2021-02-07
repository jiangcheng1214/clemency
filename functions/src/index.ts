import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {formatDate} from "@angular/common";
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const cronTask =
  functions.pubsub.schedule("*/5 * * * *").onRun((context) => {
    const db: admin.database.Database = admin.database();
    const timestamp = formatDate(new Date(), "MM/dd/yyyy hh:mm:ss", "en-US");
    db.ref("test-cron-tasks").push(timestamp);
    console.log("This will be run every 5 minutes!");
    return null;
  });

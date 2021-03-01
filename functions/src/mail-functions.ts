/* eslint-disable */
import * as functions from "firebase-functions";

import * as sgMail from "@sendgrid/mail";

const SG_API_KEY = functions.config().send_grid.api_key;
const TEMPLATE_ID = "d-0cdba9e79aa74b90a683102c1642a3d2";
const emailSenderName = "IQ certificate"; // TODO: change if necessary
const emailSenderAddress = "jiangcheng1214@gmail.com"; // TODO: change to official domain address
const emailConfirmationSubject = "IQ certificate"

sgMail.setApiKey(SG_API_KEY);

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

export const sendConfirmationMail = (async (userTestRecord: UserTestRecord) => {
    console.log("userTestRecord: " + JSON.stringify(userTestRecord));
    const msg = {
        to: userTestRecord.emailAddress,
        from: {
            name: emailSenderName,
            email: emailSenderAddress,
        },
        subject: userTestRecord.pseudonym + " " + emailConfirmationSubject,
        templateId: TEMPLATE_ID,
        dynamicTemplateData: {
            name: userTestRecord.pseudonym,
            score: userTestRecord.score
        }
    }
    try {
        console.log("sending email confirmation");
        const response = await sgMail.send(msg);
        console.log(response);
    } catch (error) {
        console.log(error);
    }

});

// export const sendConfirmationMail = functions.database.ref('dev').onWrite(async event => {
//     console.log("event: " + JSON.stringify(event));
//     const msg = {
//         to: "jiangcheng1214@gmail.com",
//         from: {
//             name:"clemency",
//             email:"jiangcheng1214@gmail.com",
//         },
//         subject: "Test subject",
//         templateId: TEMPLATE_ID,
//         dynamicTemplateData: {
//             name: "jaycee",
//             score: "135"
//         }
//     }
//     try {
//         const response = await sgMail.send(msg);
//         console.log(response);
//     } catch (error) {
//         console.log(error);
//     }

// });

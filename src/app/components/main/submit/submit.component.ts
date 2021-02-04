import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { LanguageService } from 'src/app/services/language.service';
import { formatDate } from '@angular/common';
import { loadStripe } from '@stripe/stripe-js';

const testAPIKey = 'pk_test_51IFx5hDSmzjzdNYArWG4qyRn1UBQzxNqGGZUeKRJX3T6RP9GnsjHqFeM7VLBPwv8moou0G7VSckq5cibK9f0jVH000r4R3njwZ';
const testPriceId = 'plan_IsQsyoIw5k9eTh';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {
  currentLanguageCode: String;

  // Checkout properties
  stripePromise = loadStripe(testAPIKey);
  quantity = 1;

  constructor(private db: AngularFireDatabase, private languageService: LanguageService) { }

  ngOnInit(): void {
    this._updateTextBasedOnLanguageCode(this.languageService.currentLanguageCode);
    this.languageService.currentLanguageCodeSubject.subscribe(
      languageCode => {
        this._updateTextBasedOnLanguageCode(languageCode);
      }
    )
  }

  _updateTextBasedOnLanguageCode(languageCode): void {
    this.currentLanguageCode = languageCode
    // TODO: update form language
  }

  onSubmitClicked(userInfoForm: NgForm) {
    var timestamp = formatDate(new Date(), 'MM/dd/yyyy hh:mm:ss', 'en-US');
    let data = {
      pseudonym: userInfoForm.form.value.pseudonym,
      nationality: userInfoForm.form.value.nationality,
      emailAddress: userInfoForm.form.value.emailAddress,
      timestamp: timestamp,
      educationLevel: userInfoForm.form.value.educationLevel,
      studyField: userInfoForm.form.value.studyField,
      gender: userInfoForm.form.value.gender,
      score: 100
    }
    if (!data.pseudonym || !data.nationality || !data.emailAddress || !data.educationLevel || !data.studyField || !data.score || !data.nationality || !data.gender) {
      console.log("invalid data")
    } else {
      console.log(data)
      this.db.list("/test-results").push(data)
    }
  }


  // Checkout started
  async checkout() {
    // Call your backend to create the Checkout session.

    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await this.stripePromise;
    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      lineItems: [{ price: testPriceId, quantity: this.quantity }],
      successUrl: `${window.location.href}/result`,
      cancelUrl: `${window.location.href}/error`,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      console.log(error);
    }
  }
}
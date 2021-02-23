import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';
import { LocationLanguageService } from 'src/app/services/location-language.service';

const testAPIKey = 'pk_test_51IFx5hDSmzjzdNYArWG4qyRn1UBQzxNqGGZUeKRJX3T6RP9GnsjHqFeM7VLBPwv8moou0G7VSckq5cibK9f0jVH000r4R3njwZ';
const testPriceId = 'plan_IsQsyoIw5k9eTh';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  // Checkout properties
  stripePromise = loadStripe(testAPIKey);
  testData;
  uuid: string;

  constructor(private firebaseUtils: FirebaseUtilsService, private db: AngularFireDatabase, private locationLanguageService: LocationLanguageService) {

  }

  ngOnInit(): void {
    this.uuid = window.location.href.split('/unlock/').reverse()[0]
    this.db.database.ref(this.firebaseUtils.firebaseUUIDResultMapPath + "/" + this.uuid).once('value').then(result => {
      if (!result.exists()) {
        // TODO: Error handling
        console.log("uuid " + this.uuid + " not found");
      } else {
        this.testData = result.val()
      }
    }).catch(error => {
      // TODO: Error handling
      console.log(error);
    })
  }
  // Checkout started
  async checkoutStripe() {
    // Call your backend to create the Checkout session.
    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await this.stripePromise;
    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      lineItems: [{ price: testPriceId, quantity: 1 }],
      // TODO: Based on payment callback, set `paid` flag to true on the result
      successUrl: `${window.location.origin}/${this.locationLanguageService.currentLanguageCode}/result/${this.uuid}`,
      cancelUrl: `${window.location.origin}/${this.locationLanguageService.currentLanguageCode}/unlock/${this.uuid}`,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      console.log(error);
    }
  }

  checkoutPaypal() {

  }

  checkoutCard() {

  }

}

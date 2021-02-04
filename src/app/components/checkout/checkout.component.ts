import { Component, OnInit, HostListener, Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var StripeCheckout; // : StripeCheckoutStatic;

const testAPIKey = 'pk_test_51IFx5hDSmzjzdNYArWG4qyRn1UBQzxNqGGZUeKRJX3T6RP9GnsjHqFeM7VLBPwv8moou0G7VSckq5cibK9f0jVH000r4R3njwZ';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
@Injectable()
export class CheckoutComponent {

  constructor(private http: HttpClient, private functions: AngularFireFunctions) { }

  stripePromise = loadStripe(testAPIKey);
  loading = false;
  testPriceId = 'plan_IsQsyoIw5k9eTh';
  quantity = 1;

  async checkout() {
    // Call your backend to create the Checkout session.

    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await this.stripePromise;
    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      lineItems: [{ price: this.testPriceId, quantity: this.quantity }],
      successUrl: `${window.location.href}`,
      cancelUrl: `${window.location.href}/failure`,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      console.log(error);
    }

  }
}
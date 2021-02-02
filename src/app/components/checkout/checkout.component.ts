import { Component, OnInit, HostListener, Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var StripeCheckout; // : StripeCheckoutStatic;

const testAPIKey = 'pk_test_51IFx5hDSmzjzdNYArWG4qyRn1UBQzxNqGGZUeKRJX3T6RP9GnsjHqFeM7VLBPwv8moou0G7VSckq5cibK9f0jVH000r4R3njwZ';
const testSecretKey = 'sk_test_51IFx5hDSmzjzdNYABkFivNRUrJLPVSelEl3D3aCsTUN0gQ2Wi3VBEfIZZu2hPBtoXEpdiZ3pYEfJwZ95B5YyAmig00MLK4GJ0f';
const liveAPIKey = 'pk_live_51IFx5hDSmzjzdNYAEA00Ty3RxF4Palvu3alvRyvCTsuNZk9S8S6MJdhMI2TeQsSAofQzWAvjjAX6lFQO5DVqLERR00ksf4Z0R4';
const liveSecretKey = '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';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
@Injectable()
export class CheckoutComponent implements OnInit {

  constructor(private http: HttpClient, private functions: AngularFireFunctions) { }

  amount;
  description;

  handler; // : StripeCheckoutHandler;

  confirmation: any;
  loading = false;

  ngOnInit() {
    this.amount = 100.00;
    this.handler = StripeCheckout.configure({
      key: testAPIKey,
      image: 'favicon.ico',
      locale: 'auto',
      source: async (source) => {
        this.loading = true;

        console.log('source callback called. source:' + JSON.stringify(source))
        const url: string = 'https://api.stripe.com/v1/charges';
        const headers = new HttpHeaders()
          .set('Authorization', 'Bearer ' + testSecretKey)
          .set('amount', '1')
          .set('currency', 'usd')
          .set('source', source.id)
          .set('description', 'testing')
        this.http.get(url, { headers: headers }).subscribe(res => {
          this.confirmation = res;
          this.loading = false;
        })
      }
    });
  }

  // Open the checkout handler
  async checkout(e) {
    // const user = await this.auth.getUser();
    console.log('checkout called' + e)
    this.handler.open({
      name: 'Checkout Name',
      description: 'Checkout Description',
      amount: this.amount,
      email: "test@test.com",
    });
    e.preventDefault();
  }

  // Close on navigate
  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }

}
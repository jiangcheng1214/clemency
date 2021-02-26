import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';
import { LocationLanguageService } from 'src/app/services/location-language.service';
import { environment } from 'src/environments/environment'
import { AngularFireFunctions } from '@angular/fire/functions';

declare var StripeCheckout: StripeCheckoutStatic;

interface paymentInfo {
  currency: string;
  amount: number;
  description: string;
  source: any;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  // Checkout properties
  handler: StripeCheckoutHandler;
  testData;
  uuid: string;

  constructor(private firebaseUtils: FirebaseUtilsService, private db: AngularFireDatabase, private locationLanguageService: LocationLanguageService, private functions: AngularFireFunctions) {

  }

  ngOnInit(): void {
    this.uuid = window.location.href.split('/unlock/').reverse()[0]
    this.db.database.ref(this.firebaseUtils.firebaseUUIDResultMapPath + "/" + this.uuid).once('value').then(result => {
      if (!result.exists()) {
        // TODO: Error handling
        console.log("uuid " + this.uuid + " not found");
      } else {
        this.testData = result.val()
        this.setupStripe();
      }
    }).catch(error => {
      // TODO: Error handling
      console.log(error);
    })
  }

  setupStripe() {
    console.log("configure")
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'static/assets/questions/1/a.png', // TODO: change to a prettier icon
      locale: 'auto',
      amount: 500,
      email: this.testData.emailAddress,
      name: "clemency",
      currency: 'usd',
      source: source => {
        console.log("requst charge.")
        this.handleStripePaymentSource(source)
      }
    })
  }

  async handleStripePaymentSource(source) {
    const info = {
      currency: 'usd',
      amount: 500,
      description: 'test description',
      source: source,
    }
    var cloudFunctionName;
    if (environment.production) {
      cloudFunctionName = 'stripeCharge';
    } else {
      cloudFunctionName = 'stripeChargeDev';
    }
    let response = await this.functions.httpsCallable(cloudFunctionName)(info).toPromise()
    console.log(JSON.stringify(response))
  }

  checkoutStripe() {
    this.handler.open();
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close()
  }


  checkoutPaypal() {

  }

  checkoutCard() {

  }

}

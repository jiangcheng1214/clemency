import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';
import { LocationLanguageService } from 'src/app/services/location-language.service';
import { environment } from 'src/environments/environment'
import { AngularFireFunctions } from '@angular/fire/functions';
import { UserTestRecord } from 'src/app/modules/interfaces/interfaces.module';
import { Router } from '@angular/router';

declare var StripeCheckout: StripeCheckoutStatic;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  currentLanguageCode: String;
  submittedPayment: boolean;
  // Checkout properties
  handler: StripeCheckoutHandler;
  userTestRecord: UserTestRecord;
  uuid: string;

  constructor(private firebaseUtils: FirebaseUtilsService, private db: AngularFireDatabase, private locationLanguageService: LocationLanguageService, private functions: AngularFireFunctions, private router: Router) {
  }

  ngOnInit(): void {
    this._updateTextBasedOnLanguageCode(this.locationLanguageService.currentLanguageCode);
    this.locationLanguageService.currentLanguageCodeSubject.subscribe(
      languageCode => {
        this._updateTextBasedOnLanguageCode(languageCode);
      }
    )
    this.uuid = window.location.href.split('/unlock/').reverse()[0]
    this.db.database.ref(this.firebaseUtils.firebaseUUIDResultMapPath + "/" + this.uuid).once('value').then(result => {
      if (!result.exists()) {
        // TODO: Error handling
        console.log("uuid " + this.uuid + " not found");
      } else {
        if (result.val().payment) {
          // This user has been paid. So redirect to result page.
          this.router.navigateByUrl("/" + this.currentLanguageCode + "/result/" + this.uuid)
        }
        this.userTestRecord = result.val().userTestRecord
        this.setupStripe();
      }
    }).catch(error => {
      // TODO: Error handling
      console.log(error);
    })
  }

  _updateTextBasedOnLanguageCode(languageCode): void {
    this.currentLanguageCode = languageCode
    // TODO: update form language
  }

  setupStripe() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'static/assets/questions/1/a.png', // TODO: change to a prettier icon
      locale: 'auto',
      amount: 50,
      email: this.userTestRecord.emailAddress,
      name: "clemency",
      currency: 'usd',
      source: source => {
        console.log("requst charge.")
        this.submittedPayment = true;
        this.handleStripePaymentSource(source)
      },
    })
  }

  async handleStripePaymentSource(source) {
    const paymentRequestInfo = {
      currency: 'usd',
      amount: 50,
      description: 'test description',
      source: source,
      userTestRecord: this.userTestRecord,
      uuid: this.uuid
    }
    var cloudFunctionName;
    if (environment.production) {
      cloudFunctionName = 'stripeCharge';
    } else {
      cloudFunctionName = 'stripeChargeDev';
    }
    let response = await this.functions.httpsCallable(cloudFunctionName)(paymentRequestInfo).toPromise()
    console.log(JSON.stringify(response))
    if (response.payment) {
      this.router.navigateByUrl("/" + this.currentLanguageCode + "/result/" + this.uuid)
    } else {
      // TODO: handle failed payment (should be a rare edge case as Stripe did payment verification upfront.)
    }
  }

  checkoutStripe() {
    if (!this.submittedPayment) {
      this.handler.open();
    }
  }

  @HostListener('window:popstate') onPopstate() {
    this.handler.close()
  }

}

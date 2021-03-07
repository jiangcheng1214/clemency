import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';
import { LocationLanguageService } from 'src/app/services/location-language.service';
// import { environment } from 'src/environments/environment.prod'
import { environment } from 'src/environments/environment'
import { AngularFireFunctions } from '@angular/fire/functions';
import { UserTestRecord } from 'src/app/modules/interfaces/interfaces.module';
import { Router } from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { WechatPayQRCodeComponent } from '../wechat-pay-qrcode/wechat-pay-qrcode.component';
import { WechatPayQRCodeService } from 'src/app/services/wechat-pay-qrcode.service';
import { UserAgentService } from 'src/app/services/user-agent.service';

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
  stripe;
  // Async Payment
  MAX_POLL_COUNT = 20;
  pollCount;

  constructor(private firebaseUtils: FirebaseUtilsService,
     private db: AngularFireDatabase,
     private locationLanguageService: LocationLanguageService,
     private functions: AngularFireFunctions, 
     private router: Router,
     private matDialog: MatDialog,
     private wechatPayQRCodeService: WechatPayQRCodeService,
     private userAgentService: UserAgentService) {
    this.stripe = Stripe(environment.stripeKey);
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
    console.log(JSON.stringify(source))
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

  async checkoutWechat() {
    // TODO: if else for device type

    if (!this.submittedPayment) {
      const result = await this.stripe.createSource({
        type: 'wechat',
        amount: 50,
        currency: 'usd',
      })
      
      // then(async (result) => {
        const source = result.source;
        console.log(JSON.stringify(source));
        if (!this.userAgentService.isMobile()) {
          window.location.href=source.wechat.qr_code_url;
        } else {
          this.wechatPayQRCodeService.setQRUrl(source.wechat.qr_code_url)
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = false;
          dialogConfig.autoFocus = true;
          dialogConfig.width = "200px";
          dialogConfig.height = "250px";
          dialogConfig.panelClass = "no-padding-dialog";
          const dialog = this.matDialog.open(WechatPayQRCodeComponent, dialogConfig)
        }
        // this.pollCount = 0;
        // this.pollForSourceStatus(source);
      // });
    }
  }

  pollForSourceStatus(source) {
    console.log("pollForSourceStatus, polling Count: " + this.pollCount);
    this.stripe.retrieveSource({id: source.id, client_secret: source.client_secret}).then(async result => {
      const source = result.source;
      console.log("retrieveSource callback, source: " + JSON.stringify(source));
      console.log("source.status:", source.status);
      
      if (source.status === 'chargeable') {
        console.log("chargeable!")
        const paymentRequestInfo = {
          currency: 'usd',
          amount: 50,
          description: 'wechat pay description',
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
        // let response = await this.functions.httpsCallable('stripeChargeDev')(source).toPromise()
        // console.log(JSON.stringify(response))
      } else if (source.status === 'pending' && this.pollCount < this.MAX_POLL_COUNT) {
        // Try again in a second, if the Source is still `pending`:
        this.pollCount += 1;
        console.log("still pending...")
        setTimeout(() => {this.pollForSourceStatus(source)}, 1000);
      } else {
        // Depending on the Source status, show your customer the relevant message.
      }
    });
  }

  @HostListener('window:popstate') onPopstate() {
    this.handler.close()
    this.pollCount = this.MAX_POLL_COUNT; // TODO better handle listener
  }

}

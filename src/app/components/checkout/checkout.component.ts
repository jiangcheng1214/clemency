import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';
import { LocationLanguageService } from 'src/app/services/location-language.service';
// import { environment } from 'src/environments/environment.prod'
import { environment } from 'src/environments/environment'
import { AngularFireFunctions } from '@angular/fire/functions';
import { UserTestRecord } from 'src/app/modules/interfaces/interfaces.module';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WechatPayQRCodeComponent } from '../wechat-pay-qrcode/wechat-pay-qrcode.component';
import { WechatPayQRCodeService } from 'src/app/services/wechat-pay-qrcode.service';

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
  wechatPaymentChecker;
  createSourceRef;

  constructor(private firebaseUtils: FirebaseUtilsService,
    private db: AngularFireDatabase,
    private locationLanguageService: LocationLanguageService,
    private functions: AngularFireFunctions,
    private router: Router,
    private matDialog: MatDialog,
    private wechatPayQRCodeService: WechatPayQRCodeService) {
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
    if (!this.submittedPayment) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "200px";
      dialogConfig.height = "250px";
      dialogConfig.panelClass = "no-padding-dialog";
      const dialog = this.matDialog.open(WechatPayQRCodeComponent, dialogConfig)
      if (!this.createSourceRef) {
        this.createSourceRef = await this.stripe.createSource({
          type: 'wechat',
          amount: 50,
          currency: 'usd',
        })
      }
      const source = this.createSourceRef.source;
      console.log(JSON.stringify(source));
      // TODO: use this.userAgentService.isMobile() for mobile case
      this.wechatPayQRCodeService.setQRUrl(source.wechat.qr_code_url)
      clearInterval(this.wechatPaymentChecker);
      this.wechatPaymentChecker = setInterval(async _ => {
        const retrieveSourceRef = await this.stripe.retrieveSource({ id: source.id, client_secret: source.client_secret })
        const retrievedSource = retrieveSourceRef.source
        if (retrievedSource.status === 'chargeable') {
          clearInterval(this.wechatPaymentChecker);
          console.log(JSON.stringify(retrievedSource))
          const paymentRequestInfo = {
            currency: 'usd',
            amount: 50,
            description: 'wechat pay description',
            source: retrievedSource,
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
          dialog.close();
          this.router.navigateByUrl("/" + this.currentLanguageCode + "/result/" + this.uuid)
        } else {
          console.log(JSON.stringify(retrievedSource.status))
        }
      }, 1000)
    }
  }

  @HostListener('window:popstate') onPopstate() {
    this.handler.close()
    clearInterval(this.wechatPaymentChecker)
  }

}

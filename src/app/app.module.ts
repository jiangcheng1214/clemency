import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { RecoverComponent } from './components/recover/recover.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ResultComponent } from './components/result/result.component';
import { LiveResultsComponent } from './components/main/live-results/live-results.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule } from '@angular/forms';
import { IQTestComponent } from './components/main/iqtest/iqtest.component';
import { DeclarationComponent } from './components/main/declaration/declaration.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    RecoverComponent,
    PaymentComponent,
    ResultComponent,
    LiveResultsComponent,
    FooterComponent,
    HeaderComponent,
    IQTestComponent,
    DeclarationComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

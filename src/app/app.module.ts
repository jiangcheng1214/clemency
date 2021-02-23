import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { RecoverComponent } from './components/recover/recover.component';
import { LiveResultsComponent } from './components/main/live-results/live-results.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule } from '@angular/forms';
import { IQTestComponent } from './components/main/iqtest/iqtest.component';
import { DeclarationComponent } from './components/main/declaration/declaration.component';
import { environment } from 'src/environments/environment';
import { SubmitComponent } from './components/main/submit/submit.component';
import { ResultComponent } from './components/result/result.component';
import { HttpClientModule } from '@angular/common/http';
import { CheckoutComponent } from './components/checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    RecoverComponent,
    LiveResultsComponent,
    FooterComponent,
    HeaderComponent,
    IQTestComponent,
    DeclarationComponent,
    SubmitComponent,
    ResultComponent,
    CheckoutComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

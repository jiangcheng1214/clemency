import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EnglishComponent } from './english/english.component';
import { EnglishHeaderComponent } from './english/english-header/english-header.component';
import { ChineseComponent } from './chinese/chinese.component';
import { ChineseHeaderComponent } from './chinese/chinese-header/chinese-header.component';
import { EnglishTestComponent } from './english/english-test/english-test.component';
import { EnglishRecoverResultComponent } from './english/english-recover-result/english-recover-result.component';
import { LastestResultsComponent } from './english/english-test/lastest-results/lastest-results.component';
import { EnglishQuestionsComponent } from './english/english-test/english-questions/english-questions.component';
import { EnglishDescriptionsComponent } from './english/english-test/english-descriptions/english-descriptions.component';
import { EnglishStatsComponent } from './english/english-test/english-stats/english-stats.component';
import { EnglishFooterComponent } from './english/english-footer/english-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    EnglishComponent,
    EnglishHeaderComponent,
    ChineseComponent,
    ChineseHeaderComponent,
    EnglishTestComponent,
    EnglishRecoverResultComponent,
    LastestResultsComponent,
    EnglishQuestionsComponent,
    EnglishDescriptionsComponent,
    EnglishStatsComponent,
    EnglishFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

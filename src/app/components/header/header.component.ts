import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { Title } from '@angular/platform-browser';
import { LocalizationConstants } from 'src/app/modules/localization/localization.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  currentLanguageCode: string;
  appTitle: String;
  takeTestTitle: String;
  recoverResultTitle: String;
  currentLanguageString: string;


  constructor(public languageService: LanguageService, private titleService: Title) {
  }

  ngOnInit(): void {

    this.currentLanguageCode = this.languageService.currentLanguageCode;
	this.currentLanguageString=this.languageService.supportedLanguages.get(this.currentLanguageCode);
    this.titleService.setTitle(LocalizationConstants.APP.TITLE.get(this.currentLanguageCode.toString()))
    this.appTitle = LocalizationConstants.APP.TITLE.get(this.currentLanguageCode.toString());
    this.takeTestTitle = LocalizationConstants.APP.TAKE_TEST_TITLE.get(this.currentLanguageCode.toString());
    this.recoverResultTitle = LocalizationConstants.APP.RECOVER_RESULT_TITLE.get(this.currentLanguageCode.toString());
  }

  onSelectedLanguageChange(languageCode: string) {
    this.languageService.updateSelectedLanguageCode(languageCode);
	this.currentLanguageString=this.languageService.supportedLanguages.get(languageCode);
    console.log('[Header] language updated:' + this.currentLanguageString);
    this.titleService.setTitle(LocalizationConstants.APP.TITLE.get(languageCode.toString()))
    this.appTitle = LocalizationConstants.APP.TITLE.get(languageCode.toString());
    this.takeTestTitle = LocalizationConstants.APP.TAKE_TEST_TITLE.get(this.currentLanguageCode.toString());
    this.recoverResultTitle = LocalizationConstants.APP.RECOVER_RESULT_TITLE.get(this.currentLanguageCode.toString());
  }

  getSupportedLanguages():Map<string, string> {
    return this.languageService.supportedLanguages;
  }

}

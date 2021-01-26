import { Component, OnInit } from '@angular/core';
import { LocalizationConstants } from 'src/app/modules/localization/localization.module';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.css']
})
export class DeclarationComponent implements OnInit {
  currentLanguageCode:String;
  purposeTitle: String;
  purposeText: String;
  effectivenessTitle: String;
  effectivenessText: String;
  giftedTitle: String;
  giftedText: String;
  mentalHandicapTitle:String;
  mentalHandicapText:String;

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this._updateTextBasedOnLanguageCode(this.languageService.currentLanguageCode)
    this.languageService.currentLanguageCodeSubject.subscribe(
      languageCode => {
        this._updateTextBasedOnLanguageCode(languageCode)
      }
    )
  }

  _updateTextBasedOnLanguageCode(languageCode):void {
    this.currentLanguageCode = languageCode
    this.purposeTitle = LocalizationConstants.DECLARATION.PURPOSE_TITLE.get(this.currentLanguageCode.toString());
    this.purposeText = LocalizationConstants.DECLARATION.PURPOSE_TEXT.get(this.currentLanguageCode.toString());
    this.effectivenessTitle = LocalizationConstants.DECLARATION.EFFECTIVENESS_TITLE.get(this.currentLanguageCode.toString());
    this.effectivenessText = LocalizationConstants.DECLARATION.EFFECTIVENESS_TEXT.get(this.currentLanguageCode.toString());
    this.giftedTitle = LocalizationConstants.DECLARATION.GIFTED_TITLE.get(this.currentLanguageCode.toString());
    this.giftedText = LocalizationConstants.DECLARATION.GIFTED_TEXT.get(this.currentLanguageCode.toString());
    this.mentalHandicapTitle = LocalizationConstants.DECLARATION.MENTAL_HANDICAP_TITLE.get(this.currentLanguageCode.toString());
    this.mentalHandicapText = LocalizationConstants.DECLARATION.MENTAL_HANDICAP_TEXT.get(this.currentLanguageCode.toString());
  }
}

import { Component, OnInit } from '@angular/core';
import { LocalizationConstants } from 'src/app/modules/localization/localization.module';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-iqtest',
  templateUrl: './iqtest.component.html',
  styleUrls: ['./iqtest.component.css']
})
export class IQTestComponent implements OnInit {
  answers: Number[];
  imageSrc: String;
  currentLanguageCode: String;
  title: String;
  introduction: String;
  buttonText: String;

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.imageSrc = '';
    this.answers = [];
    this._updateTextBasedOnLanguageCode(this.languageService.currentLanguageCode)
    this.languageService.currentLanguageCodeSubject.subscribe(
      languageCode => {
        this._updateTextBasedOnLanguageCode(languageCode)
      }
    )
  }

  _updateTextBasedOnLanguageCode(languageCode):void {
    this.currentLanguageCode = languageCode
    this.title = LocalizationConstants.IQTest.TITLE.get(this.currentLanguageCode.toString());
    this.introduction = LocalizationConstants.IQTest.INTRODUCTION.get(this.currentLanguageCode.toString());
    this.buttonText = LocalizationConstants.IQTest.BUTTON_TEXT.get(this.currentLanguageCode.toString());
    this.reset();
  }

  reset(): void {
    this.imageSrc = '';
    this.answers = [];
  }

  onClickStartTesting(): void {
    console.log("start test clicked")
    this.imageSrc = "static/assets/ex1.png";
  }

  onClick(num): void {
    console.log('click:', num);
    this.answers.push(num);
    console.log('answers:', this.answers);
  }

}

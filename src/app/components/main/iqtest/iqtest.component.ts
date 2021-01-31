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
  currentLanguageCode: String;
  title: String;
  introduction: String;
  buttonText: String;
  questionCounter: number;
  totalQuestionCount: number;

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.answers = [];
    this._updateTextBasedOnLanguageCode(this.languageService.currentLanguageCode)
    this.languageService.currentLanguageCodeSubject.subscribe(
      languageCode => {
        this._updateTextBasedOnLanguageCode(languageCode)
      }
    )
    this.totalQuestionCount = 3; //test for now
  }

  _updateTextBasedOnLanguageCode(languageCode): void {
    this.currentLanguageCode = languageCode
    this.title = LocalizationConstants.IQTest.TITLE.get(this.currentLanguageCode.toString());
    this.introduction = LocalizationConstants.IQTest.INTRODUCTION.get(this.currentLanguageCode.toString());
    this.buttonText = LocalizationConstants.IQTest.BUTTON_TEXT.get(this.currentLanguageCode.toString());

    // reset after language update
    this.answers = [];
    this.questionCounter = 0;
  }

  onClickStartTesting(): void {
    console.log("start test clicked")
    this.questionCounter += 1;
  }

  onClick(answer): void {
    console.log('click:', answer);
    this.answers.push(answer);
    this.questionCounter += 1;
  }

}

import { Component, Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { LocalizationConstants } from 'src/app/modules/localization/localization.module';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';
import { LocationLanguageService } from 'src/app/services/location-language.service';

const timelimitForBonusScore = 3; // time in seconds for bonus
const bonusScore = 1; // extra score if answered within time limit
const baseScore = 3; // base score per question

@Component({
  selector: 'app-iqtest',
  templateUrl: './iqtest.component.html',
  styleUrls: ['./iqtest.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class IQTestComponent implements OnInit {
  score: number;
  answers: string[];
  timeUsedList: number[];
  currentLanguageCode: String;
  title: String;
  introduction: String;
  buttonText: String;
  questionCounter: number;
  totalQuestionCount: number;
  lastClickTimestamp: number;

  constructor(private firebaseUtils: FirebaseUtilsService, private db: AngularFireDatabase, private locationLanguageService: LocationLanguageService) { }

  ngOnInit(): void {
    this._updateTextBasedOnLanguageCode(this.locationLanguageService.currentLanguageCode)
    this.locationLanguageService.currentLanguageCodeSubject.subscribe(
      languageCode => {
        this._updateTextBasedOnLanguageCode(languageCode)
      }
    )
    this._reset();
    this.totalQuestionCount = 3; //test for now
  }

  _updateTextBasedOnLanguageCode(languageCode): void {
    this.currentLanguageCode = languageCode
    this.title = LocalizationConstants.IQTest.TITLE.get(this.currentLanguageCode.toString());
    this.introduction = LocalizationConstants.IQTest.INTRODUCTION.get(this.currentLanguageCode.toString());
    this.buttonText = LocalizationConstants.IQTest.BUTTON_TEXT.get(this.currentLanguageCode.toString());

    // reset after language update
    this.questionCounter = 0
    this._reset()
  }

  onClickStartTesting(): void {
    console.log("start test clicked")
    this.questionCounter += 1;
    this.lastClickTimestamp = Date.now()
    this._reset()
  }

  _reset():void {
    this.answers = [];
    this.timeUsedList = [];
    this.score = -1;
  }

  onClick(answer): void {
    const currentTimestamp = Date.now()
    const timeUsedInSecond = (currentTimestamp - this.lastClickTimestamp) / 1000
    this.lastClickTimestamp = currentTimestamp
    this.answers.push(answer);
    this.timeUsedList.push(timeUsedInSecond);
    console.log('click: ', answer, 'time used: ', timeUsedInSecond);
    this.questionCounter += 1;
    if (this.questionCounter > this.totalQuestionCount) {
      this.onFinishAllTests()
    }
  }

  onFinishAllTests(): void {
    this.db.list(this.firebaseUtils.firebaseStandardAnswersPath).query.once('value').then(snapshot => {
      const standardAnswers = snapshot.val()
      var score = 0
      for (let index = 0; index <  this.answers.length; index++)  {
        if (this.answers[index] == standardAnswers[index]) {
          score += baseScore
          if (this.timeUsedList[index] <= timelimitForBonusScore) {
            score += bonusScore;
          }
        }
      }
      this.score = score
    })
  }

}

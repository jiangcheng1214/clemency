import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { LanguageService } from 'src/app/services/language.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {
  currentLanguageCode: String;

  constructor(private db: AngularFireDatabase, private languageService: LanguageService) { }

  ngOnInit(): void {
    this._updateTextBasedOnLanguageCode(this.languageService.currentLanguageCode);
    this.languageService.currentLanguageCodeSubject.subscribe(
      languageCode => {
        this._updateTextBasedOnLanguageCode(languageCode);
      }
    )
  }

  _updateTextBasedOnLanguageCode(languageCode): void {
    this.currentLanguageCode = languageCode
    // TODO: update form language
  }

  onSubmitClicked(userInfoForm: NgForm) {
    var timestamp = formatDate(new Date(), 'MM/dd/yyyy hh:mm:ss', 'en-US');
    let data = {
      pseudonym: userInfoForm.form.value.pseudonym,
      nationality: userInfoForm.form.value.nationality,
      emailAddress: userInfoForm.form.value.emailAddress,
      timestamp: timestamp,
      educationLevel: userInfoForm.form.value.educationLevel,
      studyField: userInfoForm.form.value.studyField,
      gender: userInfoForm.form.value.gender,
      score: 100
    }
    if (!data.pseudonym || !data.nationality || !data.emailAddress || !data.educationLevel || !data.studyField || !data.score || !data.nationality || !data.gender) {
      console.log("invalid data")
    } else {
      console.log(data)
      this.db.list("/test-results").push(data)
    }
  }
}

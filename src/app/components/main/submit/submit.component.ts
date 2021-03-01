import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { LocationLanguageService } from 'src/app/services/location-language.service';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';
import { IQTestComponent } from '../iqtest/iqtest.component';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {
  currentLanguageCode: String;
  countryFlagLink: string;
  countryName: string;
  countryCode: string;
  pseudonym: string;
  emailAddress: string;
  gender: string;
  birthYear: string;
  studyField: string;
  educationLevel: string;

  constructor(private iqTestComponent: IQTestComponent, private firebaseUtils: FirebaseUtilsService, private db: AngularFireDatabase, private locationLanguageService: LocationLanguageService, private router: Router) { }

  ngOnInit(): void {
    this._updateTextBasedOnLanguageCode(this.locationLanguageService.currentLanguageCode);
    this.locationLanguageService.currentLanguageCodeSubject.subscribe(
      languageCode => {
        this._updateTextBasedOnLanguageCode(languageCode);
      }
    )
    this.countryName = this.locationLanguageService.getCountryName();
    this.countryCode = this.locationLanguageService.getCountryCode();
    this.locationLanguageService.getMapURLsMap().then(map => {
      this.countryFlagLink = map[this.countryCode]
    })
  }

  _updateTextBasedOnLanguageCode(languageCode): void {
    this.currentLanguageCode = languageCode
    // TODO: update form language
  }

  onSubmitClicked(userInfoForm: NgForm) {
    const score = this.iqTestComponent.score
    let testRecord = {
      pseudonym: userInfoForm.form.value.pseudonym,
      countryCode: this.countryCode,
      emailAddress: userInfoForm.form.value.emailAddress,
      educationLevel: userInfoForm.form.value.educationLevel,
      studyField: userInfoForm.form.value.studyField,
      gender: userInfoForm.form.value.gender,
      score: score,
      timestamp: Date.now()
    }

    // TODO: validate data input
    if (!testRecord.pseudonym || !testRecord.countryCode || !testRecord.emailAddress ||
      !testRecord.educationLevel || !testRecord.studyField || !testRecord.gender) {
      console.log("invalid data")
      console.log(JSON.stringify(testRecord))
    } else {
      const uuid = uuidv4();
      let recordData = {
        userTestRecord: testRecord,
      }
      this.db.database.ref(this.firebaseUtils.firebaseUUIDResultMapPath + "/" + uuid).set(recordData)
        .then(result => {
          this.router.navigateByUrl("/" + this.currentLanguageCode + "/unlock/" + uuid)
        })
        .catch(error => {
          console.log("uuid-result update failed");
        })
    }
  }

  birthYears(): number[] {
    var years = [];
    for (var i = 2007; i >= 1930; i -= 1) {
      years.push(i);
    }
    return years;
  }
}

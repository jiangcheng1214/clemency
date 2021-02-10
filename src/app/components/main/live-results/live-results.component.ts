import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { LocationLanguageService } from 'src/app/services/location-language.service';
import { LocalizationConstants } from 'src/app/modules/localization/localization.module';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';

interface User {
  pseudonym: string
  nationality: string
  emailAddress: string
  timestamp: Date
  educationLevel: string
  studyField: string
  gender: string
  score: number
}

@Component({
  selector: 'app-live-results',
  templateUrl: './live-results.component.html',
  styleUrls: ['./live-results.component.css']
})

export class LiveResultsComponent implements OnInit {
  lastResults: User[];
  currentLanguageCode: String;
  description: String;

  constructor(private firebaseUtils: FirebaseUtilsService, private db: AngularFireDatabase, private locationLanguageService: LocationLanguageService) {
    var _this = this;
    db.database.ref(firebaseUtils.firebaseRecentResultsPath).once("value").then(function(data: any){
      const resultMap = data.val()
      const resultArraySorted: any[] = Object.values(resultMap).sort((a : User, b: User) => {
        return a.timestamp > b.timestamp ? -1 : 0;
      });
      _this.lastResults = resultArraySorted.slice(0, 20);
    })
  }

  ngOnInit(): void {
    this._updateTextBasedOnLanguageCode(this.locationLanguageService.currentLanguageCode);
    this.locationLanguageService.currentLanguageCodeSubject.subscribe(
      languageCode => {
        this._updateTextBasedOnLanguageCode(languageCode);
      }
    )
  }

  _updateTextBasedOnLanguageCode(languageCode): void {
    this.currentLanguageCode = languageCode
    this.description = LocalizationConstants.LiveResults.DESCRIPTION.get(this.currentLanguageCode.toString());
  }

  flagPathForCountryCode(countryCode:string):string {
    return "static/assets/flags/" + countryCode + ".jpg"
  }

}

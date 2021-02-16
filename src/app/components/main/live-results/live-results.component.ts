import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { LocationLanguageService } from 'src/app/services/location-language.service';
import { LocalizationConstants } from 'src/app/modules/localization/localization.module';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';

interface User {
  pseudonym: string
  countryCode: string
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
  flagURLs: string[] = [];
  flagURLsCacheMap;

  constructor(private firebaseUtils: FirebaseUtilsService, private db: AngularFireDatabase, private locationLanguageService: LocationLanguageService) {
    db.database.ref(firebaseUtils.firebaseRecentResultsPath).once("value").then(data => {
      const resultMap = data.val()
      const resultArraySorted: any[] = Object.values(resultMap).sort((a: User, b: User) => {
        return a.timestamp > b.timestamp ? -1 : 0;
      });
      this.lastResults = resultArraySorted.slice(0, 20);
    })
    this.locationLanguageService.getMapURLsMap().then(data => {
      this.flagURLsCacheMap = data;
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
}

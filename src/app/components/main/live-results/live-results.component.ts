import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { LocationLanguageService } from 'src/app/services/location-language.service';
import { LocalizationConstants } from 'src/app/modules/localization/localization.module';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';
import { UserRecord } from 'src/app/modules/interfaces/interfaces.module';
import { TimeDateService } from 'src/app/services/time-date.service';

@Component({
  selector: 'app-live-results',
  templateUrl: './live-results.component.html',
  styleUrls: ['./live-results.component.css']
})

export class LiveResultsComponent implements OnInit {
  lastResults: UserRecord[];
  currentLanguageCode: String;
  description: String;
  flagURLs: string[] = [];
  flagURLsCacheMap;

  constructor(private firebaseUtils: FirebaseUtilsService,
    private db: AngularFireDatabase, 
    private locationLanguageService: LocationLanguageService, 
    private timeDateService: TimeDateService) {
    db.database.ref(firebaseUtils.firebaseRecentResultsPath).once("value").then(data => {
      const resultMap = data.val()
      const resultArraySorted: any[] = Object.values(resultMap).sort((a: UserRecord, b: UserRecord) => {
        return a.userTestRecord.timestamp > b.userTestRecord.timestamp ? -1 : 0;
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

  getLocalTimeString(timestamp): string {
    return this.timeDateService.localTimeStringFromTS(timestamp);
  }

  _updateTextBasedOnLanguageCode(languageCode): void {
    this.currentLanguageCode = languageCode
    this.description = LocalizationConstants.LiveResults.DESCRIPTION.get(this.currentLanguageCode.toString());
  }
}

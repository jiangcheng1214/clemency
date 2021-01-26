import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { LanguageService } from 'src/app/services/language.service';
import { LocalizationConstants } from 'src/app/modules/localization/localization.module';

@Component({
  selector: 'app-live-results',
  templateUrl: './live-results.component.html',
  styleUrls: ['./live-results.component.css']
})
export class LiveResultsComponent implements OnInit {
  lastResults: any[];
  currentLanguageCode: String;
  description: String;

  constructor(db: AngularFireDatabase, private languageService: LanguageService) {
    db.list("/test-results").valueChanges().subscribe(results => {
      this.lastResults = results
      console.log(this.lastResults)
    })
  }

  ngOnInit(): void {
    this._updateTextBasedOnLanguageCode(this.languageService.currentLanguageCode);
    this.languageService.currentLanguageCodeSubject.subscribe(
      languageCode => {
        this._updateTextBasedOnLanguageCode(languageCode);
      }
    )
  }

  _updateTextBasedOnLanguageCode(languageCode):void {
    this.currentLanguageCode = languageCode
        this.description = LocalizationConstants.LiveResults.DESCRIPTION.get(this.currentLanguageCode.toString());
  }

}

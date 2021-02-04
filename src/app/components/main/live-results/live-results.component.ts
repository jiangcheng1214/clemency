import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { LanguageService } from 'src/app/services/language.service';
import { LocalizationConstants } from 'src/app/modules/localization/localization.module';

interface User {
  pseudonym: string
  nationality: string
  emailAddress: string
  timestamp: Date
  educationLevel: string
  studyField: string
  gender: string
  score: number
  //flaglink: string
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
    myMap = {};

  constructor(private db: AngularFireDatabase, private languageService: LanguageService) {
	this.myMap["USA"]="static/assets/flags/US.jpg";
	this.myMap["China"]="static/assets/flags/CN.jpg";
	this.myMap["France"]="static/assets/flags/CN.jpg";
	this.myMap["Canada"]="static/assets/flags/CN.jpg";
	this.myMap["Other"]="static/assets/flags/CN.jpg";
	this.myMap["France"]="static/assets/flags/CN.jpg";


    db.list("/test-results").valueChanges().subscribe(results => {
      this.lastResults = (results as User[]).sort((a, b) => {
        return a.timestamp > b.timestamp ? -1 : 0;
      })
      console.log(this.lastResults)
	  

      //for (var i=0;i<this.lastResults.length;i++){
		//console.log(this.myMap[this.lastResults[i].nationality]);
		//console.log(this.lastResults[i].nationality);
      //  if (this.lastResults[i].nationality=="USA"){
      //      this.lastResults[i].flaglink="static/assets/flags/US.jpg";
      //      }
      //  else{
      //      this.lastResults[i].flaglink="static/assets/flags/CN.jpg";
	 //}
	  //}
      //console.log(this.lastResults)
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

  _updateTextBasedOnLanguageCode(languageCode): void {
    this.currentLanguageCode = languageCode
    this.description = LocalizationConstants.LiveResults.DESCRIPTION.get(this.currentLanguageCode.toString());
  }

}

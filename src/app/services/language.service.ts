import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selectedLanguage: String;
  constructor() { 
    this.selectedLanguage = 'en'
  }
  
  updateSelectedLanguage(language:String) {
    console.log("selectedLanguage changed to " + language)
    this.selectedLanguage = language;
  }

  getSelectedLanguage():String {
    return this.selectedLanguage;
  }
  
}

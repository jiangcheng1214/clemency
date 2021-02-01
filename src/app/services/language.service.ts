import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLanguageCodeSubject: Subject<string>;
  public currentLanguageCode: string;
  public supportedLanguages: Map<string, string>;
  
  constructor(private router: Router) {
    this.supportedLanguages = new Map;
    this.supportedLanguages.set('en', 'English')
    this.supportedLanguages.set('ch', '汉语')
    this.currentLanguageCodeSubject = new Subject();
    let baseURL = window.location.origin
    let currentURL = window.location.href
    this.currentLanguageCode = currentURL.slice(baseURL.length).split('/').filter(function (x) { return x.length })[0]
    console.log("[LanguageService] url: " + window.location.href + " currentLanguageCode: " + this.currentLanguageCode);
    if (!this.currentLanguageCode || !this.supportedLanguages.has(this.currentLanguageCode)) {
      console.log("[LanguageService] languageCode is not supported: " + this.currentLanguageCode);
      this.currentLanguageCode = 'en'
      this.router.navigateByUrl("/en")
    }
    
  }

  updateSelectedLanguageCode(languageCode: string) {
    console.log("[LanguageService] selectedLanguage changed to " + languageCode)
    this.currentLanguageCode = languageCode;
    this.currentLanguageCodeSubject.next(languageCode)
    this.router.navigateByUrl("/" + languageCode + "/")
  }

  languageSubject(): Subject<String> {
    return this.currentLanguageCodeSubject;
  }

}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLanguageCodeSubject: Subject<String>;
  public currentLanguageCode: String;

  constructor(private router: Router,) {
    this.currentLanguageCodeSubject = new Subject();
    this.currentLanguageCode = 'en';
  }

  updateSelectedLanguageCode(languageCode: String) {
    console.log("[LanguageService] selectedLanguage changed to " + languageCode)
    this.currentLanguageCode = languageCode;
    this.currentLanguageCodeSubject.next(languageCode)
    this.router.navigateByUrl("/" + languageCode + "/")
  }

  languageSubject(): Subject<String> {
    return this.currentLanguageCodeSubject;
  }

}

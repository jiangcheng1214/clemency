import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface LocaleData {
  "ip": string,
  "type": string,
  "continent_code": string,
  "continent_name": string,
  "country_code": string,
  "country_name": string,
  "region_code": string,
  "region_name": string,
  "city": string,
  "zip": string,
  "latitude": number,
  "longitude": number,
  "location": {
    "geoname_id": number,
    "capital": string,
    "languages": { "code": string, "name": string, "native": string }[],
    "country_flag": string,
    "country_flag_emoji": string,
    "country_flag_emoji_unicode": string,
    "calling_code": string,
    "is_eu": false
  }
}

@Injectable({
  providedIn: 'root'
})
export class LocationLanguageService {
  currentLanguageCodeSubject: Subject<string>;
  public currentLanguageCode: string;
  public supportedLanguages: Map<string, string>;
  localeData: LocaleData;

  constructor(private http: HttpClient, private router: Router) {
    try {
      this.supportedLanguages = new Map([['en', 'English'], ['ch', '汉语']]);
      this.currentLanguageCodeSubject = new Subject();
      // TODO: upgrade to prenium for bucks if necessary https://ipstack.com/
      this.http.get<any>('http://api.ipstack.com/76.175.69.159?access_key=e15876bbe6374926943370c103a129c7').subscribe(data => {
        console.log('Callback')
        this.localeData = data as LocaleData;
      })
      this.currentLanguageCode = this.locationBasedPreferredLanguage()
      this.router.navigateByUrl("/" + this.currentLanguageCode)
    } catch (error) {
      console.log(error)
    }
  }

  updateSelectedLanguageCode(languageCode: string) {
    console.log("[LocationLanguageService] selectedLanguage changed to " + languageCode)
    this.currentLanguageCode = languageCode;
    this.currentLanguageCodeSubject.next(languageCode)
    this.router.navigateByUrl("/" + languageCode + "/")
  }

  languageSubject(): Subject<String> {
    return this.currentLanguageCodeSubject;
  }

  locationBasedPreferredLanguage(): string {
    try {
      let baseURL = window.location.origin
      let currentURL = window.location.href
      var languageCode = currentURL.slice(baseURL.length).split('/').filter(function (x) { return x.length })[0]
      console.log(languageCode)
      if (languageCode && this.supportedLanguages.has(languageCode)) {
        // support current language
        return languageCode;
      }
      // default to english
      return 'en';
    } catch (error) {
      console.log(error)
      return 'en';
    }
  }

  getCountryFlagEmojiUnicode() {
    if (this.localeData) {
      return this.localeData.location.country_flag_emoji_unicode;
    }
  }

  getCountryName():string {
    if (this.localeData) {
      return this.localeData.country_name;
    }
  }

  getCountryCode():string {
    if (this.localeData) {
      return this.localeData.country_code.toLowerCase();
    }
  }

}

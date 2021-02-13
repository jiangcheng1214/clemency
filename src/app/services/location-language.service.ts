import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FirebaseUtilsService } from './firebase-utils.service';
import { AngularFireDatabase } from 'angularfire2/database';

interface LocaleData {
  "ip": string,
  "state_prov": string,
  "continent_name": string,
  "country_code2": string,
  "country_code3": string,
  "country_name": string,
  "country_capital": string,
  "district": string,
  "city": string,
  "zipcode": string,
  "latitude": string,
  "longitude": string,
  "calling_code": string,
  "country_tld": string,
  "languages": string,
  "country_flag": string,
  "geoname_id": string,
  "isp": string,
  "connection_type": string,
  "organization": string,
  "currency": {
    "code": string,
    "name": string,
    "symbol": string
  },
  "time_zone": {
    "name": string,
    "offset": number,
    "current_time": string,
    "current_time_unix": number,
    "is_dst": boolean,
    "dst_savings": number
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

  constructor(private firebaseUtils: FirebaseUtilsService, private db: AngularFireDatabase, private http: HttpClient, private router: Router) {
    try {
      this.supportedLanguages = new Map([['en', 'English'], ['ch', '汉语']]);
      this.currentLanguageCodeSubject = new Subject();
      // https://api.ipgeolocation.io/ipgeo?apiKey=2d836806f62245f79e2a00191320bf3b
      const promise = this.http.get<any>('https://api.ipgeolocation.io/ipgeo?apiKey=2d836806f62245f79e2a00191320bf3b').toPromise() 
      promise.then(data => {
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

  getCountryFlagLink() {
    if (this.localeData) {
      return this.localeData.country_flag;
    }
  }

  getCountryName(): string {
    if (this.localeData) {
      return this.localeData.country_name;
    }
  }

  getCountryCode(): string {
    if (this.localeData) {
      return this.localeData.country_code2.toLowerCase();
    }
  }

}

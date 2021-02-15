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
  flagURLsMap: Map<string, string>;
  localeData: LocaleData;

  constructor(private db: AngularFireDatabase, private firebaseUtils: FirebaseUtilsService, private http: HttpClient, private router: Router) {
    try {
      this.supportedLanguages = new Map([['en', 'English'], ['ch', '汉语']]);
      this.currentLanguageCodeSubject = new Subject();
      // https://api.ipgeolocation.io/ipgeo?apiKey=2d836806f62245f79e2a00191320bf3b
      const promise = this.http.get<any>('https://api.ipgeolocation.io/ipgeo?apiKey=2d836806f62245f79e2a00191320bf3b').toPromise() 
      promise.then(data => {
        this.localeData = data as LocaleData;
        return this.localeData
      }).then(async localeData => {
        try {
          this.flagURLsMap = (await this.db.database.ref(this.firebaseUtils.firebaseFlagMapPath).once('value')).val()
          let countryCode = localeData.country_code2.toLowerCase()
          if (!this.flagURLsMap || !this.flagURLsMap[countryCode] || this.flagURLsMap[countryCode] != localeData.country_flag) {
            let newEntery = {}
            newEntery[countryCode] = localeData.country_flag
            this.db.database.ref(this.firebaseUtils.firebaseFlagMapPath).update(newEntery)
          }
        } catch (error) {
          console.log(error)
        }
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

  async getMapURLsMap() {
    try {
      if (!this.flagURLsMap) {
        this.flagURLsMap = (await this.db.database.ref(this.firebaseUtils.firebaseFlagMapPath).once('value')).val()
        let countryCode = this.localeData.country_code2.toLowerCase()
        if (!this.flagURLsMap[countryCode] || this.flagURLsMap[countryCode] != this.localeData.country_flag) {
          let newEntery = {}
          newEntery[countryCode] = this.localeData.country_flag
          this.db.database.ref(this.firebaseUtils.firebaseFlagMapPath).update(newEntery)
        }
      }
      console.log(this.flagURLsMap)
      return this.flagURLsMap
    } catch (error) {
      console.log(error)
      return {};
    }
  }

}

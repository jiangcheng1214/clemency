import { formatDate } from '@angular/common';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUtilsService {
  public firebaseRecentResultsPath: string;
  public firebaseResultsPath: string;
  public firebaseUUIDResultMapPath: string;

  public firebaseStandardAnswersPath: string;
  public firebaseFlagMapPath: string;
  constructor() { 
    const date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    if (isDevMode()) {
      this.firebaseRecentResultsPath = "dev/recent-results"
      this.firebaseResultsPath = "dev/iq-test-results/"+date
      this.firebaseUUIDResultMapPath = "dev/uuid-result-map"
    } else {
      this.firebaseRecentResultsPath = "prod/recent-results"
      this.firebaseResultsPath = "prod/iq-test-results/"+date
      this.firebaseUUIDResultMapPath = "prod/uuid-result-map"
    }
    this.firebaseStandardAnswersPath = 'standard-answers'
    this.firebaseFlagMapPath = 'flag-url-map'
  }
}

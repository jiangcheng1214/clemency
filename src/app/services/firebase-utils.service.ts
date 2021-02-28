import { formatDate } from '@angular/common';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUtilsService {
  public firebaseRecentResultsPath: string;
  public firebaseUUIDResultMapPath: string;

  public firebaseStandardAnswersPath: string;
  public firebaseFlagMapPath: string;
  constructor() { 
    const date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    if (isDevMode()) {
      this.firebaseRecentResultsPath = "dev/recent-test-results-by-uuid"
      this.firebaseUUIDResultMapPath = "dev/test-results-by-uuid"
    } else {
      this.firebaseRecentResultsPath = "prod/recent-test-results-by-uuid"
      this.firebaseUUIDResultMapPath = "prod/test-results-by-uuid"
    }
    this.firebaseStandardAnswersPath = 'standard-answers'
    this.firebaseFlagMapPath = 'flag-url-map'
  }
}

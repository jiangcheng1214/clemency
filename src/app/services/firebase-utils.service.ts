import { formatDate } from '@angular/common';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUtilsService {
  public firebaseRecentResultsPath: string;
  public firebaseResultsPath: string;
  constructor() { 
    const date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    if (isDevMode()) {
      this.firebaseRecentResultsPath = "dev/recent-results"
      this.firebaseResultsPath = "dev/iq-test-results/"+date
    } else {
      this.firebaseRecentResultsPath = "prod/recent-results"
      this.firebaseResultsPath = "prod/iq-test-results/"+date
    }
  }
}

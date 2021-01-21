import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-live-results',
  templateUrl: './live-results.component.html',
  styleUrls: ['./live-results.component.css']
})
export class LiveResultsComponent implements OnInit {
  lastResults: any[];

  constructor(db: AngularFireDatabase) {
    db.list("/test-results").valueChanges().subscribe(results => {
      this.lastResults = results
      console.log(this.lastResults)
    })
  }

  ngOnInit(): void {
  }

}

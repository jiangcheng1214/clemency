import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onClickButton(): void {
    console.log('onClickButton')
    // const db: admin.database.Database = admin.database();
    // const timestamp = formatDate(new Date(), "MM/dd/yyyy HH:mm:ss", "en-US");
    // db.ref("test-cron-tasks").push(timestamp);
    // console.log("This will be run every 5 minutes!");
    return null;
  }

}

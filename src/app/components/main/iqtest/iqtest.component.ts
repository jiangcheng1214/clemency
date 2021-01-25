import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iqtest',
  templateUrl: './iqtest.component.html',
  styleUrls: ['./iqtest.component.css']
})
export class IQTestComponent implements OnInit {
  testStarted:boolean;
  constructor() { }

  ngOnInit(): void {
    this.testStarted = false;
  }

  onTestStart(): void {
    console.log("start test clicked")
    this.testStarted = true;
  }

}

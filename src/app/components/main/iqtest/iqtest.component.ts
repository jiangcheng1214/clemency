import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iqtest',
  templateUrl: './iqtest.component.html',
  styleUrls: ['./iqtest.component.css']
})
export class IQTestComponent implements OnInit {
  answers: Number[];
  imageSrc: String;

  constructor() { }

  ngOnInit(): void {
    this.imageSrc = '';
    this.answers = [];
  }

  onClickStartTesting(): void {
    console.log("start test clicked")
    this.imageSrc = "static/assets/ex1.png";
  }

  onClick(num): void {
    console.log('click:', num);
    this.answers.push(num);
    console.log('answers:', this.answers);
  }

}

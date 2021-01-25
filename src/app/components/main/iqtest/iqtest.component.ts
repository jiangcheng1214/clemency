import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iqtest',
  templateUrl: './iqtest.component.html',
  styleUrls: ['./iqtest.component.css']
})
export class IQTestComponent implements OnInit {

  question_counter=0;
  isTesting=false;
  all_answers=[];

  imageSrc = '';

  constructor() { }

  ngOnInit(): void {
  }

  clickstart(){
    this.isTesting=true;
    this.imageSrc="assets/ex1.png";
  }

  onClick(num){
    console.log('click:',num);
    this.all_answers.push(num);
    console.log('all_answers:',this.all_answers);
  }


}

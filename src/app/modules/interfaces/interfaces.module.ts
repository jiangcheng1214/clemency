import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class InterfacesModule { }

export interface UserTestRecord {
  pseudonym: string
    countryCode: string
    nationality: string
    emailAddress: string
    timestamp: Date
    educationLevel: string
    studyField: string
    gender: string
    score: number
}

export interface UserRecord {
  userTestRecord: UserTestRecord,
  payment: {
    amount: number,
    description: string,
    paymentType: string,
  },
}
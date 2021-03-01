import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeDateService {

  constructor() { }

  localTimeStringFromTS(ts):string {
    const dateTime = new Date(parseInt(ts))
    return [dateTime.getMonth() + 1, dateTime.getDate()].join('/') + " " + [dateTime.getHours(), dateTime.getMinutes()].join(':')
  }

}

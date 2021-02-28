import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserTestRecord } from 'src/app/modules/interfaces/interfaces.module';
import { FirebaseUtilsService } from 'src/app/services/firebase-utils.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  userTestRecord: UserTestRecord;
  uuid: string;

  constructor(private firebaseUtils: FirebaseUtilsService, private db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.uuid = window.location.href.split('/result/').reverse()[0]
    this.db.database.ref(this.firebaseUtils.firebaseUUIDResultMapPath + "/" + this.uuid).once('value').then(result => {
      if (!result.exists()) {
        // TODO: Refund handling
        console.log("uuid " + this.uuid + " not found");
      } else {
        // TODO: handle non-paid result and provide a link to let user checkout at
        // {baseUrl}/{language}/unlock/{UUID}
        this.userTestRecord = result.val().userTestRecord;
      }
    })
  }

}

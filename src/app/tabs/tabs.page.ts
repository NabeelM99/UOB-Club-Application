
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Record } from 'src/app/services/retrieve-events.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Component, Injectable } from '@angular/core';
import { QuerySnapshot } from '@angular/fire/firestore';
import { authenticationService } from 'src/app/services/authentication.service';
import { State } from 'ionicons/dist/types/stencil-public-runtime';


export interface userData {
  name:string;
  email:string;
  password:string;
  type:string;
  events:any[];
  club_name:string;
  photoUrl:string;
  event_requests:any;
  club_requests:any;
  field:any;
  intro:any;
  clubStatus:any;
  eventStatus:any;
}
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})


export class TabsPage {
  public resulted: { [index: string]: userData[] } = {};
  selected:any;
  Search='';
  public filteredRecords:userData[]=[];
  public maps:[user:any,event: any]=[]as any;
  public newRecords: { user: userData, event: any }[] = [];
  public userId:any;
  public userData:userData[]=[]
  public waitingStudents:userData[]=[];
  public loaded:boolean=false;
  public club:boolean=false;
  public admins:boolean=false;
  public users:userData[]=[];
  public events:boolean=false;
constructor(
  public router:Router,
  public alertCtrl: AlertController,
  public nav: NavController,
  public loading: LoadingController,
  public auth:authenticationService,
  public firestore:AngularFirestore
  ) { }
  ngOnInit() {
    const sessionValue = sessionStorage.getItem('currentUser');
    console.log(sessionValue); // Output: mySessionValue
  
    if (sessionValue) {
    const userId = JSON.parse(sessionValue);
    this.userId=userId;
  }
  this.firestore.collection('users').get().toPromise()
  .then((querySnapshot) => {
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        const userData: userData = doc.data() as userData;
        this.users.push(userData);
      });
    }
  })
  .catch((error) => {
    console.error('Error retrieving users:', error);
  });
 
  this.firestore.collection('users').doc(this.userId).get().subscribe(
    (doc) => {
      if (doc.exists) {
        const user = doc.data() as userData;
        this.userData.push(user);
        console.log(this.userData);
        this.loaded=true;
        
          if(user.type === 'admin'){
            this.admins=true;
          }
       
         }
    })
}
}

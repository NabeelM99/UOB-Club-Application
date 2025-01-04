import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { AngularFirestore,DocumentReference, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { authenticationService, userData } from 'src/app/services/authentication.service';
import { Record } from 'src/app/services/retrieve-events.service';
import { RetrieveClubEventsService } from 'src/app/services/retrieve-club-events.service';
import { AddEventsPage } from '../add-events/add-events.page';
@Component({
  selector: 'app-college-events',
  templateUrl: './college-events.page.html',
  styleUrls: ['./college-events.page.scss'],
})
export class CollegeEventsPage implements OnInit {
  va: any;
  public leaders:userData[]=[];
  submitted = false;
  submitted2 = false;
  submitted3 = false;
  submitted4 = false;
  public reg:boolean=false;
  submitted5 = false;
  public clubMem:boolean=false;
  public notLeader:boolean=true;
  public edit:boolean=false;
  submitted6 = false;
  public iamleader:boolean=false;
  name = "";
  comeFromTb1:boolean=false;
  pass = "";
  public reloaded:boolean=true;
  public createdBy: string = '';
  public userId: any;
  public club: string = '';
  public college:string='';
  public sample1:any;
public file:any;
  public page:string='tabs/tab1';
  public tab1:boolean=false;
  public admins:boolean=false;
  public colleges:boolean=false;
public leader:boolean=false;
public user:userData[]=[];
public clubName:string='';
public events : Record[] = [];
public bails = []as any;
public ds={date:[]as any,time:[]as any};
public record:Record[]=[];
public theuser:userData[]=[];

public imgs={urls:[]as any};
public chess:boolean=false;
public sports:boolean=false;
public environment:boolean=false;
public photography:boolean=false;
public music:boolean=false;
public theater:boolean=false;
public fineArts:boolean=false;
public volunteering:boolean=false;
public graduates:boolean=false;
public registered:boolean=false;
public tab11:boolean=false;
public field:string='';
public loaded:boolean=false;
public load:boolean=false;
constructor(public router:Router,
  private loading: LoadingController,
  private retrieveClubEventsService: RetrieveClubEventsService,
  public auth:authenticationService,
public route:ActivatedRoute,
private afData: AngularFirestore,
private modalController: ModalController,
public alert: AlertController,
private storage: AngularFireStorage,
public firestore:AngularFirestore,
public formbuilder: FormBuilder,



) { }

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.edit = navigation.extras.state['edit'] ;
    }
    const sessionValue = sessionStorage.getItem('currentUser');
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.userId = userId;
    }
    const userDoc = await firstValueFrom(this.afData.collection('users').doc(this.userId).get());
    if (userDoc.exists) {
      const userRecord = userDoc.data() as userData;
      this.user=userRecord as unknown as userData[];
      if(userRecord.type=='leader'){
        this.edit=true;
        this.iamleader=true;
        this.leader=true;
        this.registered=true;
        this.theuser = [userRecord];
      }
      const field=userRecord.field;
      const firstTwoLetters = field.substring(0, field.indexOf('-'));
      this.field=firstTwoLetters;
      if(firstTwoLetters=='ee'){
        this.college='Engineering';

      }if(firstTwoLetters=='bu'){
        this.college='Business';

      }if(firstTwoLetters=='it'){
        this.college='Information Technology';
      }
      this.clubName=firstTwoLetters;
  }
  const collectionName =this.clubName;
  this.retrieveClubEventsService.getAllRecordsFromCollections(collectionName).then(async ()=>{
    this.events=this.retrieveClubEventsService.records;
    this.ds=this.retrieveClubEventsService.ds;
    
    for (const ev of this.events) {
      let foundEventRef: DocumentReference<any>;
        const querySnapshot = await this.firestore.collection(collectionName).ref.where('name', '==', ev.name).get();
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            foundEventRef = doc.ref;
          });
          ; // Stop searching other collections once a match is found
        }
      
      const doc = await firstValueFrom(this.firestore.collection('users').doc(this.userId).get());
      if (doc.exists) {
        const user = doc.data() as userData;
        const eventExists = user.events.some((eventRef: DocumentReference<Record>) => {
          return eventRef.path === foundEventRef.path;
        });
        console.log(eventExists);
        if (!eventExists) {
          console.log(this.bails);
          this.bails.push(false);
        } else {
          console.log(this.bails);
          this.bails.push(true);
        }
      }
    }
  })
  this.loaded=true;
}
 
  async showMembers() {
    console.log(this.clubName);
    this.clubMem=true;
    this.colleges=true;
    this.router.navigate(['show-members'], { state: {field:this.field,colleges:this.colleges,clubMem: this.clubMem ,clubName:this.clubName,TB1:this.comeFromTb1}});
  }
goBck(){
  this.router.navigate(['tabs/tab1'], {});
}

  async manageClub() {
    if (this.theuser && this.theuser.length > 0) {
      this.leader=true;
      const data = this.theuser[0];
      this.edit=true;
    await  this.router.navigateByUrl('college-manage'), {state:{edit:this.edit}};
}
    }
    goToDetails(record: Record,i:number) {
      this.tab11=true;
      this.colleges=true;
      this.router.navigate(['event-details'], { state: {edit:this.edit,iamleader:this.iamleader,colleges:this.colleges, record, bail: this.bails[i],leader:this.leader,tab11:this.tab11 } });
    }
    async openModal(){
      const modal = await this.modalController.create({
        component:AddEventsPage,
        backdropDismiss:false
      });
      return await modal.present();
    }
    
    
    close(){
      this.modalController.dismiss();
    }
    
}
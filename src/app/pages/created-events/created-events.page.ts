import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { authenticationService, userData } from 'src/app/services/authentication.service';
import { Record, RetrieveEventsService } from 'src/app/services/retrieve-events.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
@Component({
  selector: 'app-created-events',
  templateUrl: './created-events.page.html',
  styleUrls: ['./created-events.page.scss'],
})
export class CreatedEventsPage implements OnInit {
  public comeFromCreated:boolean=false;
  public reloaded: boolean = true;
  public clubName: string = '';
  public userId: any;
  public isOld=[]as boolean[];
  public page: string = 'created-events';
  public filteredRecords=[] as Record[];
  public all:boolean=false;
  public new:boolean=false;
  public old:boolean=false;
  public rall:boolean=false;
  public rnew:boolean=false;
  public rold:boolean=false;
  public Record: Record[] = [];
  public oldRecord: Record[] = [];
  public newRecord: Record[] = [];
  display:boolean=false;
  public ds={date:[]as any,time:[]as any};
  but:boolean=false;
  public idd:any;
  Search:string='';
  public selected:string='';
  display2:boolean=false;
  public show:string='card';
  public x:string='reorder-two-outline';
  public y:string='albums-outline';
  public show2:string='item';
  public leader:boolean=false;
  constructor(
    public alertCtrl: AlertController,
    public auth: authenticationService,
    public nav: NavController,
    public fire: authenticationService,
    private modalController: ModalController,
    public alert: AlertController,
    private loading: LoadingController,
    private storage: AngularFireStorage,
    private afData:AngularFirestore,
    public router: Router,
    public firestore:AngularFirestore,
    public retrieve:RetrieveEventsService,
  ) { }

  ngOnInit() {
    this.auth.checkUserAuthentication(this.page);
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.rnew = navigation.extras.state['rnew'] ;
      this.rold = navigation.extras.state['rold'] ;
      this.rall = navigation.extras.state['rall'] ;
    }
    const sessionValue = sessionStorage.getItem('currentUser');
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.userId = userId;
      if(this.rnew==true){this.newGen();}
      if(this.rold==true){this.oldGen();}
      if(this.rall==true){this.allGen();}
      if(this.rall==false&&this.rnew==false&&this.rold==false){
      this.newGen();
      }
    }
  }
  
  async allGen() {
    this.all=true;
    this.old=false;
    this.new=false;
    const newRecords: Record[] = [];
    const currentDate = new Date();
    this.isOld = [];
  
    try {
      const docSnapshot = await this.firestore.collection('users').doc(this.userId).get().toPromise();

      if (docSnapshot && docSnapshot.exists) { // Add a null check for docSnapshot
        const data = docSnapshot.data() as userData;
        this.clubName = data.club_name;
        this.leader = data.type === 'leader';
      }
  
      if (this.clubName) {
        const collectionRef = this.afData.collection<Record>(this.clubName).ref.where('createdBy', '==', this.userId);
        const snapshot = await collectionRef.get();
  
        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const record = doc.data() as Record;
          newRecords.push(record);
        });
  
        const sortedEvents = newRecords.map(ev => {
          const time = ev.date as firebase.firestore.Timestamp;
          const date = time.toDate();
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const seconds = date.getSeconds();
          const formattedDate = `${year}-${month}-${day}`;
          const formattedTime = `${hours}:${minutes}:${seconds}`;
          return {
            ev,
            date,
            formattedDate,
            formattedTime
          };
        });
  
        sortedEvents.sort((a, b) => {
          if (a.date.getTime() === b.date.getTime()) {
            // If the dates are the same, compare the times
            return a.formattedTime.localeCompare(b.formattedTime);
          } else {
            return a.date.getTime() - b.date.getTime();
          }
        });
  
        this.Record = sortedEvents.map(event => event.ev);
        this.ds.date = sortedEvents.map(event => event.formattedDate);
        this.ds.time = sortedEvents.map(event => event.formattedTime);
        this.Record = this.Record.reverse();
        this.ds.date.reverse();
        this.ds.time.reverse();
  
        this.ds.date.forEach((formattedDate: string) => {
          const date = new Date(formattedDate);
  
          if (date < currentDate) {
            this.isOld.push(true);
          } else {
            this.isOld.push(false);
          }
        });
      }
  
      this.init();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  
  goBack() {
    this.router.navigateByUrl('tabs/tab2');
  }
  goBck(){
    this.router.navigateByUrl('tabs/tab2');

  }
  
  init() {
    this.filteredRecords = this.Record;
  }
  async oldGen() {
    this.all=false;
    this.old=true;
    this.new=false;
    const newRecords: Record[] = [];
    const currentDate = new Date();
    this.isOld = [];
  
    try {
      const docSnapshot = await this.firestore.collection('users').doc(this.userId).get().toPromise();
  
      if (docSnapshot && docSnapshot.exists) {
        const data = docSnapshot.data() as userData;
        this.clubName = data.club_name;
        if (data.type == 'leader') {
          this.leader = true;
        }
        const collection = this.clubName;
      }
  
      const collectionRef = this.afData.collection<Record>(this.clubName).ref.where('createdBy', '==', this.userId);
      const snapshot = await collectionRef.get();
  
      if (snapshot) {
        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const record = doc.data() as Record;
  
          if (record.date.toDate() < currentDate) {
            newRecords.push(record);
          }
        });
      }
  
      const sortedEvents = newRecords.map(ev => {
        const time = ev.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return {
          ev,
          date,
          formattedDate,
          formattedTime
        };
      });
  
      sortedEvents.sort((a, b) => {
        if (a.date.getTime() === b.date.getTime()) {
          return a.formattedTime.localeCompare(b.formattedTime);
        } else {
          return a.date.getTime() - b.date.getTime();
        }
      });
  
      this.oldRecord = sortedEvents.map(event => event.ev);
      this.ds.date = sortedEvents.map(event => event.formattedDate);
      this.ds.time = sortedEvents.map(event => event.formattedTime);
      this.oldRecord = this.oldRecord.reverse();
      this.initOld();
      this.ds.date.reverse();
      this.ds.time.reverse();
  
      this.isOld = [];
      this.ds.date.forEach((formattedDate: string) => {
        const date = new Date(formattedDate);
        if (date < currentDate) {
          this.isOld.push(true);
        } else {
          this.isOld.push(false);
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  
  initOld() {
    this.filteredRecords = this.oldRecord;
  }
  
  async newGen() {
    this.all=false;
    this.old=false;
    this.new=true;
    const newRecords: Record[] = [];
    const currentDate = new Date();
    this.isOld = [];
  
    try {
      const docSnapshot = await this.firestore.collection('users').doc(this.userId).get().toPromise();
  
      if (docSnapshot && docSnapshot.exists) {
        const data = docSnapshot.data() as userData;
        this.clubName = data.club_name;
        if (data.type == 'leader') {
          this.leader = true;
        }
        const collection = this.clubName;
      }
  
      const collectionRef = this.afData.collection<Record>(this.clubName).ref.where('createdBy', '==', this.userId);
      const snapshot = await collectionRef.get();
  
      if (snapshot) {
        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const record = doc.data() as Record;
  
          if (record.date.toDate() > currentDate) {
            newRecords.push(record);
          }
        });
      }
  
      const sortedEvents = newRecords.map(ev => {
        const time = ev.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return {
          ev,
          date,
          formattedDate,
          formattedTime
        };
      });
  
      sortedEvents.sort((a, b) => {
        if (a.date.getTime() === b.date.getTime()) {
          return a.formattedTime.localeCompare(b.formattedTime);
        } else {
          return a.date.getTime() - b.date.getTime();
        }
      });
  
      this.newRecord = sortedEvents.map(event => event.ev);
      this.ds.date = sortedEvents.map(event => event.formattedDate);
      this.ds.time = sortedEvents.map(event => event.formattedTime);
      this.newRecord = this.newRecord.reverse();
      this.initNew();
      this.ds.date.reverse();
      this.ds.time.reverse();
  
      this.isOld = [];
      this.ds.date.forEach((formattedDate: string) => {
        const date = new Date(formattedDate);
        if (date < currentDate) {
          this.isOld.push(true);
        } else {
          this.isOld.push(false);
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  
  initNew() {
    this.filteredRecords = this.newRecord;
  }
  changeDisplay(){
    this.display=!this.display;
    this.but=!this.but;
  }

  goToDetails(record: Record, i: number) {
    console.log(i);
    const currentDate = new Date();
    const clickedDate = record.date.toDate();
    if (clickedDate < currentDate) {
      this.comeFromCreated=true;
      this.router.navigate(['my-event-details'], { state: { record ,created:this.comeFromCreated} });
    } else {
      this.comeFromCreated=true;
      this.router.navigate(['event-details'], { state: { record,leader:this.leader,created:this.comeFromCreated ,new:this.new,old:this.old,all:this.all} });
    }
  }

  checks(){
    this.init();
    if (this.selected==''){this.searchAll();}
    if (this.selected=='all'){this.searchAll();}
    if (this.selected=='name'){this.searchName();}
    if (this.selected=='club-name'){this.searchClubName();}
    if (this.selected=='date'){this.searchDate();}
  }

  searchName(){
    this.init();
    let val=this.Search;
    if(val && val.trim()!=""){
      this.filteredRecords=this.filteredRecords.filter((item)=>{
        return (item.name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
      });
      this.ds = { date: [], time: [] }; // Clear the ds array
  
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}`; // Format the date in YYYY-MM-DD format
        const formattedTime = `${hours}:${minutes}:${seconds}`; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      });
    } else {
      // Reset the ds array to its original values
      this.ds = { date: [], time: [] }; // Clear the ds array
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}`; // Format the date in YYYY-MM-DD format
        const formattedTime = `${hours}:${minutes}:${seconds}`; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);})
    }
  }
  searchClubName(){
    this.init();
    let val=this.Search;
    if(val && val.trim()!=""){
      this.filteredRecords=this.filteredRecords.filter((item)=>{
        return (item.club_name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
      });
      this.ds = { date: [], time: [] }; // Clear the ds array
  
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}`; // Format the date in YYYY-MM-DD format
        const formattedTime = `${hours}:${minutes}:${seconds}`; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      });
    } else {
      // Reset the ds array to its original values
      this.ds = { date: [], time: [] }; // Clear the ds array
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}`; // Format the date in YYYY-MM-DD format
        const formattedTime = `${hours}:${minutes}:${seconds}`; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);})
    
    }
  }
  searchDate() {
    this.init();
    const val = this.Search;
    if (val && val.trim() !== '') {
      this.filteredRecords = this.filteredRecords.filter((item) => {
        let itemDate: Date;
        if (item.date instanceof firebase.firestore.Timestamp) {
          itemDate = item.date.toDate(); // Convert Timestamp to Date
        } else {
          itemDate = new Date(item.date); // Create Date object from other date representations
        }
        const formattedItemDate = itemDate.toLocaleDateString(); // Format the Date as needed
        return (
          formattedItemDate.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) > -1
        );
      });
      this.ds = { date: [], time: [] }; // Clear the ds array
  
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}`; // Format the date in YYYY-MM-DD format
        const formattedTime = `${hours}:${minutes}:${seconds}`; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      });
    } else {
      // Reset the ds array to its original values
      this.ds = { date: [], time: [] }; // Clear the ds array
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}`; // Format the date in YYYY-MM-DD format
        const formattedTime = `${hours}:${minutes}:${seconds}`; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);})
    
    }
  }
  searchAll() {
    this.init();
    const val = this.Search;
    if (val && val.trim() !== '') {
      this.filteredRecords = this.filteredRecords.filter((item) => {
        let itemDate: Date;
        if (item.date instanceof firebase.firestore.Timestamp) {
          itemDate = item.date.toDate(); // Convert Timestamp to Date
        } else {
          itemDate = new Date(item.date); // Create Date object from other date representations
        }
        const formattedItemDate = itemDate.toLocaleDateString(); // Format the Date as needed
        return (
          item.name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) > -1 ||
          item.club_name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) > -1 ||
          formattedItemDate.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) > -1
        );
      });
      this.ds = { date: [], time: [] }; // Clear the ds array
  
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}`; // Format the date in YYYY-MM-DD format
        const formattedTime = `${hours}:${minutes}:${seconds}`; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      });
    } else {
      // Reset the ds array to its original values
      this.ds = { date: [], time: [] }; // Clear the ds array
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${year}-${month}-${day}`; // Format the date in YYYY-MM-DD format
        const formattedTime = `${hours}:${minutes}:${seconds}`; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);})
    
    }
  }
}
 

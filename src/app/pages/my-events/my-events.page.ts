import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Record } from 'src/app/services/retrieve-events.service';
import { userData } from 'src/app/tabs/tabs.page';
import { AlertController, LoadingController } from '@ionic/angular';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Injectable } from '@angular/core';
import { QuerySnapshot } from '@angular/fire/firestore';
import { authenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {

  public page:string='my-events';
  public user: userData[]=[];
  public record: Record[]=[];
  Record: Record[] = [];
  public show:string='card';
  public show2:string='item';
  public x:string='reorder-two-outline';
  public y:string='albums-outline';
  display:boolean=false;
  display2:boolean=false;
  but:boolean=false;
  Search:string='';
  query:string='';
  feed:string='';
  public isOld=[]as boolean[];
  displayedCount:number=0;
  public starsNum:number=0;
  counts:number=0;
  public selected:string='';
  public showz:boolean=false;
  public filteredRecords=[] as Record[];
  public dates:any='';
  public oldEvents=[] as Record[];
  public newEvents=[] as Record[];
  public ds={date:[]as any,time:[]as any,id:[]as any};
  public os={date:[]as any,time:[]as any,id:[]as any};
  public first:boolean=true;
  public second:boolean=false;
  public third:boolean=false;
  public seccond:boolean=false;
  public thirrd:boolean=false;
  public userId:any;
  public bail:boolean=true;
  public comeFromMyEventsOld:boolean=false;
  public rated:boolean=false;
  public comeFromMyEventsNew:boolean=false;
  public comeFromMyEventsAll:boolean=false;
  public oldDetails:boolean=false;
  public newDetails:boolean=false;
  public allDetails:boolean=false;
  
    constructor(
      public router:Router,
      public alertCtrl: AlertController,
      public nav: NavController,
      public loading: LoadingController,
      public auth:authenticationService,
      public firestore:AngularFirestore
    )
    {}
    ngOnInit() {
      const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.allDetails = navigation.extras.state['allDetails'];
      this.oldDetails = navigation.extras.state['comefromold'];
      this.newDetails = navigation.extras.state['newDetails'];
      this.rated = navigation.extras.state['rated'];
    }
      this.ds = { date: [], time: [],id:[] }; // Clear the ds array
      this.auth.checkUserAuthentication(this.page);
      if(this.rated==true){
        this.oldDetails=true;
      }
      const sessionValue = sessionStorage.getItem('currentUser');
      console.log(sessionValue); // Output: mySessionValue
      if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.userId=userId;
      console.log(userId); // Output: userId
      if(this.newDetails==true){
        this.newGen();
        this.initNew();}
      if(this.oldDetails==true){     
        this.oldGen();
        this.initOld();}
      if(this.allDetails==true){
        this.allGen();
        this.init();}
        if(this.oldDetails==false && this.newDetails==false&&this.allDetails==false){
          this.newGen();
          this.initNew();
        }

  } else {
    console.log('User ID not found in session');
  }
  
  }
  logOut() {
    this.auth.logOut();
  }

  changeDisplay(){
    this.display=!this.display;
    this.but=!this.but;
  }
 goToDetailss(record: Record) {
  const currentDate = new Date();
  const clickedDate = record.date.toDate();

  if (clickedDate < currentDate) {
    this.router.navigate(['my-event-details'], { state: { record } });
  } else {
    this.router.navigate(['event-details'], { state: { record, bail: this.bail,comeFromMyEventsOld:this.comeFromMyEventsOld,comeFromMyEventsNew:this.comeFromMyEventsNew,comeFromMyEventsAll:this.comeFromMyEventsAll} });
  }
}
goBck(){
  this.router.navigate(['tabs/tab2'], { });

}
  allGen(){
    this.comeFromMyEventsAll=true;
    this.comeFromMyEventsNew=false;
    this.comeFromMyEventsOld=false;
    this.ds = { date: [], time: [],id:[] }; // Clear the ds array
    const sessionValue = sessionStorage.getItem('currentUser');
    console.log(sessionValue); // Output: mySessionValue
    if (sessionValue) {
    const userId = JSON.parse(sessionValue);
    console.log(userId); // Output: userId
    this.first=true;
    this.second=false;
    this.third=false;
    this.getUserByIdAll(userId);
    this.init();
  }
  }
  
    getUserByIdAll(userId: string) {
      this.user = [];
      this.record = [];
      this.oldEvents = [];
      this.newEvents = [];
      this.isOld=[];
      this.firestore.collection('users').doc(userId).get().subscribe(
        (doc) => {
          if (doc.exists) {
            const user = doc.data() as userData;
            this.user.push(user);
            const eventsPromises = user.events.map((eventRef: DocumentReference<Record>) => {
              return eventRef.get();
            });
    
            Promise.all(eventsPromises).then(eventDocs => {
              const sortedEvents = eventDocs.map(eventDoc => {
                const event = eventDoc.data() as Record;
                const time = event.date as firebase.firestore.Timestamp;
                const date = time.toDate();
                const currentDate = new Date();
               
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();
                const formattedDate = `${year}-${month}-${day}`;
                const formattedTime = `${hours}:${minutes}:${seconds}`;
                return {
                  event,
                  date,
                  formattedDate,
                  formattedTime,
                  eventId: eventDoc.id
                };
                
              });
    
              // Sort the events based on date and time in ascending order
              sortedEvents.sort((a, b) => {
                if (a.date.getTime() === b.date.getTime()) {
                  // If the dates are the same, compare the times
                  return a.formattedTime.localeCompare(b.formattedTime);
                } else {
                  return a.date.getTime() - b.date.getTime();
                }
              });
    
              this.ds.date = sortedEvents.map(event => event.formattedDate);
              this.ds.time = sortedEvents.map(event => event.formattedTime);
              this.ds.id = sortedEvents.map(event => event.eventId);
              this.record = sortedEvents.map(event => event.event);
              // Display the sorted arrays
              const currentDate = new Date();
              this.record.reverse(); //
              console.log(this.record);
              this.ds.date.reverse();
              console.log(this.ds.date);
              this.ds.time.reverse();
              console.log(this.ds.time);
              console.log(this.ds.id);
              this.ds.date.forEach((formattedDate: string)=>{
                const date = new Date(formattedDate);
                  console.log(currentDate)                
                  if(date<currentDate){
                    this.isOld.push(true);
                  }else{
                    this.isOld.push(false);
                  }
                  console.log(this.isOld)
                })
              this.init();

          
    
            }).catch(error => {
              console.error('Error retrieving events:', error);
            });
          } else {
            console.log('User document not found');
          }
        },
        (error) => {
          console.log('Error getting user document:', error);
        }
      );
    }
    init(){
      this.filteredRecords=this.record;
    }
    oldGen() {
      this.comeFromMyEventsOld=true;
      this.comeFromMyEventsAll=false;
      this.comeFromMyEventsNew=false;
      this.seccond = true;
      this.ds = { date: [], time: [], id: [] }; // Clear the ds array
      const sessionValue = sessionStorage.getItem('currentUser');
      console.log(sessionValue); // Output: mySessionValue
      if (sessionValue) {
        const userId = JSON.parse(sessionValue);
        this.second = true;
        this.first = false;
        this.third = false;
        this.getUserByIdOld(userId);
        this.initOld();
      }
    }
    
    getUserByIdOld(userId: string) {
      this.user = [];
      this.record = [];
      this.oldEvents = [];
      this.newEvents = [];
      this.isOld=[];
      this.firestore.collection('users').doc(userId).get().subscribe(
        (doc) => {
          if (doc.exists) {
            const user = doc.data() as userData;
            this.user.push(user);
            const eventsPromises = user.events.map((eventRef: DocumentReference<Record>) => {
              return eventRef.get();
            });
    
            Promise.all(eventsPromises).then(eventDocs => {
              const sortedEvents = eventDocs.map(eventDoc => {
                const event = eventDoc.data() as Record;
                const time = event.date as firebase.firestore.Timestamp;
                const date = time.toDate();
                const currentDate = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();
                const formattedDate = `${year}-${month}-${day}`;
                const formattedTime = `${hours}:${minutes}:${seconds}`;
                return {
                  event,
                  date,
                  formattedDate,
                  formattedTime,
                  eventId: eventDoc.id
                };
                
              });
    
              // Sort the events based on date and time in ascending order
              sortedEvents.sort((a, b) => {
                if (a.date.getTime() === b.date.getTime()) {
                  // If the dates are the same, compare the times
                  return a.formattedTime.localeCompare(b.formattedTime);
                } else {
                  return a.date.getTime() - b.date.getTime();
                }
              });
    
              this.ds.date = sortedEvents
              .filter(event => event.date < new Date()) // Filter events that are older than the current date
              .map(event => event.formattedDate);
              this.ds.time = sortedEvents.filter(event => event.date < new Date()) .map(event => event.formattedTime);
              this.ds.id = sortedEvents.map(event => event.eventId);
              this.oldEvents = sortedEvents.map(event => event.event);
              // Display the sorted arrays
              const currentDate = new Date();
              this.oldEvents=this.oldEvents.filter(event => event.date.toDate() < currentDate);
              this.oldEvents.reverse(); //
              console.log(this.oldEvents);
              this.ds.date.reverse();
              console.log(this.ds.date);
              this.ds.time.reverse();
              console.log(this.ds.time);
              console.log(this.ds.id);
              this.ds.date.forEach((formattedDate: string)=>{
              const date = new Date(formattedDate);
                console.log(currentDate)                
                if(date<currentDate){
                  this.isOld.push(true);
                }else{
                  this.isOld.push(false);
                }
                console.log(this.isOld)

              })
              this.initOld();

            }).catch(error => {
              console.error('Error retrieving events:', error);
            });
          } else {
            console.log('User document not found');
          }
        },
        (error) => {
          console.log('Error getting user document:', error);
        }
      );
    }
    
    formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
      const day = date.getDate();
      return `${year}-${month}-${day}`; // Format the date in YYYY-MM-DD format
    }
    
    formatTime(date: Date): string {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return `${hours}:${minutes}:${seconds}`; // Format the time in HH:MM:SS format
    }
    initOld() {
      this.filteredRecords = this.oldEvents;
      console.log(this.filteredRecords);
    }
    newGen() {
      this.comeFromMyEventsNew=true;
      this.comeFromMyEventsOld=false;
      this.comeFromMyEventsAll=false;
      this.seccond = false;
      this.ds = { date: [], time: [], id: [] }; // Clear the ds array
      const sessionValue = sessionStorage.getItem('currentUser');
      console.log(sessionValue); // Output: mySessionValue
      if (sessionValue) {
        const userId = JSON.parse(sessionValue);
        this.second = false;
        this.first = false;
        this.third = true;
        this.getUserByIdNew(userId);
        this.initNew();
      }
    }
    
    getUserByIdNew(userId: string) {
      this.user = [];
      this.record = [];
      this.oldEvents = [];
      this.newEvents = [];
    
      this.firestore.collection('users').doc(userId).get().subscribe(
        (doc) => {
          if (doc.exists) {
            const user = doc.data() as userData;
            this.user.push(user);
            const eventsPromises = user.events.map((eventRef: DocumentReference<Record>) => {
              return eventRef.get();
            });
    
            Promise.all(eventsPromises).then(eventDocs => {
              const sortedEvents = eventDocs.map(eventDoc => {
                const event = eventDoc.data() as Record;
                console.log(event);
                const time = event.date as firebase.firestore.Timestamp;
                const date = time.toDate();
                const currentDate = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();
                const formattedDate = `${year}-${month}-${day}`;
                const formattedTime = `${hours}:${minutes}:${seconds}`;
                return {
                  event,
                  date,
                  formattedDate,
                  formattedTime,
                  eventId: eventDoc.id
                };
                
              });
    
              // Sort the events based on date and time in ascending order
              sortedEvents.sort((a, b) => {
                if (a.date.getTime() === b.date.getTime()) {
                  // If the dates are the same, compare the times
                  return a.formattedTime.localeCompare(b.formattedTime);
                } else {
                  return a.date.getTime() - b.date.getTime();
                }
              });
    
              this.ds.date = sortedEvents
              .filter(event => event.date > new Date()) // Filter events that are older than the current date
              .map(event => event.formattedDate);
              this.ds.time = sortedEvents.filter(event => event.date > new Date()) .map(event => event.formattedTime);
              this.ds.id = sortedEvents.map(event => event.eventId);
              this.newEvents = sortedEvents.map(event => event.event);
              // Display the sorted arrays
              const currentDate = new Date();
              this.newEvents=this.newEvents.filter(event => event.date.toDate() > currentDate);
              this.newEvents.reverse(); //
              console.log(this.newEvents);
              this.ds.date.reverse();
              console.log(this.ds.date);
              this.ds.time.reverse();
              console.log(this.ds.time);
              console.log(this.ds.id);
              this.ds.date.forEach((formattedDate: string)=>{
                const date = new Date(formattedDate);
                  console.log(currentDate)                
                  if(date<currentDate){
                    this.isOld.push(true);
                  }else{
                    this.isOld.push(false);
                  }
                  console.log(this.isOld)
                });
              this.initNew();


            }).catch(error => {
              console.error('Error retrieving events:', error);
            });
          } else {
            console.log('User document not found');
          }
        },
        (error) => {
          console.log('Error getting user document:', error);
        }
      );
    }
    initNew() {
      this.filteredRecords = this.newEvents;
    }
    goBack(){
    
      this.nav.navigateBack('tabs/tab2');
    
    }
    checks(){
      if (!this.second) {
        this.init();
      }
      if (!this.first) {
        this.initOld();
      }
      if (!this.first && !this.second) {
        this.initNew();
      }
      if (this.selected==''){this.searchAll();}
      if (this.selected=='all'){this.searchAll();}
      if (this.selected=='name'){this.searchName();}
      if (this.selected=='club-name'){this.searchClubName();}
      if (this.selected=='date'){this.searchDate();}
    }
  
    searchName() {
      this.os=this.ds;
      if (!this.second) {
        this.init();
      }
      if (!this.first) {
        this.initOld();
      }
      if (!this.first && !this.second) {
        this.initNew();
      }
      let val = this.Search;
      if (val && val.trim() != "") {
        this.filteredRecords = this.filteredRecords.filter((item) => {
          return (
            item.name.toLowerCase().indexOf(val.toLowerCase()) > -1
          );
        });
    
        this.ds = { date: [], time: [] ,id:[]}; // Clear the ds array
    
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
        this.ds = { date: [], time: [],id:[] }; // Clear the ds array
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
      this.os=this.ds;
      if (!this.second) {
        this.init();
      }
      if (!this.first) {
        this.initOld();
      }
      if (!this.first && !this.second) {
        this.initNew();
      } 
         let val=this.Search;
      if(val && val.trim()!=""){
        this.filteredRecords=this.filteredRecords.filter((item)=>{
          return (item.club_name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
        });
        this.ds = { date: [], time: [] ,id:[]}; // Clear the ds array
    
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
        this.ds = { date: [], time: [] ,id:[]}; // Clear the ds array
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
      if (!this.second) {
        this.init();
      }
      if (!this.first) {
        this.initOld();
      }
      if (!this.first && !this.second) {
        this.initNew();
      }
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
        
        this.ds = { date: [], time: [],id:[] }; // Clear the ds array
    
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
        this.ds = { date: [], time: [],id:[] }; // Clear the ds array
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
      if (!this.second) {
        this.init();
      }
      if (!this.first) {
        this.initOld();
      }
      if (!this.first && !this.second) {
        this.initNew();
      }
   
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
        
        this.ds = { date: [], time: [],id:[] }; // Clear the ds array
    
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
        this.ds = { date: [], time: [],id:[] }; // Clear the ds array
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
  
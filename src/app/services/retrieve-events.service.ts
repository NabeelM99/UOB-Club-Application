import { Injectable } from '@angular/core';
import { AngularFirestore, QueryDocumentSnapshot, DocumentData, Reference } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { firstValueFrom } from 'rxjs';

type rate<K extends string | number | symbol, T> = { [P in K]: T };

export interface Record {
  overview:string;
  feedbacks:any[];
  type:string;
  createdBy:any;
  name: string;
  club_name: string;
  date: firebase.firestore.Timestamp;
  photoUrl: string;
  location: string;
  rating: rate<'zero' | 'one' | 'two' | 'three' | 'four', number>;
}

@Injectable({
  providedIn: 'root'
})
export class RetrieveEventsService {
  records: Record[] = [];
  public isOld=[]as boolean[];
  public ds = {
    date: [] as string[],
    time: [] as string[],
    id: [] as any[]
  };
  public bails = {
    yes: [] as any
  };
  public idd: any;

  constructor(private afData: AngularFirestore) {}

  async getAllRecordsFromCollections(collections: string[]): Promise<void> {
    const newRecords: Record[] = [];
    const currentDate = new Date();
    const sessionValue = sessionStorage.getItem('currentUser');
    console.log(sessionValue); // Output: mySessionValue
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.idd = userId;
    }

      for (const collectionName of collections) {
        const collectionRef = this.afData.collection<Record>(collectionName);
        const snapshot = await collectionRef.get().toPromise();
      if (snapshot){
        snapshot.docs.forEach(async (doc: QueryDocumentSnapshot<DocumentData>) => {
          const record = doc.data() as Record;
      
          if (record.date.toDate() > currentDate) {
            newRecords.push(record);
          }
        });
      }
      }const sortedEvents = newRecords.map(ev => {
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

    this.records = sortedEvents.map(event => event.ev);
    this.ds.date = sortedEvents.map(event => event.formattedDate);
    this.ds.time = sortedEvents.map(event => event.formattedTime);
    this.records=this.records.reverse();
    this.ds.date.reverse();
    this.ds.time.reverse();
    // Display the sorted arrays
    console.log(this.ds.date);
    console.log(this.ds.time);
    console.log(this.ds.id);
  }
    
  async getAllRecordsFromCollectionsCreatedOld(collection: string): Promise<void> {
    const newRecords: Record[] = [];
    const currentDate = new Date();
    this.isOld = [];
    const sessionValue = sessionStorage.getItem('currentUser');
    console.log(sessionValue); // Output: mySessionValue
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.idd = userId;
    }
    const collectionRef = this.afData.collection<Record>(collection).ref.where('createdBy', '==', this.idd);
    const snapshot = await collectionRef.get().then((snapshot) => {
      if (snapshot) {
        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const record = doc.data() as Record;
  
          if (record.date.toDate() < currentDate) { // Compare with less than operator to retrieve old events
            newRecords.push(record);
          }
        });
      }
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

    this.records = sortedEvents.map(event => event.ev);
    this.ds.date = sortedEvents.map(event => event.formattedDate);
    this.ds.time = sortedEvents.map(event => event.formattedTime);
    this.records=this.records.reverse();
    this.ds.date.reverse();
    this.ds.time.reverse();
    // Display the sorted arrays
    console.log(this.ds.date);
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
  }
  


  async getAllRecordsFromCollectionsCreatedNew(collection: string): Promise<void> {
    const newRecords: Record[] = [];
    const currentDate = new Date();
    this.isOld = [];
    const sessionValue = sessionStorage.getItem('currentUser');
    console.log(sessionValue); // Output: mySessionValue
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.idd = userId;
    }
    const collectionRef = this.afData.collection<Record>(collection).ref.where('createdBy', '==', this.idd);
    const snapshot = await collectionRef.get().then((snapshot) => {
      if (snapshot) {
        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const record = doc.data() as Record;
  
          if (record.date.toDate() > currentDate) { // Compare with less than operator to retrieve old events
            newRecords.push(record);
          }
        });
      }
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

    this.records = sortedEvents.map(event => event.ev);
    this.ds.date = sortedEvents.map(event => event.formattedDate);
    this.ds.time = sortedEvents.map(event => event.formattedTime);
    this.records=this.records.reverse();
    this.ds.date.reverse();
    this.ds.time.reverse();
    // Display the sorted arrays
    console.log(this.ds.date);
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
  }
  async getAllRecordsFromCollectionsCreatedAll(collection: string): Promise<void> {
    const newRecords: Record[] = [];
    const currentDate = new Date();
    this.isOld = [];
    const sessionValue = sessionStorage.getItem('currentUser');
    console.log(sessionValue); // Output: mySessionValue
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.idd = userId;
    }
    const collectionRef = this.afData.collection<Record>(collection).ref.where('createdBy', '==', this.idd);
    const snapshot = await collectionRef.get().then((snapshot) => {
      if (snapshot) {
        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const record = doc.data() as Record;
  
            newRecords.push(record);
          
        });
      }
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

    this.records = sortedEvents.map(event => event.ev);
    this.ds.date = sortedEvents.map(event => event.formattedDate);
    this.ds.time = sortedEvents.map(event => event.formattedTime);
    this.records=this.records.reverse();
    this.ds.date.reverse();
    this.ds.time.reverse();
    // Display the sorted arrays
    console.log(this.ds.date);
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
  }
}

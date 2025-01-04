import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentData, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

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
export class RetrieveClubEventsService {
  records: Record[] = [];
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
 getRecords(cc:any){

 }
  async getAllRecordsFromCollections(collections: string): Promise<void> {
    const newRecords: Record[] = [];
    const currentDate = new Date();
    const sessionValue = sessionStorage.getItem('currentUser');
    console.log(sessionValue); // Output: mySessionValue
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.idd = userId;
    }

      
        const collectionRef = this.afData.collection<Record>(collections);
        const snapshot = await collectionRef.get().toPromise();
      if(snapshot){
        snapshot.docs.forEach(async (doc: QueryDocumentSnapshot<DocumentData>) => {
          const record = doc.data() as Record;
      
          if (record.date.toDate() > currentDate) {
            newRecords.push(record);
          }
        });}
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
    console.log(this.records);
  }
    
}

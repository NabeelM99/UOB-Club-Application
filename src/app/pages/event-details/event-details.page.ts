import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Record } from 'src/app/services/retrieve-events.service';
import { userData } from 'src/app/services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, first, from } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Injectable } from '@angular/core';
import { QuerySnapshot } from '@angular/fire/firestore';
import { authenticationService } from 'src/app/services/authentication.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EditEventPage } from '../edit-event/edit-event.page';
import { doc } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss']
})
export class EventDetailsPage implements OnInit {
  public page:string='event-details';

  record: Record | any;
  public documentId: string = '';
  public clubName: any = '';
  public eventType:string='';
  public ds = { date: []as any, time: []as any };
  public isLeader:boolean=false;
public bails:boolean=false;
public comeFromMyEventsOld:boolean=false;
public comeFromMyEventsNew:boolean=false;
public club:string='';
public comeFromMyEventsAll:boolean=false;
public oldDetails:boolean=false;
public newDetails:boolean=false;
public allDetails:boolean=false;
public new:boolean=false;
public old:boolean=false;
public all:boolean=false;
public tab2:boolean=false;
public chess:boolean=false;
public sports:boolean=false;
public fine:boolean=false;
public music:boolean=false;
public volu:boolean=false;
public envi:boolean=false;
public grad:boolean=false;
public thea:boolean=false;
public photo:boolean=false;
public loaded:boolean=false;
public registered:boolean=false;
public tab1:boolean[]=[];
public tab11:boolean=false;;
public user:userData[]=[];
public userId:any;
public docId:any;
public clubMem:boolean=false;
public eventMem2:boolean=false;
public iamleader:boolean=false;
public eventMem:boolean=false;
public leaderId:any;
public alreadyReg:boolean=false;
public colleges:boolean=false;
public createdDr:any;
public drId:any;
public created:boolean=false;
public edit:boolean=false;
public tb1:boolean=false;
public manage:boolean=false;
public users:userData[]=[];
  constructor(
    public nav: NavController,
    public firestore: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
    public auth:authenticationService,
    public alert:AlertController,
    private modalController: ModalController,
    private loading: LoadingController,


  ) {}

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.record = navigation.extras.state['record'] as Record;
      this.drId = this.record.createdBy;
      const docRef = this.firestore.collection('users').doc(this.drId);
      
      docRef.get().subscribe((doc) => {
        if (doc.exists) {
          // Document found, you can access its data using doc.data()
          const data = doc.data() as userData;
          this.createdDr=data.name;
          console.log(data);
        } else {
          // Document not found
          console.log('Document not found');
        }
      }, (error) => {
        console.log('Error retrieving document:', error);
      });
      this.created = navigation.extras.state['created'] ;
      const clubName = this.record.club_name;
      this.club=clubName;
      this.alreadyReg=false;
      const eventName = this.record.name;
      const ref=this.firestore.collection(clubName).ref;
      const query= ref.where('name','==',eventName);
      const querySnapshot=await query.get();
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        this.docId=docId;
        console.log(docId);
        // Use the docId as needed
      } else {
        // No document found with the given name in the specified collection
      }
      this.auth.checkUserAuthentication(this.page);
   
      const sessionValue = sessionStorage.getItem('currentUser');
      if (sessionValue) {
        const userId = JSON.parse(sessionValue);
        this.userId = userId;
        const ref = this.firestore.collection('users').ref;
        const query = ref
          .where('type', '==', 'leader')
          .where('club_name', '==', clubName);
        const querySnapshot = await query.get();
      
        if (!querySnapshot.empty) {
          const leaderDocRef = querySnapshot.docs[0].ref;
          this.leaderId = leaderDocRef.id;
          console.log(this.leaderId)
          // Use the leaderDocRef as needed
        }
      
      
        querySnapshot.forEach(async (doc) => {
          if (doc.exists) {
            const data = doc.data() as userData;
      
            const existingEventRequests = data.event_requests || {};
      
            const eventRef = this.firestore.doc(`${this.club}/${this.docId}`).ref;
            const userRef = this.firestore.doc(`users/${this.userId}`).ref;
      
            const existingEntries = existingEventRequests[this.docId] || [];
            const isExistingEntry = existingEntries.some(
              (entry: { user: { isEqual: (arg0: DocumentReference<unknown>) => any; }; }) => entry.user.isEqual(userRef)
            );
       if(isExistingEntry){
        this.alreadyReg=true;
       }
          } 
        })

        this.firestore.collection('users').doc(this.userId).get()
          .subscribe((docSnapshot: firebase.firestore.DocumentSnapshot<unknown>) => {
            if (docSnapshot.exists) {
              this.user = docSnapshot.data() as userData[];
              console.log(this.user);
              // Do something with the user data
            } else {
              console.log('User document not found');
            }
          }, (error: any) => {
            console.error('Error getting user:', error);
          });
      }
     
      this.bails = navigation.extras.state['bail'];
      this.isLeader = navigation.extras.state['leader'];
      this.comeFromMyEventsOld = navigation.extras.state['comeFromMyEventsOld'];
      this.comeFromMyEventsNew = navigation.extras.state['comeFromMyEventsNew'];
      this.comeFromMyEventsAll = navigation.extras.state['comeFromMyEventsAll'];
      this.new = navigation.extras.state['new'];
      this.old = navigation.extras.state['old'];
      this.all = navigation.extras.state['all'];
      this.tab2 = navigation.extras.state['tab2'];
      this.tab11 = navigation.extras.state['tab11'];
      this.tab1 = navigation.extras.state['tab1'];
      this.chess = navigation.extras.state['chess'];
      this.envi = navigation.extras.state['envi'];
      this.photo = navigation.extras.state['photo'];
      this.music = navigation.extras.state['music'];
      this.grad = navigation.extras.state['grad'];
      this.volu = navigation.extras.state['volu'];
      this.thea = navigation.extras.state['thea'];
      this.fine = navigation.extras.state['fine'];
      this.sports = navigation.extras.state['sports'];
      this.colleges = navigation.extras.state['colleges'];
      this.iamleader = navigation.extras.state['iamleader'];
      this.edit = navigation.extras.state['edit'];
      this.manage = navigation.extras.state['manage'];
      localStorage.setItem('currentRecord', JSON.stringify(this.record));
      this.ds = { date: [], time: [] };
      if(this.record.type=="clubOnly"){
        this.eventType='this event is only allowed for club members'
      }
      if(this.record.type=="registration"){
        this.eventType='this events requires registration, so make sure to register fast there are limited seats'
      }
      if(this.record.type=="forAll"){
        this.eventType='this event is open for all students'
      }
      if(this.record.type=="college"){
        if(this.record.club_name=='ee'){
          this.eventType= `this event is open for all Engineering students`
        }
        if(this.record.club_name=='bu'){
          this.eventType= `this event is open for all Business students`
        }
        if(this.record.club_name=='it'){
          this.eventType= `this event is open for all Information Technology students`
        }
      }
      this.firestore
        .collection(this.record.club_name, (ref) =>
          ref.where('name', '==', this.record?.name)
        )
        .get()
        .subscribe(async (querySnapshot) => {
          if (!querySnapshot.empty) {
            const time = this.record?.date as firebase.firestore.Timestamp;
            const date = time.toDate();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const formattedDate = `${year}-${month}-${day}`;
            const formattedTime = `${hours}:${minutes}:${seconds}`;
            this.ds.date.push(formattedDate);
            this.ds.time.push(formattedTime);
            const document = querySnapshot.docs[0];
            this.documentId = document.id;
            this.clubName = this.record?.club_name;
          }
          if(!querySnapshot.empty){
            this.loaded=true;
          }
        }
      );
    }

  }

  goBck(){
  if(this.manage){
    this.router.navigate(['college-manage'], { });

  }
    if(this.tab2){
      this.router.navigate(['tabs/tab2'], { });

    }
    if(this.tab1){
      this.router.navigate(['tabs/tab1'], { });

    }
    if(this.chess){
      this.router.navigate(['chess'], { });

    }
    if(this.envi){
      this.router.navigate(['environment'], { });

    }
    if(this.photo){
      this.router.navigate(['photography'], { });

    }
    if(this.volu){
      this.router.navigate(['volunteering'], { });

    }
    if(this.thea){
      this.router.navigate(['theater'], { });

    }
    if(this.music){
      this.router.navigate(['music'], { });

    }
    if(this.sports){
      this.router.navigate(['sports'], { });

    }
    if(this.grad){
      this.router.navigate(['graduation'], { });

    }
    if(this.fine){
      this.router.navigate(['fine-arts'], { });

    }
    if(!this.tab1&&!this.tab2){
      this.router.navigate([this.clubName], { });

    }
    if(this.tab11){
      this.router.navigate(['tabs/tab1'], { });

    }
    if(this.colleges){
      this.router.navigate(['college-events'], { });
    }
  }
  async cancelRequest(){
    const confirmed = await this.showAlertRequestAlreadySent();
    if (!confirmed) {
      return;
    }
    const ref = this.firestore.collection('users').ref;
    const query = ref
      .where('type', '==', 'leader')
      .where('club_name', '==', this.clubName);
    const querySnapshot = await query.get();
  
    if (!querySnapshot.empty) {
      const leaderDocRef = querySnapshot.docs[0].ref;
      this.leaderId = leaderDocRef.id;
      // Use the leaderDocRef as needed
    }
  
    querySnapshot.forEach(async (doc) => {
      if (doc.exists) {
        const data = doc.data() as userData;
  
        const existingEventRequests = data.event_requests || {};
  
        const eventRef = this.firestore.doc(`${this.club}/${this.docId}`).ref;
        const userRef = this.firestore.doc(`users/${this.userId}`).ref;
  
        const existingEntries = existingEventRequests[this.docId] || [];
        const isExistingEntry = existingEntries.some(
          (entry: { user: { isEqual: (arg0: DocumentReference<unknown>) => any; }; }) => entry.user.isEqual(userRef)
        );
       const updatedEntries = existingEntries.filter(
          (entry: { user: { isEqual: (arg0: DocumentReference<unknown>) => any; }; }) => !entry.user.isEqual(userRef)
        );
        const updatedEventRequests = {
          ...existingEventRequests,
          [this.docId]: updatedEntries,
        };

        await this.firestore
          .collection('users')
          .doc(this.leaderId)
          .update({ event_requests: updatedEventRequests });
          const userRefs = this.firestore.collection('users').doc(this.userId);
          userRefs.valueChanges().pipe(first()).subscribe(async (userDocs: any) => {
            const eventStatusArray = userDocs?.eventStatus || [];
            const existingEventIndex = eventStatusArray.findIndex((entry: { event: string }) => entry.event === this.docId);
          
            if (existingEventIndex !== -1) {
              eventStatusArray.splice(existingEventIndex, 1); // Remove existing record
            }
          
            const updatedEventStatusArray = [...eventStatusArray];
            await userRefs.update({ eventStatus: updatedEventStatusArray });
          });
          
          if(this.tab2==true){
            this.presentLoadingCancel().then(() => {
              setTimeout(async () => {
                this.dismissLoading();
               await this.showAlertRequestCanceled();
              this.router.navigate(['tabs/tab2'], { state: { } })
              .then(()=>{
                location.reload();
              });
              },2000);
            });
          }
          if(this.tab11==true){
            this.presentLoadingCancel().then(() => {
              setTimeout(async () => {
                this.dismissLoading();
               await this.showAlertRequestCanceled();
              this.router.navigate(['tabs/tab1'], { state: { } })
              .then(()=>{
                location.reload();
              });
              },2000);
            });
          }
      }
    })
  }
 


  async removeEvent(record: Record) {
    const confirmed = await this.showAlertRemoveEvent();
    if (!confirmed) {
      return;
    }
    const clubName= record.club_name;
    const recordName= record.name;
    if (record.type === 'registration') {
      const collectionRef = this.firestore.collection('users').doc(this.userId);
    
      try {
        const querySnapshot = await collectionRef.get();
        querySnapshot.forEach(async (doc) => {
          const existingEventRequests = (doc.data() as userData).event_requests || {};
          const updatedEventRequests = { ...existingEventRequests };
          delete updatedEventRequests[this.docId];
    
          await collectionRef.update({ event_requests: updatedEventRequests });
        });
      } catch (error) {
        // Handle any potential errors here
      }
     
    }
    if (record.type === 'clubOnly') {
      // Retrieve user records where club_name matches this.clubName
     // Retrieve user records where club_name matches this.clubName
const usersCollection = this.firestore.collection('users').ref;
const query = usersCollection.where('club_name', '==', this.clubName);
const userRecords = await query.get();

// Iterate through each user record
for (const userDoc of userRecords.docs) {
  const userData = userDoc.data() as userData;
  const userId = userDoc.id;

  // Check if the user has an events field
  if (userData.events && Array.isArray(userData.events)) {
    const updatedEvents = [];

    // Iterate through each event entry
    for (const eventRef of userData.events) {
      // Check if the eventRef is a DocumentReference
      if (eventRef instanceof firebase.firestore.DocumentReference) {
        const eventSnapshot = await eventRef.get();

        // Check if the eventSnapshot exists and matches the event you are looking for
        if (eventSnapshot.exists && eventSnapshot.id === this.docId) {
          // Delete the event reference
          await eventRef.delete();
          continue; // Skip deleting this entry
        }
      }

      updatedEvents.push(eventRef); // Keep the event reference
    }

    // Update the user's events field with the filtered array
    await usersCollection.doc(userId).update({ events: updatedEvents });
  }
}
}
if(record.type==='college'){
  // Retrieve all user records
const usersCollection = this.firestore.collection('users').ref;
const userRecords = await usersCollection.get();

// Iterate through each user record
for (const userDoc of userRecords.docs) {
  const userData = userDoc.data() as userData;
  const userId = userDoc.id;

  // Check if the user has an events field
  if (userData.events && Array.isArray(userData.events)) {
    const updatedEvents = [];

    // Iterate through each event entry
    for (const eventRef of userData.events) {
      // Check if the eventRef is a DocumentReference
      if (eventRef instanceof firebase.firestore.DocumentReference) {
        const eventSnapshot = await eventRef.get();

        // Check if the eventSnapshot exists and matches the event you are looking for
        if (eventSnapshot.exists && eventSnapshot.id === this.docId) {
          // Delete the event reference
          await eventRef.delete();
          continue; // Skip deleting this entry
        }
      }

      updatedEvents.push(eventRef); // Keep the event reference
    }

    // Update the user's events field with the filtered array
    await usersCollection.doc(userId).update({ events: updatedEvents });
  }
}
}
if (record.type === 'forAll') {
// Retrieve all user records
const usersCollection = this.firestore.collection('users').ref;
const userRecords = await usersCollection.get();

// Iterate through each user record
for (const userDoc of userRecords.docs) {
  const userData = userDoc.data() as userData;
  const userId = userDoc.id;

  // Check if the user has an events field
  if (userData.events && Array.isArray(userData.events)) {
    const updatedEvents = [];

    // Iterate through each event entry
    for (const eventRef of userData.events) {
      // Check if the eventRef is a DocumentReference
      if (eventRef instanceof firebase.firestore.DocumentReference) {
        const eventSnapshot = await eventRef.get();

        // Check if the eventSnapshot exists and matches the event you are looking for
        if (eventSnapshot.exists && eventSnapshot.id === this.docId) {
          // Delete the event reference
          await eventRef.delete();
          continue; // Skip deleting this entry
        }
      }

      updatedEvents.push(eventRef); // Keep the event reference
    }

    // Update the user's events field with the filtered array
    await usersCollection.doc(userId).update({ events: updatedEvents });
  }
}
    }
    const collName = record.club_name;
    const querySnapshot = await this.firestore
      .collection(collName).ref
      .where('name', '==', record.name)
      .get();
    
    const deletePromises: any[] = [];
    querySnapshot.forEach((doc: { ref: { delete: () => any; }; }) => {
      deletePromises.push(doc.ref.delete());
    });
  
    Promise.all(deletePromises)
      .then(async () => {
        if(this.new==true){
          this.presentLoadingRemoving().then(() => {
            setTimeout(async () => {
              this.dismissLoading();
             await this.presentAlert();
            this.router.navigate(['created-events'], { state: {rnew:this.new,rall:this.all,rold:this.old } })
            .then(()=>{
              location.reload();
            });
            },2000);
          });
        }
        if(this.old==true){
          this.presentLoadingRemoving().then(() => {
            setTimeout(async () => {
              this.dismissLoading();
             await this.presentAlert();
            this.router.navigate(['created-events'], { state: {rnew:this.new,rall:this.all,rold:this.old } })
            .then(()=>{
              location.reload();
            });
            },2000);
          });
        }
        if(this.all==true){
          this.presentLoadingRemoving().then(() => {
            setTimeout(async () => {
              this.dismissLoading();
             await this.presentAlert();
            this.router.navigate(['created-events'], { state: {rnew:this.new,rall:this.all,rold:this.old } })
            .then(()=>{
              location.reload();
            });
            },2000);
          });
        }
        if(this.chess==true){
          this.presentLoadingRemoving().then(() => {
            setTimeout(async () => {
              this.dismissLoading();
             await this.presentAlert();
            this.router.navigate(['chess'], { state: { } })
            .then(()=>{
              location.reload();
            });
            },2000);
          });
        }
        if(this.tab11==true){
          this.presentLoadingRemoving().then(() => {
            setTimeout(async () => {
              this.dismissLoading();
             await this.presentAlert();
            this.router.navigate(['tabs/tab1'], { state: { } })
            .then(()=>{
              location.reload();
            });
            },2000);
          });
        }
        if(this.colleges==true){
          this.presentLoadingRemoving().then(() => {
            setTimeout(async () => {
              this.dismissLoading();
             await this.presentAlert();
            this.router.navigate(['college-events'], { state: { } })
            .then(()=>{
              location.reload();
            });
            },2000);
          });
        }
        
      })
     
  }
  editEvent(prod:Record){
    this.openModal2(prod);
    console.log(prod);
  }
  async openModal2(product: Record) {
    const modal = await this.modalController.create({
      component: EditEventPage,
      backdropDismiss: false,
      componentProps: {
        receivedRecordName: product.name,
        receivedRecordClub:product.club_name
      }
    });
    return await modal.present();
  }
  close(){
    this.modalController.dismiss();
  }
  showMembers(record:string){
    this.eventMem=true;
    this.router.navigate(['show-members'],{ state: { chess:this.chess,recorddd:this.record,TB2:this.tab2,TB1:this.tab11,eventName:record,clubName:this.clubName,clubMem:this.clubMem,eventMem:this.eventMem } });
  }
  async bailing() {
    const confirmed = await this.showAlertRemoveEvent();
    if (!confirmed) {
      return;
    }
    const eventId = this.documentId;
    const sessionValue = sessionStorage.getItem('currentUser');
  
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      const userRef = this.firestore.collection('users').doc(userId).ref;
  
      // Delete the event reference from the user's events array
      this.firestore.firestore.runTransaction((transaction) => {
        return transaction.get(userRef).then(async (doc) => {
          if (doc.exists) {
            const user = doc.data() as userData;
            this.user=user as any;
            const events = user.events || [];
  
            const eventRefIndex = events.findIndex(
              (ref: any) => ref.path === this.clubName + '/' + eventId
            );
            if (eventRefIndex !== -1) {
              events.splice(eventRefIndex, 1); // Remove the event reference from the array
              transaction.update(userRef, { events: events });
              console.log('Event reference removed from user document successfully');
                if(this.comeFromMyEventsAll==true){
                  this.allDetails=true;
                  this.presentLoadingRemoving().then(() => {
                    setTimeout(async () => {
                      this.dismissLoading();
                     await this.presentAlert();
                     this.router.navigate(['my-events'], { state: { oldDetails:this.oldDetails,newDetails:this.newDetails,allDetails:this.allDetails } })
                     .then(()=>{
                       location.reload();
                     });
                    },2000);
                  });
                }
                if(this.comeFromMyEventsNew==true){
                  this.newDetails=true;
                  this.presentLoadingRemoving().then(() => {
                    setTimeout(async () => {
                      this.dismissLoading();
                     await this.presentAlert();
                     this.router.navigate(['my-events'], { state: { oldDetails:this.oldDetails,newDetails:this.newDetails,allDetails:this.allDetails } })
                     .then(()=>{
                       location.reload();
                     });
                    },2000);
                  });
                }
                if(this.comeFromMyEventsOld==true){
                  this.oldDetails=true;
                  this.presentLoadingRemoving().then(() => {
                    setTimeout(async () => {
                      this.dismissLoading();
                     await this.presentAlert();
                     this.router.navigate(['my-events'], { state: { oldDetails:this.oldDetails,newDetails:this.newDetails,allDetails:this.allDetails } })
                     .then(()=>{
                       location.reload();
                     });
                    },2000);
                  });
                }
                if(this.tab2==true){
                  this.presentLoadingRemoving().then(() => {
                    setTimeout(async () => {
                      this.dismissLoading();
                     await this.presentAlert();
                    this.router.navigate(['tabs/tab2'], { state: { } })
                    .then(()=>{
                      location.reload();
                    });
                    },2000);
                  });
                }
                if(this.chess==true){
                  this.presentLoadingRemoving().then(() => {
                    setTimeout(async () => {
                      this.dismissLoading();
                     await this.presentAlert();
                    this.router.navigate(['chess'], { state: { } })
                    .then(()=>{
                      location.reload();
                    });
                    },2000);
                  });
                }
                if(this.tab11==true){
                  this.presentLoadingRemoving().then(() => {
                    setTimeout(async () => {
                      this.dismissLoading();
                     await this.presentAlert();
                    this.router.navigate(['tabs/tab1'], { state: { } })
                    .then(()=>{
                      location.reload();
                    });
                    },2000);
                  });
                }
            }
          
          }
        });
      })
      .catch((error) => {
        console.error('Error retrieving user document:', error);
      });
    } else {
      console.log('User ID not found in session');
    }
  }
  async presentAlert(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: 'Event Removed Successfully',
        message: '',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              resolve(true); // Resolve with true when Yes button is clicked
            }
          },

        ]
      });

      await alert.present();
    });
  }

  async Register() {
    if(this.record.type==='college'){
      const confirmed = await this.addEventAlert();
      if (!confirmed) {
        return;
      }
      const recordString = localStorage.getItem('currentRecord');
      if (recordString) {
        const record = JSON.parse(recordString) as Record;
        const eventId = this.documentId;
        const sessionValue = sessionStorage.getItem('currentUser');

        if (sessionValue) {
          const userId = JSON.parse(sessionValue);

          const userRef = this.firestore.collection('users').doc(userId).ref;

          this.firestore.firestore.runTransaction((transaction) => {
            return transaction.get(userRef).then((doc) => {
              if (doc.exists) {
                const user = doc.data() as userData;
                const events = user.events || [];

                const eventRef = this.firestore
                  .doc(this.record.club_name + '/' + eventId)
                  .ref;
                const eventIndex = events.findIndex(
                  (ref: any) => ref.path === eventRef.path
                );
                if (eventIndex === -1) {
                  events.push(eventRef);
                  transaction.update(userRef, { events: events });
                  if(this.tab2==true){
                    this.presentLoading().then(() => {
                      setTimeout(async () => {
                        this.dismissLoading();
                       await this.showAlertAddedEvent();
                      this.router.navigate(['tabs/tab2'], { state: { } })
                      .then(()=>{
                        location.reload();
                      });
                      },2000);
                    });
                  }
                  if(this.tab11==true){
                    this.presentLoading().then(() => {
                      setTimeout(async () => {
                        this.dismissLoading();
                       await this.showAlertAddedEvent();
                      this.router.navigate(['tabs/tab1'], { state: { } })
                      .then(()=>{
                        location.reload();
                      });
                      },2000);
                    });
                  }
                } else {
                  this.showAlertEventExists();
                }
              }
            });
          })
          .catch((error) => {
            console.error('Error retrieving user document:', error);
          });
      } else {
        console.log('User ID not found in session');
      }
    } else {
      console.error('Record not found in localStorage');
    }
    }
    if (this.record.type === 'clubOnly') {
      firstValueFrom(this.firestore.collection('users').doc(this.userId).get())
        .then(async (doc) => {
          if (doc.exists) {
            const data = doc.data() as userData;
            if (data?.club_name === 'notRegistered') {
              this.showAlertNotRegistered();
              return;
            } else {
               if (this.record.club_name === data?.club_name) {
                const confirmed = await this.addEventAlert();
              if (!confirmed) {
                return;
              }
                const recordString = localStorage.getItem('currentRecord');
                if (recordString) {
                  const record = JSON.parse(recordString) as Record;
                  const eventId = this.documentId;
                  const sessionValue = sessionStorage.getItem('currentUser');
    
                  if (sessionValue) {
                    const userId = JSON.parse(sessionValue);
    
                    const userRef = this.firestore.collection('users').doc(userId).ref;
    
                    this.firestore.firestore.runTransaction((transaction) => {
                      return transaction.get(userRef).then((doc) => {
                        if (doc.exists) {
                          const user = doc.data() as userData;
                          const events = user.events || [];
    
                          const eventRef = this.firestore
                            .doc(this.record.club_name + '/' + eventId)
                            .ref;
                          const eventIndex = events.findIndex(
                            (ref: any) => ref.path === eventRef.path
                          );
                          if (eventIndex === -1) {
                            events.push(eventRef);
                            transaction.update(userRef, { events: events });
                            if(this.tab2==true){
                              this.presentLoading().then(() => {
                                setTimeout(async () => {
                                  this.dismissLoading();
                                 await this.showAlertAddedEvent();
                                this.router.navigate(['tabs/tab2'], { state: { } })
                                .then(()=>{
                                  location.reload();
                                });
                                },2000);
                              });
                            }
                            if(this.tab11==true){
                              this.presentLoading().then(() => {
                                setTimeout(async () => {
                                  this.dismissLoading();
                                 await this.showAlertAddedEvent();
                                this.router.navigate(['tabs/tab1'], { state: { } })
                                .then(()=>{
                                  location.reload();
                                });
                                },2000);
                              });
                            }
                          } else {
                            this.showAlertEventExists();
                          }
                        }
                      });
                    })
                    .catch((error) => {
                      console.error('Error retrieving user document:', error);
                    });
                  } else {
                    console.log('User ID not found in session');
                  }
                } else {
                  console.error('Record not found in localStorage');
                }
              } else {
                this.showAlertNotClub();
              }
            }
          } else {
            console.log('User document does not exist');
          }
        })
        .catch((error) => {
          console.error('Error updating club:', error);
        });
    }
    if(this.record.type=='forAll'){
      const confirmed = await this.addEventAlert();
      if (!confirmed) {
        return;
      }
      const recordString = localStorage.getItem('currentRecord');
      if (recordString) {
        const record = JSON.parse(recordString) as Record;
        const eventId = this.documentId;
        const sessionValue = sessionStorage.getItem('currentUser');

        if (sessionValue) {
          const userId = JSON.parse(sessionValue);

          const userRef = this.firestore.collection('users').doc(userId).ref;

          this.firestore.firestore.runTransaction((transaction) => {
            return transaction.get(userRef).then((doc) => {
              if (doc.exists) {
                const user = doc.data() as userData;
                const events = user.events || [];

                const eventRef = this.firestore
                  .doc(this.record.club_name + '/' + eventId)
                  .ref;
                const eventIndex = events.findIndex(
                  (ref: any) => ref.path === eventRef.path
                );
                if (eventIndex === -1) {
                  events.push(eventRef);
                  transaction.update(userRef, { events: events });
                  if(this.tab2==true){
                    this.presentLoading().then(() => {
                      setTimeout(async () => {
                        this.dismissLoading();
                       await this.showAlertAddedEvent();
                      this.router.navigate(['tabs/tab2'], { state: { } })
                      .then(()=>{
                        location.reload();
                      });
                      },2000);
                    });
                  }
                  if(this.tab11==true){
                    this.presentLoading().then(() => {
                      setTimeout(async () => {
                        this.dismissLoading();
                       await this.showAlertAddedEvent();
                      this.router.navigate(['tabs/tab1'], { state: { } })
                      .then(()=>{
                        location.reload();
                      });
                      },2000);
                    });
                  }
                } else {
                  this.showAlertEventExists();
                }
              }
            });
          })
          .catch((error) => {
            console.error('Error retrieving user document:', error);
          });
      } else {
        console.log('User ID not found in session');
      }
    } else {
      console.error('Record not found in localStorage');
    }
    }
    if (this.record.type == 'registration') {
      const confirmed = await this.showAlertEventRequest();
      if (!confirmed) {
        return;
      }
      const ref = this.firestore.collection('users').ref;
      const query = ref
        .where('type', '==', 'leader')
        .where('club_name', '==', this.clubName);
      const querySnapshot = await query.get();
    
      if (!querySnapshot.empty) {
        const leaderDocRef = querySnapshot.docs[0].ref;
        this.leaderId = leaderDocRef.id;
        // Use the leaderDocRef as needed
      }
    
      querySnapshot.forEach(async (doc) => {
        if (doc.exists) {
          const data = doc.data() as userData;
    
          const existingEventRequests = data.event_requests || {};
    
          const eventRef = this.firestore.doc(`${this.clubName}/${this.docId}`).ref;
          const userRef = this.firestore.doc(`users/${this.userId}`).ref;
    
          const existingEntries = existingEventRequests[this.docId] || [];
          const isExistingEntry = existingEntries.some(
            (entry: { user: { isEqual: (arg0: DocumentReference<unknown>) => any; }; }) => entry.user.isEqual(userRef)
          );
    
          if (!isExistingEntry) {
            const updatedEntry = {  user: userRef };
            const updatedEntries = [...existingEntries, updatedEntry];
            const updatedEventRequests = {
              ...existingEventRequests,
              [this.docId]: updatedEntries,
            };
    
            await this.firestore
            .collection('users')
            .doc(this.leaderId)
            .update({ event_requests: updatedEventRequests });
            
            const userRefs = this.firestore.collection('users').doc(this.userId);
            userRefs.valueChanges().pipe(first()).subscribe(async (userDocs: any) => {
              const eventStatusArray = userDocs?.eventStatus || [];
              const existingEventIndex = eventStatusArray.findIndex((entry: { event: string }) => entry.event === this.docId);
            
              if (existingEventIndex !== -1) {
                eventStatusArray.splice(existingEventIndex, 1); // Remove existing record
              }
            
              const updatedEventStatusArray = [...eventStatusArray, { event: this.docId, status: 'pending' }];
              await userRefs.update({ eventStatus: updatedEventStatusArray });
            });
            
              if(this.tab2==true){
                this.presentLoading2().then(() => {
                  setTimeout(async () => {
                    this.dismissLoading();
                   await this.showAlertAddedEvent2();
                  this.router.navigate(['tabs/tab2'], { state: { } })
                  .then(()=>{
                    location.reload();
                  });
                  },2000);
                });
              }
              if(this.tab11==true){
                this.presentLoading2().then(() => {
                  setTimeout(async () => {
                    this.dismissLoading();
                   await this.showAlertAddedEvent2();
                  this.router.navigate(['tabs/tab1'], { state: { } })
                  .then(()=>{
                    location.reload();
                  });
                  },2000);
                });
              }
          }else{
      const confirmed = await this.showAlertRequestSent();
      if (!confirmed) {
        return;
      }
         const updatedEntries = existingEntries.filter(
            (entry: { user: { isEqual: (arg0: DocumentReference<unknown>) => any; }; }) => !entry.user.isEqual(userRef)
          );
          const updatedEventRequests = {
            ...existingEventRequests,
            [this.docId]: updatedEntries,
          };

          await this.firestore
            .collection('users')
            .doc(this.leaderId)
            .update({ event_requests: updatedEventRequests });
            const userRefs = this.firestore.collection('users').doc(this.userId);
            userRefs.valueChanges().pipe(first()).subscribe(async (userDocs: any) => {
              const eventStatusArray = userDocs?.eventStatus || [];
              const existingEventIndex = eventStatusArray.findIndex((entry: { event: string }) => entry.event === this.docId);
            
              if (existingEventIndex !== -1) {
                eventStatusArray.splice(existingEventIndex, 1); // Remove existing record
              }
            
              const updatedEventStatusArray = [...eventStatusArray];
              await userRefs.update({ eventStatus: updatedEventStatusArray });
            });
            
            if(this.tab2==true){
              this.presentLoadingCancel().then(() => {
                setTimeout(async () => {
                  this.dismissLoading();
                 await this.showAlertRequestCanceled();
                this.router.navigate(['tabs/tab2'], { state: { } })
                .then(()=>{
                  location.reload();
                });
                },2000);
              });
            }
            if(this.tab11==true){
              this.presentLoadingCancel().then(() => {
                setTimeout(async () => {
                  this.dismissLoading();
                  await this.showAlertRequestCanceled();
                this.router.navigate(['tabs/tab1'], { state: { } })
                .then(()=>{
                  location.reload();
                });
                },2000);
              });
            }
        }
      }
    }
  )};
    }
        
     
    async showAlertAddedEventRequested(): Promise<boolean> {
      return new Promise<boolean>(async (resolve) => {
        const alert = await this.alert.create({
          header: 'Event Registration request was sent to the club leader',
          message: '',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                resolve(true); // Resolve with true when Yes button is clicked
              }
            },
          
  
          ]
        });
  
        await alert.present();
      });
    }
    async showAlertRemoveEvent(): Promise<boolean> {
      return new Promise<boolean>(async (resolve) => {
        const alert = await this.alert.create({
          header: 'are you sure you want to remove this event ?',
          message: '',
          buttons: [
            {
              text: 'yes',
              handler: () => {
                resolve(true); // Resolve with true when Yes button is clicked
              }
            },
            {
              text: 'Cancel',
              handler: () => {
                resolve(false); // Resolve with true when Yes button is clicked
              }
            },
  
          ]
        });
  
        await alert.present();
      });
    }
    async showAlertRequestCanceled(): Promise<boolean> {
      return new Promise<boolean>(async (resolve) => {
        const alert = await this.alert.create({
          header: 'Event Registration request was Cancelled Successfully',
          message: '',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                resolve(true); // Resolve with true when Yes button is clicked
              }
            },
          
  
          ]
        });
  
        await alert.present();
      });
    }
    async showAlertRequestSent(): Promise<boolean> {
      return new Promise<boolean>(async (resolve) => {
        const alert = await this.alert.create({
          header: 'Event Registration request was already sent to the club leader, do you want to cancel request ?',
          message: '',
          buttons: [
            {
              text: 'yes',
              handler: () => {
                resolve(true); // Resolve with true when Yes button is clicked
              }
            },
            {
              text: 'no',
              handler: () => {
                resolve(false); // Resolve with true when Yes button is clicked
              }
            },
  
          ]
        });
  
        await alert.present();
      });
    }
    async showAlertRequestAlreadySent(): Promise<boolean> {
      return new Promise<boolean>(async (resolve) => {
        const alert = await this.alert.create({
          header: 'Are You Sure you want to cancel the request ?',
          message: '',
          buttons: [
            {
              text: 'yes',
              handler: () => {
                resolve(true); // Resolve with true when Yes button is clicked
              }
            },
            {
              text: 'no',
              handler: () => {
                resolve(false); // Resolve with true when Yes button is clicked
              }
            },
  
          ]
        });
  
        await alert.present();
      });
    }
  async showAlertEventRequest(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: 'Are you sure you want to register in this event?',
        message: '',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              resolve(true); // Resolve with true when Yes button is clicked
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              resolve(false); // Resolve with false when Cancel button is clicked
            }
          },

        ]
      });

      await alert.present();
    });
  }
  async showAlertNotRegistered(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: `Sorry, you have to be registered in the ${this.record.club_name} club first`,
        message: '',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              resolve(true); // Resolve with true when Yes button is clicked
            }
          },
        

        ]
      });

      await alert.present();
    });
  }
  async showAlertNotClub(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: `Sorry, you have to be registered in the ${this.record.club_name} club first`,
        message: '',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              resolve(true); // Resolve with true when Yes button is clicked
            }
          },
         
        ]
      });

      await alert.present();
    });
  }
  async showAlertAddedEvent(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: `Event Added Successfully`,
        message: '',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              resolve(true); // Resolve with true when Yes button is clicked
            }
          },
       

        ]
      });

      await alert.present();
    });
  }
  async showAlertAddedEvent2(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: `Registration Request Sent Successfully`,
        message: '',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              resolve(true); // Resolve with true when Yes button is clicked
            }
          },
       

        ]
      });

      await alert.present();
    });
  }
  async addEventAlert(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: `are you sure You want to register in this event?`,
        message: '',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              resolve(true); // Resolve with true when Yes button is clicked
            }
          },
          {
            text: 'Cancel',
            handler: () => {
              resolve(false); // Resolve with true when Yes button is clicked
            }
          },
       

        ]
      });

      await alert.present();
    });
  }
  async showAlertEventExists(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: `Sorry, you have Already Registered in this event`,
        message: '',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              resolve(true); // Resolve with true when Yes button is clicked
            }
          },
        

        ]
      });

      await alert.present();
    });
  }
  async presentLoading() {
    const loading = await this.loading.create({
      message: 'adding new event...',
      spinner: 'lines', // Choose the type of spinner you want
      translucent: true,
      backdropDismiss: false, // Prevent dismissing the loading by tapping outside
      keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
    });
    await loading.present();
  }
  async presentLoading2() {
    const loading = await this.loading.create({
      message: 'Sending event Request...',
      spinner: 'lines', // Choose the type of spinner you want
      translucent: true,
      backdropDismiss: false, // Prevent dismissing the loading by tapping outside
      keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
    });
    await loading.present();
  }
  async presentLoadingCancel() {
    const loading = await this.loading.create({
      message: 'Cancelling event request...',
      spinner: 'lines', // Choose the type of spinner you want
      translucent: true,
      backdropDismiss: false, // Prevent dismissing the loading by tapping outside
      keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
    });
    await loading.present();
  }

  dismissLoading() {
    this.loading.dismiss();
  }
  async presentLoadingRemoving() {
    const loading = await this.loading.create({
      message: 'Removing event...',
      spinner: 'lines', // Choose the type of spinner you want
      translucent: true,
      backdropDismiss: false, // Prevent dismissing the loading by tapping outside
      keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
    });
    await loading.present();
  }


}
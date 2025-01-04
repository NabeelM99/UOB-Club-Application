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
import { Component, Injectable, OnInit } from '@angular/core';
import { QuerySnapshot } from '@angular/fire/firestore';
import { authenticationService } from 'src/app/services/authentication.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EditEventPage } from '../edit-event/edit-event.page';
import { doc } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  public page: string = 'requests';
  public userRequested:any;
  public newRequest:any;
  public userRecord: userData[] = [];
  public user: userData[] = [];
public requestedId:any;
public requestedName:string='';
public clubName:string='';
public ev:boolean=false;
public userId:any;
public reqid:any;
public reqid2:any;
public leaderId:any;
  constructor(

    public auth:authenticationService,
    public alert:AlertController,
    private modalController: ModalController,
    private loading: LoadingController,
    public nav: NavController,
    public fire: authenticationService,
    private firestore: AngularFirestore,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.fire.checkUserAuthentication(this.page);
    const state = history.state;
    
    // Check if 'new' value exists in the state object
    if (state && state.new) {
      this.newRequest = state.new;
      console.log(this.newRequest);
      // Do something with the new request value
    }
    if (state && state.event) {
      this.newRequest = state.event;
      console.log(this.newRequest);
      // Do something with the new request value
    }
    if (state && state.comeev) {
      this.ev = state.comeev;
    }

    const sessionValue = sessionStorage.getItem('currentUser');
  
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.userId = userId;
      
      this.firestore
        .collection('users')
        .doc(this.userId)
        .get()
        .subscribe((docSnapshot: firebase.firestore.DocumentSnapshot<unknown>) => {
          if (docSnapshot.exists) {
            const userData = docSnapshot.data() as userData;
            console.log(userData); // Log the entire userData object
            
            if (userData && userData.club_name) {
              this.clubName = userData.club_name;
              console.log(this.clubName);
              
              // Do something with the user data
            } else {
              console.log('Invalid user data or missing club_name property');
            }
          } else {
            console.log('User document not found');
          }
        });
    }
     // Access the state value passed from the previous page
    if (state && state.name) {
      const { name } = state;
      this.requestedName=name;
      console.log(this.requestedName);
        this.firestore
          .collection<userData>('users', (ref) => ref.where('name', '==', name))
          .valueChanges()
          .subscribe((users: userData[]) => {
            this.userRecord = users;
            console.log(this.userRecord);
          });
          const ref=this.firestore.collection('users').ref;
          const query= ref.where('name','==',name);
          const querySnapshot=await query.get();
          if (!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;
            this.requestedId=docId;
            console.log(docId);
            // Use the docId as needed
          } else {
            // No document found with the given name in the specified collection
          }
      }
  }

 async approveRequest2(){
  const confirmed = await this.showAlert();
  if (!confirmed) {
    return;
  }
  this.firestore.collection('users').ref.where('name','==',this.requestedName).get().then((querySnapshot)=>{
    if(!querySnapshot.empty){
      querySnapshot.forEach((doc)=>{
        this.reqid= doc.id;
        console.log(this.reqid)
      })
    }
  }).then(()=>{
    this.firestore.collection(this.clubName).ref.where('name','==',this.newRequest).get().then((querySnapshot)=>{
      if(!querySnapshot.empty){
        querySnapshot.forEach((doc)=>{
          this.reqid2= doc.id;
          console.log(this.reqid2)
        })
      }
    }).then(async ()=>{
      const userRef = this.firestore.collection('users').doc(this.reqid).ref;
    
      this.firestore.firestore.runTransaction((transaction) => {
        return transaction.get(userRef).then((doc) => {
          if (doc.exists) {
            console.log('dd');
            const user = doc.data() as userData;
            const events = user.events || [];
            const eventRef = this.firestore
              .doc(this.clubName + '/' + this.reqid2)
              .ref;
            const eventIndex = events.findIndex(
              (ref: any) => ref.path === eventRef.path
            );
            if (eventIndex === -1) {
              events.push(eventRef);
              transaction.update(userRef, { events: events });
            }
          }})
          })
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
          
              const eventRef = this.firestore.doc(`${this.clubName}/${this.reqid2}`).ref;
              const userRef = this.firestore.doc(`users/${this.reqid}`).ref;
          
              const existingEntries = existingEventRequests[this.reqid2] || [];
              const updatedEntries = existingEntries.filter(
                (entry: { user: { isEqual: (arg0: DocumentReference<unknown>) => any; }; }) =>
                  !entry.user.isEqual(userRef)
              );
          
              const updatedEventRequests = {
                ...existingEventRequests,
                [this.reqid2]: updatedEntries,
              };
          
              await this.firestore
                .collection('users')
                .doc(this.leaderId)
                .update({ event_requests: updatedEventRequests });
            }
          });
          const userRefs = this.firestore.collection('users').doc(this.reqid);
          userRefs.valueChanges().pipe(first()).subscribe(async (userDocs: any) => {
            const eventStatusArray = userDocs?.eventStatus || [];
            const existingEventIndex = eventStatusArray.findIndex((entry: { event: string }) => entry.event === this.reqid2);
          
            if (existingEventIndex !== -1) {
              eventStatusArray.splice(existingEventIndex, 1); // Remove existing record
            }
          
            const updatedEventStatusArray = [...eventStatusArray, { event: this.reqid2, status: 'Approved' }];
            await userRefs.update({ eventStatus: updatedEventStatusArray });
          });
    })
 

  }).then(()=>{
    this.presentLoading().then(() => {
      setTimeout(async () => {
        this.dismissLoading();
       await this.showAlert2();
      this.router.navigate(['tabs/tab3'],)
      .then(()=>{
        location.reload();
      });
      },2000);
    });
  })


      }
 
 async refuse2(){
  const confirmed = await this.showAlert3();
  if (!confirmed) {
    return;
  }
  this.firestore.collection('users').ref.where('name','==',this.requestedName).get().then((querySnapshot)=>{
    if(!querySnapshot.empty){
      querySnapshot.forEach((doc)=>{
        this.reqid= doc.id;
        console.log(this.reqid)
      })
    }
  }).then(()=>{
    this.firestore.collection(this.clubName).ref.where('name','==',this.newRequest).get().then((querySnapshot)=>{
      if(!querySnapshot.empty){
        querySnapshot.forEach((doc)=>{
          this.reqid2= doc.id;
          console.log(this.reqid2)
        })
      }
    }).then(async ()=>{
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
          
              const eventRef = this.firestore.doc(`${this.clubName}/${this.reqid2}`).ref;
              const userRef = this.firestore.doc(`users/${this.reqid}`).ref;
          
              const existingEntries = existingEventRequests[this.reqid2] || [];
              const updatedEntries = existingEntries.filter(
                (entry: { user: { isEqual: (arg0: DocumentReference<unknown>) => any; }; }) =>
                  !entry.user.isEqual(userRef)
              );
          
              const updatedEventRequests = {
                ...existingEventRequests,
                [this.reqid2]: updatedEntries,
              };
          
              await this.firestore
                .collection('users')
                .doc(this.leaderId)
                .update({ event_requests: updatedEventRequests });
            }
          });
          const userRefs = this.firestore.collection('users').doc(this.reqid);
          userRefs.valueChanges().pipe(first()).subscribe(async (userDocs: any) => {
            const eventStatusArray = userDocs?.eventStatus || [];
            const existingEventIndex = eventStatusArray.findIndex((entry: { event: string }) => entry.event === this.reqid2);
          
            if (existingEventIndex !== -1) {
              eventStatusArray.splice(existingEventIndex, 1); // Remove existing record
            }
          
            const updatedEventStatusArray = [...eventStatusArray, { event: this.reqid2, status: 'Declined' }];
            await userRefs.update({ eventStatus: updatedEventStatusArray });
          });
    })
 

  }).then(()=>{
    this.presentLoading2().then(() => {
      setTimeout(async () => {
        this.dismissLoading();
       await this.showAlert4();
      this.router.navigate(['tabs/tab3'],)
      .then(()=>{
        location.reload();
      });
      },2000);
    });
  })


 }
 
  async approveRequest() {
    const confirmed = await this.showAlert();
    if (!confirmed) {
      return;
    }
    
      const querySnapshot = await this.firestore
        .collection('users', (ref) => ref.where('name', '==', this.requestedName))
        .get()
        .toPromise();

      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          const docRef = this.firestore.collection('users').doc(doc.id);
          docRef
            .update({ club_name: this.clubName,
                      clubStatus:'approved'
             })
            .then(() => {
              console.log('club_name field updated successfully.');
            })
            .catch((error) => {
              console.error('Error updating club_name field:', error);
            });
        });
        const collectionRef = this.firestore.collection('users').ref;
        const query = collectionRef.where('club_name', '==', this.clubName).where('type','==','leader');
        query.get().then((querySnapshot) => {
          const typedQuerySnapshot = querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
        
          typedQuerySnapshot.forEach((doc) => {
            const clubRequests = doc.data()['club_requests'];
            const updatedClubRequests = { ...clubRequests };
        
            for (const key in updatedClubRequests) {
              if (updatedClubRequests.hasOwnProperty(key) && key === this.requestedName) {
                delete updatedClubRequests[key];
                break; // Assuming only one matching entry should be removed
              }
            }
        
            doc.ref.update({ club_requests: updatedClubRequests });
          });
        });



      } else {
        console.error('No query snapshot found.');
      }
    
      this.presentLoading().then(() => {
        setTimeout(async () => {
          this.dismissLoading();
         await this.showAlert2();
        this.router.navigate(['tabs/tab3'],)
        .then(()=>{
          location.reload();
        });
        },2000);
      });
    
   
    
  }
  async presentLoading() {
    const loading = await this.loading.create({
      message: 'approving request...',
      spinner: 'lines', // Choose the type of spinner you want
      translucent: true,
      backdropDismiss: false, // Prevent dismissing the loading by tapping outside
      keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
    });
    await loading.present();
  }
  async presentLoading2() {
    const loading = await this.loading.create({
      message: 'Removing request...',
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
  async showAlert(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: 'are you sure you want to accept this request ?',
        message: '',
        buttons: [
          {
            text: 'Approve',
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
  async showAlert3(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: 'are you sure you want to refuse this request ?',
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
  async showAlert4(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: 'the request has been declined successfully',
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
  async showAlert2(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: 'request approved successfully',
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
 
  async refuse(){
    const confirmed = await this.showAlert3();
    if (!confirmed) {
      return;
    }
    const status = `declined${this.clubName}`;
    const querySnapshot = await this.firestore
        .collection('users', (ref) => ref.where('name', '==', this.requestedName))
        .get()
        .toPromise();

      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          const docRef = this.firestore.collection('users').doc(doc.id);
          docRef
            .update({ club_name: 'notRegistered',
              clubStatus:status
             })
            .then(() => {
              console.log('club_name field updated successfully.');
            })
            .catch((error) => {
              console.error('Error updating club_name field:', error);
            });
        });
        const collectionRef = this.firestore.collection('users').ref;
        const query = collectionRef.where('club_name', '==', this.clubName).where('type','==','leader');
        query.get().then((querySnapshot) => {
          const typedQuerySnapshot = querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
        
          typedQuerySnapshot.forEach((doc) => {
            const clubRequests = doc.data()['club_requests'];
            const updatedClubRequests = { ...clubRequests };
        
            for (const key in updatedClubRequests) {
              if (updatedClubRequests.hasOwnProperty(key) && key === this.requestedName) {
                delete updatedClubRequests[key];
                break; // Assuming only one matching entry should be removed
              }
            }
        
            doc.ref.update({ club_requests: updatedClubRequests });
          });
        });



      } else {
        console.error('No query snapshot found.');
      }
    
      this.presentLoading2().then(() => {
        setTimeout(async () => {
          this.dismissLoading();
         await this.showAlert4();
        this.router.navigate(['tabs/tab3'],)
        .then(()=>{
          location.reload();
        });
        },2000);
      });
    
   
  }
}


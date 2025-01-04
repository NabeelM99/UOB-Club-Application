import { Component, OnInit } from '@angular/core';
import { AngularFirestore, combineChange } from '@angular/fire/compat/firestore';
import { userData } from 'src/app/services/authentication.service';
import { firstValueFrom, from } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Record } from 'src/app/services/retrieve-events.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Injectable } from '@angular/core';
import { QuerySnapshot } from '@angular/fire/firestore';
import { authenticationService } from 'src/app/services/authentication.service';
import { State } from 'ionicons/dist/types/stencil-public-runtime';
import { userDatas } from '../pages/show-feedbacks/show-feedbacks.page';


export interface evReq {
  ev: {
    event: firebase.firestore.DocumentReference,
    user: firebase.firestore.DocumentReference
  }
}
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  public resulted: { [index: string]: userData[] } = {};
selected='';
Search='';
public studentEvents:boolean=false;
public studentClub:boolean=false;
public ev:boolean=false;
public leader:boolean=false;
public student:boolean=false;
public filteredRecords:userData[]=[];
public loads:boolean=false;
public loads2:boolean=false;
public maps: { key: any; record: any }[] = [];
public newevent:any;
public newRecords: { user: userData, event: any }[] = [];
public userId:any;
public userData:userData[]=[]
public waitingStudents:userData[]=[];
public loaded:boolean=false;
public club:boolean=false;
public admins:boolean=false;
public users:userData[]=[];
public clubName:string='';
public field:string='';
public college:string='';
public declineClub:string='';
public pendValue:string='';
public events:boolean=false;
public isPending:boolean[]=[];
public leaderId:any;
public pendBtn:boolean=false;
public clearBtn:boolean=false;
public isFinish:boolean[]=[];
public eventss:string[]=[];
public msg2:string='';
public msg3:string='';
public msg4:string='';
public emptyStatus:boolean=false;
public otherStatus:boolean=false;
public club2:string='';
public docId:any;
public club3:any;
public name2:any;
public msg:string='';
public reqs: { event: any, status: any }[]=[];
public club_req: Map<string, firebase.firestore.DocumentReference> = new Map();
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
    this.init();
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
        this.clubName=user.club_name;
          if(user.type === 'admin'){
            this.admins=true;
          }
          if(user.type === 'student'){
            this.student=true;

          }
          if(user.type === 'leader'){
           this.leader=true;
          }
         }
    })
}
async showAlertRemoveEvent(): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const alert = await this.alertCtrl.create({
      header: 'are you sure you want to remove this user ?',
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
  async remove(x: userData) {
  const confirmed = await this.showAlertRemoveEvent();
  if (!confirmed) {
    return;
  }
  const email = x.email;
  const type = x.type;

  const firestore = firebase.firestore();
  const collectionRef = firestore.collection('users');

  collectionRef
    .where('email', '==', email)
    .where('type', '==', type)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete()
          .then(() => {
            this.presentLoadingRemoving().then(() => {
              setTimeout(async () => {
               await this.dismissLoading();
               await this.presentAlert();
              this.router.navigate(['tabs/tab3'], { state: { } })
              .then(()=>{
                location.reload();
              });
              },2000);
            });
          })
          .catch(error => {
            console.error('Error deleting record:', error);
            // Handle any errors that occur during deletion
          });
      });
    })
    .catch(error => {
      console.error('Error retrieving records:', error);
      // Handle any errors that occur during the query
    });
}
async presentAlert(): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const alert = await this.alertCtrl.create({
      header: 'user Removed Successfully',
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

dismissLoading(){
  this.loading.dismiss();
}
  async segmentChange(event: any) {
    const selectedValue = event.detail.value;
    if (selectedValue == 'club') {
      
      this.loads = true;
      this.loads2 = false;
      this.msg3 = 'there are no club requests';
      this.waitingStudents = [];
      this.club = true;
      this.events = false;
    
      if (this.userData[0].type == 'leader') {
        const clubRequests = this.userData[0].club_requests;
        let requestsProcessed = 0;
    
        const processRequests = async () => {
          for (const [key, requestRef] of Object.entries(clubRequests)) {
            const requestReference = requestRef as firebase.firestore.DocumentReference;
            const snapshot = await requestReference.get();
    
            if (snapshot.exists) {
              const requestData = snapshot.data() as userData;
              console.log(requestData);
              this.waitingStudents.push(requestData);
            }
    
            requestsProcessed++;
    
            if (requestsProcessed === Object.entries(clubRequests).length) {
              if (this.waitingStudents.length === 0) {
                this.msg3 = 'there are no club requests';
              } else {
                this.msg3 = '';
              }
    
            }
          }
        };
    
        await processRequests();
      }
    }
  
    if (selectedValue === 'events') {
      this.club = false;
      this.events = true;
      this.loads = false;
      this.loads2 = true;
      this.waitingStudents = [];
      this.maps = [];
      this.resulted = {}; // Reset resulted object before populating new entries
    
      if (this.userData[0].type === 'leader') {
        const eventRequests = this.userData[0].event_requests;
let hasentry = false;

        for (const arrayKey in eventRequests) {
          const requestArray = eventRequests[arrayKey];
          if(requestArray.length>0){
            hasentry=true;
          }
          if(hasentry){
            this.msg4='';
          }else{this.msg4='there are no events requests';}
          const newR = arrayKey;
          console.log(arrayKey);
          // Create a new entry in resulted object
          this.resulted[arrayKey] = [];
    
          for (const map in requestArray) {
            const requestMap = requestArray[map];
    
            // Insert user data into the corresponding array in resulted object
            if (requestMap.user) {
              requestMap.user.get().then((userSnapshot: firebase.firestore.DocumentSnapshot<userData>) => {
                if (userSnapshot.exists) {
                  const userData: userData | undefined = userSnapshot.data();
                  if (userData) {
                    const user = userData;
                    const enter = { user, event };
                    this.newRecords.push(enter);
                    console.log(this.newRecords);
                    this.resulted[arrayKey].push(userData);
                    const y = Object.keys(this.resulted);
                    console.log(this.resulted);
                    for (const key in this.resulted) {
                      console.log(`Key: ${key}`);
                      this.resulted[key].forEach((record) => {
                        this.field=user.field;
                        const firstTwoLetters = this.field.substring(0, this.field.indexOf('-'));
                        this.college=firstTwoLetters;
                        this.firestore.collection(this.college).doc(key).get().subscribe((doc) => {
                          if (doc.exists) {
                            const d = doc.data() as userData;
                            this.newevent = d.name;
                            const newc = { key: this.newevent, record };
                            this.maps.push(newc);
                          }
                        });
                      });
                    }
    
                    // Set the value of this.msg4 at the end
               
                  }
                } else {
                  console.log('f');
                  console.log('User document not found');
                }
              }, (error: any) => {
                console.log('Error retrieving user data:', error);
              });
            }
          }
        }
      }
    }
    
      // Move the loads and loads2 assignments to the end of the block
  }
  segmentChange2(event: any) {
    this.reqs=[];
    const selectedValue = event.detail.value;
    if (selectedValue == 'club') {
      this.waitingStudents=[];
      this.studentClub=true;
      this.studentEvents=false;
if(this.userData[0].clubStatus==''){
  this.emptyStatus=true;
  if(this.userData[0].club_name=='notRegistered'){
    this.msg='you are not registered in any club , Hurry up and join one of UOB Clubs';
  }
else{
  this.msg=`You are a member of ${this.userData[0].club_name} club.`;
}
}else{
  this.otherStatus=true;
  if(this.userData[0].clubStatus=='pending'){
    this.pendBtn=true;
    this.clearBtn=false;

    if(this.userData[0].club_name=='pendingchess'){this.pendValue='chess'}
    if(this.userData[0].club_name=='pendingenvironment'){this.pendValue='environment'}
    if(this.userData[0].club_name=='pendingphotography'){this.pendValue='photography'}
    if(this.userData[0].club_name=='pendingsports'){this.pendValue='sports'}
    if(this.userData[0].club_name=='pendingmusic'){this.pendValue='music'}
    if(this.userData[0].club_name=='pendinggraduates'){this.pendValue='graduates'}
    if(this.userData[0].club_name=='pendingfine-arts'){this.pendValue='fine-arts'}
    if(this.userData[0].club_name=='pendingtheater'){this.pendValue='theater'}
    if(this.userData[0].club_name=='pendingvolunteering'){this.pendValue='volunteering'}
    this.msg=`You have a registration request pending at ${this.pendValue} club.`;

  }
  if(this.userData[0].clubStatus=='approved'){
    this.clearBtn=true;
    this.pendBtn=false;

    this.msg=`Your registration request at ${this.userData[0].club_name} club has been Approved.`;
  }

    if(this.userData[0].clubStatus=='declinedgraduates'){
      this.declineClub='graduates';
      this.msg=`Your registration request at ${this.declineClub} club has been declined.`;
      this.clearBtn=true;
      this.pendBtn=false;
    }
    if(this.userData[0].clubStatus=='declinedvolunteering'){
      this.declineClub='volunteering';
      this.msg=`Your registration request at ${this.declineClub} club has been declined.`;
      this.clearBtn=true;
      this.pendBtn=false;
    }
    if(this.userData[0].clubStatus=='declinedtheater'){
      this.declineClub='theater';
      this.msg=`Your registration request at ${this.declineClub} club has been declined.`;
      this.clearBtn=true;
      this.pendBtn=false;
    }
    if(this.userData[0].clubStatus=='declinedenvironment'){
      this.declineClub='environment';
      this.msg=`Your registration request at ${this.declineClub} club has been declined.`;
      this.clearBtn=true;
      this.pendBtn=false;
    }
    if(this.userData[0].clubStatus=='declinedmusic'){
      this.declineClub='music';
      this.msg=`Your registration request at ${this.declineClub} club has been declined.`;
      this.clearBtn=true;
      this.pendBtn=false;
    }
    if(this.userData[0].clubStatus=='declinedfine_arts'){
      this.declineClub='fine_arts';
      this.msg=`Your registration request at ${this.declineClub} club has been declined.`;
      this.clearBtn=true;
      this.pendBtn=false;
    }
    if(this.userData[0].clubStatus=='declinedsports'){
      this.declineClub='sports';
      this.msg=`Your registration request at ${this.declineClub} club has been declined.`;
      this.clearBtn=true;
      this.pendBtn=false;
    }
    if(this.userData[0].clubStatus=='declinedchess'){
      this.declineClub='chess';
      this.msg=`Your registration request at ${this.declineClub} club has been declined.`;
      this.clearBtn=true;
      this.pendBtn=false;
    }
    if(this.userData[0].clubStatus=='declinedphotography'){
    this.declineClub='photography';
    this.msg=`Your registration request at ${this.declineClub} club has been declined.`;
    this.clearBtn=true;
    this.pendBtn=false;
  }

  
}
    
    
    }
  
    if (selectedValue === 'events') {
      this.msg2='';
      this.studentEvents=true;
      this.studentClub=false;
      this.club = false;
      this.events = true;
      this.waitingStudents = [];
      this.maps=[];
      this.resulted = {}; // Reset resulted object before populating new entries
      const requests1 = this.userData[0].eventStatus;

      if (requests1.length > 0) {
        this.msg2='';
        const collections = ['graduates', 'volunteering', 'theater', 'environment', 'music', 'fine_arts', 'sports', 'chess', 'photography'];
    
        requests1.forEach((req: { event: string, status: string }) => {
          collections.forEach((collection: string) => {
            const promise = firebase.firestore().collection(collection).doc(req.event).get()
              .then((doc) => {
                if (doc.exists) {
                  const event = doc.data()?.['name'];
                  let status = req.status;
                  if (status == 'pending') {
                    this.isPending.push(true);
                    this.isFinish.push(false);
                  } else {
                    this.isPending.push(false);
                    this.isFinish.push(true);
                  }
                  const emp = { event, status }
                  this.reqs.push(emp as any)
                  console.log(this.reqs);
                }
              })
          });
        });
      } else {
        this.msg2 = 'events that require registration will appear here';
      }
  }
  }
  clubRequests(x:string){
    console.log(x);
    this.router.navigate(['requests'], { state: { name: x } }); 
   }
   eventRequests(userName:any,eventName:any){
    this.ev=true;
    this.router.navigate(['requests'], { state: { name:userName,event:eventName,comeev:this.ev } }); 
  }
  async clear(event:any){
    const confirmed = await this.showAlertClearr();
    if (!confirmed) {
      return;
    }
    const collections = ['graduates', 'volunteering', 'theater', 'environment', 'music', 'fine_arts', 'sports', 'chess', 'photography'];
    const collectionData = await Promise.all(
      collections.map(async (collection: string) => {
        const query = firebase.firestore().collection(collection).where('name', '==', event);
        const querySnapshot = await query.get();
        if (!querySnapshot.empty) {
          const leaderDocRef = querySnapshot.docs[0].ref;
          const leaderDocSnapshot = await leaderDocRef.get();
          if (leaderDocSnapshot.exists) {
            const data = leaderDocSnapshot.data() as Record;
            return {
              docId: leaderDocRef.id,
              club2: data.club_name,
            };
          }
        }
        return null;
      })
    );
  
    // Find the first non-null result
    const collectionResult = collectionData.find((result) => result !== null);
    if (!collectionResult) {
      return;
    }
  
    this.docId = collectionResult.docId;
    this.club2 = collectionResult.club2;
  
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
    this.presentLoadingClear().then(() => {
      setTimeout(async () => {
        this.dismissLoading();
       await this.showAlert3();
      this.router.navigate(['tabs/tab3'],)
      .then(()=>{
        location.reload();
      });
      },2000);
    });
    
  }
  async cancelRequest(event:any){
    const confirmed = await this.showAlertRequestAlreadySent();
    if (!confirmed) {
      return;
    }
    const collections = ['graduates', 'volunteering', 'theater', 'environment', 'music', 'fine_arts', 'sports', 'chess', 'photography'];
    const collectionData = await Promise.all(
      collections.map(async (collection: string) => {
        const query = firebase.firestore().collection(collection).where('name', '==', event);
        const querySnapshot = await query.get();
        if (!querySnapshot.empty) {
          const leaderDocRef = querySnapshot.docs[0].ref;
          const leaderDocSnapshot = await leaderDocRef.get();
          if (leaderDocSnapshot.exists) {
            const data = leaderDocSnapshot.data() as Record;
            return {
              docId: leaderDocRef.id,
              club2: data.club_name,
            };
          }
        }
        return null;
      })
    );
  
    // Find the first non-null result
    const collectionResult = collectionData.find((result) => result !== null);
    if (!collectionResult) {
      return;
    }
  
    this.docId = collectionResult.docId;
    this.club2 = collectionResult.club2;
  
    const ref = this.firestore.collection('users').ref;
    const query = ref.where('type', '==', 'leader').where('club_name', '==', this.club2);
    const querySnapshot = await query.get();
  
    if (!querySnapshot.empty) {
      const leaderDocRef = querySnapshot.docs[0].ref;
      this.leaderId = leaderDocRef.id;
    }  
  
    querySnapshot.forEach(async (doc) => {
      if (doc.exists) {
        const data = doc.data() as userData;
  
        const existingEventRequests = data.event_requests || {};
  
        const eventRef = this.firestore.doc(`${this.club2}/${this.docId}`).ref;
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
          })
          
            this.presentLoading2().then(() => {
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
    })
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
  async presentLoadingRemoving() {
    const loading = await this.loading.create({
      message: 'Removing User...',
      spinner: 'lines', // Choose the type of spinner you want
      translucent: true,
      backdropDismiss: false, // Prevent dismissing the loading by tapping outside
      keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
    });
    await loading.present();
  }
  async presentLoadingClear() {
    const loading = await this.loading.create({
      message: 'Removing Record...',
      spinner: 'lines', // Choose the type of spinner you want
      translucent: true,
      backdropDismiss: false, // Prevent dismissing the loading by tapping outside
      keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
    });
    await loading.present();
  }
  async showAlert2(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: 'request removed successfully',
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
  async showAlert3(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: 'record removed successfully',
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
  async clear2(){
  const confirmed = await this.showAlertClearr();
  if (!confirmed) {
    return;
  }else{
    const userDoc = await firstValueFrom(this.firestore.collection('users').doc(this.userId).get());
    if (userDoc.exists) {
      const userRecord = userDoc.data() as userData;
      if (userRecord && userRecord['club_name']) {
        // Extract the club name by removing the "pending" prefix
        this.club3 = userRecord['club_name'].replace('pending', '').trim();
        this.name2=userRecord.name;
   
      }
    }
    const collectionReff = this.firestore.collection('users');
    const docRef = collectionReff.doc(this.userId);
    
    
    docRef.update({
      clubStatus:''
    }).then(()=>{
      this.presentLoadingClear().then(() => {
        setTimeout(async () => {
          this.dismissLoading();
         await this.showAlertClear();
        this.router.navigate(['tabs/tab3'],)
        .then(()=>{
          location.reload();
        });
        },2000);
      });
    })
  }
}
  async cancelRequest2(){
  const confirmed = await this.showAlertRequestAlreadySent();
  if (!confirmed) {
    return;
  }else{

    const userDoc = await firstValueFrom(this.firestore.collection('users').doc(this.userId).get());
    if (userDoc.exists) {
      const userRecord = userDoc.data() as userData;
      if (userRecord && userRecord['club_name']) {
        // Extract the club name by removing the "pending" prefix
        this.club3 = userRecord['club_name'].replace('pending', '').trim();
        this.name2=userRecord.name;
   
      }
          const collectionRef = this.firestore.collection('users').ref;
          const query = collectionRef.where('club_name', '==',this.club3).where('type','==','leader');
          query.get().then((querySnapshot) => {
            const typedQuerySnapshot = querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
          
            typedQuerySnapshot.forEach((doc) => {
              const clubRequests = doc.data()['club_requests'];
              const updatedClubRequests = { ...clubRequests };
          
              for (const key in updatedClubRequests) {
                if (updatedClubRequests.hasOwnProperty(key) && key === this.name2) {
                  delete updatedClubRequests[key];
                  break; // Assuming only one matching entry should be removed
                }
              }
          
              doc.ref.update({ club_requests: updatedClubRequests });
            });
          });
          const collectionReff = this.firestore.collection('users');
          const docRef = collectionReff.doc(this.userId);
          
          
          docRef.update({
            club_name: 'notRegistered',
            clubStatus:''
          }).then(()=>{
            this.presentLoading2().then(() => {
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
   }

}
async showAlertClear(): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const alert = await this.alertCtrl.create({
      header: 'the record has been removed successfully',
      message: '',
      buttons: [
        {
          text: 'ok',
          handler: () => {
            resolve(true); // Resolve with true when Yes button is clicked
          }
        },
       

      ]
    });

    await alert.present();
  });
}
  async showAlertRequestAlreadySent(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
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
  async showAlertClearr(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: 'Are You Sure You want to remove this record?',
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
   checks(){
    this.init();
    if (this.selected==''){this.searchAll();}
    if (this.selected=='all'){this.searchAll();}
    if (this.selected=='type'){this.searchType();}
    if (this.selected=='major'){this.searchMajor();}
    if (this.selected=='name'){this.searchName();}
    if (this.selected=='club-name'){this.searchClubName();}
  }
  init(){
    this.filteredRecords=this.users;
  }
  searchAll() {
    this.init();
    let val = this.Search;
    if (val && val.trim() != "") {
      this.filteredRecords = this.filteredRecords.filter((item) => {
        return (
          item.name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1 ||
          item.club_name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1 ||
          item.type.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1 ||
          item.field.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1
        );
      });
    }
  }

  searchName(){
    this.init();
    let val=this.Search;
    if(val && val.trim()!=""){
      this.filteredRecords=this.filteredRecords.filter((item)=>{
        return (item.name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
      });

  }
}
searchMajor(){
  this.init();
  let val=this.Search;
  if(val && val.trim()!=""){
    this.filteredRecords=this.filteredRecords.filter((item)=>{
      return (item.field.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
    });

}
}
searchType(){
  this.init();
    let val=this.Search;
    if(val && val.trim()!=""){
      this.filteredRecords=this.filteredRecords.filter((item)=>{
        return (item.type.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
      });
 
  }
}
  searchClubName(){
    this.init();
    let val=this.Search;
    if(val && val.trim()!=""){
      this.filteredRecords=this.filteredRecords.filter((item)=>{
        return (item.club_name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
      });
 
  }
}
 
 
}
import { Component, OnInit, model } from '@angular/core';
import {  Router } from '@angular/router';
import { authenticationService } from 'src/app/services/authentication.service';
import { RetrieveClubEventsService, Record } from 'src/app/services/retrieve-club-events.service';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { ActivatedRoute,  } from '@angular/router';
import { LoadingController, ModalController, NavController,  } from '@ionic/angular';
import { userData } from 'src/app/tabs/tabs.page';
import { AlertController,   } from '@ionic/angular';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { firstValueFrom } from 'rxjs';
import 'firebase/compat/storage';
import { AddEventsPage } from '../../add-events/add-events.page';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-theater',
  templateUrl: './theater.page.html',
  styleUrls: ['./theater.page.scss'],
})
export class TheaterPage implements OnInit {
  public events : Record[] = [];
  public bails = []as any;
  public page:string='theater';
  public ds={date:[]as any,time:[]as any};
  public imgs={urls:[]as any};
  public isadmin:boolean=false;
  public userId:any;
  public clubName:string='theater';
  public requestName:string='';
  public comeFromChess:boolean=false;
  public alreadyReg:boolean=false;
  public pending:string='';
  public pendValue:string='';
  public clubMem:boolean=false;
  public eventMem:boolean=false;
  public goingClub:string='';
  public loaded:boolean=false;
public tab11:boolean=false;
  public leader:boolean=false;
  public tab1:boolean=false;
  public thea:boolean=false;
  constructor(public router:Router,
    private retrieveClubEventsService: RetrieveClubEventsService,
    public auth:authenticationService,
  public route:ActivatedRoute,
  private afData: AngularFirestore,
  private modalController: ModalController,
  public alert: AlertController,
  private storage: AngularFireStorage,
  public firestore:AngularFirestore,
  private loading: LoadingController,
public nav:NavController

) {}

async ngOnInit() {
  await this.auth.checkUserAuthentication(this.page);
await this.initializePage().then(()=>{
  this.loaded=true;
})
    
    }
    async initializePage(){
      this.tab1=true;
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state) {
        this.leader = navigation.extras.state['leader'] ;}
        console.log(this.leader);
      const sessionValue = sessionStorage.getItem('currentUser');
      if (sessionValue) {
        const userId = JSON.parse(sessionValue);
        this.userId = userId;
      }
      const userDoc = await firstValueFrom(this.afData.collection('users').doc(this.userId).get());
      if (userDoc.exists) {
        const userRecord = userDoc.data() as userData;
        this.requestName=userRecord.name;
        if (userRecord.type === 'leader'&& userRecord.club_name==this.page) {
          this.leader = true;
        } else {
          this.leader = false;
          this.pending=userRecord.club_name;
          if(this.pending=='pendingchess'){this.pendValue='chess'}
          if(this.pending=='pendingenvironment'){this.pendValue='environment'}
          if(this.pending=='pendingphotography'){this.pendValue='photography'}
          if(this.pending=='pendingsports'){this.pendValue='sports'}
          if(this.pending=='pendingmusic'){this.pendValue='music'}
          if(this.pending=='pendinggraduates'){this.pendValue='graduates'}
          if(this.pending=='pendingfine-arts'){this.pendValue='fine-arts'}
          if(this.pending=='pendingtheater'){this.pendValue='theater'}
          if(this.pending=='pendingvolunteering'){this.pendValue='volunteering'}
          if(this.pendValue==this.clubName){
            this.alreadyReg=true;
          }
        }
      } else {
        console.log('User document does not exist');
      }
          const collectionName = 'theater';
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
    }
    cancelRequest(){
          setTimeout(async () => {
            this.dismissLoading();
              const confirmed = await this.showAlertRequestRemove();
              if (!confirmed) {
                return;
              }else{
                const collectionRef = this.firestore.collection('users').ref;
                const query = collectionRef.where('club_name', '==', this.pendValue).where('type','==','leader');
                query.get().then((querySnapshot) => {
                  const typedQuerySnapshot = querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
                
                  typedQuerySnapshot.forEach((doc) => {
                    const clubRequests = doc.data()['club_requests'];
                    const updatedClubRequests = { ...clubRequests };
                
                    for (const key in updatedClubRequests) {
                      if (updatedClubRequests.hasOwnProperty(key) && key === this.requestName) {
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
                })
                  .then(() => {
                    console.log('Document successfully updated.');
                  })
                  .catch((error) => {
                    console.error('Error updating document:', error);
                  });           
                  this.removingLoadingClub().then(() => {
                  setTimeout(() => {
                    this.dismissLoading();
                    this.showAlert3().then(()=>{
                      this.router.navigateByUrl('tabs/tab1').then(()=>{
                        location.reload();
                      })

                    })
                  }, 2000);
                });
              }
          })
        
      
    }
      async registerNewClub() {
        const querySnapshot = await this.firestore.collection('users')
          .ref.where('type', '==', 'leader')
          .where('club_name', '==', this.clubName)
          .get();
        console.log(querySnapshot);
      
        if (querySnapshot.empty) {
          // No user found with the specified criteria
          return;
        }
      
        // Iterate over the query snapshot to access the user(s) that match the criteria
        const confirmed = await this.showAlert();
        if (!confirmed) {
          return;
        }
        const userDoc = await firstValueFrom(this.afData.collection('users').doc(this.userId).get());
        if (userDoc.exists) {
          const userRecord = userDoc.data() as userData;
          this.pending=userRecord.club_name;
          if (userRecord.club_name === 'notRegistered') {
            const existingEntries = querySnapshot.docs
              .map((doc) => doc.data() as userData)
              .filter((userData: userData) => {
                const existingClubRequests = userData.club_requests || {};
                return Object.keys(existingClubRequests).includes(this.requestName);
              });
        
            if (existingEntries.length > 0) {
              // Duplicate entry found
              this.presentLoadingClub().then(() => {
                setTimeout(() => {
                  this.dismissLoading();
                  this.showAlertSent().then(()=>{
                    this.router.navigateByUrl('tabs/tab1').then(()=>{
                      location.reload();
                    })

                  });
                }, 2000);
              });
              return;
            } else {
              querySnapshot.forEach(async (doc) => {
                const userRef = doc.ref;
                console.log(userRef);
        
                const userData = doc.data() as userData;
                const userName = userData.name; // Assuming the name field exists in the user document
                console.log(userName);
                this.goingClub=userData.club_name;
                const existingClubRequests = userData.club_requests || {};
        
                // Get a reference to the document you want to add as a reference
                const otherDocRef = this.firestore.doc(`users/${this.userId}`).ref;
        
                const updatedClubRequests = {
                  ...existingClubRequests,
                  [this.requestName]: otherDocRef,
                };
        
                await userRef.update({
                  club_requests: updatedClubRequests,
                });
                await userDoc.ref.update({
                  club_name: `pending${this.goingClub}`,
                  clubStatus:'pending'
                });
                this.presentLoadingClub().then(() => {
                  setTimeout(() => {
                    this.dismissLoading();
                    this.showAlert2().then(()=>{
                      this.router.navigateByUrl('tabs/tab1').then(()=>{
                        location.reload();
                      })

                    });
                  }, 2000);
                });
              });
            }
            // Update club_name field in the user's record
          
          } else {
            if(this.pending=='pendingchess'){this.pendValue='chess'}
            if(this.pending=='pendingenvironment'){this.pendValue='environment'}
            if(this.pending=='pendingphotography'){this.pendValue='photography'}
            if(this.pending=='pendingsports'){this.pendValue='sports'}
            if(this.pending=='pendingmusic'){this.pendValue='music'}
            if(this.pending=='pendinggraduates'){this.pendValue='graduates'}
            if(this.pending=='pendingfine-arts'){this.pendValue='fine-arts'}
            if(this.pending=='pendingtheater'){this.pendValue='theater'}
            if(this.pending=='pendingvolunteering'){this.pendValue='volunteering'}
  if(this.clubName == this.pendValue){
    this.presentLoadingClub().then(() => {
      setTimeout(() => {
        this.dismissLoading();
        this.showAlertAlreadyRegistered(this.pendValue).then(async ()=>{
          const confirmed = await this.showAlertRequestRemove();
          if (!confirmed) {
            return;
          }else{
            const collectionRef = this.firestore.collection('users').ref;
            const query = collectionRef.where('club_name', '==', this.pendValue).where('type','==','leader');
            query.get().then((querySnapshot) => {
              const typedQuerySnapshot = querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
            
              typedQuerySnapshot.forEach((doc) => {
                const clubRequests = doc.data()['club_requests'];
                const updatedClubRequests = { ...clubRequests };
            
                for (const key in updatedClubRequests) {
                  if (updatedClubRequests.hasOwnProperty(key) && key === this.requestName) {
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
            })
              .then(() => {
                console.log('Document successfully updated.');
              })
              .catch((error) => {
                console.error('Error updating document:', error);
              });           
              this.removingLoadingClub().then(() => {
              setTimeout(() => {
                this.dismissLoading();
                this.showAlert3().then(()=>{
                  this.router.navigateByUrl('tabs/tab1').then(()=>{
                    location.reload();
                  })

                });
              }, 2000);
            });
          }
        })
      })
    })
  }
  
  else{

    this.presentLoadingClub().then(() => {
      setTimeout(() => {
        this.dismissLoading();
        this.showAlertAlreadyRegistered(this.pendValue).then(async ()=>{
          const confirmed = await this.showAlertRequestSent();
          if (!confirmed) {
            return;
          }else{
            const collectionRef = this.firestore.collection('users').ref;
            const query = collectionRef.where('club_name', '==', this.pendValue);
            
            query.get().then((querySnapshot) => {
              const typedQuerySnapshot = querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
            
              typedQuerySnapshot.forEach((doc) => {
                const clubRequests = doc.data()['club_requests'];
                const updatedClubRequests = { ...clubRequests };
            
                for (const key in updatedClubRequests) {
                  if (updatedClubRequests.hasOwnProperty(key) && key === this.requestName) {
                    delete updatedClubRequests[key];
                    break; // Assuming only one matching entry should be removed
                  }
                }
            
                doc.ref.update({ club_requests: updatedClubRequests });
              });
            });

            querySnapshot.forEach(async (doc) => {
              const userRef = doc.ref;
              console.log(userRef);
      
              const userData = doc.data() as userData;
              const userName = userData.name; // Assuming the name field exists in the user document
              console.log(userName);
              this.goingClub=userData.club_name;
              const existingClubRequests = userData.club_requests || {};
      
              // Get a reference to the document you want to add as a reference
              const otherDocRef = this.firestore.doc(`users/${this.userId}`).ref;
      
              const updatedClubRequests = {
                ...existingClubRequests,
                [this.requestName]: otherDocRef,
              };
      
              await userRef.update({
                club_requests: updatedClubRequests,
              });
              await userDoc.ref.update({
                club_name: `pending${this.goingClub}`,
                clubStatus:'pending'
              });
              this.presentLoadingClub().then(() => {
                setTimeout(() => {
                  this.dismissLoading();
                  this.showAlert2().then(()=>{
                    this.router.navigateByUrl('tabs/tab1').then(()=>{
                      location.reload();
                    })

                  });
                }, 2000);
              });
            });
          }

        })
      }, 2000);
    });        
  }

          }
        }
          
          
         
        // Continue with the rest of your logic...
      }
      async showAlert3() {
        return new Promise<void>(async (resolve) => {
          const alert = await this.alert.create({
            header: 'You request has been cancelled successfully',
            message: '',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  resolve();
                },
              }
            ],
          });
      
          await alert.present();
        });
      }
      async removingLoadingClub() {
        const loading = await this.loading.create({
          message: `cancelling your request ...`,
          spinner: 'lines', // Choose the type of spinner you want
          translucent: true,
          backdropDismiss: false, // Prevent dismissing the loading by tapping outside
          keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
        });
        await loading.present();
      }
      async showAlertRequestRemove(): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
          const alert = await this.alert.create({
            header: 'do you want to Cancel the registration request?',
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
      async showAlertRequestSent(): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
          const alert = await this.alert.create({
            header: 'do you want to change the registration request to this club?',
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
      async showAlertAlreadyRegistered(x:string): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
          const alert = await this.alert.create({
            header: `you already have a pending request in ${x} club!`,
            message: '',
            buttons: [
                       {
                text: 'Ok',
                handler: () => {
                  resolve(true); // Resolve with false when Cancel button is clicked
                }
              },
      
            ]
          });
      
          await alert.present();
        });
      }
      async showAlert(): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
          const alert = await this.alert.create({
            header: `Are You Sure You want to register in ${this.clubName} club ?`,
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
      async presentLoadingClub() {
        const loading = await this.loading.create({
          message: `registering in ${this.clubName} club...`,
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
      async showAlert2() {
        return new Promise<void>(async (resolve) => {
          const alert = await this.alert.create({
            header: 'You request has been sent to the club leader!',
            message: '',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  resolve();
                },
              }
            ],
          });
      
          await alert.present();
        });
      }
   
      async showAlertSent() {
        return new Promise<void>(async (resolve) => {
          const alert = await this.alert.create({
            header: 'you request was already sent',
            message: '',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  resolve();
                },
              }
            ],
          });
      
          await alert.present();
        });
      }
      goToDetails(record: Record,i:number) {
        this.tab11=true;
        this.thea=true;
      this.router.navigate(['event-details'], { state: {thea:this.thea, record, bail: this.bails[i],leader:this.leader,tab1:this.tab1,tab11:this.tab11 } });
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
      async showMembers() {
        console.log(this.clubName);
        this.clubMem=true;
        this.router.navigate(['show-members'], { state: {clubMem: this.clubMem , eventMem:this.eventMem,clubName:this.clubName}});
      }
      goBck(){
        this.nav.navigateBack('tabs/tab1');
            }
      }
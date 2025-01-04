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
  selector: 'app-student-info',
  templateUrl: './student-info.page.html',
  styleUrls: ['./student-info.page.scss'],
})
export class StudentInfoPage implements OnInit {
public name:string='';
public userRecord:userData[]=[];
public recordId:any;
public recordN:any;
public isLeader:boolean=false;
public isLeader2:boolean=false;
public theLeader:boolean=false;
public clubMem:boolean=false;
public colleges:boolean=false;
public college:boolean=false;
public clubMem2:boolean=false;
public club:boolean=false;
public event:boolean=false;
public eventMem:boolean=false;
public eventMem2:boolean=false;
public clubName:string='';
public userId:any;
  constructor(
    public nav: NavController,
    public alert: AlertController,
    private loading: LoadingController,
    public firestore: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
    public auth: authenticationService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.name = navigation.extras.state['userName'];
      this.clubMem = navigation.extras.state['clubMem'];
      this.eventMem = navigation.extras.state['eventMem'];
      this.clubName = navigation.extras.state['clubName'];
      this.recordId = navigation.extras.state['record'];
      this.recordN = navigation.extras.state['recordN'];
      this.colleges = navigation.extras.state['colleges'];
if(this.clubMem){
  this.club=true;
}
if(this.eventMem){
  this.event=true;
}
if(this.colleges){
  this.college=true;
}
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
         if(userData.type=='leader'){
          this.isLeader=true;
         }
            if(userData.type=='leader'&&this.clubName==userData.club_name){
              this.isLeader2=true;
            }
          } 
        });
    }

      this.firestore
      .collection<userData>('users', (ref) => ref.where('name', '==', this.name))
      .valueChanges()
      .subscribe((users: userData[]) => {
        this.userRecord = users;
        if(users[0].type=='leader'){
          this.theLeader=true;
        }
      
        console.log(this.userRecord);
      });
     
  }
removeUser(){
this.leaveClub();
}
async showAlertRemoveEvent(): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const alert = await this.alert.create({
      header: 'are you sure you want to remove this user from this event ?',
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
goBck(){
  if(this.colleges){
    this.nav.navigateBack(['show-members'], { state: {colleges:this.colleges,eventName:this.recordN,clubName:this.clubName,eventMem:this.eventMem,eventMem2:this.eventMem2}});

  }
  if(this.clubMem && !this.colleges||this.clubMem2&&!this.colleges ){
     this.nav.navigateBack(['show-members'], { state: {clubName:this.clubName,clubMem2:this.clubMem2}});
    
  }
  if(this.eventMem||this.eventMem2){
     this.nav.navigateBack(['show-members'], { state: {eventName:this.recordN,clubName:this.clubName,eventMem:this.eventMem,eventMem2:this.eventMem2}});
    
    
  }
}
    async removeUser2() {
      const confirmed = await this.showAlertRemoveEvent();
      if (!confirmed) {
        return;
      }
    
      const eventId = this.recordId;
      const sessionValue = sessionStorage.getItem('currentUser');
    
      const userQuery = this.firestore.collection('users').ref.where('name', '==', this.name);
      const userSnapshot = await userQuery.get();
    
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const user = userDoc.data() as userData;
        const events = user.events || [];
    
        const eventRefIndex = events.findIndex(
          (ref: any) => ref.path === this.clubName + '/' + eventId
        );
    
        if (eventRefIndex !== -1) {
          events.splice(eventRefIndex, 1); // Remove the event reference from the array
          await this.firestore.firestore.runTransaction(async (transaction) => {
            transaction.update(userDoc.ref, { events: events });
          });
    
          console.log('Event reference removed from user document successfully');
    
          await this.presentLoading();
          setTimeout(async () => {
            this.eventMem2=true;
            await this.dismissLoading();
            await this.presentAlert();
           await this.router.navigate(['show-members'], { state: {eventName:this.recordN,clubName:this.clubName,eventMem:this.eventMem,eventMem2:this.eventMem2}});
              location.reload();
          }, 2000);
        }
      }
    }
async presentAlert(): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const alert = await this.alert.create({
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

async presentLoading() {
  const loading = await this.loading.create({
    message: 'removing user from event...',
    spinner: 'lines', // Choose the type of spinner you want
    translucent: true,
    backdropDismiss: false, // Prevent dismissing the loading by tapping outside
    keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
  });
  await loading.present();
}
async leaveClub() {
  
  const confirmed = await this.showAlert();
  if (!confirmed) {
    return;
  }
  this.presentLoadingCancel().then(async () => {
    setTimeout(async () => {
      this.dismissLoading();
      // Get a reference to the 'users' collection
      const usersCollection = this.firestore.collection<any>('users');
  
      // Create a query to find the document where 'name' is equal to 'this.name'
      const query = usersCollection.ref.where('name', '==', this.name);
  
      // Execute the query and get the QuerySnapshot
      const querySnapshot = await query.get();
  
      // Check if the query returned any documents
      if (!querySnapshot.empty) {
        // Get the first document in the QuerySnapshot
        const doc = querySnapshot.docs[0];
  
        // Update the 'club_name' field of the document
        await doc.ref.update({
          club_name: 'notRegistered'
        });
  
        // Show the alert and navigate to the club page
        await this.showAlert2().then(async () => {
          this.clubMem2=true;
          console.log(this.clubName);
          await this.router.navigate(['show-members'], { state: {clubName:this.clubName,clubMem2:this.clubMem2}});
            location.reload();

        
        });
      } else {
        console.error('No user found with the name', this.name);
      }
    }, 2000);
  });
}
async showAlert(): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const alert = await this.alert.create({
      header: 'Are you sure you want to Remove user from this club?',
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

async showAlert2() {
  return new Promise<void>(async (resolve) => {
    const alert = await this.alert.create({
      header: 'user is removed successfully',
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
async presentLoadingCancel() {
  const loading = await this.loading.create({
    message: 'removing user from this club...',
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

}

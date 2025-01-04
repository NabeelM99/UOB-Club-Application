import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { authenticationService, userData } from 'src/app/services/authentication.service';
import firebase from 'firebase/compat/app';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { TheaterPage } from '../clubs/theater/theater.page';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.page.html',
  styleUrls: ['./add-events.page.scss'],
})
export class AddEventsPage implements OnInit {
  public page: string = 'add-events';
  signInForm: FormGroup;
  va: any;
  submitted = false;
  submitted2 = false;
  submitted3 = false;
  submitted4 = false;
  submitted5 = false;
  public it:boolean=false;
  public bu:boolean=false;
  public ee:boolean=false;
  public filePath:string='';
  submitted6 = false;
  name = "";
  pass = "";
  public reloaded:boolean=true;
  public createdBy: string = '';
  public field:string='';
  public college:string='';
  public userId: any;
  public club: string = '';
  public sample1:any;
public file:any;
  constructor(
    public alertCtrl: AlertController,
    public formbuilder: FormBuilder,
    public nav: NavController,
    public fire: authenticationService,
    private modalController: ModalController,
    public alert: AlertController,
    private loading: LoadingController,
    public firestore: AngularFirestore,
    private storage: AngularFireStorage,
    public router:Router,
  ) {
    this.signInForm = formbuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      date: [null, Validators.compose([Validators.required,])],
      location: [null, Validators.compose([Validators.required,])],
      type: [null, Validators.compose([Validators.required,])],
      photo: [null, Validators.compose([Validators.required,])],
      info: [null, Validators.compose([Validators.required, Validators.minLength(10)])],
    });
  }

  get f() {
    return this.signInForm.controls;
  }

  async ngOnInit() {
    this.fire.checkUserAuthentication(this.page);
    const sessionValue = sessionStorage.getItem('currentUser');
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.userId = userId;
    }
    const doc = await firstValueFrom(this.firestore.collection('users').doc(this.userId).get());
    if (doc.exists) {
      const user = doc.data() as userData;
      this.club = user.club_name;
      this.field=user.field;
      const firstTwoLetters = this.field.substring(0, this.field.indexOf('-'));
      this.college=firstTwoLetters;
    }
   
    this.firestore.collection('users').doc(this.userId).get().subscribe(
      async (userDoc) => {
        if (userDoc.exists) {
          const x = userDoc.data() as userData;
          if (x.type === 'leader') {
            console.log(this.college);
            console.log(`Welcome ${this.club} Club leader`);          } else {
            this.nav.navigateForward('tabs/tab1');
              this.showAlertUser();
          }
        }
      }
    );
  }
  async showAlertUser() {
    return new Promise<void>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: 'Sorry, Only Club Leaders Can Access This Page',
        message: '',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              resolve(); // Resolve the promise when the OK button is clicked
            },
          },
        ],
      });
  
      await alert.present();
    });
  }

  subName() {
    this.submitted = true;
  }

  subPassword() {
    this.submitted2 = true;
  }

  subLocation() {
    this.submitted3 = true;
  }

  subType() {
    this.submitted4 = true;
  }
  subInfo(){
    this.submitted6= true;
  }

  getCurrentDateTime(): string {
    const current = new Date();
    return formatDate(current, 'yyyy-MM-ddTHH:mm', 'en');
  }

  handleFileInput(event: any): void {
    this.submitted5 = true;
    const file = event.target.files[0]; // Access the file using item(0)
   this.file=file;
    console.log(file);
    this.signInForm.patchValue({
      photo: file
    });
  }
  addEvent() {
    this.showAlert().then((alert) => {
      if (alert.role === 'confirm') {
        this.presentLoading().then(() => {
          this.uploadPhoto().then(() => {
            this.dismissLoading();
            this.showSuccessAlert();
          }).catch(() => {
            this.dismissLoading();
            this.showExistingEventAlert();
          });
        }).catch(() => {
          this.dismissLoading();
        });
      }
    }).catch(() => {
      this.showErrorAlert();
    });
  }
  uploadPhoto() {
    return new Promise<void>((resolve, reject) => {
      if (this.signInForm.valid) {
        const formValue = this.signInForm.value;
        if (this.file) {
          if(formValue.type=='college'){
            this.filePath = `clubs/${this.college}/${this.file.name}`;
          }else{
             this.filePath = `clubs/${this.club}/${this.file.name}`;
          }
          const fileref = this.storage.ref(this.filePath);
          const task = this.storage.upload(this.filePath, this.file);
  
          task.snapshotChanges().pipe(
            finalize(() => {
              fileref.getDownloadURL().subscribe((downloadurl) => {
                if(formValue.type=='college'){
                  const dateValue = new Date(formValue.date).getTime();
                  const dateTimeStamp = firebase.firestore.Timestamp.fromMillis(dateValue);
                  const modifiedValue = {
                    overview: formValue.info,
                    feedbacks: [],
                    name: formValue.name.toLowerCase(),
                    date: dateTimeStamp,
                    location: formValue.location,
                    type: formValue.type,
                    club_name: this.college,
                    createdBy: this.userId,
                    rating: {
                      zero: 0,
                      one: 0,
                      two: 0,
                      three: 0,
                      four: 0,
                    },
                    photoUrl: downloadurl, // Add the photo URL to the modifiedValue object
                  };
    
                  // Check if an event with a similar name already exists (case-insensitive)
                  this.firestore
                    .collection(this.college)
                    .get()
                    .toPromise()
                    .then((querySnapshot) => {
                      const existingEvents: string[] = [];
                      if (querySnapshot) {
                        querySnapshot.forEach((doc) => {
                          const eventData = doc.data() as any;
                          existingEvents.push(eventData.name.toLowerCase().trim());
                        });
                      }
    
                      const newNameLowercase = modifiedValue.name.toLowerCase().trim();
                      const hasSimilarName = existingEvents.some(
                        (eventName) => eventName === newNameLowercase
                      );
    
                      if (hasSimilarName) {
                        // An event with a similar name already exists
                        reject();
                      } else {
                        // No event with a similar name exists, add the new event
                        this.firestore
                          .collection(this.college)
                          .add(modifiedValue)
                          .then((docRef) => {
                            // Get the ID of the added document
                            const addedDocId = docRef.id;
                            console.log('Event added to Firebase collection with ID:', addedDocId);
                            resolve();
                          })
                          .catch((error) => {
                            console.error('Error adding event to Firebase collection:', error);
                            reject();
                          });
                      }
                    })
                    .catch((error) => {
                      console.error('Error checking for existing events:', error);
                      reject();
                    });
                }else{
                const dateValue = new Date(formValue.date).getTime();
                const dateTimeStamp = firebase.firestore.Timestamp.fromMillis(dateValue);
                const modifiedValue = {
                  overview: formValue.info,
                  feedbacks: [],
                  name: formValue.name.toLowerCase().trim(),
                  date: dateTimeStamp,
                  location: formValue.location,
                  type: formValue.type,
                  club_name: this.club,
                  createdBy: this.userId,
                  rating: {
                    zero: 0,
                    one: 0,
                    two: 0,
                    three: 0,
                    four: 0,
                  },
                  photoUrl: downloadurl, // Add the photo URL to the modifiedValue object
                };
  
                // Check if an event with a similar name already exists (case-insensitive)
                this.firestore
                  .collection(this.club)
                  .get()
                  .toPromise()
                  .then((querySnapshot) => {
                    const existingEvents: string[] = [];
                    if (querySnapshot) {
                      querySnapshot.forEach((doc) => {
                        const eventData = doc.data() as any;
                        existingEvents.push(eventData.name.toLowerCase().trim());
                      });
                    }
  
                    const newNameLowercase = modifiedValue.name.toLowerCase().trim();
                    const hasSimilarName = existingEvents.some(
                      (eventName) => eventName === newNameLowercase
                    );
  
                    if (hasSimilarName) {
                      // An event with a similar name already exists
                      reject();
                    } else {
                      // No event with a similar name exists, add the new event
                      this.firestore
                        .collection(this.club)
                        .add(modifiedValue)
                        .then((docRef) => {
                          // Get the ID of the added document
                          const addedDocId = docRef.id;
                          console.log('Event added to Firebase collection with ID:', addedDocId);
                          resolve();
                        })
                        .catch((error) => {
                          console.error('Error adding event to Firebase collection:', error);
                          reject();
                        });
                    }
                  })
                  .catch((error) => {
                    console.error('Error checking for existing events:', error);
                    reject();
                  });
                }
              });
            })
          ).subscribe();
        } else {
          reject();
        }
      } else {
        reject();
      }
    });
  }
  showExistingEventAlert() {
    this.alert.create({
      header: 'Event with the same name already exists',
      message: 'Please choose a different name for the event.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  
  showSuccessAlert() {
    this.alert.create({
      header: 'Event added successfully',
      message: 'The event has been added successfully.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  
  showErrorAlert() {
    this.alert.create({
      header: 'Error',
      message: 'An error occurred while adding the event.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  async showAlert2() {
    const alert = await this.alert.create({
      header: 'Event Added Successfully!',
      message: '',
      buttons: []
    });

    await alert.present();

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  }

  dismissAlert() {
    this.alert.dismiss();
  }

  async showAlert() {
    const alert = await this.alert.create({
      header: 'Are You Sure?',
      message: '',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();

    return alert.onDidDismiss();
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

  dismissLoading() {
    this.loading.dismiss();
  }
  close() {
    this.modalController.dismiss({
      'dismissed': true,
      'reloaded': true // Set the 'reloaded' value as true
    }).then(() =>{
      const r = this.reloaded;
      this.router.navigate(['tabs/tab1'],).then(()=>{
        location.reload();
      })
    }
    );
  }

}
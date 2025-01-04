import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController, NavParams } from '@ionic/angular';
import { authenticationService, userData } from 'src/app/services/authentication.service';
import firebase from 'firebase/compat/app';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, switchMap } from 'rxjs/operators';
import { TheaterPage } from '../clubs/theater/theater.page';
import { Router } from '@angular/router';
import { Record } from 'src/app/services/retrieve-events.service';
import { firstValueFrom, from } from 'rxjs';
@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {
  @Input()
  receivedRecordName!: string;
  @Input()
  receivedRecordClub!: string;
  public page: string = 'edit-events';
  public receivedRecord: Record[]=[];
  public records:Record[]=[];
  signInForm: FormGroup;
  va: any;
  submitted = false;
  submitted2 = false;
  submitted3 = false;
  submitted4 = false;
  submitted5 = false;
  submitted6 = false;
  name = "";
  pass = "";
  public reloaded:boolean=true;
  public createdBy: string = '';
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
      info: [null, Validators.compose([Validators.required, Validators.minLength(10)])],
    });
  }

  get f() {
    return this.signInForm.controls;
  }
  async ngOnInit() {
    this.fire.checkUserAuthentication(this.page);
    console.log(this.receivedRecordClub);
    console.log(this.receivedRecordName);
    const sessionValue = sessionStorage.getItem('currentUser');
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.userId = userId;
    }

    const doc = await firstValueFrom(this.firestore.collection('users').doc(this.userId).get());
    if (doc.exists) {
      const user = doc.data() as userData;
      this.club = user.club_name;
    }
    this.firestore.collection('users').doc(this.userId).get().subscribe(
      async (userDoc) => {
        if (userDoc.exists) {
          const x = userDoc.data() as userData;
          if (x.type === 'leader') {
            console.log(`Welcome ${this.club} Club leader`);
           
            this.firestore
            .collection(this.receivedRecordClub)
            .ref.where('name', '==', this.receivedRecordName)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const record = doc.data() as Record; // Explicitly define the type of 'record'

                // Convert the Firestore timestamp back to JavaScript Date
                const date = record.date.toDate();

                // Format the date value
                const formattedDate = formatDate(date, 'yyyy-MM-ddTHH:mm', 'en');
        
                this.signInForm.patchValue({
                  name: record.name,
                  location: record.location,
                  type: record.type,
                  info: record.overview,
                  date: formattedDate, // Prefill the date input field with the formatted date value
                });
              });
            });
            
          } else {
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

  }
  async editEvent() {
    const confirmed = await this.showAlert();
    if (!confirmed) {
      return;
    }
  
    if (this.signInForm.valid) {
      const formValue = this.signInForm.value;
      const { name, date, location, type, info } = formValue;
  
      // Convert names to lowercase for case-insensitive comparison
      const receivedRecordNameLowerCase = this.receivedRecordName.toLowerCase().trim();
      const enteredNameLowerCase = name.toLowerCase().trim();
  
      // Check if the name has been changed
      if (enteredNameLowerCase !== receivedRecordNameLowerCase) {
        // Check if the new name already exists in the collection
        const existingEventSnapshot = await this.firestore
          .collection(this.receivedRecordClub)
          .ref
          .where('name', '==', enteredNameLowerCase)
          .get();
  
        if (!existingEventSnapshot.empty) {
          // The new name already exists, handle this case
          await this.showExistingEventAlert();
          return;
        }
      }
  
      const timestamp = firebase.firestore.Timestamp.fromDate(new Date(date));
  
      const recordSnapshot = await this.firestore
        .collection(this.receivedRecordClub)
        .ref
        .where('name', '==', this.receivedRecordName)
        .get();
  
      await Promise.all(
        recordSnapshot.docs.map(async (doc) => {
          const file = this.file;
          if (file) {
            const filePath = `clubs/${this.club}/${file.name}`;
            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(filePath, file);
  
            await task.snapshotChanges().pipe(
              finalize(() => {
                return fileRef.getDownloadURL().pipe(
                  switchMap((downloadUrl) => {
                    // Update the document with the downloadUrl value
                    return this.firestore
                      .collection(this.receivedRecordClub)
                      .doc(doc.id)
                      .update({
                        name:name.toLowerCase().trim(),
                        date: timestamp,
                        location,
                        type,
                        photoUrl: downloadUrl,
                        overview: info
                      });
                  })
                ).toPromise();
              })
            ).toPromise();
          } else {
            // If the file is not provided, update the document without the photoUrl field
            await this.firestore
              .collection(this.receivedRecordClub)
              .doc(doc.id)
              .update({
                name:name.toLowerCase().trim(),
                date: timestamp,
                location,
                type,
                overview: info
              });
          }
        })
      );
  
      this.presentLoading().then(() => {
        setTimeout(async () => {
          this.dismissLoading();
          await this.showSuccessEditAlert();
          this.nav.navigateBack('tabs/tab1').then(() => {
            window.location.reload();
          });
        }, 2000);
      });
    }
  }
  showExistingEventAlert() {
    this.alert.create({
      header: 'Event with the same name already exists',
      message: 'Please choose a different name for the event.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  

  async showSuccessEditAlert(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: 'Event modified successfully',
        message: 'The event has been added successfully.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              resolve(true); // Resolve with true when Yes button is clicked
            }
          },
         
        ]
      });

      await alert.present();
    });
  }
  
  showErrorAlert() {
    this.alert.create({
      header: 'Error',
      message: 'An error occurred while modifying the event.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  async showAlert2() {
    const alert = await this.alert.create({
      header: 'Event Modified Successfully!',
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

  async showAlert(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: 'are you sure you want to modify this event ?',
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

  async presentLoading() {
    const loading = await this.loading.create({
      message: 'modifying event...',
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
      'dismissed': true
    });
  }
}

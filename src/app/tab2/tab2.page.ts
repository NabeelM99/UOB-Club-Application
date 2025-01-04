import { Component, OnInit } from '@angular/core';
import { RetrieveEventsService, Record } from '../services/retrieve-events.service';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { authenticationService, userData } from '../services/authentication.service';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';
import { formatDate } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { CreatedEventsPage } from '../pages/created-events/created-events.page';
import { initializeApp } from 'firebase/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';

export interface Page {
  name: string;
  imagePath: string;
  route: string;
}
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public page: string = 'tabs/tab2';
  public Record: Record[] = [];

  public admins: boolean = false;
  public show: string = 'card';
  public show2: string = 'item';
  public x: string = 'reorder-two-outline';
  public y: string = 'albums-outline';
  display: boolean = false;
  display2: boolean = false;
  but: boolean = false;
  Search: string = '';
  query: string = '';
  public loaded: boolean = false;
  feed: string = '';
  signInForm: FormGroup;
  va: any;
  submitted = false;
  submitted2 = false;
  submitted3 = false;
  submitted4 = false;
  submitted5 = false;
  public modified: any;
  submitted6 = false;
  submitted9 = false;
  name = "";
  pass = "";
  public reloaded: boolean = true;
  public createdBy: string = '';
  public userId: any;
  public club: string = '';
  public sample1: any;
  public file: any;
  displayedCount: number = 0;
  public starsNum: number = 0;
  counts: number = 0;
  public selected: string = '';
  public showz: boolean = false;
  public filteredRecords = [] as Record[];
  public ds = { date: [] as any, time: [] as any };
  public bails = [] as any;
  public bail: boolean = false;
  public comeFromTab2: boolean = false;
  public comeFromOld: boolean = false;
  public comeFromAll: boolean = false;
  public comeFromNew: boolean = false;

  public leader: boolean = false;
  public clubName: string = '';
  public rec1: Record[] = [];
  constructor(public retrieve: RetrieveEventsService,
    public router: Router,
    public auth: authenticationService,

    public formbuilder: FormBuilder,
    public firestore: AngularFirestore,
    public alert: AlertController,
    private loading: LoadingController,
    private storage: AngularFireStorage,
    private afData: AngularFirestore,
    public modalcontroller: ModalController
  ) {
    this.signInForm = formbuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      type: [null, Validators.compose([Validators.required,])],
      major: [null, Validators.compose([Validators.required,])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      photo: [null, Validators.compose([Validators.required,])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
    });
  }

  get f() {
    return this.signInForm.controls;
  }
  async ngOnInit() {
    await this.auth.checkUserAuthentication(this.page);
    this.initializePage();
  }

  initializePage() {
    const sessionValue = sessionStorage.getItem('currentUser');
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.userId = userId;
      this.firestore.collection('users').doc(this.userId).get()
        .subscribe((docSnapshot: firebase.firestore.DocumentSnapshot<unknown>) => {
          if (docSnapshot.exists) {
            const data = docSnapshot.data() as userData;
            this.clubName = data.club_name;
            if (data.type === 'leader') {
              this.leader = true;
            } else {
              if (data.type === 'admin') {
                this.leader = false;
                this.admins = true;
              }
              else {
                this.leader = false;
              }
            }
            // Do something with the user data
          } else {
            console.log('User document not found');
          }



        }, (error: any) => {
          console.error('Error getting user:', error);
        });
    }
    const collections = ['graduates', 'volunteering', 'theater', 'environment', 'music', 'fine_arts', 'sports', 'chess', 'photography', 'it', 'bu', 'ee'];
    this.retrieve.getAllRecordsFromCollections(collections).then(async () => {
      this.Record = this.retrieve.records;
      console.log(this.Record);
      this.ds = this.retrieve.ds;
      this.init();
      const currentDate = new Date();

      for (const ev of this.Record) {
        let foundEventRef: DocumentReference<any>;
        for (const collection of collections) {
          const querySnapshot = await this.firestore.collection(collection).ref.where('name', '==', ev.name).get();
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              foundEventRef = doc.ref;
            });
            break; // Stop searching other collections once a match is found
          }
        }
        const doc = await firstValueFrom(this.firestore.collection('users').doc(this.userId).get());
        if (doc.exists) {
          this.loaded = true;
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
    });
  }

  subName() {
    this.submitted = true;
  }

  subPassword() {
    this.submitted2 = true;
  }
  subType() {
    this.submitted9 = true;
  }
  submajor() {
    this.submitted3 = true;
  }

  subEmail() {
    this.submitted4 = true;
  }
  subInfo() {
    this.submitted6 = true;
  }

  getCurrentDateTime(): string {
    const current = new Date();
    return formatDate(current, 'yyyy-MM-ddTHH:mm', 'en');
  }

  handleFileInput(event: any): void {
    this.submitted5 = true;
    const file = event.target.files[0]; // Access the file using item(0)
    this.file = file;
    console.log(file);
    this.signInForm.patchValue({
      photo: file
    });
  }
  addEvent() {
    this.showAlertone().then((alert) => {
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
  showExistingEventAlert() {
    this.alert.create({
      header: 'user with the same name already exists',
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  showSuccessAlert() {
    this.alert.create({
      header: 'user added successfully',
      message: 'new user record has been added successfully.',
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
  async presentLoading() {
    const loading = await this.loading.create({
      message: 'adding new user...',
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
  async showAlertone() {
    const alert = await this.alert.create({
      header: 'Are You Sure you want to add new user?',
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
  uploadPhoto() {
    return new Promise<void>((resolve, reject) => {
      if (this.signInForm.valid) {
        const formValue = this.signInForm.value;
        if (this.file) {
          const filePath = 'users / ${ this.file.name }';
          const fileref = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, this.file);

          task.snapshotChanges().pipe(
            finalize(() => {
              fileref.getDownloadURL().subscribe((downloadurl) => {
                const modifiedValue = this.getModifiedUserData(formValue, downloadurl);

                // Check if a user with a similar name and type already exists (case-insensitive and trimmed)
                this.checkIfUserExists(formValue, modifiedValue)
                  .then(() => {
                    // No user with a similar name and type exists, add the new user
                    this.createUserAndAddToFirestore(formValue, modifiedValue)
                      .then(() => {
                        resolve();
                      })
                      .catch((error) => {
                        console.error('Error creating user or adding user data:', error);
                        reject('Error creating user.');
                      });
                  })
                  .catch((error) => {
                    console.error('Error checking for existing users:', error);
                    reject(error);
                  });
              });
            })
          ).subscribe();
        } else {
          reject('No file is selected.');
        }
      } else {
        reject('Invalid form.');
      }
    });
  }

  getModifiedUserData(formValue: any, photoUrl: string): any {
    const hashedPassword = formValue.password;

    if (formValue.type === 'student') {
      return {
        name: formValue.name.toLowerCase().trim(),
        password: hashedPassword,
        type: formValue.type,
        clubStatus: '',
        eventStatus: '',
        events: [],
        field: formValue.major,
        club_name: 'notRegistered',
        email: formValue.email,
        photoUrl,
      };
    } else if (formValue.type === 'leader') {
      return {
        name: formValue.name.toLowerCase().trim(),
        password: hashedPassword,
        type: formValue.type,
        event_requests: {},
        club_requests: {},
        intro: '',
        field: formValue.major,
        club_name: 'notLeader',
        email: formValue.email,
        photoUrl,
      };
    } else {
      return {
        name: formValue.name.toLowerCase().trim(),
        password: hashedPassword,
        type: formValue.type,
        event_requests: {},
        club_requests: {},
        intro: '',
        field: formValue.major,
        club_name: 'notLeader',
        email: formValue.email,
        photoUrl,
      };
    }
  }

  checkIfUserExists(formValue: any, modifiedValue: any): Promise<void> {
    return this.firestore
      .collection('users', (ref) =>
        ref
          .where('name', '==', formValue.name.trim().toLowerCase())
          .where('type', '==', formValue.type)
      )
      .get()
      .toPromise()
      .then((querySnapshot: any) => {
        if (!querySnapshot.empty) {
          // A user with a similar name and type already exists
          throw new Error('A user with a similar name and type already exists.');
        }
      });
  }

  createUserAndAddToFirestore(formValue: any, modifiedValue: any): Promise<void> {

    return this.firestore
      .collection('users')
      .add(modifiedValue)
      .then((docRef) => {
        // Get the ID of the added document
        const addedDocId = docRef.id;
        console.log('User added to Firebase collection with ID:', addedDocId);
      });

  }

  init() {
    this.filteredRecords = this.Record;
  }
  goToCreatedEvents() {
    this.router.navigateByUrl('created-events');
  }



  close() {
    this.modalcontroller.dismiss();
  }
  goToDetails2() {
    this.router.navigate(['my-events']);

  }

  changeDisplay() {
    this.display = !this.display;
    this.but = !this.but;
  }


  goToDetails(record: Record, i: number) {
    this.comeFromTab2 = true;
    console.log(this.bails);
    console.log(i);
    const currentDate = new Date();
    const clickedDate = record.date.toDate();
    if (clickedDate < currentDate) {
      this.router.navigate(['my-event-details'], { state: { record } });
    } else {
      this.router.navigate(['event-details'], { state: { record, bail: this.bails[i], tab2: this.comeFromTab2, leader: this.leader } });
    }
  }

  checks() {
    this.init();
    if (this.selected == '') { this.searchAll(); }
    if (this.selected == 'all') { this.searchAll(); }
    if (this.selected == 'name') { this.searchName(); }
    if (this.selected == 'club-name') { this.searchClubName(); }
    if (this.selected == 'date') { this.searchDate(); }
  }

  searchName() {
    this.init();
    let val = this.Search;
    if (val && val.trim() != "") {
      this.filteredRecords = this.filteredRecords.filter((item) => {
        return (item.name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) > -1)
      });
      this.ds = { date: [], time: [] }; // Clear the ds array

      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = '${year}-${month}-${day}'; // Format the date in YYYY-MM-DD format
        const formattedTime = '${hours}:${minutes}:${seconds}'; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      });
    } else {
      // Reset the ds array to its original values
      this.ds = { date: [], time: [] }; // Clear the ds array
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = '${year}-${month}-${day}'; // Format the date in YYYY-MM-DD format
        const formattedTime = '${hours}:${minutes}:${seconds}'; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      })
    }
  }
  searchClubName() {
    this.init();
    let val = this.Search;
    if (val && val.trim() != "") {
      this.filteredRecords = this.filteredRecords.filter((item) => {
        return (item.club_name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) > -1)
      });
      this.ds = { date: [], time: [] }; // Clear the ds array

      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = '${year}-${month}-${day}'; // Format the date in YYYY-MM-DD format
        const formattedTime = '${hours}:${minutes}:${seconds}'; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      });
    } else {
      // Reset the ds array to its original values
      this.ds = { date: [], time: [] }; // Clear the ds array
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = '${year}-${month}-${day}'; // Format the date in YYYY-MM-DD format
        const formattedTime = '${hours}:${minutes}:${seconds}'; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      })

    }
  }
  searchDate() {
    this.init();
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
      this.ds = { date: [], time: [] }; // Clear the ds array

      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = '${year}-${month}-${day}'; // Format the date in YYYY-MM-DD format
        const formattedTime = '${hours}:${minutes}:${seconds}'; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      });
    } else {
      // Reset the ds array to its original values
      this.ds = { date: [], time: [] }; // Clear the ds array
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = '${year}-${month}-${day}'; // Format the date in YYYY-MM-DD format
        const formattedTime = '${hours}:${minutes}:${seconds}'; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      })

    }
  }
  searchAll() {
    this.init();
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
      this.ds = { date: [], time: [] }; // Clear the ds array

      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = '${year}-${month}-${day}'; // Format the date in YYYY-MM-DD format
        const formattedTime = '${hours}:${minutes}:${seconds}'; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      });
    } else {
      // Reset the ds array to its original values
      this.ds = { date: [], time: [] }; // Clear the ds array
      this.filteredRecords.forEach((record) => {
        const time = record.date as firebase.firestore.Timestamp;
        const date = time.toDate();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Add 1 since getMonth() returns values from 0 to 11
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = '${year}-${month}-${day}'; // Format the date in YYYY-MM-DD format
        const formattedTime = '${hours}:${minutes}:${seconds}'; // Format the time in HH:MM:SS format
        this.ds.date.push(formattedDate);
        this.ds.time.push(formattedTime);
      })

    }
  }
}
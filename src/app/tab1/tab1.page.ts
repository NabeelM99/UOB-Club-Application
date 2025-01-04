import { Component, OnInit } from '@angular/core';
import { RetrieveEventsService, Record } from '../services/retrieve-events.service';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { authenticationService, userData } from '../services/authentication.service';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';
import { RetrieveClubEventsService } from '../services/retrieve-club-events.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AddEventsPage } from '../pages/add-events/add-events.page';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Page {
  name: string;
  imagePath: string;
  route: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  signInForm: FormGroup;
  va: any;
  public leaders: userData[] = [];
  submitted = false;
  submitted2 = false;
  submitted3 = false;
  submitted4 = false;
  public reg: boolean = false;
  submitted5 = false;
  public clubMem: boolean = false;
  public notLeader: boolean = false;
  public showmem: boolean = true;
  public title: boolean = false;
  submitted6 = false;
  name = "";
  comeFromTb1: boolean = false;
  pass = "";
  public reloaded: boolean = true;
  public createdBy: string = '';
  public userId: any;
  public club: string = '';
  public college: string = '';
  public sample1: any;
  public file: any;
  public page: string = 'tabs/tab1';
  public tab1: boolean = false;
  public admins: boolean = false;
  pages: Page[] = [
    {
      name: 'Chess',
      imagePath: '../../assets/images/chess/01.jpeg',
      route: '/chess',
    },
    {
      name: 'Sports',
      imagePath: '../../assets/images/sports/01.jpeg',
      route: '/sports',
    },
    {
      name: 'Music',
      imagePath: '../../assets/images/music/01.jpeg',
      route: '/music',
    },
    {
      name: 'Environment',
      imagePath: '../../assets/images/environment/01.jpeg',
      route: '/environment',
    },
    {
      name: 'Fine Arts',
      imagePath: '../../assets/images/fine_arts/02.jpeg',
      route: '/fine-arts',
    },
    {
      name: 'Graduates',
      imagePath: '../../assets/images/graduates/01.jpeg',
      route: '/graduates',
    },
    {
      name: 'Photography',
      imagePath: '../../assets/images/photography/01.jpeg',
      route: '/photography',
    },
    {
      name: 'Theater',
      imagePath: '../../assets/images/theater/01.jpeg',
      route: '/theater',
    },
    {
      name: 'Volunteering',
      imagePath: '../../assets/images/volunteering/01.jpeg',
      route: '/volunteering',
    },
    // Add more pages as needed
  ];
  public record: Record[] = [];
  public leader: boolean = false;
  public leader2: boolean = true;
  public theuser: userData[] = [];
  public events: Record[] = [];
  public bails = [] as any;
  public ds = { date: [] as any, time: [] as any };
  public imgs = { urls: [] as any };
  public chess: boolean = false;
  public notreg: boolean = true;
  public sports: boolean = false;
  public environment: boolean = false;
  public photography: boolean = false;
  public music: boolean = false;
  public theater: boolean = false;
  public fineArts: boolean = false;
  public volunteering: boolean = false;
  public graduates: boolean = false;
  public registered: boolean = false;
  public tab11: boolean = false;
  public clubName: string = '';
  public loaded: boolean = false;
  public load: boolean = false;
  constructor(public router: Router,
    private loading: LoadingController,
    private retrieveClubEventsService: RetrieveClubEventsService,
    public auth: authenticationService,
    public route: ActivatedRoute,
    private afData: AngularFirestore,
    private modalController: ModalController,
    public alert: AlertController,
    private storage: AngularFireStorage,
    public firestore: AngularFirestore,
    public formbuilder: FormBuilder,



  ) {
    this.signInForm = formbuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      leader: [null, Validators.compose([Validators.required,])],
      info: [null, Validators.compose([Validators.required, Validators.minLength(10)])],
    });
  }

  subPassword() {
    this.submitted2 = true;
  }
  subName() {
    this.submitted = true;
  }

  subInfo() {
    this.submitted6 = true;
  }


  subType() {
    this.submitted4 = true;
  }




  get f() {
    return this.signInForm.controls;
  }
  async ngOnInit() {
    await this.auth.checkUserAuthentication(this.page);
    await this.initializePage().then(() => {
      this.loaded = true;
      this.load = true;
      this.firestore.collection('users', ref => ref.where('type', '==', 'leader'))
        .valueChanges()
        .subscribe((users: unknown[]) => {
          const typedUsers = users as userData[]; // Cast the 'users' array to 'userData[]'
          console.log(typedUsers);
          this.leaders.push(...typedUsers);
          console.log(this.leaders);
        });
    });

    if (!localStorage.getItem('pageRefreshed')) {
      localStorage.setItem('pageRefreshed', 'true');
      window.location.reload();
      this.loaded = true;
      this.load = true;
    }
  }

  addEvent() {
    if (this.signInForm.valid) {
      const formValue = this.signInForm.value;
      this.name = formValue.name;

      this.firestore.collection(formValue.name).get().toPromise().then((querySnapshot) => {
        if (querySnapshot && querySnapshot.size > 0) {
          // Collection with the same name already exists, show alert
          this.showCollectionExistsAlert();
        } else {
          // Collection does not exist, proceed with creation
          this.showAlertone().then((alert) => {
            if (alert.role === 'confirm') {
              this.presentLoading().then(() => {
                // Check 'users' collection for club_name field
                const usersRef = this.firestore.collection('users');
                usersRef
                  .ref.where('name', '==', formValue.leader)
                  .get()
                  .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                      querySnapshot.forEach((doc) => {
                        const userRef = doc.ref;
                        const userData = doc.data() as userData;

                        const clubName = userData.club_name;
                        if (clubName === 'notLeader') {
                          // Update club_name for the user
                          this.firestore.collection(this.name).add({}).then(() => {
                            userRef.update({ club_name: this.name, intro: formValue.info }).then(() => {
                              this.dismissLoading();
                              this.showSuccessAlert();
                            }).catch(() => {
                              this.dismissLoading();
                              this.showErrorAlert();
                            });
                          })
                        } else {
                          this.dismissLoading();
                          // Leader is already assigned to a different club, show alert
                          this.showLeaderAssignedAlert();
                        }
                      });
                    }
                  })
                  .catch(() => {
                    this.dismissLoading();
                    this.showErrorAlert();
                  });
              });
            }
          });
        }
      });
    }
  }
  showLeaderAssignedAlert() {
    this.alert.create({
      header: 'this leader is already assigned to a different club',
      message: 'Please choose a different leader for the club.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  async presentLoading() {
    const loading = await this.loading.create({
      message: 'adding new club...',
      spinner: 'lines', // Choose the type of spinner you want
      translucent: true,
      backdropDismiss: false, // Prevent dismissing the loading by tapping outside
      keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
    });
    await loading.present();
  }
  showSuccessAlert() {
    this.alert.create({
      header: 'club added successfully',
      message: 'The club has been added successfully.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  showErrorAlert() {
    this.alert.create({
      header: 'Error',
      message: 'An error occurred while adding the club.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  async showAlertone() {
    const alert = await this.alert.create({
      header: 'Are you sure you want to create the club "${this.name}"?',
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
  showCollectionExistsAlert() {
    this.alert.create({
      header: 'a club with the same name already exists',
      message: 'Please choose a different name for the club.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  goToCollege() {
    this.router.navigate(['college-events']), {};
  }


  async initializePage() {
    this.reg = true;
    const sessionValue = sessionStorage.getItem('currentUser');
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.userId = userId;
    }
    const userDoc = await firstValueFrom(this.afData.collection('users').doc(this.userId).get());
    if (userDoc.exists) {
      const userRecord = userDoc.data() as userData;
      this.record = userRecord as unknown as Record[];
      this.clubName = userRecord.club_name;
      const field = userRecord.field;
      const firstTwoLetters = field.substring(0, field.indexOf('-'));
      this.college = firstTwoLetters;
      if (this.college == 'ee') {
        this.college = 'Engineering';

      }
      if (this.college == 'bu') {
        this.college = 'Business';

      }
      if (this.college == 'it') {
        this.college = 'Information Technology';

      }
      if (userRecord.type == 'leader') {
        this.notLeader = true;
      }


      if (userRecord.club_name == 'notLeader') {
        this.showmem = false;
        this.leader2 = false;
        this.title = true;
      }
      if (this.clubName == 'chess') {
        this.chess = true;
      } if (this.clubName == 'environment') {
        this.environment = true;
      } if (this.clubName == 'photography') {
        this.photography = true;
      } if (this.clubName == 'sports') {
        this.sports = true;
      } if (this.clubName == 'music') {
        this.music = true;
      } if (this.clubName == 'volunteering') {
        this.volunteering = true;
      } if (this.clubName == 'theater') {
        this.theater = true;
      } if (this.clubName == 'graduates') {
        this.graduates = true;
      } if (this.clubName == 'fine-arts') {
        this.fineArts = true;
      }
      if (userRecord.type === 'student') {
        if (userRecord.club_name === 'notRegistered' || userRecord.club_name === 'pendingchess' ||
          userRecord.club_name === 'pendingenvironment' || userRecord.club_name === 'pendingsports' || userRecord.club_name === 'pendingmusic' ||
          userRecord.club_name === 'pendinggraduates' || userRecord.club_name === 'pendingvolunteering' || userRecord.club_name === 'pendingfine-arts' ||
          userRecord.club_name === 'pendingtheater' || userRecord.club_name === 'pendingphotography'
        ) {
          this.reg = false;
          this.notreg = false;
          this.registered = false;
          this.load = true;
        } else {
          this.registered = true;
        }
      }
      if (userRecord.type === 'leader') {
        this.registered = true;
        this.theuser = [userRecord];
        this.leader = true;
      } else {
        if (userRecord.type === 'admin') {
          this.leader = false;
          this.admins = true;
        }
        else {
          this.leader = false;
        }
      }

    } else {
      console.log('User document does not exist');
    }

    const collectionName = this.clubName;
    this.retrieveClubEventsService.getAllRecordsFromCollections(collectionName).then(async () => {
      this.events = this.retrieveClubEventsService.records;
      this.ds = this.retrieveClubEventsService.ds;

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
  collegeEvents() {
    this.router.navigate(['college-events'], {});

  }
  async showMembers() {
    console.log(this.clubName);
    this.clubMem = true;
    this.comeFromTb1 = true;
    this.router.navigate(['show-members'], { state: { clubMem: this.clubMem, clubName: this.clubName, TB1: this.comeFromTb1 } });
  }
  gotop() {
    this.router.navigateByUrl('student-padge');
  }
  manageClub() {
    if (this.theuser && this.theuser.length > 0) {
      this.leader = true;
      const data = this.theuser[0];
      this.router.navigate([data.club_name]), { state: { leader: this.leader } };
    }
  }
  async leaveClub() {
    const confirmed = await this.showAlert();
    if (!confirmed) {
      return;
    }
    this.presentLoadingCancel().then(async () => {
      setTimeout(async () => {
        this.dismissLoading();
        this.firestore.collection('users').doc(this.userId).update({
          club_name: 'notRegistered'
        });
        await this.showAlert2();
        location.reload();
      }, 2000);
    });

  }
  async presentLoadingCancel() {
    const loading = await this.loading.create({
      message: 'removing you from this club...',
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
        header: 'Are you sure you want to leave this club?',
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
        header: 'You are no longer a club member',
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

  goToPage(route: string) {
    this.router.navigate([route]);
  }

  goToDetails(record: Record, i: number) {
    this.tab11 = true;
    this.router.navigate(['event-details'], { state: { record, bail: this.bails[i], leader: this.leader, tab11: this.tab11 } });
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: AddEventsPage,
      backdropDismiss: false
    });
    return await modal.present();
  }


  close() {
    this.modalController.dismiss();
  }

}
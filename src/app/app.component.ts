import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RetrieveClubEventsService } from './services/retrieve-club-events.service';
import { authenticationService, userData } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public userId: any;
  public still: boolean = false;
  public leader: boolean = false;
  public loaded: boolean = false;
  public adminor: boolean = true;
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


  ) { }

  async ngOnInit() {
    const sessionValue = sessionStorage.getItem('currentUser');
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.userId = userId;
      this.still = true;
    } else { this.still = false; }
    const userDoc = await firstValueFrom(this.afData.collection('users').doc(this.userId).get());
    if (userDoc.exists) {
      const userRecord = userDoc.data() as userData;
      if (userRecord.type == 'leader') {
        this.leader = true;
      }
      if (userRecord.type == 'admin') {
        this.adminor = false;
      }
    }
    this.loaded = true;
  }
  async gotologout() {
    const confirmed = await this.showAlert();
    if (!confirmed) {
      return;
    }
    this.router.navigateByUrl('logout');

  }
  async showAlert(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: 'Are you sure you want to Log Out?',
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
}
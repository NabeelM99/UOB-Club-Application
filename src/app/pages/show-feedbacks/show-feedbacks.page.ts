import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Record } from 'src/app/services/retrieve-events.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { userData } from 'src/app/tabs/tabs.page';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Injectable } from '@angular/core';
import { QuerySnapshot } from '@angular/fire/firestore';
import { authenticationService } from 'src/app/services/authentication.service';
export interface userDatas {
  name:string;
  email:string;
  password:string;
  type:string;
  events:any;
  club_name:string;
  photoUrl:string;
  feedbacks:{
    feedback:string,
    rated:boolean,
    rating:number,
    username:string
  }[];
}
@Component({
  selector: 'app-show-feedbacks',
  templateUrl: './show-feedbacks.page.html',
  styleUrls: ['./show-feedbacks.page.scss'],
})
export class ShowFeedbacksPage implements OnInit {
public record: Record | any;
rated = true;
showz = true;
numRate = 0;
public users:userDatas[]=[];
  constructor(
    public router:Router,
    public alertCtrl: AlertController,
    public nav: NavController,
    public loading: LoadingController,
    public auth:authenticationService,
    public firestore:AngularFirestore
  ){}
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.record = navigation.extras.state['record'] as Record;
    this.users.push(this.record);
  }
  }
      Rating(index: number) {
      this.rated = true;
      this.showz = true;
      this.numRate = index;
      for (let i = 0; i < this.datas.Rate.length; i++) {
        if (i <= index) {
          this.datas.Rate[i].Name = 'star';
        } else {
          this.datas.Rate[i].Name = 'star-outline';
        }
      }
    }
  
    public datas = {
      Rate: [
        { Name: 'star' },
        { Name: 'star' },
        { Name: 'star' },
        { Name: 'star' },
        { Name: 'star' }
      ]
    }; 
}
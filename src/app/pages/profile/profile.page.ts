import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { authenticationService } from 'src/app/services/authentication.service';
import { userData } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public page:string='profile';
  public dr:boolean=false;
  public std:boolean=false;
  submitted = false;
  submitted2 = false;
  name = "";
  public edits:boolean=false;
  pass = "";
  public url: any;
  public userId:any;
public userRecord:userData[]=[];
  constructor(
    public alertCtrl: AlertController,
    public formbuilder: FormBuilder,
    public nav: NavController,
    public fire: authenticationService,
    private storage: AngularFireStorage,
    public firestore:AngularFirestore,
  ) {

  }



  ngOnInit() {
    this.edits=false;
    this.fire.checkUserAuthentication(this.page);
    const sessionValue = sessionStorage.getItem('currentUser');
    console.log(sessionValue); // Output: mySessionValue
    if (sessionValue) {
      const userId = JSON.parse(sessionValue);
      this.userId = userId ;
       }
       this.firestore.collection('users').doc(this.userId).get().subscribe(
        (userDoc) => {
          if (userDoc.exists) {
            const x = userDoc.data() as userData;
            if(x.type=='leader'){
              this.dr=true;
              this.std=false;
            }else{this.std=true;
              this.dr=false;
            }
            this.userRecord.push(x);
          }})
  }

edit(){
this.edits=true;
}

}
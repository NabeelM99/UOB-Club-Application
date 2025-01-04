import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { authenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
  signInForm: FormGroup;
  submitted = false;
  submitted2 = false;
  name = "";
  pass = "";
  public url: any;

  constructor(
    public alertCtrl: AlertController,
    public formbuilder: FormBuilder,
    public nav: NavController,
    public fire: authenticationService,
    private storage: AngularFireStorage,
  ) {
    this.signInForm = formbuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
    });
  }

  get f() {
    return this.signInForm.controls;
  }

  ngOnInit() {
    sessionStorage.removeItem('currentUser');
    this.retrieveImage();
  }

  sub() {
    this.submitted = true;
  }

  subps() {
    this.submitted2 = true;
  }

  VerifyUser() {
    this.submitted = true;
    var user = this.signInForm.value;
    this.fire.loginUser(user);
  }

  retrieveImage() {
    const filePath = 'login/UOB.png'; // Replace with the correct path to your image
    const fileRef = this.storage.ref(filePath);

    fileRef.getDownloadURL().subscribe((downloadUrl) => {
      this.url = downloadUrl;
    });
  }
  forgotPass(){
    this.nav.navigateForward('forget-password');

  }
}
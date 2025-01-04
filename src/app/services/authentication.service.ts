import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { take } from 'rxjs-compat/operator/take';
import { DocumentReference } from 'firebase/firestore';
export interface userData {
  name:string;
  email:string;
  password:string;
  type:string;
  events:any[];
  club_name:string;
  photoUrl:string;
  event_requests:any;
  club_requests:any;
  field:any;
  intro:any;
  clubStatus:any;
  eventStatus:any;
}
@Injectable({
  providedIn: 'root'
})

export class authenticationService {
public uname:any;
public user:userData[] = [];
  constructor(
    public firestore:AngularFirestore,
    public fireauth:AngularFireAuth,
    public navCtrl:NavController,
    public alert:AlertController,
    public router:Router
  ) {     this.usersCollection = this.firestore.collection('users');

}
  private usersCollection: AngularFirestoreCollection<any>;

 

  loginUser(data: any) {
    this.firestore
      .collection('users', ref => ref.where('email', '==', data.email).where('password', '==', data.password))
      .get()
      .subscribe(async querySnapshot => {
        if (querySnapshot.size > 0) {
          // User exists
          const user = querySnapshot.docs[0].data() as userData;
          const field = user.name;
          const userId = querySnapshot.docs[0].id;
          sessionStorage.setItem('currentUser', JSON.stringify(userId));
          const userType = user.type;
          await this.showAlert(field);
          this.router.navigate(['/tabs/tab1']).then(()=>{
            location.reload();
          });
      
        } else {
          // User does not exist or invalid credentials
          this.showError();
        }
      });
  }
logOut(){
  sessionStorage.removeItem('currentUser');
  this.router.navigate(['/login']); // Redirect to the login page
}
async showAlert(name:string): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const alert = await this.alert.create({
      header: 'Successful Login',
      message: 'Welcome '+name,
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
  async showError(){
    let alert = await this.alert.create({
        header:'unsuccessful login',
        message:'Wrong email or password',
        buttons:['ok']
      })
alert.present();
  }
  async checkUserAuthentication(page:string) {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      this.navCtrl.navigateForward(page);
    } else {
      this.showAlert2();
    }
  }
  async checkUserAuthentication2(page:string,record:any) {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      this.navCtrl.navigateForward(page);
    } else {
      this.showAlert2();
    }
  }
  async showAlert2(){
    let alert = await this.alert.create({
        header:'Welcome',
        message:'please login!',
        buttons:['ok']

      })
alert.present();
this.router.navigate(['/login']); // Redirect to the login page
}
}
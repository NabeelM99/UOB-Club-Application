import { Component, OnInit } from '@angular/core';
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
import { Injectable } from '@angular/core';
import { QuerySnapshot } from '@angular/fire/firestore';
import { authenticationService } from 'src/app/services/authentication.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EditEventPage } from '../edit-event/edit-event.page';
import { doc } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-show-members',
  templateUrl: './show-members.page.html',
  styleUrls: ['./show-members.page.scss'],
})
export class ShowMembersPage implements OnInit {
  public record:string='';
  public recordId:any;
  selected='';
Search='';
  public records: Record[] = [];
  public recorddd: Record[] = [];
  public users: userData[] = [];
public clubName:string='';
public clubMem:boolean=false;
public clubMem2:boolean=false;
public leaders:string[]=[];
public eventMem:boolean=false;
public colleges:boolean=false;
public tb1:boolean=false;
public tb2:boolean=false;
public eventMem2:boolean=false;
public members:userData[]=[]; 
public members3:userData[]=[]; 
public filteredRecords:userData[]=[]; 
public filteredRecords3:userData[]=[]; 
public filteredRecords2:userData[]=[]; 
public members2:userData[]=[]; 
public field:string='';
constructor(
    public nav: NavController,
    public firestore: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
    public auth: authenticationService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
 
   
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.clubMem = navigation.extras.state['clubMem'];
      this.clubMem2 = navigation.extras.state['clubMem2'];
      this.eventMem2 = navigation.extras.state['eventMem2'];
      this.eventMem = navigation.extras.state['eventMem'];
      this.clubName = navigation.extras.state['clubName'];
      this.record = navigation.extras.state['eventName'];
      this.tb1 = navigation.extras.state['TB1'];
      this.tb2 = navigation.extras.state['TB2'];
      this.recorddd = navigation.extras.state['recorddd'];
      this.colleges = navigation.extras.state['colleges'];
      this.field = navigation.extras.state['field'];
      
      }
      if(this.colleges){
        this.showMembers3();
      }
      if(this.clubMem && !this.colleges ||this.clubMem2&&!this.colleges ){
        this.showMembers();
      }
      if(this.eventMem||this.eventMem2){
        console.log(this.record);
        console.log(this.clubName);
    
        // Get a reference to the 'this.clubName' collection
        const clubCollection = this.firestore.collection(this.clubName);
    
        // Query the 'this.clubName' collection for a document with a 'name' field matching 'this.record'
        const clubSnapshot = await clubCollection.ref.where('name', '==', this.record).get();
    
        // Check if the clubSnapshot is not empty
        if (!clubSnapshot.empty) {
          // Get the document ID of the matching document
          const recordDocId = clubSnapshot.docs[0].id;
          this.recordId=recordDocId;
        }
     this.showMembers2();
      }
    }
    goBck(){
      if(this.colleges){
        this.nav.navigateBack('college-events');
      }
      if(this.clubMem &&!this.colleges||this.clubMem2&&!this.colleges ){
      if(this.tb1){
           this.nav.navigateBack('tabs/tab1');
        }else{
          this.nav.navigateBack(this.clubName);
        }
      }
      if(this.eventMem||this.eventMem2){
        if(this.tb2){
          this.router.navigate(['event-details'], { state: {tab2:this.tb2,record:this.recorddd,eventMem:this.eventMem,clubName:this.clubName}});
        }
        if(this.tb1){
          this.router.navigate(['event-details'], { state: {tab1:this.tb1,record:this.recorddd,eventMem:this.eventMem,clubName:this.clubName}});
        }
        if(!this.tb1&&!this.tb2){
          this.router.navigate(['event-details'], { state: {tab2:this.tb2,record:this.recorddd,eventMem:this.eventMem,clubName:this.clubName}});
        }
      }
    }
    async showMembers3() {
      this.members3 = []; // Initialize an empty array to store the members
      const query = this.firestore.collection('users')
    .ref
    .where('field', '>=', this.field + '-')
    .where('field', '<', this.field + '0');
      // Execute the query and get the QuerySnapshot
      const querySnapshot = await query.get();
    
      // Loop through the documents in the QuerySnapshot
      querySnapshot.forEach((doc) => {
        // Get the user data from the document
        const userData = doc.data() as userData;
        if(userData.type=='leader'){
          this.leaders.push('leader');
        }else{
          this.leaders.push('');
        }
    
        // Add the user data to the members array
        this.members3.push(userData);

      });
    
      console.log(this.members);
      this.init3();
    }
    async showMembers() {
      this.members = []; // Initialize an empty array to store the members
    
      // Get a reference to the Firestore "users" collection
      const usersCollection = this.firestore.collection<any>('users');
    
      // Create a query to filter the users by "club_name"
      const query = usersCollection.ref.where('club_name', '==', this.clubName);
    
      // Execute the query and get the QuerySnapshot
      const querySnapshot = await query.get();
    
      // Loop through the documents in the QuerySnapshot
      querySnapshot.forEach((doc) => {
        // Get the user data from the document
        const userData = doc.data() as userData;
        if(userData.type=='leader'){
          this.leaders.push('leader');
        }else{
          this.leaders.push('');
        }
    
        // Add the user data to the members array
        this.members.push(userData);

      });
    
      console.log(this.members);
      this.init();
    }
    async showMembers2() {
      
      this.members2 = []; // Initialize an empty array to store the members
   

      const usersCollection = this.firestore.collection('users').ref;
      const userRecords = await usersCollection.get();

// Iterate through each user record
for (const userDoc of userRecords.docs) {
  const userData = userDoc.data() as userData;
  const userId = userDoc.id;

  // Check if the user has an events field
  if (userData.events && Array.isArray(userData.events)) {
    const updatedEvents = [];

    // Iterate through each event entry
    for (const eventRef of userData.events) {
      // Check if the eventRef is a DocumentReference
      if (eventRef instanceof firebase.firestore.DocumentReference) {
        const eventSnapshot = await eventRef.get();

        // Check if the eventSnapshot exists and matches the event you are looking for
        if (eventSnapshot.exists && eventSnapshot.id === this.recordId) {
        console.log(userData);
        this.members2.push(userData);
        }
      }

      updatedEvents.push(eventRef); // Keep the event reference
    }

    // Update the user's events field with the filtered array
    await usersCollection.doc(userId).update({ events: updatedEvents });
  }
}        this.init2();

    }
    goToUser(name:any){
      this.router.navigate(['student-info'], { state: {userName:name,clubMem:this.clubMem,clubName:this.clubName}});
    }
    goToUser2(name:any){
      this.router.navigate(['student-info'], { state: {recordN:this.record,record:this.recordId,userName:name,eventMem:this.eventMem,clubName:this.clubName}});
    }
    goToUser3(name:any){
      this.router.navigate(['student-info'], { state: {colleges:this.colleges,recordN:this.record,record:this.recordId,userName:name,eventMem:this.eventMem,clubName:this.clubName}});
    }
    checks(){
      this.init();
      this.init2();
      if (this.selected=='all'){this.searchAll();}
      if (this.selected==''){this.searchAll();}
      if (this.selected=='type'){this.searchType();}
      if (this.selected=='field'){this.searchMajor();}
      if (this.selected=='name'){this.searchName();}
      if (this.selected=='club-name'){this.searchClubName();}
    }
    init(){
      this.filteredRecords=this.members;
    }
    init2(){
      this.filteredRecords2=this.members2;
    }
    init3(){
      this.filteredRecords3=this.members3;
    }
  searchAll() {
    this.init();
    this.init2();
    this.init3();
    let val = this.Search;
    if (val && val.trim() != "") {
      this.filteredRecords = this.filteredRecords.filter((item) => {
        return (
          item.name.toLowerCase().includes(val.toLowerCase()) ||
          item.club_name.toLowerCase().includes(val.toLowerCase()) ||
          item.type.toLowerCase().includes(val.toLowerCase()) ||
          item.field.toLowerCase().includes(val.toLowerCase())
        );
      });
    }
  }

  searchName(){
    this.init();
    this.init2();
    this.init3();

    let val=this.Search;
    if(val && val.trim()!=""){
      this.filteredRecords=this.filteredRecords.filter((item)=>{
        return (item.name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
      });

  }
}
searchMajor(){
  this.init();
  this.init2();
  this.init3();

  let val=this.Search;
  if(val && val.trim()!=""){
    this.filteredRecords=this.filteredRecords.filter((item)=>{
      return (item.field.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
    });

}
}
searchType(){
  this.init();
  this.init2();
  this.init3();

    let val=this.Search;
    if(val && val.trim()!=""){
      this.filteredRecords=this.filteredRecords.filter((item)=>{
        return (item.type.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
      });
 
  }
}
  searchClubName(){
    this.init();
    this.init2();
    this.init3();

    let val=this.Search;
    if(val && val.trim()!=""){
      this.filteredRecords=this.filteredRecords.filter((item)=>{
        return (item.club_name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())>-1)
      });
 
  }
}
 
 
}

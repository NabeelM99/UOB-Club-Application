import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Record } from 'src/app/services/retrieve-events.service';
import { userData } from 'src/app/tabs/tabs.page';
import { AlertController, LoadingController } from '@ionic/angular';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Injectable } from '@angular/core';
import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { authenticationService } from 'src/app/services/authentication.service';
import { State } from 'ionicons/dist/types/stencil-public-runtime';

@Component({
  selector: 'app-my-event-details',
  templateUrl: './my-event-details.page.html',
  styleUrls: ['./my-event-details.page.scss'],
})
export class MyEventDetailsPage implements OnInit {
  public page:string='my-event-details';

  record: Record | undefined;
  public documentId:string='';
  public clubName:any='';
  
  public ds = { date: []as any, time: []as any };
  public created:boolean=false;
    but:boolean=false;
    Search:string='';
    query:string='';
    feed:string='';
    displayedCount:number=0;
    public starsNum:number=0;
    counts:number=0;
    public userId:any;
    public showz:boolean=false;
    public zero:number | undefined =0;
    public one:number | undefined =0;
    public two:number | undefined =0;
    public oldRating:number=0;
    public oldRate:boolean=false;
    public three:number | undefined =0;
    public four:number | undefined =0;
    public eventType:string='';
    public username:any;
    public numRate:number=0;
    public loaded:boolean=false;
    public comefromold:boolean=true;
    public old:boolean=true;
    public docId:any;
    public yesrated:boolean=true;
    public rated:boolean=false;
    public rates = {
      
    };
  constructor(    
    public nav:NavController,
    public firestore:AngularFirestore,
     private route: ActivatedRoute, 
     private router: Router,
    public alert:AlertController,
    public auth:authenticationService,
    private loading: LoadingController,

  ) {}
  
  
  
    async ngOnInit() {
      console.log(this.rated);
          const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state) {
        this.record = navigation.extras.state['record'] as Record;
        this.created = navigation.extras.state['created'];
        this.auth.checkUserAuthentication(this.page);
        if(this.record.type=="clubOnly"){
          this.eventType='this event is only allowed for club members'
        }
        if(this.record.type=="registration"){
          this.eventType='this events requires registration, so make sure to register fast there are limited seats'
        }
        if(this.record.type=="forAll"){
          this.eventType='this event is open for all students'
        }
        const sessionValue = sessionStorage.getItem('currentUser');
        console.log(sessionValue); // Output: mySessionValue
        if (sessionValue) {
          const userId = JSON.parse(sessionValue);
          this.userId = userId;
          this.retrieveUserName(userId).then((name)=>{
            this.username=name;
          })

        }
        const clubName = this.record.club_name;
        const eventName = this.record.name;
        const ref=this.firestore.collection(clubName).ref;
        const query= ref.where('name','==',eventName);
        const querySnapshot=await query.get();
        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id;
          this.docId=docId;
          console.log(docId);
          // Use the docId as needed
        } else {
          // No document found with the given name in the specified collection
        }
        this.firestore.collection(this.record.club_name, ref => ref.where('name', '==', this.record?.name)).get()
          .subscribe(querySnapshot => {
            if (!querySnapshot.empty) {
              this.zero=this.record?.rating.zero;
              this.one=this.record?.rating.one;
              this.two=this.record?.rating.two;
              this.three=this.record?.rating.three;
              this.four=this.record?.rating.four;
              const time = this.record?.date as firebase.firestore.Timestamp;
              const date = time.toDate();
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const day = date.getDate();
              const hours = date.getHours();
              const minutes = date.getMinutes();
              const seconds = date.getSeconds();
              const formattedDate = `${year}-${month}-${day}`;
              const formattedTime = `${hours}:${minutes}:${seconds}`;
              this.ds.date.push(formattedDate);
              this.ds.time.push(formattedTime);
              const document = querySnapshot.docs[0].id;
              this.documentId = document;
              this.clubName = this.record?.club_name;
              // Use the record and its document ID as needed
            }
            this.loaded=true;
          });
      }
    }
    showMembers(){
      this.router.navigate(['show-members'],{ state: { record:this.record } });
    }
    showFeedbacks(record:Record){
      this.router.navigate(['show-feedbacks'], { state: { record } });
    }
    public datas = {
      Rate: [
        { Name: 'star-outline' },
        { Name: 'star-outline' },
        { Name: 'star-outline' },
        { Name: 'star-outline' },
        { Name: 'star-outline' }
      ]
    }; 
    retrieveUserName(userId: string): Promise<string | null> {
      return new Promise((resolve, reject) => {
        this.firestore.collection('users').doc(userId).get().subscribe(
          (userDoc) => {
            if (userDoc.exists) {
              const userData = userDoc.data() as { name: string }; // Type annotation for userData
              const userName = userData?.name;
              resolve(userName || null);
            } else {
              console.log('User document not found');
              resolve(null);
            }
          },
          (error) => {
            console.error('Error retrieving user document:', error);
            resolve(null);
          }
        );
      });
    }
    async removeEvent(record: Record) {
      const confirmed = await this.showAlertRemoveEvent();
      if (!confirmed) {
        return;
      }
      const clubName= record.club_name;
      const recordName= record.name;
      if (record.type === 'registration') {
        const collectionRef = this.firestore.collection('users').doc(this.userId);
      
        try {
          const querySnapshot = await collectionRef.get();
          querySnapshot.forEach(async (doc) => {
            const existingEventRequests = (doc.data() as userData).event_requests || {};
            const updatedEventRequests = { ...existingEventRequests };
            delete updatedEventRequests[this.docId];
      
            await collectionRef.update({ event_requests: updatedEventRequests });
          });
        } catch (error) {
          // Handle any potential errors here
        }
       
      }
      if (record.type === 'clubOnly') {
        // Retrieve user records where club_name matches this.clubName
       // Retrieve user records where club_name matches this.clubName
  const usersCollection = this.firestore.collection('users').ref;
  const query = usersCollection.where('club_name', '==', this.clubName);
  const userRecords = await query.get();
  
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
          if (eventSnapshot.exists && eventSnapshot.id === this.docId) {
            // Delete the event reference
            await eventRef.delete();
            continue; // Skip deleting this entry
          }
        }
  
        updatedEvents.push(eventRef); // Keep the event reference
      }
  
      // Update the user's events field with the filtered array
      await usersCollection.doc(userId).update({ events: updatedEvents });
    }
  }
  }
  if (record.type === 'forAll') {
  // Retrieve all user records
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
          if (eventSnapshot.exists && eventSnapshot.id === this.docId) {
            // Delete the event reference
            await eventRef.delete();
            continue; // Skip deleting this entry
          }
        }
  
        updatedEvents.push(eventRef); // Keep the event reference
      }
  
      // Update the user's events field with the filtered array
      await usersCollection.doc(userId).update({ events: updatedEvents });
    }
  }
      }
      const collName = record.club_name;
      const querySnapshot = await this.firestore
        .collection(collName).ref
        .where('name', '==', record.name)
        .get();
      
      const deletePromises: any[] = [];
      querySnapshot.forEach((doc: { ref: { delete: () => any; }; }) => {
        deletePromises.push(doc.ref.delete());
      });
    
      Promise.all(deletePromises)
        .then(async () => {
            if(this.created==true){
              this.presentLoadingRemoving().then(() => {
                setTimeout(async () => {
                  this.dismissLoading();
                 await this.presentAlert();
                this.router.navigate(['created-events'], { state: {rold:this.old } })
                .then(()=>{
                  location.reload();
                });
                },2000);
              });
            }else{
              this.presentLoadingRemoving().then(() => {
                setTimeout(async () => {
                  this.dismissLoading();
                 await this.presentAlert();
                this.router.navigate(['my-events'], { state: {comefromold:this.comefromold } })
                .then(()=>{
                  location.reload();
                });
                },2000);
              });
            }
        })
        .catch((error) => {
          console.log(error);
        });
    }
      async showAlertRemoveEvent(): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
          const alert = await this.alert.create({
            header: 'are you sure you want to remove this event ?',
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
      async presentAlert(): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
          const alert = await this.alert.create({
            header: 'Event Removed Successfully',
            message: '',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  resolve(true); // Resolve with true when Yes button is clicked
                }
              },
             
    
            ]
          });
    
          await alert.present();
        });
      }
  goBack(){
    if(this.created==true){
      this.nav.navigateBack('created-events');
  }else{
    this.nav.navigateBack('my-events');
  }
  }
  
  changeFeed() {
    console.log(this.rated);
    if (this.feed === '') {
      this.showz = false;
    }
    if (this.feed === '' && this.rated === true) {
      this.showz = true;
    }
    if (this.feed !== '') {
      this.showz = true;
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

  async showAlert(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: `Are You Sure You Want to Send Feedback ?`,
        message: '',
        buttons: [
                   {
            text: 'Yes',
            handler: () => {
              resolve(true); // Resolve with false when Cancel button is clicked
            }
          },
          {
            text: 'Cancel',
            handler: () => {
              resolve(false); // Resolve with false when Cancel button is clicked
            }
          },
        ]
      });

      await alert.present();
    });
  }

  async sendFeedback() {
    const confirmed = await this.showAlert();
    if (!confirmed) {
      return;
    }    
    const collref = firebase.firestore().collection(this.clubName);
    const doc = collref.doc(this.documentId);
  
    let data: any = {}; // Initialize data as an empty object
  
    if (this.rated === false) {
      this.oldRate=false;
      // Create a new feedback entry
      const newFeedback = {
        username:this.userId, // Update the reference to 'users'/this.userId
        rated: false,
        rating: this.numRate,
        feedback: this.feed,
      };
  
      // Retrieve the existing feedbacks array from Firestore
      const existingFeedbacks: any[] = this.record?.feedbacks || [];
  
      // Check if there is an existing feedback with the same username
      const existingFeedbackIndex = existingFeedbacks.findIndex(
        (feedback) => feedback.username === this.userId// Update the reference to 'users'/this.userId
      );
      let updatedFeedbacks;
  
      if (existingFeedbackIndex !== -1) {
        // If an existing feedback with the same username is found, replace it with the new feedback entry
        updatedFeedbacks = [
          ...existingFeedbacks.slice(0, existingFeedbackIndex),
          newFeedback,
          ...existingFeedbacks.slice(existingFeedbackIndex + 1),
        ];
      } else {
        // If no existing feedback with the same username is found, add the new feedback entry to the array
        updatedFeedbacks = [...existingFeedbacks, newFeedback];
      }
  
      const record = this.record;
  
      data = {
        createdBy: this.record?.createdBy,
        name: this.record?.name,
        club_name: this.record?.club_name,
        date: this.record?.date,
        location: this.record?.location,
        photoUrl: this.record?.photoUrl,
        type: this.record?.type,
        feedbacks: updatedFeedbacks,
        overview: this.record?.overview,
        rating: {
          zero: record?.rating?.zero,
          one: record?.rating?.one,
          two: record?.rating?.two,
          three: record?.rating?.three,
          four: record?.rating?.four,
        },
      };
    }
    /////////////////////////////////////////////////////////
  else{
     // Create a new feedback entry

     const newFeedback = {
      username:this.userId, // Update the reference to 'users'/this.userId
      rated: true,
      rating: this.numRate,
      feedback: this.feed,
    };

    // Retrieve the existing feedbacks array from Firestore
    const existingFeedbacks: any[] = this.record?.feedbacks || [];

    // Check if there is an existing feedback with the same username
    const existingFeedbackIndex = existingFeedbacks.findIndex(
      (feedback) => feedback.username === this.userId // Update the reference to 'users'/this.userId
    );
    let updatedFeedbacks;

    if (existingFeedbackIndex !== -1) {
      const previousRating = existingFeedbacks[0].rating;
      const previousRated = existingFeedbacks[0].rated;
      console.log(previousRating);
      this.oldRating=previousRating;
      this.oldRate=previousRated;
      // If an existing feedback with the same username is found, replace it with the new feedback entry
      updatedFeedbacks = [
        ...existingFeedbacks.slice(0, existingFeedbackIndex),
        newFeedback,
        ...existingFeedbacks.slice(existingFeedbackIndex + 1),
      ];
    } else {
      // If no existing feedback with the same username is found, add the new feedback entry to the array
      updatedFeedbacks = [...existingFeedbacks, newFeedback];
    }

    const record = this.record;
   
    if(this.oldRate){
      if(this.numRate==0){
        if (this.oldRating==1){
          this.rates= {
            zero: record?.rating?.zero !== undefined ? record.rating.zero + 1 : undefined,
            one: record?.rating?.one !== undefined ? record.rating.one - 1 : undefined,
            two: record?.rating?.two,
            three: record?.rating?.three,
            four: record?.rating?.four,
          };
        }
        if (this.oldRating==2){
          this.rates= {
            zero: record?.rating?.zero !== undefined ? record.rating.zero + 1 : undefined,
            two: record?.rating?.two !== undefined ? record.rating.two - 1 : undefined,
            one: record?.rating?.one,
            three: record?.rating?.three,
            four: record?.rating?.four,
          };
        }
        if (this.oldRating==3){
          this.rates= {
            zero: record?.rating?.zero !== undefined ? record.rating.zero + 1 : undefined,
            three: record?.rating?.three !== undefined ? record.rating.three - 1 : undefined,
            two: record?.rating?.two,
            one: record?.rating?.one,
            four: record?.rating?.four,
          };
        }
        if (this.oldRating==4){
          this.rates= {
            zero: record?.rating?.zero !== undefined ? record.rating.zero + 1 : undefined,
            four: record?.rating?.four !== undefined ? record.rating.four - 1 : undefined,
            two: record?.rating?.two,
            three: record?.rating?.three,
            one: record?.rating?.one,
          };
        }
        if (this.oldRating==0){
          this.rates= {
            zero: record?.rating?.zero,
            four: record?.rating?.four,
            two: record?.rating?.two,
            three: record?.rating?.three,
            one: record?.rating?.one,
          };
        }
        data = {
          createdBy: this.record?.createdBy,
          name: this.record?.name,
          club_name: this.record?.club_name,
          date: this.record?.date,
          location: this.record?.location,
          photoUrl: this.record?.photoUrl,
          type: this.record?.type,
          feedbacks: updatedFeedbacks,
          overview: this.record?.overview,
          rating:this.rates
        };
      }
      if(this.numRate==1){
        if (this.oldRating==1){
          this.rates= {
            zero: record?.rating?.zero,
            one: record?.rating?.one,
            two: record?.rating?.two,
            three: record?.rating?.three,
            four: record?.rating?.four,
          };
        }
        if (this.oldRating==2){
          this.rates= {
            zero: record?.rating?.zero,
            two: record?.rating?.two !== undefined ? record.rating.two - 1 : undefined,
            one: record?.rating?.one !== undefined ? record.rating.one + 1 : undefined,
            three: record?.rating?.three,
            four: record?.rating?.four,
          };
        }
        if (this.oldRating==3){
          this.rates= {
            zero: record?.rating?.zero,
            three: record?.rating?.three !== undefined ? record.rating.three - 1 : undefined,
            two: record?.rating?.two,
            one: record?.rating?.one !== undefined ? record.rating.one + 1 : undefined,
            four: record?.rating?.four,
          };
        }
        if (this.oldRating==4){
          this.rates= {
            zero: record?.rating?.zero,
            four: record?.rating?.four !== undefined ? record.rating.four - 1 : undefined,
            two: record?.rating?.two,
            three: record?.rating?.three,
            one: record?.rating?.one !== undefined ? record.rating.one + 1 : undefined,
          };
        }
        if (this.oldRating==0){
          this.rates= {
            zero: record?.rating?.zero !== undefined ? record.rating.zero - 1 : undefined,
            four: record?.rating?.four,
            two: record?.rating?.two,
            three: record?.rating?.three,
            one: record?.rating?.one!== undefined ? record.rating.one + 1 : undefined,
          };
        }
          data = {
            createdBy: this.record?.createdBy,
            name: this.record?.name,
            club_name: this.record?.club_name,
            date: this.record?.date,
            location: this.record?.location,
            photoUrl: this.record?.photoUrl,
            type: this.record?.type,
            feedbacks: updatedFeedbacks,
            overview: this.record?.overview,
            rating: this.rates,
          };
        }
        if(this.numRate==2){
          if (this.oldRating==1){
            this.rates= {
              zero: record?.rating?.zero,
              one: record?.rating?.one !== undefined ? record.rating.one - 1 : undefined,
              two: record?.rating?.two !== undefined ? record.rating.two + 1 : undefined,
              three: record?.rating?.three,
              four: record?.rating?.four,
            };
          }
          if (this.oldRating==2){
            this.rates= {
              zero: record?.rating?.zero,
              two: record?.rating?.two,
              one: record?.rating?.one,
              three: record?.rating?.three,
              four: record?.rating?.four,
            };
          }
          if (this.oldRating==3){
            this.rates= {
              zero: record?.rating?.zero,
              three: record?.rating?.three !== undefined ? record.rating.three - 1 : undefined,
              one: record?.rating?.one,
              two: record?.rating?.two !== undefined ? record.rating.two + 1 : undefined,
              four: record?.rating?.four,
            };
          }
          if (this.oldRating==4){
            this.rates= {
              zero: record?.rating?.zero,
              four: record?.rating?.four !== undefined ? record.rating.four - 1 : undefined,
              one: record?.rating?.one,
              three: record?.rating?.three,
              two: record?.rating?.two !== undefined ? record.rating.two + 1 : undefined,
            };
          }
          if (this.oldRating==0){
            this.rates= {
              zero: record?.rating?.zero !== undefined ? record.rating.zero - 1 : undefined,
              four: record?.rating?.four,
              one: record?.rating?.one,
              three: record?.rating?.three,
              two: record?.rating?.two!== undefined ? record.rating.two + 1 : undefined,
            };
          }
          data = {
            createdBy: this.record?.createdBy,
            name: this.record?.name,
            club_name: this.record?.club_name,
            date: this.record?.date,
            location: this.record?.location,
            photoUrl: this.record?.photoUrl,
            type: this.record?.type,
            feedbacks: updatedFeedbacks,
            overview: this.record?.overview,
            rating: this.rates,
          };
        }
        if(this.numRate==3){
          if (this.oldRating==1){
            this.rates= {
              zero: record?.rating?.zero,
              one: record?.rating?.one !== undefined ? record.rating.one - 1 : undefined,
              three: record?.rating?.three !== undefined ? record.rating.three + 1 : undefined,
              two: record?.rating?.two,
              four: record?.rating?.four,
            };
          }
          if (this.oldRating==2){
            this.rates= {
              zero: record?.rating?.zero,
              two: record?.rating?.two !== undefined ? record.rating.two - 1 : undefined,
              one: record?.rating?.one,
              three: record?.rating?.three!== undefined ? record.rating.three + 1 : undefined,
              four: record?.rating?.four,
            };
          }
          if (this.oldRating==3){
            this.rates= {
              zero: record?.rating?.zero,
              three: record?.rating?.three,
              one: record?.rating?.one,
              two: record?.rating?.two,
              four: record?.rating?.four,
            };
          }
          if (this.oldRating==4){
            this.rates= {
              zero: record?.rating?.zero,
              four: record?.rating?.four !== undefined ? record.rating.four - 1 : undefined,
              one: record?.rating?.one,
              two: record?.rating?.two,
              three: record?.rating?.three !== undefined ? record.rating.three + 1 : undefined,
            };
          }
          if (this.oldRating==0){
            this.rates= {
              zero: record?.rating?.zero !== undefined ? record.rating.zero - 1 : undefined,
              four: record?.rating?.four,
              one: record?.rating?.one,
              two: record?.rating?.two,
              three: record?.rating?.three!== undefined ? record.rating.three + 1 : undefined,
            };
          }
          data = {
            createdBy: this.record?.createdBy,
            name: this.record?.name,
            club_name: this.record?.club_name,
            date: this.record?.date,
            location: this.record?.location,
            photoUrl: this.record?.photoUrl,
            type: this.record?.type,
            feedbacks: updatedFeedbacks,
            overview: this.record?.overview,
            rating:this.rates,
          };
        }
        if(this.numRate==4){
          if (this.oldRating==1){
            this.rates= {
              zero: record?.rating?.zero,
              one: record?.rating?.one !== undefined ? record.rating.one - 1 : undefined,
              three: record?.rating?.three,
              two: record?.rating?.two,
              four: record?.rating?.four !== undefined ? record.rating.four + 1 : undefined,
            };
          }
          if (this.oldRating==2){
            this.rates= {
              zero: record?.rating?.zero,
              two: record?.rating?.two !== undefined ? record.rating.two - 1 : undefined,
              one: record?.rating?.one,
              four: record?.rating?.four!== undefined ? record.rating.four + 1 : undefined,
              three: record?.rating?.three,
            };
          }
          if (this.oldRating==3){
            this.rates= {
              zero: record?.rating?.zero,
              three: record?.rating?.three  !== undefined ? record.rating.three - 1 : undefined,
              one: record?.rating?.one,
              two: record?.rating?.two,
              four: record?.rating?.four  !== undefined ? record.rating.four + 1 : undefined,
            };
          }
          if (this.oldRating==4){
            this.rates= {
              zero: record?.rating?.zero,
              four: record?.rating?.four,
              one: record?.rating?.one,
              two: record?.rating?.two,
              three: record?.rating?.three,
            };
          }
          if (this.oldRating==0){
            this.rates= {
              zero: record?.rating?.zero !== undefined ? record.rating.zero - 1 : undefined,
              three: record?.rating?.three,
              one: record?.rating?.one,
              two: record?.rating?.two,
              four: record?.rating?.four!== undefined ? record.rating.four + 1 : undefined,
            };
          }
          data = {
            createdBy: this.record?.createdBy,
            name: this.record?.name,
            club_name: this.record?.club_name,
            date: this.record?.date,
            location: this.record?.location,
            photoUrl: this.record?.photoUrl,
            type: this.record?.type,
            feedbacks: updatedFeedbacks,
            overview: this.record?.overview,
            rating:this.rates,
          };
        }
    }else{
if(this.numRate==0){
  
  data = {
    createdBy: this.record?.createdBy,
    name: this.record?.name,
    club_name: this.record?.club_name,
    date: this.record?.date,
    location: this.record?.location,
    photoUrl: this.record?.photoUrl,
    type: this.record?.type,
    feedbacks: updatedFeedbacks,
    overview: this.record?.overview,
    rating: {
      zero: record?.rating?.zero !== undefined ? record.rating.zero + 1 : undefined,
      one: record?.rating?.one,
      two: record?.rating?.two,
      three: record?.rating?.three,
      four: record?.rating?.four,
    },
  };
}
if(this.numRate==1){
    data = {
      createdBy: this.record?.createdBy,
      name: this.record?.name,
      club_name: this.record?.club_name,
      date: this.record?.date,
      location: this.record?.location,
      photoUrl: this.record?.photoUrl,
      type: this.record?.type,
      feedbacks: updatedFeedbacks,
      overview: this.record?.overview,
      rating: {
        zero: record?.rating?.zero,
        one: record?.rating?.one !== undefined ? record.rating.one + 1 : undefined,
        two: record?.rating?.two,
        three: record?.rating?.three,
        four: record?.rating?.four,
      },
    };
  }
  if(this.numRate==2){
    data = {
      createdBy: this.record?.createdBy,
      name: this.record?.name,
      club_name: this.record?.club_name,
      date: this.record?.date,
      location: this.record?.location,
      photoUrl: this.record?.photoUrl,
      type: this.record?.type,
      feedbacks: updatedFeedbacks,
      overview: this.record?.overview,
      rating: {
        zero: record?.rating?.zero,
        one: record?.rating?.one,
        two: record?.rating?.two !== undefined ? record.rating.two + 1 : undefined,
        three: record?.rating?.three,
        four: record?.rating?.four,
      },
    };
  }
  if(this.numRate==3){
    data = {
      createdBy: this.record?.createdBy,
      name: this.record?.name,
      club_name: this.record?.club_name,
      date: this.record?.date,
      location: this.record?.location,
      photoUrl: this.record?.photoUrl,
      type: this.record?.type,
      feedbacks: updatedFeedbacks,
      overview: this.record?.overview,
      rating: {
        zero: record?.rating?.zero,
        one: record?.rating?.one,
        two: record?.rating?.two,
        three:record?.rating?.three !== undefined ? record.rating.three + 1 : undefined,
        four: record?.rating?.four,
      },
    };
  }
  if(this.numRate==4){
    data = {
      createdBy: this.record?.createdBy,
      name: this.record?.name,
      club_name: this.record?.club_name,
      date: this.record?.date,
      location: this.record?.location,
      photoUrl: this.record?.photoUrl,
      type: this.record?.type,
      feedbacks: updatedFeedbacks,
      overview: this.record?.overview,
      rating: {
        zero: record?.rating?.zero,
        one: record?.rating?.one,
        two: record?.rating?.two,
        three: record?.rating?.three,
        four: record?.rating?.four !== undefined ? record.rating.four + 1 : undefined,
      },
    };
  }
}
  }
    const ex = this.record;
    doc.set(data);
    this.presentLoading().then(() => {
      setTimeout(async () => {
        this.dismissLoading();
       await this.showAlertThank();
       this.router.navigate(['my-events'], { state: { rated:this.yesrated } })
       .then(()=>{
         location.reload();
       });
      },2000);
    });
  
  }
  async showAlertThank(): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alert.create({
        header: 'thank you for your feedback',
        message: '',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              resolve(true); // Resolve with true when Yes button is clicked
            }
          },

        ]
      });

      await alert.present();
    });
  }
  async presentLoadingRemoving() {
    const loading = await this.loading.create({
      message: 'Removing event...',
      spinner: 'lines', // Choose the type of spinner you want
      translucent: true,
      backdropDismiss: false, // Prevent dismissing the loading by tapping outside
      keyboardClose: false // Prevent dismissing the loading by pressing the keyboard
    });
    await loading.present();
  }
  async presentLoading() {
    const loading = await this.loading.create({
      message: 'adding your feedback',
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

    
}

  
  
  
  
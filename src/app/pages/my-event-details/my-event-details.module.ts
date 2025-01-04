import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyEventDetailsPageRoutingModule } from './my-event-details-routing.module';

import { MyEventDetailsPage } from './my-event-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyEventDetailsPageRoutingModule
  ],
  declarations: [MyEventDetailsPage]
})
export class MyEventDetailsPageModule {}

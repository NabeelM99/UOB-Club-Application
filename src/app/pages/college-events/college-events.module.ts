import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollegeEventsPageRoutingModule } from './college-events-routing.module';

import { CollegeEventsPage } from './college-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollegeEventsPageRoutingModule
  ],
  declarations: [CollegeEventsPage]
})
export class CollegeEventsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEventsPageRoutingModule } from './add-events-routing.module';

import { AddEventsPage } from './add-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEventsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddEventsPage]
})
export class AddEventsPageModule {}

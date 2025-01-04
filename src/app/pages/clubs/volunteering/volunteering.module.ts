import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VolunteeringPageRoutingModule } from './volunteering-routing.module';

import { VolunteeringPage } from './volunteering.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VolunteeringPageRoutingModule
  ],
  declarations: [VolunteeringPage]
})
export class VolunteeringPageModule {}

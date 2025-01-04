import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MyEventsPageRoutingModule } from './my-events-routing.module';

import { MyEventsPage } from './my-events.page';

@NgModule({
  imports: [ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MyEventsPageRoutingModule
  ],
  declarations: [MyEventsPage]
})
export class MyEventsPageModule {}

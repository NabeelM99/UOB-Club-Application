import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraduatesPageRoutingModule } from './graduates-routing.module';

import { GraduatesPage } from './graduates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraduatesPageRoutingModule
  ],
  declarations: [GraduatesPage]
})
export class GraduatesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotographyPageRoutingModule } from './photography-routing.module';

import { PhotographyPage } from './photography.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotographyPageRoutingModule
  ],
  declarations: [PhotographyPage]
})
export class PhotographyPageModule {}

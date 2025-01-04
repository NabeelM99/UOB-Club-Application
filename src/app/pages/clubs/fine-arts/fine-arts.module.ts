import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FineArtsPageRoutingModule } from './fine-arts-routing.module';

import { FineArtsPage } from './fine-arts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FineArtsPageRoutingModule
  ],
  declarations: [FineArtsPage]
})
export class FineArtsPageModule {}

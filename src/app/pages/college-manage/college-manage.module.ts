import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollegeManagePageRoutingModule } from './college-manage-routing.module';

import { CollegeManagePage } from './college-manage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CollegeManagePageRoutingModule
  ],
  declarations: [CollegeManagePage]
})
export class CollegeManagePageModule {}

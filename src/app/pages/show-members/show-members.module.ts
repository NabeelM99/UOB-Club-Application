import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowMembersPageRoutingModule } from './show-members-routing.module';

import { ShowMembersPage } from './show-members.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowMembersPageRoutingModule
  ],
  declarations: [ShowMembersPage]
})
export class ShowMembersPageModule {}

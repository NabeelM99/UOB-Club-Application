import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowFeedbacksPageRoutingModule } from './show-feedbacks-routing.module';

import { ShowFeedbacksPage } from './show-feedbacks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowFeedbacksPageRoutingModule
  ],
  declarations: [ShowFeedbacksPage]
})
export class ShowFeedbacksPageModule {}

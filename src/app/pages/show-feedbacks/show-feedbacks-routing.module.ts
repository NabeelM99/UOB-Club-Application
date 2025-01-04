import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowFeedbacksPage } from './show-feedbacks.page';

const routes: Routes = [
  {
    path: '',
    component: ShowFeedbacksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowFeedbacksPageRoutingModule {}

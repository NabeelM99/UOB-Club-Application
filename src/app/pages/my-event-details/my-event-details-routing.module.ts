import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyEventDetailsPage } from './my-event-details.page';

const routes: Routes = [
  {
    path: '',
    component: MyEventDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyEventDetailsPageRoutingModule {}

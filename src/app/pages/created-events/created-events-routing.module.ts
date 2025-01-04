import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatedEventsPage } from './created-events.page';

const routes: Routes = [
  {
    path: '',
    component: CreatedEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatedEventsPageRoutingModule {}

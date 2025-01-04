import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VolunteeringPage } from './volunteering.page';

const routes: Routes = [
  {
    path: '',
    component: VolunteeringPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VolunteeringPageRoutingModule {}

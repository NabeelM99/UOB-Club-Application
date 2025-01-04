import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollegeEventsPage } from './college-events.page';

const routes: Routes = [
  {
    path: '',
    component: CollegeEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollegeEventsPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraduatesPage } from './graduates.page';

const routes: Routes = [
  {
    path: '',
    component: GraduatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraduatesPageRoutingModule {}

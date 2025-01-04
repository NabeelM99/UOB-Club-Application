import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TheaterPage } from './theater.page';

const routes: Routes = [
  {
    path: '',
    component: TheaterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TheaterPageRoutingModule {}

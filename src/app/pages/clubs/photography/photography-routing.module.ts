import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotographyPage } from './photography.page';

const routes: Routes = [
  {
    path: '',
    component: PhotographyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotographyPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FineArtsPage } from './fine-arts.page';

const routes: Routes = [
  {
    path: '',
    component: FineArtsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FineArtsPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowMembersPage } from './show-members.page';

const routes: Routes = [
  {
    path: '',
    component: ShowMembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowMembersPageRoutingModule {}

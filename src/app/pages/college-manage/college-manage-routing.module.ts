import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollegeManagePage } from './college-manage.page';

const routes: Routes = [
  {
    path: '',
    component: CollegeManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollegeManagePageRoutingModule {}

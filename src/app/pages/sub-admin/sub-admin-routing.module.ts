import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubAdminComponent } from './sub-admin.component';

const routes: Routes = [
  {
    path: "",
    component: SubAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAdminRoutingModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubAdminRoutingModule } from './sub-admin-routing.module';
import { SubAdminComponent } from './sub-admin.component';
import { UserComponent } from './user/user.component';



@NgModule({
  declarations: [
    SubAdminComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SubAdminRoutingModule
  ]
})
export class SubAdminModule { }

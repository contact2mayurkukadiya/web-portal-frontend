import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersModule } from '../users/users.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SubAdminComponent } from './sub-admin/sub-admin.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [AdminComponent, SubAdminComponent, UserComponent],
  imports: [CommonModule, AdminRoutingModule, SharedModule, UsersModule],
})
export class AdminModule { }

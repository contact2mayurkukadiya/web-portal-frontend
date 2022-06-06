import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';
// import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent
      },
      /* {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard]
      }, */
      /* {
        path: 'profile',
        component: ProfileComponent
      } */
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule { }

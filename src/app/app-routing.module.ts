import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { CanActivateGuard } from './shared/guards/can-activate.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin',
        canActivate: [CanActivateGuard],
        loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'sub-admin',
        canActivate: [CanActivateGuard],
        loadChildren: () => import('./pages/sub-admin/sub-admin.module').then((m) => m.SubAdminModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./pages/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/authentication/profile/profile.module').then((m) => m.ProfileModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

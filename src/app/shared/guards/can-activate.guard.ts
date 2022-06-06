import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MENUITEMS } from '@constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {
  constructor(private _router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentRoute = route.url[0].path
    const menu = MENUITEMS.find(menu => menu.path == `/${currentRoute}`)
    const currentUser = JSON.parse(localStorage.getItem('current_user_details'))
    if (menu && menu.enablesIn.indexOf(currentUser.role) > -1) {
      return true;
    }
    else {
      let firstMenu = MENUITEMS.find(menu => menu.enablesIn.indexOf(currentUser.role) > -1)
      if (firstMenu && firstMenu.path != `/${currentRoute}`)
        this._router.navigate([firstMenu.path]);
      return false;
    }
  }

}

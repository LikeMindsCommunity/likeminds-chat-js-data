import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { STORAGE_KEY } from '../enums/storage-keys.enum'; 

@Injectable({
  providedIn: 'root'
})
export class UserLoginGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     
      if (isPlatformBrowser(this.platformId)) {
        const user = localStorage.getItem(STORAGE_KEY.LIKEMINDS_USER);
        if (!user) {
          this.router.navigate(['auth']);
          return false;
        }
        else return true;
      }
      return false;
  } 
}

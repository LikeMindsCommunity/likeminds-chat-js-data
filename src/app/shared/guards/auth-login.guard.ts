import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';

import { STORAGE_KEY } from '../enums/storage-keys.enum';

@Injectable({
    providedIn: 'root',
})
export class AuthLoginGuard implements CanActivate {
    constructor(@Inject(PLATFORM_ID) private platformId: object, private router: Router, private route: ActivatedRoute) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (isPlatformBrowser(this.platformId)) {
            const user = localStorage.getItem(STORAGE_KEY.LIKEMINDS_USER);
            if (!user) {
                return true;
            } else {
                this.router.navigate(['']);
                return false;
            }
        }
        return false;
    }
}

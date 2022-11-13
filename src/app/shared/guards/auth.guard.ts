import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

import { STORAGE_KEY } from '../enums/storage-keys.enum';
import { AUTH_PATH, COMMUNITY_FEED_PATH } from '../constants/routes.constant';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(@Inject(PLATFORM_ID) private platformId: object, private router: Router, private auth: AuthService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.auth.isLoggedIn()) return true;
            else {
                this.router.navigate([`/${AUTH_PATH}`]);
                return false;
            }
        }
        return false;
    }
}

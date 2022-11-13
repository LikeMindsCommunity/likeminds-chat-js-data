import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

import { STORAGE_KEY } from '../enums/storage-keys.enum';
import { COMMUNITY_DETAIL_PATH } from '../constants/routes.constant';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class EditProfileGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (isPlatformBrowser(this.platformId)) {
          const user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
          const params = next.params;
          if (!user) return false;
          if (user && params && params.communityId && params.userId && parseInt(params.userId) === user.id) return true;
          else {
            this.router.navigate([`/${COMMUNITY_DETAIL_PATH}/${params.communityId}`], { queryParams: next.queryParams });
            return false;
          }
      }
  }
  
}

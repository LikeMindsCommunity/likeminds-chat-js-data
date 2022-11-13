import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CommunityService } from 'src/app/core/services/community.service';
import { COMMMUNITY_OPENED } from '../constants/app-constant';
import { COLLABCARD_PATH, COMMUNITY_FEED_PATH, EVENT_FEED_PATH } from '../constants/routes.constant';
import { isInternalLink } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class WhiteLabelGuard implements CanActivate {
  cmID: number;
  communityObj: any;

  constructor(private router: Router, private communityService: CommunityService, private cookieService: CookieService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log(route);


    if (isInternalLink(location.host)) {
      this.communityService?.isWhiteLabel$$?.next(false);
      return true;
    }
    if (state.url?.includes(COLLABCARD_PATH))
      return true;

    if(location.host.includes('localhost')) return true;

    return new Observable<boolean>(observer => this.communityService.getCommunityId(location.host).subscribe(res => {
      if (res.success) {
        this.cmID = res.community_id;
        this.communityService.getCommunityDetails({ communityId: this.cmID }).subscribe(community => {
          this.communityObj = community.community;

          this.communityService?.currentCommunityData$$?.next(this.communityObj);
          this.communityService?.isWhiteLabel$$?.next(true);

          this.cookieService.delete(COMMMUNITY_OPENED);
          this.cookieService?.set(COMMMUNITY_OPENED, this.communityObj?.id);

          if (this.communityObj.id == this.cmID) {
            if (!(state.url.includes(COMMUNITY_FEED_PATH) || state.url.includes(EVENT_FEED_PATH)))
              this.router.navigate(['/'], { state: { communityId: this.cmID } });
            observer.next(true)
          }
          else {
            this.router.navigate(['/404']);
            observer.next(false);
          }
        }, err => {
          this.router.navigate(['/404']);
          observer.next(false)
        })
      } else {
        this.router.navigate(['/404']);
        observer.next(false)
      }
    }, err => {
      this.router.navigate(['/404']);
      observer.next(false)
    })
    )

  }

}

import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

import { LocalStorageService } from '../../../../core/services/localstorage.service';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { IUser } from '../../../../shared/models/user.model';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { COMMMUNITY_OPENED } from 'src/app/shared/constants/app-constant';
import { COMMUNITY_FEED_PATH } from 'src/app/shared/constants/routes.constant';
import { SessionstorageService } from 'src/app/core/services/sessionstorage.service';
import { CommunityService } from 'src/app/core/services/community.service';

@Component({
    selector: 'app-home-feed',
    templateUrl: './home-feed.component.html',
    styleUrls: ['./home-feed.component.scss'],
})
export class HomeFeedComponent implements OnInit, OnDestroy {
    screenType: string;
    user: IUser;
    isChatroom: boolean = false;
    drawerOpened: boolean = false;
    private destroy$$ = new Subject();
    communityData: any;

    message: any;
    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private localStorageService: LocalStorageService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private cookieService: CookieService,
        private snackbar: MatSnackBar,
        public chatroomService: ChatroomService,
        public sessionStorageService: SessionstorageService,
        public communityService: CommunityService
    ) {}

    ngOnInit(): void {
        //get branding
        this.communityData = this.sessionStorageService.getSessionState('__community__');
        if (this.communityData?.id) this.communityService.getBranding(this.communityData?.id);

        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        let urlPattern = JSON.parse(localStorage.getItem(STORAGE_KEY.URL_PATTERN));

        let reload = this.localStorageService.getSavedState(STORAGE_KEY.HAS_LEFT_COMMUNITY);

        if (reload) {
            this.localStorageService.setSavedState(false, STORAGE_KEY.HAS_LEFT_COMMUNITY);
            window.location.reload();
        }

        let showMemberRemovedSnackbar = this.localStorageService.getSavedState(STORAGE_KEY.RELOAD);
        if (showMemberRemovedSnackbar) {
            this.snackbar.open('You have been removed from this community.', null, {
                duration: 4000,
                panelClass: ['snackbar'],
            });
            this.localStorageService.removedSavedState(STORAGE_KEY.RELOAD);
        }

        if (urlPattern) {
            let path = urlPattern.path;
            let qparams = urlPattern.queryParams;
            // if the url patter match for the renewal page
            if (path.includes('/renewal/') && qparams.renew === 'true' && qparams.user_id) {
                this.localStorageService.setSavedState('isRenewalPage', '_is__renewal__page_');
                this.router.navigate([`${path}`], { queryParams: qparams });
                return;
            }
        }

        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);

        if (this.router.url === '/') {
            this.router.navigate(['auth']);
        }

        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((route) => {
                if (route.children.length) this.isChatroom = true;
                else this.isChatroom = false;
                if (this.drawerOpened) this.chatroomService.openHomePageProfileDrawer$$.next(false);
                this.fireFbPixelEvent();
            });

        if (localStorage.getItem('__show_detail_page__')) {
            let communityId = localStorage.getItem('__show_detail_page__');
            window.localStorage.removeItem('__show_detail_page__');
            this.router.navigate(['/' + COMMUNITY_FEED_PATH + '/' + communityId + '/' + 'detail']);
        }

        // CHECK IF THE USE HAS ACCESS TO THE APP
        let access = this.localStorageService.getSavedState(STORAGE_KEY.ACCESS);
        if (!access) {
            //this.router.navigate([`/blocker`]);
        }

        this.chatroomService.openHomePageProfileDrawer$$.subscribe((res) => {
            if (this.drawerOpened !== res) this.drawerOpened = res;
        });
    }

    fireFbPixelEvent() {
        // this.fbPixelService.registerPixelEvent('trackCustom', 'ViewContent', {
        //     community_id: this.cookieService.get(COMMMUNITY_OPENED),
        //     page: 'community_home',
        // });
    }

    ngOnDestroy(): void {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

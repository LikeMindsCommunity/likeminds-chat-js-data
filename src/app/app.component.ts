import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID, Input, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { GetHeaderDataAction, ClearMessage } from './shared/store/actions/app.action';
import { BaseHeaderData } from './shared/models/header.model';
import { getSelectedHeader, isLoading } from './shared/store/selectors/app.selector';
import { MESSAGE_TYPE } from './shared/enums/message-type.enum';
import { setTheme } from 'ngx-bootstrap/utils';
import { State } from './shared/store/reducers';
import { ScriptService } from './core/services/script.service';
import { isPlatformBrowser } from '@angular/common';
import { AUTH_PATH, COMMUNITY_DETAIL_PATH, ROUTE_PIXEL_MAP } from './shared/constants/routes.constant';
import { CommunityService } from './core/services/community.service';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from './core/services/localstorage.service';
import { STORAGE_KEY } from './shared/enums/storage-keys.enum';
import _ from 'lodash';
import { AuthService } from './core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { SessionstorageService } from './core/services/sessionstorage.service';
import { InitSdkService } from './core/services/init-sdk.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    @Input() apiKey: any;
    @Input() userUniqueId: any;
    @Input() userName: any;
    @Input() isGuest: any;

    // @Input() apiKey: any = '1b442bdc-bec5-4e08-bb41-e13debf97e00';
    // @Input() userUniqueId: any = '10003';
    // @Input() userName: any = 'Sanjay Kumar';
    // @Input() isGuest: any = 'false';

    sdk: any;
    title = 'LikeMinds';
    isLoading = false;
    subscriptions: Subscription[] = [];
    headerData: BaseHeaderData;
    publicLink = MESSAGE_TYPE.PUBLIC_LINK;
    privateLink = MESSAGE_TYPE.PRIVATE_LINK;
    snackbar = MESSAGE_TYPE.SNACKBAR;
    loadingBtn: boolean = true;
    communityData: any;
    private destroy$$ = new Subject();

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        public translate: TranslateService,
        private store: Store<State>,
        private cdr: ChangeDetectorRef,
        private scriptService: ScriptService,
        private communityService: CommunityService,
        private initSdkService: InitSdkService,
        private router: Router,
        private auth: AuthService,
        private cookieService: CookieService,
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionstorageService
    ) {
        setTheme('bs4');
        translate.addLangs(['en', 'hi']);
        translate.setDefaultLang('en');
    }

    ngOnInit(): void {
        this.sdk = {
            apiKey: this.apiKey,
            userUniqueId: this.userUniqueId || '',
            userName: this.userName || '',
            isGuest: this.isGuest?.toLowerCase() == 'true' ? true : false,
        };

        this.initSdkService.sdkInfo$$.next(this.sdk);

        this.scriptService.load('google_places');
        this.getSelectedHeader();
        this.store.pipe(select(isLoading)).subscribe((isLoading) => {
            this.isLoading = isLoading;
            this.cdr.detectChanges();
        });

        this.authSdk();

        // Get Headers Data
        this.store.dispatch(GetHeaderDataAction());

        // //get branding
        // this.communityData = this.sessionStorageService.getSessionState('__community__');
        // if (this.communityData?.id) this.communityService.getBranding(this.communityData?.id);

        // this.communityService.currentCommunityData$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
        //     if (res?.id) this.communityService.getBranding(res?.id);
        // });
    }

    authSdk() {
        if (this.auth.isLoggedIn()) {
            if (location.pathname.split('/').length > 3) {
            } else {
                this.router.navigateByUrl('/' + this.cookieService.get('__community-opened__'));
            }
            this.onGetBranding();
        } else {
            this.onGetBranding();
            this.router.navigate([`/${AUTH_PATH}`]);
            return false;
        }
    }

    onGetBranding() {
        //get branding
        this.communityData = this.sessionStorageService.getSessionState('__community__');
        if (this.communityData?.id) this.communityService.getBranding(this.communityData?.id);
    }

    // Logout
    logout() {
        this.auth
            .logout({
                refresh_token: this.localStorageService.getSavedState(STORAGE_KEY.REFRESH_TOKEN_RTM)?.refresh_token,
            })
            .pipe(takeUntil(this.destroy$$))
            .subscribe((res) => {
                this.sdk.setBranding({});
                localStorage.clear();
                return true;
            });
    }

    // Get selected header
    getSelectedHeader() {
        this.subscriptions.push(
            this.store.pipe(select(getSelectedHeader)).subscribe((headerData) => {
                this.headerData = headerData;
                this.cdr.detectChanges();
            })
        );
    }

    close() {
        this.store.dispatch(ClearMessage());
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

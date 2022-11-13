import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from 'src/app/core/services/auth.service';
import { CommunityService } from 'src/app/core/services/community.service';
import { InitSdkService } from 'src/app/core/services/init-sdk.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { SessionstorageService } from 'src/app/core/services/sessionstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
    private destroy$$ = new Subject();
    sdkInitData: any;
    sdkData: any;
    constructor(
        private router: Router,
        private initSdkService: InitSdkService,
        private localStorageService: LocalStorageService,
        private sessionstorageService: SessionstorageService,
        private authService: AuthService,
        private cookieService: CookieService,
        private communityService: CommunityService
    ) {}

    ngOnInit(): void {
        this.getSdkData();
    }

    getSdkData() {
        this.initSdkService.sdkInfo$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            this.sdkInitData = res;
            //get branding
            // this.communityData = this.sessionStorageService.getSessionState('__community__');
            if (this.sdkData?.community?.id) this.communityService.getBranding(this.sdkData?.community?.id);
        });

        if (!this.sdkInitData.apiKey) return;
        else {
            this.localStorageService.setSavedState(this.sdkInitData.apiKey, STORAGE_KEY.API_KEY);

            const params = {
                is_guest: this.sdkInitData.isGuest,
                user_unique_id: this.sdkInitData.userUniqueId,
                user_name: this.sdkInitData.userName,
            };

            this.authService.initiateSDK(params).subscribe((res) => {
                const access = { access: true };
                this.sdkData = res.data;

                this.localStorageService.setSavedState(this.sdkData.access_token, STORAGE_KEY.ACCESS_TOKEN_LTM);
                this.localStorageService.setSavedState(this.sdkData.refresh_token, STORAGE_KEY.REFRESH_TOKEN_RTM);

                this.localStorageService.setSavedState(this.sdkInitData.isGuest, STORAGE_KEY.IS_GUEST);
                this.localStorageService.setSavedState(this.sdkData.user.id, STORAGE_KEY.AJS_USER_ID);
                this.localStorageService.setSavedState(access, STORAGE_KEY.ACCESS);
                this.localStorageService.setSavedState({ community_id: this.sdkData.community.id }, STORAGE_KEY.BRANDING);
                this.localStorageService.setSavedState('true', 'otpSend');
                this.localStorageService.setSavedState('false', STORAGE_KEY.MY_SUBSCRIPTION_IS_OPENED);
                this.localStorageService.setSavedState(this.sdkData.user, STORAGE_KEY.LIKEMINDS_USER);
                this.localStorageService.setSavedState(access, STORAGE_KEY.USER_EXIST);

                this.cookieService.set(STORAGE_KEY.COMMUNITY_OPENED, this.sdkData.community.id);
                this.cookieService.set(STORAGE_KEY.AJS_USER_ID, this.sdkData.user.id);
                this.cookieService.set(STORAGE_KEY.NOTIFICATION, 'true');

                this.sessionstorageService.setSessionState(STORAGE_KEY.COMMUNITY, this.sdkData.community);

                this.router.navigateByUrl('/' + this.sdkData?.community?.id);
            });
        }
    }

    ngOnDestroy() {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

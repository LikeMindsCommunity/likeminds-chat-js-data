/**
 * @class AuthService
 * @description This class contains all the service related to auth
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { BaseService } from './base.service';
import {
    GENERATE_OTP_API,
    VERIFY_OTP_API,
    LOGIN_API,
    MERGE_ACCOUNT_API,
    CONFIG_API,
    LIMIT_ACCESS,
    LOGOUT_API,
    FETCH_APP_ACCESS,
    FETCH_ALL,
    SDK_INITIATE,
    REFRESH_TOKEN_API,
} from '../../shared/constants/api.constant';
import { GenerateOtpModel, GenerateOtpForMergeAccountModel } from '../../shared/models/auth.model';
import { VerifyOtpModel } from '../../shared/models/auth.model';
import { AnalyticsService } from './analytics.service';
import { LocalStorageService } from './localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';

@Injectable({
    providedIn: 'root',
})
export class AuthService extends BaseService {
    openRenewMembership$$ = new BehaviorSubject<any>(false);

    constructor(
        private httpClient: HttpClient,
        private analyticsService: AnalyticsService,
        private localStorageService: LocalStorageService
    ) {
        super(httpClient);
    }

    /**
     * @function initiateSDK
     * @param params
     * @description Service to update that DM button is clicked.
     */

    initiateSDK(params): Observable<any> {
        return this.post(params, null, SDK_INITIATE);
    }

    /**
     * @function generateOtp
     * @param params
     * @description This function generates OTP
     */
    generateOtp(params: GenerateOtpModel | GenerateOtpForMergeAccountModel): Observable<any> {
        return this.get(params, GENERATE_OTP_API);
    }

    /**
     * @function verifyOtp
     * @param params
     * @description This function verifies OTP
     */
    verifyOtp(params: VerifyOtpModel): Observable<any> {
        return this.get(params, VERIFY_OTP_API);
    }

    /**
     * @function login
     * @param data
     * @description This function is for login
     */
    login(data): Observable<any> {
        return this.post(data, null, LOGIN_API);
    }

    /**
     * @function refreshToken
     * @param data
     * @description This function is for refreshing token
     */
    refreshToken(): Observable<any> {
        return this.post(null, null, REFRESH_TOKEN_API);
    }

    /**
     * @function isLoggedIn
     * @description This function is to check if user is logged in
     */
    isLoggedIn(): boolean {
        return (
            this.localStorageService.getSavedState(STORAGE_KEY.ACCESS_TOKEN_LTM) &&
            this.localStorageService.getSavedState(STORAGE_KEY.REFRESH_TOKEN_RTM)
        );
    }

    /**
     * @function logout
     * @param data
     * @description This function is for logout
     */
    logout(params): Observable<any> {
        return this.post(params, null, LOGOUT_API);
    }

    /**
     * @function mergeAccount
     * @param data
     * @description This function is to merge accounts
     */
    mergeAccount(data): Observable<any> {
        // const { country_code, mobile_no, user_id } = data;
        return this.post(data, null, `${MERGE_ACCOUNT_API}`);
    }

    /**
     * @function setConfig
     * @description This function is get config data for the user and send it to mixpanel
     */
    setConfig(): void {
        this.get(null, CONFIG_API).subscribe((userData) => {
            const {
                user_detail,
                user_detail: { user: userObj, user_metrics },
            } = userData;
            if (user_detail && userObj && user_metrics) {
                this.analyticsService.setUserConfig({
                    $name: userObj.name,
                    has_profile_photo: userObj.image_url && !!userObj.image_url,
                    ...user_metrics,
                });
            }
            this.analyticsService.segMentConfig$$.next(userData.use_segment);
        });
    }

    getLimitAccess(userId): Observable<any> {
        return this.get(null, FETCH_APP_ACCESS);
    }

    fetchAppAccess(): Observable<any> {
        return this.get(null, FETCH_APP_ACCESS);
    }

    fetchAll(params?: any): Observable<any> {
        return this.get(params, FETCH_ALL);
    }
}

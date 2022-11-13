/**
 * @class ApiInterceptor
 * @description It intercepts all the HTTP requests
 */

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../services/localstorage.service';
import { STORAGE_KEY } from '../../shared/enums/storage-keys.enum';
import { IUser } from '../../shared/models/user.model';
import { DeviceService } from '../services/device.service';
import { FETCH_ALL, FETCH_CONVERSATION_API, GET_COMMUNITY_FEED_CHATROOMS } from 'src/app/shared/constants/api.constant';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(private localStorageService: LocalStorageService, private deviceStorage: DeviceService) {}
    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let BASE_URL = '';
        BASE_URL = environment.baseUrl;

        if (httpRequest.url.includes('/subscription/')) {
            BASE_URL = environment.baseUrlPayment;
        } else if (httpRequest.url.includes('/sdk/')) {
            BASE_URL = environment.sdkBaseUrl;
        } else {
            BASE_URL = environment.baseUrl;
        }

        const isAssetRequest = httpRequest.url.includes('assets');
        const isLinkedinRequest = httpRequest.url.includes('linkedin');
        const isMergeAccountRequest = httpRequest.url.includes('merge_account');
        const isJoinCommunityRequest = httpRequest.url.includes('skip_community');
        const isLeaveCommunityRequest = httpRequest.url.includes('remove_from_member');
        const isCreateEventRequest = httpRequest.url.includes('event/create');
        const isEditConversationRequest = httpRequest.url.includes('edit_conversation');
        const isMarkRead = httpRequest.url.includes('mark_read');
        const isRenewMember = httpRequest.url.includes('renew_member');
        const isChatroomMuteRequest = httpRequest.url.includes('chatroom_mute');
        const isUploadUriReq = httpRequest.url.includes('/cms/banner/upload_uri');
        const isConversationFetchAPI = httpRequest.url.includes(FETCH_CONVERSATION_API);
        const isSubsriptionAPI = httpRequest.url.includes('/subscription/');
        const isFetchAllUsers = httpRequest.url.includes(FETCH_ALL);
        const isLogout = httpRequest.url.includes('/logout');
        const removeAsCommunityManager = httpRequest.url.includes('remove_community_manager');
        const transferOwnerShip = httpRequest.url.includes('transfer_ownership');
        const isJoinEmailAddRequest = httpRequest.url.includes('join_email/add');
        const isCommunityFetchCommunityMeta = httpRequest.url.includes('community/fetch_community_meta');
        const isCommunityMemberFetchFeed = httpRequest.url.includes(GET_COMMUNITY_FEED_CHATROOMS);
        const isOTPRequest = httpRequest.url.includes('otp');
        const isLoginRequest = httpRequest.url.includes('login');
        const isRefreshRequest = httpRequest.url.includes('refresh');

        const SDKInitiate = httpRequest.url.includes('/sdk/initiate');

        const isUploadUriAws = httpRequest.url.includes(`${environment.awsS3MediaUrl}`);
        const url = `${isAssetRequest || isLinkedinRequest || isUploadUriReq || isUploadUriAws ? '' : BASE_URL}` + httpRequest.url;
        httpRequest = httpRequest.clone({ url });
        const likemindsUser: IUser = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);

        let headers: HttpHeaders = new HttpHeaders();
        if (!isAssetRequest && !isLinkedinRequest) {
            headers = new HttpHeaders({
                'x-platform-code': environment.platformCode,
                Accept: 'application/json',
            });
            if (
                !isLinkedinRequest ||
                !isMergeAccountRequest ||
                !isJoinCommunityRequest ||
                !isLeaveCommunityRequest ||
                !removeAsCommunityManager ||
                !transferOwnerShip ||
                !isCommunityFetchCommunityMeta
            )
                headers.append('Content-Type', 'application/json');
        }

        const createConvoReq = httpRequest.url.includes('/conversation/create');
        const convoMetaReq = httpRequest.url.includes('/conversation_meta');
        const deviceId = this.deviceStorage.deviceID;

        if (SDKInitiate) {
            // headers = headers.append('x-api-key', localStorage.getItem('__apiKey__'));
        }
        headers = headers.append('x-api-key', this.localStorageService.getSavedState(STORAGE_KEY.API_KEY));

        if (!isOTPRequest && !isLoginRequest && !isRefreshRequest && !SDKInitiate) {
            headers = headers.append(
                'Authorization',
                `Bearer ${this.localStorageService.getSavedState(STORAGE_KEY.ACCESS_TOKEN_LTM)}`
                // `Bearer ${this.localStorageService.getSavedState(STORAGE_KEY.ACCESS_TOKEN_LTM)?.access_token}`
            );
        }

        if (isLoginRequest) {
            headers = headers.append('Authorization', `Bearer ${this.localStorageService.getSavedState(STORAGE_KEY.ACCESS_TOKEN_VTM)}`);
        }

        if (isRefreshRequest) {
            headers = headers.append('Authorization', `Bearer ${this.localStorageService.getSavedState(STORAGE_KEY.REFRESH_TOKEN_RTM)}`);
        }

        if ((createConvoReq || convoMetaReq || isConversationFetchAPI) && deviceId) {
            headers = headers.append('x-device-id', 'web_device_' + likemindsUser?.id);
        }

        if (isLogout) {
            headers = headers.append('x-device-id', 'web_device_' + likemindsUser?.id);
        }

        if (
            isLinkedinRequest ||
            isMergeAccountRequest ||
            isJoinCommunityRequest ||
            isLeaveCommunityRequest ||
            isEditConversationRequest ||
            isChatroomMuteRequest ||
            isRenewMember ||
            isMarkRead ||
            removeAsCommunityManager ||
            transferOwnerShip ||
            isCommunityFetchCommunityMeta
        ) {
            headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
        }

        if (isCommunityMemberFetchFeed) headers = headers.append('x-accept-version', 'v2');

        if (isCreateEventRequest) {
            headers = headers.append('Content-Type', 'text/plain');
        }

        if (isUploadUriReq || isFetchAllUsers) {
            headers = headers.append('x-username', 'teamGrowth');
            headers = headers.append('x-password', 'TheLMGrowth@1001');
        }
        if (likemindsUser && !isAssetRequest && !isLinkedinRequest) {
            headers = headers.append('x-member-id', likemindsUser.id.toString());
            headers = headers.append('x-version-code', environment.versionCode.toString());
        }

        httpRequest = httpRequest.clone({ headers });

        return next.handle(httpRequest);
        // return next.handle(httpRequest).pipe(
        //     tap(
        //         (event: HttpEvent<any>) => {
        //             // Handle success response here
        //         },
        //         (error: any) => {
        //             if (error instanceof HttpErrorResponse) {
        //                 console.log('Something went wrong: ' + JSON.stringify(error));
        //                 // Handle error response here
        //             }
        //         }
        //     )
        // );
    }
}

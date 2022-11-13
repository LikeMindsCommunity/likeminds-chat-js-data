import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';

import {
    EDIT_MEMBER_PROFILE,
    EDIT_USER,
    FETCH_COMMON_COMMUNITIES,
    FETCH_COMMUNITY_PROFILE,
    FETCH_REPORT_TAGS,
    FETCH_USER_CHATROOMS,
    PUSH_REPORT,
} from '../../shared/constants/api.constant';
import { switchMap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';

@Injectable({
    providedIn: 'root',
})
export class ProfileService extends BaseService {
    constructor(private httpClient: HttpClient, private afStorage: AngularFireStorage) {
        super(httpClient);
    }

    /**
     * @function getMemberProfile
     * @description Service to fetch community member profile
     */
    getMemberProfile(community_id: string | number, user_id: string | number, urlParams: any): Observable<any> {
        const queryParams = { community_id, user_id, ...urlParams };
        return this.get(queryParams, FETCH_COMMUNITY_PROFILE);
    }

    /**
     * @function getMemberProfile
     * @description Service to fetch community member profile
     */
    updateProfileImage(payload: any): Observable<any> {
        return this.post(payload, null, EDIT_USER);
    }

    /**
     * @function getCommonCommunitites
     * @description Service to fetch common communities
     */
    getCommonCommunities(user_id: string | number, page: string | number, urlParams: any): Observable<any> {
        const queryParams = { page, user_id, ...urlParams };
        return this.get(queryParams, FETCH_COMMON_COMMUNITIES);
    }

    /**
     * @function getChatrooms
     * @description Service to fetch chatrooms of user
     */
    getChatrooms(
        community_id: string | number,
        user_id: string | number,
        state: string | number,
        page: string | number,
        urlParams: any
    ): Observable<any> {
        const queryParams = { community_id, page, user_id, state, ...urlParams };
        return this.get(queryParams, FETCH_USER_CHATROOMS);
    }

    /**
     * @function getReportTags
     * @description Service to fetch report tags
     */
    getReportTags(): Observable<any> {
        return this.get({ type: 0 }, FETCH_REPORT_TAGS);
    }

    /**
     * @function pushReport
     * @description Service to push report
     */
    pushReport(data: any): Observable<any> {
        return this.post(data, null, PUSH_REPORT);
    }

    /**
     * @function editMemberProfile
     * @description Service to edit member profile
     */
    editMemberProfile(data: any): Observable<any> {
        return this.post(data, null, EDIT_MEMBER_PROFILE);
    }

    /**
     * @function uploadMemberImage
     * @description Service to edit member image
     */
    uploadMemberImage(data: any, file, type = 'file'): Observable<string> {
        const path = `files/community/${data.community_id}/profile/${data.member_id}`;

        const uploadedFile: AngularFireUploadTask = this.afStorage.upload(path, file);

        return from(uploadedFile).pipe(switchMap((_) => this.afStorage.ref(path).getDownloadURL()));
    }

    /**
     * @function uploadMemberImage
     * @description Service to edit member image
     */
    uploadAccountProfileImage(data: any, file): Observable<string> {
        const path = `files/profile/${data.member_id}`;

        const uploadedFile: AngularFireUploadTask = this.afStorage.upload(path, file);

        return from(uploadedFile).pipe(switchMap((_) => this.afStorage.ref(path).getDownloadURL()));
    }
}

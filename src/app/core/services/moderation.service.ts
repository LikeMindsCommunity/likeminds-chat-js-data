/**
 * @class ModerationService
 * @description Contains services related to community manager rights
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service';

import {
    FETCH_COMMUNITY_MANGER_RIGHTS,
    FETCH_MEMBER_RIGHTS,
    FETCH_REPORT_TAGS,
    JOIN_REQUEST,
    LEAVE_COMMUNITY_API,
    REMOVE_COMMUNITY_MANAGER,
    TRANSFER_OWNERSHIP,
    UPDATE_COMMUNITY_MANAGER_RIGHTS,
    UPDATE_MEMBER_RIGHTS,
} from '../../shared/constants/api.constant';

@Injectable({
    providedIn: 'root',
})
export class ModerationService extends BaseService {
    modUserObj$$ = new BehaviorSubject<any>({});

    constructor(private httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * @function getCummunityManagerRight
     * @param params
     * @description Service to fetch community manager rights
     */
    getCummunityManagerRight(params): Observable<any> {
        return this.get(params, FETCH_COMMUNITY_MANGER_RIGHTS);
    }

    /**
     * @function updateCummunityManagerRight
     * @param params
     * @description Service to update community manager rights
     */
    updateCummunityManagerRight(params): Observable<any> {
        return this.post(params, null, UPDATE_COMMUNITY_MANAGER_RIGHTS);
    }

    /**
     * @function getManagerRight
     * @param params
     * @description Service to fetch manager rights
     */
    getManagerRight(params): Observable<any> {
        return this.get(params, FETCH_MEMBER_RIGHTS);
    }

    /**
     * @function updateManagerRight
     * @param params
     * @description Service to update community manager rights
     */
    updateManagerRight(params): Observable<any> {
        return this.post(params, null, UPDATE_MEMBER_RIGHTS);
    }

    /**
     * @function removeCommunityMember
     * @param params
     * @description Service to update community manager rights
     */
    removeCommunityMember(params): Observable<any> {
        return this.post(params, null, LEAVE_COMMUNITY_API);
    }

    /**
     * @function removeCommunityManager
     * @param params
     * @description Service to remove as community manager
     */
    removeCommunityManager(params): Observable<any> {
        return this.post(params, null, REMOVE_COMMUNITY_MANAGER);
    }

    /**
     * @function doTransferOwnerShip
     * @param params
     * @description Service to transer owner ship rights
     */
    doTransferOwnerShip(params): Observable<any> {
        return this.post(params, null, TRANSFER_OWNERSHIP);
    }

    /**
     * @function memberRequest
     * @param params
     * @description Service to update member request
     */
    memberRequest(params): Observable<any> {
        return this.post(params, null, JOIN_REQUEST);
    }

    /**
     * @function getReportTags
     * @description Service to fetch report tags
     */
    getReportTags(): Observable<any> {
        return this.get({}, FETCH_REPORT_TAGS);
    }
}

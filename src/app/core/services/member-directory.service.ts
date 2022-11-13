/**
 * @class MemberDirectoryService
 * @description Contains services related to member directory
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from './base.service';

import {
    ALL_MEMBER_LIST_API,
    FETCH_FILTERS,
    SEARCH_MEMBER_DIRECTORY,
    SUBSCRIPTION_SEARCH,
    SUBSCRIPTION_SEARCH_HISTORY,
    USER,
} from '../../shared/constants/api.constant';

@Injectable({
    providedIn: 'root',
})
export class MemberDirectoryService extends BaseService {
    constructor(private httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * @function getAllMembers
     * @param params
     * @description Service to fetch all member
     */
    getAllMembers(params): Observable<any> {
        return this.get(params, ALL_MEMBER_LIST_API);
    }

    /**
     * @function getMemberFilters
     * @param params
     * @description Service to fetch all member filters
     */
    getMemberFilters(params): Observable<any> {
        return this.get(params, FETCH_FILTERS);
    }

    /**
     * @function getSubscriptionSearchHistory
     * @param params
     * @description Service to fetch all member filters
     */
    getSubscriptionSearchHistory(params): Observable<any> {
        return this.get(params, SUBSCRIPTION_SEARCH_HISTORY);
    }

    /**
     * @function getSubscriptionSearch
     * @param params
     * @description Service to fetch all member filters
     */
    getSubscriptionSearch(params): Observable<any> {
        return this.get(params, SUBSCRIPTION_SEARCH);
    }

    /**
     * @function getMembersDirectory
     * @param params
     * @description Service to fetch all member filters
     */
    getMembersDirectory(params): Observable<any> {
        return this.get(params, SEARCH_MEMBER_DIRECTORY);
    }

    /**
     * @function getUserData
     * @param params
     * @description Service to fetch all member filters
     */
    getUserData(params): Observable<any> {
        const userid = `${USER}/${params}`;
        return this.get(params, userid);
    }
}

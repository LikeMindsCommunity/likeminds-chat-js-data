/**
 * @class DmService
 * @description Contains services related to Direct messaging
 */

import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

import {
    SHOW_DM_BUTTON,
    FETCH_DM_HOME,
    UPDATE_DM_TUTORIAL,
    FETCH_DM_FEED,
    GET_HOME_FEED_CHATROOMS,
    GET_DM_FEED_CHATROOMS,
    CAN_DM,
    GET_ALL_MEMBERS_DM,
    REQUEST_DM_LIMIT,
    CREATE_DM,
    REQUEST_DM,
    PUSH_REPORT,
    BLOCK
} from '../../shared/constants/api.constant';

@Injectable({
    providedIn: 'root',
})
export class DmService extends BaseService {
    getTotalCountDM = new BehaviorSubject<any>('');

    constructor(private httpClient: HttpClient, private cookieService: CookieService) {
        super(httpClient);
    }

    showDmHeader$$ = new BehaviorSubject<any>({ status: false, headerValue: '' });
    private dmFeedChatroomGroups$$ = new BehaviorSubject<any>({});

    public get dmFeedChatroomGroups$(): Observable<any> {
        return this.dmFeedChatroomGroups$$.asObservable();
    }

    /**
    * @function getShowDmButtonInfo
    * @param params
    * @description Service to fetch show dm button or not in profile page or community detail page
    */
    getShowDmButtonInfo(params): Observable<any> {
        return this.post(params, null, SHOW_DM_BUTTON);
    }

    /**
     * @function fetchDmHome
     * @param params
     * @description Service to fetch info about whther to show dm button or not, with new tag and dm count info
     */

    fetchDmHome(params): Observable<any> {
        return this.get(params, FETCH_DM_HOME)
    }

    /**
    * @function updateDmTutorial
    * @param params
    * @description Service to update that DM button is clicked.
    */

    updateDmTutorial(params): Observable<any> {
        return this.post(params, null, UPDATE_DM_TUTORIAL);
    }

    /**
    * @function fetchDmFeed
    * @param params
    * @description Service to fetch the value whether DMs are enabled or not.
    */

    fetchDmFeed(params): Observable<any> {
        return this.get(params, FETCH_DM_FEED)
    }

    getInitialFeedChatRooms(params): void {
        this.get(params, GET_HOME_FEED_CHATROOMS)
            .subscribe((response) => {

                if (response.my_chatrooms.length === 0) {
                    return;
                }

                let data = this.dmFeedChatroomGroups$$.value;
                data['home'] = {
                    chatrooms: params?.page == 1 ? response?.my_chatrooms : [...data['home']?.chatrooms, ...response.my_chatrooms],
                    total_pages: response?.total_pages,
                };
                this.dmFeedChatroomGroups$$.next({ ...data });
                params.page = 2
                this.getDmFeedChatrooms(params)
                // this.createInitialConversations(response.my_chatrooms);
            });
    }

    getDmFeedChatrooms(params): void {
        // const queryParams = { page };
        this.get(params, GET_HOME_FEED_CHATROOMS)
            .subscribe((response) => {

                if (response.my_chatrooms.length === 0) {
                    return;
                }

                let data = this.dmFeedChatroomGroups$$.value;
                data['home'] = {
                    chatrooms: params?.page == 1 ? response?.my_chatrooms : [...data['home']?.chatrooms, ...response.my_chatrooms],
                    total_pages: response?.total_pages,
                };
                this.dmFeedChatroomGroups$$.next({ ...data });
                // this.createInitialConversations(response.my_chatrooms);
            });
    }

    fetchDMChatrooms(params): void {
        // const queryParams = { page };
        this.get(params, GET_DM_FEED_CHATROOMS)
            .subscribe((response) => {

                if (response.dm_chatrooms.length === 0) {
                    return;
                }

                let data = this.dmFeedChatroomGroups$$.value;
                data['home'] = {
                    chatrooms: params?.page == 1 ? response?.dm_chatrooms : [...data['home']?.chatrooms, ...response.dm_chatrooms],
                    total_pages: response?.total_pages,
                };
                this.dmFeedChatroomGroups$$.next({ ...data });
                // this.createInitialConversations(response.my_chatrooms);
            });
    }

    canDM(params) {
        return this.get(params, CAN_DM)

    }

    getAllMembers(params) {
        return this.get(params, GET_ALL_MEMBERS_DM);
    }

    requestDMLimit(params) {
        return this.get(params, REQUEST_DM_LIMIT)
    }

    createDM(body) {
        return this.post(body, null, CREATE_DM)
    }

    requestDM(params) {
        return this.post(params, null, REQUEST_DM)
    }

    pushReport(params) {
        return this.post(params, null, PUSH_REPORT)
    }

    chatroomBlock(body) {
        return this.post(body, null, BLOCK)
    }

}

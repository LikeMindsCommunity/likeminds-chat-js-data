import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

import { BaseService } from './base.service';
import { LocalStorageService } from './localstorage.service';
import {
    CHATROOM_EVENT_FETCH_ALL,
    COLLABCARD_SEEN,
    EVENT_FETCH_ALL_META,
    FETCH_UNSEEN_COUNT,
    UPDATE_LAST_SEEN,
} from 'src/app/shared/constants/api.constant';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root',
})
export class EventFeedService extends BaseService {
    private unseenEventCount$$ = new BehaviorSubject<any>({});
    private eventFeedChatroomGroups$$ = new BehaviorSubject<any>({});

    constructor(private httpClient: HttpClient, private utilsService: UtilsService, private localStorageService: LocalStorageService) {
        super(httpClient);
    }

    public get eventFeedChatroomGroups$(): Observable<any> {
        return this.eventFeedChatroomGroups$$.asObservable();
    }

    public get unseenEventCount$(): Observable<any> {
        return this.unseenEventCount$$.asObservable();
    }

    /**
     * @function getHomeFeedChatrooms
     * @description Service to fetch home feed chatrooms
     */

    getEventFeedChatrooms(page: string | number): void {
        // Past events

        const queryParams = {
            page: page,
            attending_status: true,
            past_events: false,
        };
        this.get(queryParams, CHATROOM_EVENT_FETCH_ALL).subscribe((response) => {
            if (response.my_chatrooms.length === 0) {
                return;
            }
            let data = this.eventFeedChatroomGroups$$.value;
            data['home'] = {
                chatrooms: [...data['home']?.chatrooms, ...response.my_chatrooms],
                inactive_chatroom_count: response.inactive_chatroom_count,
                total_pages: response.total_pages,
            };
            this.eventFeedChatroomGroups$$.next({ ...data });
        });
    }

    /**
     * @function getUnseenEventFeedCount
     * @param params
     * @description Service to fetch new event room counts
     */
    getUnseenEventFeedCount() {
        return this.get({}, FETCH_UNSEEN_COUNT);
        // this.get({}, FETCH_UNSEEN_COUNT).subscribe((res) => {
        //     this.unseenEventCount$$.next(res);
        // });
    }

    /**
     * @function getMyEvents
     * @param params
     * @description Service to fetch chatroom url
     */
    getMyEvents(params): Observable<any> {
        return this.get(params, CHATROOM_EVENT_FETCH_ALL);
    }

    /**
     * @function updateLastSeen
     * @param params
     * @description Service to update last seen
     */
    updateLastSeen(): Observable<any> {
        return this.post(null, {}, UPDATE_LAST_SEEN);
    }

    /**
     * @function markEventNotNew
     * @description Service to mark chatroom as seen
     */
    markEventNotNew(event: any, userId: number | string) {
        const queryParams = {
            collabcard_id: event?.id,
            community_id: event?.community_id,
            member_id: userId,
            collabcard_type: event?.type,
        };
        this.post(null, queryParams, COLLABCARD_SEEN).subscribe((_) => {});
    }

    /**
     * @function fetchAllMeta
     * @param params
     * @description Service to fetch all event meta
     */
    fetchAllMeta(params): Observable<any> {
        return this.get(params, EVENT_FETCH_ALL_META);
    }
}

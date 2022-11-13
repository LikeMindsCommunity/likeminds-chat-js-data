/**
 * @class CommunityService
 * @description Contains services related to community
 */

import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import {
    MEMBER_STATE_API,
    QUESTIONS_API,
    JOIN_COMMUNITY_API,
    ADMIN_MEMBER_LIST_API,
    ALL_MEMBER_LIST_API,
    COMMUNITY_API,
    SKIP_COMMUNITY_API,
    INTRO_EXAMPLES_API,
    COMMUNITY_CHAT_ROOM_FEED_API,
    LEAVE_COMMUNITY_API,
    FETCH_COMMUNITY_URL,
    FETCH_FEED_URL,
    COMMUNITY_FETCH_COMMUNITY_META,
    BRANDING,
    INVITE_MULTIPLE_MEMBER,
    GET_COMMUNITY_ID,
    FETCH_MEMBERS_META,
    SEARCH_CHATROOM,
    SEARCH_CONVERSATION,
} from '../../shared/constants/api.constant';
import { CookieService } from 'ngx-cookie-service';
import { COMMMUNITY_OPENED } from 'src/app/shared/constants/app-constant';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { LocalStorageService } from './localstorage.service';

@Injectable({
    providedIn: 'root',
})
export class CommunityService extends BaseService {
    constructor(private httpClient: HttpClient, private cookieService: CookieService, private lsService: LocalStorageService) {
        super(httpClient);
    }

    currentCommunityData$$ = new BehaviorSubject<any>(null);
    currentCommunityBranding$$ = new BehaviorSubject<any>(null);
    isWhiteLabel$$ = new BehaviorSubject<any>(null);
    showPendingStateMessage$$ = new BehaviorSubject<any>(false);
    showMembershipExpiredMessage$$ = new BehaviorSubject<boolean>(null);
    memberStateObj$$ = new BehaviorSubject<any>('');
    sendAccessDataToBottomSheet$$ = new BehaviorSubject<any>(null);
    showCommunityHeader$$ = new BehaviorSubject<any>({ status: false, headerValue: '' });

    /**
     * @function getMemberState
     * @param params
     * @description Service to fetch state of member
     */
    getMemberState(params): Observable<any> {
        return this.get(params, MEMBER_STATE_API);
    }

    /**
     * @function getCurrentCommunity
     * @param params
     * @description Service to get current opened community
     */
    getCurrentCommunity(): number {
        return +this.cookieService?.get(COMMMUNITY_OPENED);
    }

    /**
     * @function getQuestions
     * @param params
     * @description Service to fetch questions list of a community
     */
    getQuestions(params): Observable<any> {
        return this.get(params, QUESTIONS_API);
    }

    /**
     * @function getCommunityMembers
     * @param params
     * @description Service to fetch members list of a community
     */
    getCommunityMembers(params): Observable<any> {
        return this.get(params, FETCH_MEMBERS_META);
    }

    /**
     * @function joinCommunity
     * @param body
     * @description Service to join community
     */
    joinCommunity(body): Observable<any> {
        return this.post(body, null, JOIN_COMMUNITY_API);
    }

    /**
     * @function joinCommunity
     * @param body
     * @description Service to join community
     */
    skipCommunity(body): Observable<any> {
        return this.post(body, null, SKIP_COMMUNITY_API);
    }

    /**
     * @function getAdminMembersList
     * @param communityId
     * @description Service to get list of members
     */
    getCommunityAdminList({ community_id }): Observable<any> {
        const subPath = `${ADMIN_MEMBER_LIST_API}/${community_id}`;
        return this.get(null, subPath);
    }

    /**
     * @function getSearchListChatrooms
     * @description Service to fetch home-feed search conversations
     */
    getSearchListChatrooms(params) {
        return this.get(params, SEARCH_CHATROOM);
    }

    /**
     * @function getSearchListConversations
     * @description Service to fetch home-feed search chatrooms
     */
    getSearchListConversations(params) {
        return this.get(params, SEARCH_CONVERSATION);
    }

    /**
     * @function getAllMembers
     * @param params
     * @description Service to get list of members
     */
    getAllMembers(params): Observable<any> {
        return this.get(params, ALL_MEMBER_LIST_API);
    }

    /**
     * @function getCommunityDetails
     * @description Service to get community details
     */
    getCommunityDetails(data: any): Observable<any> {
        const { communityId, aj, member_id } = data;
        return this.get({ aj, member_id }, COMMUNITY_API + `/${communityId}`);
    }

    /**
     * @function getIntroExamples
     * @description Service to get intro examples
     */
    getIntroExamples(): Observable<any> {
        return this.get(null, INTRO_EXAMPLES_API);
    }

    /**
     * @function getCommunityChatroomFeed
     * @description Service to get community chatroom feed
     */
    getCommunityChatroomFeed(communityId: object): Observable<any> {
        return this.get(communityId, COMMUNITY_CHAT_ROOM_FEED_API);
    }

    /**
     * @function leaveCommunity
     * @description Service to leave community
     */
    leaveCommunity(body: any): Observable<any> {
        return this.post(body, null, LEAVE_COMMUNITY_API);
    }

    /**
     * @function getCommunityShareURL
     * @description Service to fetch communuity share url (Private/public)
     */
    getCommunityShareURL(communityId: any): Observable<any> {
        return this.get(null, FETCH_COMMUNITY_URL + `?community_id=${communityId}`);
    }

    /**
     * @function getCommunityFeedUrl
     * @description Service to fetch communuity feed url.
     */
    getCommunityFeedUrl(communityId: any): Observable<any> {
        return this.get(null, FETCH_FEED_URL + `?community_id=${communityId}`);
    }

    /**
     * @function postAjToGetCommunityIdAndSharedBy
     * @description Service to get Community ID and shared_by used in community Joining. Aj acts as joining code here.
     */
    postAjToGetCommunityIdAndSharedBy(body: any): Observable<any> {
        return this.post(body, null, COMMUNITY_FETCH_COMMUNITY_META + body);
    }

    getBranding(id: any) {
        return this.get(null, `${COMMUNITY_API}/${id}${BRANDING}`).subscribe((res) => {
            if (res.success) {
                this.currentCommunityBranding$$.next({ ...res?.branding, community_id: id });
                this.lsService.setSavedState({ ...res?.branding, community_id: id }, STORAGE_KEY.BRANDING);
            } else {
                const branding = this.lsService.getSavedState(STORAGE_KEY.BRANDING);
                if (parseInt(branding?.community_id) === parseInt(id)) {
                    this.currentCommunityBranding$$.next({ ...res?.branding, community_id: id });
                }
            }
            let branding = res.branding || this.lsService.getSavedState(STORAGE_KEY.BRANDING);

            //branding colors init
            document.body.style.setProperty(
                '--header_colour',
                branding?.advanced?.header_colour ? branding?.advanced?.header_colour : 'white'
            );
            document.body.style.setProperty(
                '--buttons_icons_colour',
                branding?.advanced?.buttons_icons_colour
                    ? branding?.advanced?.buttons_icons_colour
                    : branding?.basic?.primary_colour
                    ? branding?.basic?.primary_colour
                    : undefined
            );
            document.body.style.setProperty(
                '--text_links_colour',
                branding?.advanced?.text_links_colour
                    ? branding?.advanced?.text_links_colour
                    : branding?.basic?.primary_colour
                    ? branding?.basic?.primary_colour
                    : undefined
            );
            document.body.style.setProperty('--header_text_colour', !branding?.advanced?.header_colour ? '#000000' : '#ffffff');

            if (document.body.style.getPropertyValue('--header_colour') === 'undefined')
                document.body.style.removeProperty('--header_colour');
            if (document.body.style.getPropertyValue('--buttons_icons_colour') === 'undefined')
                document.body.style.removeProperty('--buttons_icons_colour');
            if (document.body.style.getPropertyValue('--text_links_colour') === 'undefined')
                document.body.style.removeProperty('--text_links_colour');
        });
    }

    resetBranding() {
        document.body.style.removeProperty('--header_colour');
        document.body.style.removeProperty('--buttons_icons_colour');
        document.body.style.removeProperty('--text_links_colour');
        document.body.style.removeProperty('--header_text_colour');
    }

    getCommunityId(domain: any) {
        return this.get({ domain }, `${GET_COMMUNITY_ID}`);
    }
    /**
     * @function body
     * @param body
     * @description Service to send multiple invite using either whatsapp or emailid's
     */
    sendInviteLinks(body): Observable<any> {
        return this.post(body, null, INVITE_MULTIPLE_MEMBER);
    }
}

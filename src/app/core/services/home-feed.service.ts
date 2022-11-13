import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, forkJoin, Observable, from, interval, Subscription, Subject, zip } from 'rxjs';
import { filter, last, map, switchMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';

import { BaseService } from './base.service';
import { LocalStorageService } from './localstorage.service';
import { ChatroomService } from './chatroom.service';
import { State } from '../../shared/store/reducers';
import { IUser } from '../../shared/models/user.model';
import { copyTextToClipboard } from '../../shared/utils';
import { ICommunity } from '../../shared/models/community.model';
import { STORAGE_KEY } from '../../shared/enums/storage-keys.enum';
import { BLOCKER } from '../../shared/constants/routes.constant';
import { MemberTagPipe } from '../../shared/pipes/member-tag.pipe';
import { ConversationModel, IMessage } from '../../shared/models/chatroom.model';
import { StartLoading, StopLoading } from '../../shared/store/actions/app.action';
import { ReportPopupComponent } from '../../shared/entryComponents/report-popup/report-popup.component';
import { ReportedPopupComponent } from '../../shared/entryComponents/reported-popup/reported-popup.component';
import { DeleteConfirmationComponent } from '../../shared/entryComponents/delete-confirmation/delete-confirmation.component';
import { environment } from 'src/environments/environment';

import {
    CHATROOM_PIN,
    CHATROOM_UPLOAD_FILES,
    COLLABCARD_SEEN,
    COMMUNITY_META,
    CREATE_CONVERSATION_API,
    DELETE_CONVERSATION_API,
    EDIT_CONVERSATION_API,
    FETCH_CHATROOM_API,
    FETCH_CONVERSATION_API,
    FETCH_MICROPOLL_USERS,
    FETCH_POLL_USERS,
    FETCH_UNREAD_PREVIEWS_API,
    FETCH_UNREAD_PREVIEWS_COUNT_API,
    GET_COMMUNITY_FEED_CHATROOMS,
    GET_HOME_FEED_CHATROOMS,
    GET_HOME_FEED_COMMUNITIES,
    HOME_DRAWER_BOTTOM_MENU,
    HOME_FEED_META,
    PUSH,
    PUSH_REPORT,
    SUBSCRIPTION_FETCH,
} from '../../shared/constants/api.constant';
import { IndexedDbService } from './indexed-db.service';
import { AwsS3BucketService } from './aws-s3-bucket.service';
import { SubscriptionService } from './subscription.service';
import { UtilsService } from './utils.service';
import { CookieService } from 'ngx-cookie-service';
import { COMMMUNITY_OPENED } from 'src/app/shared/constants/app-constant';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class HomeFeedService extends BaseService {
    user: IUser;

    public communityGroup$$ = new BehaviorSubject<any>([]);
    public refreshEvent = new Subject<any>();
    private communityDetailGroup$$ = new BehaviorSubject<any>({});
    private mySubscriptions$$ = new BehaviorSubject<any>(null);
    private homeFeedChatroomGroups$$ = new BehaviorSubject<any>({});
    private communityFeedChatroomGroups$$ = new BehaviorSubject<any>({});
    private communityPinnedChatroomGroup$$ = new BehaviorSubject<any>({});
    private chatroomDetailGroup$$ = new BehaviorSubject<any>({});
    public conversationGroups$$ = new BehaviorSubject<any>({});
    private introRoomThreadConv$$ = new BehaviorSubject<any>(null);
    private replyMessage$$ = new BehaviorSubject<any>(null);
    private editMessage$$ = new BehaviorSubject<any>(null);
    private selectedMsg$$ = new BehaviorSubject<any>({});
    private mediaUploadPercentage$$ = new BehaviorSubject<any>({});
    private refreshSubscription: Subscription;
    public loadedMediaObject$$ = new BehaviorSubject<any>({});
    public currentlyLoadingMediaIds$$ = new BehaviorSubject<any>({});
    public totalFileSize$$ = new BehaviorSubject<{}>({});
    public mapTempToOriginalMessageIDs$$ = new BehaviorSubject<{}>({});
    public subscribedCommunitiesMetaGroup$$ = new BehaviorSubject<any>({});
    public backgroundBackdropEnabled$$ = new BehaviorSubject<boolean>(false);
    public memberRemovedFromCommunityData$$ = new BehaviorSubject<{}>({});
    public watchCommunity$$ = new BehaviorSubject<any>(null);

    introRoomThreadConvCount$$ = new BehaviorSubject<number>(0);
    deleteIndexedDBvalues = new BehaviorSubject<any>(false);
    showRetryButton$$ = new BehaviorSubject<any>(true);
    showIntroThreadView$$ = new BehaviorSubject<any>(false);
    introThreadPageCount$$ = new BehaviorSubject<any>(2);
    homePageProfileUpdated$$ = new BehaviorSubject<any>(false);
    disableInputView$$ = new BehaviorSubject<any>(false);
    public get loadedMediaObject$(): Observable<any> {
        return this.loadedMediaObject$$.asObservable();
    }

    public get mediaUploadPercentage$(): Observable<any> {
        return this.mediaUploadPercentage$$.asObservable();
    }

    public get replyMessage$(): Observable<any> {
        return this.replyMessage$$.asObservable();
    }

    public get subscribedCommunitiesMetaGroup$(): Observable<any> {
        return this.subscribedCommunitiesMetaGroup$$.asObservable();
    }

    public get mySubscriptions$(): Observable<any> {
        return this.mySubscriptions$$.asObservable();
    }

    public get editMessage$(): Observable<any> {
        return this.editMessage$$.asObservable();
    }

    public get selectedMsg$(): Observable<any> {
        return this.selectedMsg$$.asObservable();
    }

    public get communityGroup$(): Observable<any> {
        return this.communityGroup$$.asObservable();
    }

    public get communityDetailGroup$(): Observable<any> {
        return this.communityDetailGroup$$.asObservable();
    }

    public get communityPinnedChatroomGroup$(): Observable<any> {
        return this.communityPinnedChatroomGroup$$.asObservable();
    }

    public get communityFeedChatroomGroups$(): Observable<any> {
        return this.communityFeedChatroomGroups$$.asObservable();
    }

    public get homeFeedChatroomGroups$(): Observable<any> {
        return this.homeFeedChatroomGroups$$.asObservable();
    }

    public get chatroomDetailGroup$(): Observable<any> {
        return this.chatroomDetailGroup$$.asObservable();
    }

    public get conversationGroups$(): Observable<any> {
        return this.conversationGroups$$.asObservable();
    }

    public get conversationGroupsBehavior$(): BehaviorSubject<any> {
        return this.conversationGroups$$;
    }

    public get introRoomThreadConv$(): Observable<any> {
        return this.introRoomThreadConv$$.asObservable();
    }

    constructor(
        private httpClient: HttpClient,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        private store: Store<State>,
        private chatroomService: ChatroomService,
        private localStorageService: LocalStorageService,
        private indexedDbService: IndexedDbService,
        private awsS3Bucket: AwsS3BucketService,
        private subscriptionService: SubscriptionService,
        private cookieService: CookieService,
        private utilsService: UtilsService,
        private router: Router
    ) {
        super(httpClient);

        this.chatroomService.getConvoData$$.subscribe((res) => {
            if (res) {
                const data = { ...this.conversationGroups$$.value };
                this.conversationGroups$$.next(data);
                this.chatroomService.getConvoData$$.next(false);
            }
        });
    }

    updateConversationGroup(conversations) {
        this.conversationGroups$$.next(conversations);
    }

    updateChatroomDetailGroup(allChatroomDetail) {
        this.chatroomDetailGroup$$.next(allChatroomDetail);
    }

    /**
     * @function getHomeFeedChatrooms
     * @description Service to fetch home feed chatrooms
     */

    getHomeFeedChatrooms(page: string | number): void {
        const queryParams = { page };
        this.get(queryParams, GET_HOME_FEED_CHATROOMS).subscribe((response) => {
            if (response.my_chatrooms.length === 0) {
                return;
            }

            let data = this.homeFeedChatroomGroups$$.value;
            data['home'] = {
                chatrooms: page == 1 ? response.my_chatrooms : [...data['home']?.chatrooms, ...response.my_chatrooms],
                inactive_chatroom_count: response.inactive_chatroom_count,
                total_pages: response.total_pages,
            };
            this.homeFeedChatroomGroups$$.next({ ...data });
            this.createInitialConversations(response.my_chatrooms);
        });
    }

    getInitialHomeFeedChatrooms(): void {
        const queryParams = { page: 1 };
        this.get(queryParams, GET_HOME_FEED_CHATROOMS).subscribe(
            (response) => {
                if (!response.my_chatrooms || response.my_chatrooms.length === 0) {
                    return;
                }
                let data = this.homeFeedChatroomGroups$$.value;
                data['home'] = {
                    chatrooms: response.my_chatrooms,
                    inactive_chatroom_count: response.inactive_chatroom_count,
                    total_pages: response.total_pages,
                };
                this.homeFeedChatroomGroups$$.next({ ...data });
                this.createInitialConversations(response.my_chatrooms);
                this.getHomeFeedChatrooms(2);
            },
            (err) => {}
        );
    }

    /**
     * @function getHomeFeedChatrooms
     * @description Service to fetch community home feed chatrooms
     */

    getCommunityHomeFeedChatrooms(community_id: number, page: string | number): void {
        const queryParams = { community_id, page };
        this.get(queryParams, GET_HOME_FEED_CHATROOMS).subscribe((response) => {
            if (response.my_chatrooms.length === 0) {
                return;
            }

            let data = this.homeFeedChatroomGroups$$.value;
            data['home'] = {
                chatrooms: [...data['home']?.chatrooms, ...response.my_chatrooms],
                inactive_chatroom_count: response.inactive_chatroom_count,
                total_pages: response.total_pages,
            };
            this.homeFeedChatroomGroups$$.next({ ...data });
            this.createInitialConversations(response.my_chatrooms);
        });
    }

    /**
     * @function getIntitialCommunityHomeFeedChatrooms
     * @description Service to fetch initial community home feed chatrooms
     */
    getInitialCommunityHomeFeedChatrooms(community_id?): void {
        const queryParams = { community_id, page: 1 };
        this.get(queryParams, GET_HOME_FEED_CHATROOMS).subscribe(
            (response) => {
                if (!response.my_chatrooms) {
                    return;
                }
                let data = this.homeFeedChatroomGroups$$.value;
                data['home'] = {
                    chatrooms: response.my_chatrooms,
                    inactive_chatroom_count: response.inactive_chatroom_count,
                    total_pages: response.total_pages,
                };
                this.homeFeedChatroomGroups$$.next({ ...data });
                this.createInitialConversations(response.my_chatrooms);
                this.getCommunityHomeFeedChatrooms(community_id, 2);
            },
            (err) => {}
        );
    }

    updateChatroomCount(chatroomId: number): number {
        let count: number;
        let data = this.homeFeedChatroomGroups$$.value;
        if (data?.home && data.home.chatrooms?.length) {
            let index = data.home.chatrooms.findIndex((Chatroom) => Chatroom.chatroom.id === chatroomId);
            if (index === -1) count = 0;
            else {
                count = data.home.chatrooms[index].unseen_conversation_count;
                data.home.chatrooms[index].unseen_conversation_count = 0;
                this.homeFeedChatroomGroups$$.next({ ...data });
            }
            return count;
        }
    }

    refreshHomeFeed(): void {
        this.refreshSubscription = interval(10000)
            .pipe(tap((_) => this.getInitialCommunityHomeFeedChatrooms()))
            .subscribe((count) => {
                // Do something with count.
            });
    }

    clearRefreshSubscription(): void {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
            this.refreshSubscription = null;
        }
    }

    createInitialConversations(chatrooms: any[]) {
        for (let chatroom of chatrooms) {
            if (!this.conversationGroups$$.value[chatroom.chatroom.id]) {
                const data = {};
                data[chatroom.chatroom.id] = [];
                this.conversationGroups$$.next({ ...this.conversationGroups$$.value, ...data });
            }
        }
    }

    /**
     * @function getCommunityFeedChatrooms
     * @description Service to fetch community feed chatrooms
     */
    getCommunityFeedChatrooms(community_id: string | number, page: string | number, order_type: string | number): void {
        let queryParams = {
            community_id,
            order_type,
            page,
        };
        this.get(queryParams, GET_COMMUNITY_FEED_CHATROOMS).subscribe((response) => {
            let data = this.communityFeedChatroomGroups$$.value;
            data.community[community_id] = [...new Set([...data.community[community_id], ...response.chatrooms])];
            data.communityPinnedChatroomsCount[community_id] = response.pinned_chatrooms_count || 0;
            this.communityFeedChatroomGroups$$.next({ ...data });
        });
    }

    getInitialCommunityFeedChatrooms(community_id: string | number, order_type: string | number): void {
        let queryParams = {
            community_id,
            order_type,
            page: 1,
        };
        if (!this.user) return;
        this.get(queryParams, GET_COMMUNITY_FEED_CHATROOMS).subscribe((response) => {
            let data = this.communityFeedChatroomGroups$$.value;
            if (!data.community) data.community = {};
            if (!data.communityPinnedChatroomsCount) data.communityPinnedChatroomsCount = {};

            data.community[community_id] = response.chatrooms;
            data.communityPinnedChatroomsCount[community_id] = response.pinned_chatrooms_count || 0;
            this.communityFeedChatroomGroups$$.next({ ...data });
            if (response.chatrooms?.length) this.getCommunityFeedChatrooms(community_id, 2, order_type);
        });
    }

    /**
     * @function getCommunityFeedPinnedChatrooms
     * @description Service to fetch community feed Pinned chatrooms
     */
    getCommunityFeedPinnedChatrooms(community_id: string | number, page: string | number, order_type: string | number) {
        let queryParams = {
            community_id,
            pinned: true,
            order_type,
            page,
        };
        this.get(queryParams, GET_COMMUNITY_FEED_CHATROOMS).subscribe((response) => {
            let data = this.communityPinnedChatroomGroup$$.value;
            data[community_id] = [...new Set([...data[community_id], ...response.chatrooms])];
            this.communityPinnedChatroomGroup$$.next({ ...data });
        });
    }

    getInitialCommunityFeedPinnedChatrooms(community_id: string | number, order_type: string | number): void {
        let queryParams = {
            community_id,
            pinned: true,
            order_type,
            page: 1,
        };
        if (!this.user) return;
        this.get(queryParams, GET_COMMUNITY_FEED_CHATROOMS).subscribe((response) => {
            let data = this.communityPinnedChatroomGroup$$.value;
            data[community_id] = response.chatrooms;
            this.communityPinnedChatroomGroup$$.next({ ...data });
            if (response.chatrooms?.length)
                // this.getCommunityFeedPinnedChatrooms(community_id, response.chatrooms[response.chatrooms.length - 1].id);
                this.getCommunityFeedPinnedChatrooms(community_id, 2, order_type);
        });
    }

    /**
     * @function pinChatroom
     * @description Service to pin/unpin chatroom
     */
    pinChatroom(chatroom_id: string, value: boolean, notify: boolean = false) {
        const data = { chatroom_id, value, notify };
        return this.post(data, {}, CHATROOM_PIN);
    }

    /**
     * @function getHomeBottomMenu
     * @description Service to home drawer bottom menu
     */
    getHomeDrawerBottomMenu() {
        return this.get(null, HOME_DRAWER_BOTTOM_MENU);
    }

    /**
     * @function pushNotification
     * @description Service to pin/unpin chatroom
     */
    pushNotification(data: any) {
        return this.post({}, {}, PUSH + '?device_id=' + data.device_id + '&member_idmember_id=' + data.member_id + '&token=' + data.token);
    }

    /**
     * @function markChatroomSeen
     * @description Service to mark chatroom as seen
     */
    markChatroomSeen(chatroom: any, userId: number | string) {
        const queryParams = {
            collabcard_id: chatroom?.id,
            community_id: chatroom?.community_id,
            member_id: userId,
            collabcard_type: chatroom?.type,
        };
        this.post(null, queryParams, COLLABCARD_SEEN).subscribe((_) => {});
    }

    /**
     * @function getChatroomDetail
     * @description Service to fetch chatroom detail
     */
    getChatroomDetail(chatroom_id: string | number, urlParams: any) {
        const queryParams = { chatroom_id, ...urlParams, api_type: 1 };
        this.get(queryParams, FETCH_CHATROOM_API).subscribe((response) => {
            const data = this.chatroomDetailGroup$$.value;
            data[chatroom_id] = response;
            this.chatroomDetailGroup$$.next({ ...data });
        });
    }

    fetchChatroomDetail(chatroom_id: string | number, urlParams: any) {
        // const queryParams = { chatroom_id, ...urlParams };
        const queryParams = { chatroom_id, ...urlParams, api_type: 1 };
        return this.get(queryParams, FETCH_CHATROOM_API);
    }

    getOverflowMenu(urlParams: any) {
        // const queryParams = { chatroom_id, ...urlParams };
        return this.get(urlParams, FETCH_CHATROOM_API);
    }

    /**
     * @function getCommunityDetail
     * @description Service to fetch community detail
     */
    getCommunityDetail(community_id: number | string) {
        const queryParams = { community_id };
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        if (!this.user) return;
        this.get(queryParams, COMMUNITY_META).subscribe((response) => {
            const data = this.communityDetailGroup$$.value;
            data[community_id] = response;
            this.communityDetailGroup$$.next({ ...data });
        });
    }

    updateCommunityDetail(community: ICommunity) {
        let data = this.communityDetailGroup$$.value;
        data[community?.id] = { community: community, actions: [] };
        this.communityDetailGroup$$.next({ ...data });
    }

    /**
     * @function getMyCommunities
     * @description Service to fetch home feed communities
     */
    getMyCommunities(page: number): void {
        const queryParams = { page };
        this.get(queryParams, GET_HOME_FEED_COMMUNITIES).subscribe((myCommunities) => {
            console.log(myCommunities);
            if (myCommunities.your_communities && myCommunities.your_communities.length === 0) {
                if (page === 1) {
                    // this.router.navigate([`/${BLOCKER}`]);
                    return;
                }
                this.fetchCommunitySubscription().subscribe((response) => {
                    let subscribedCommunities = {};
                    let communityIds = [];

                    response?.subscriptions?.forEach((community) => {
                        subscribedCommunities[community?.community_id] = community;
                        subscribedCommunities[community?.community_id]['image_url'] = community?.image_url;
                        subscribedCommunities[community?.community_id]['show_upgrade_membership'] = community?.show_upgrade_membership;
                        subscribedCommunities[community?.community_id]['plan'] = community?.plan;
                        communityIds.push(community.community_id);
                    });
                    this.subscribedCommunitiesMetaGroup$$.next(subscribedCommunities);
                    if (communityIds.join()) {
                        this.subscriptionService
                            .fetchCommunityBenefits({ community_ids: communityIds.join() })
                            .subscribe((communityBenefits: any) => {
                                let allSubscriptionsBenefits = [];
                                communityBenefits?.community_benefits?.forEach((communityBenefit) => {
                                    communityBenefit['show_upgrade_membership'] =
                                        subscribedCommunities[communityBenefit?.community?.id]['show_upgrade_membership'];
                                    communityBenefit['membership_state'] =
                                        subscribedCommunities[communityBenefit?.community?.id]['membership_state'];
                                    communityBenefit['duration_name'] =
                                        subscribedCommunities[communityBenefit?.community?.id]?.plan?.duration_name;
                                    communityBenefit['cost'] = subscribedCommunities[communityBenefit?.community?.id]?.plan?.cost;
                                    communityBenefit['duration_in_months'] =
                                        subscribedCommunities[communityBenefit?.community?.id]?.plan?.duration_in_months;
                                    communityBenefit['valid_till'] = subscribedCommunities[communityBenefit?.community?.id]?.valid_till;
                                    communityBenefit['type'] = subscribedCommunities[communityBenefit?.community?.id]?.type;
                                    communityBenefit['plan'] = subscribedCommunities[communityBenefit?.community?.id]?.plan;
                                    allSubscriptionsBenefits.push(communityBenefit);
                                });
                                this.mySubscriptions$$.next(allSubscriptionsBenefits); //allSubscriptionsBenefits);
                            });
                    }
                });
                return;
            } else {
                let is_cm = false;
                myCommunities.your_communities.forEach((community) => {
                    if (community.member_state === 1 && community.is_paid) {
                        is_cm = true;
                    }
                });
            }
            let oldData = this.communityGroup$$.value;
            if (page === 1) oldData = [];
            let data = oldData.concat(myCommunities?.your_communities);
            this.communityGroup$$.next([...data]);
            this.getMyCommunities(page + 1);
        });
    }

    fetchCommunitySubscription(): Observable<any> {
        return this.get(null, SUBSCRIPTION_FETCH);
    }

    /**
     * @function fetchInitialUnreadPreviews
     * @description Service to fetch initial intro-room thread conversations
     */
    fetchIntitialUnreadPreviews(chatroom_id: string | number) {
        const queryParams = { chatroom_id, paginate_by: 20, page: 1 };
        this.get(queryParams, FETCH_UNREAD_PREVIEWS_API).subscribe((response) => {
            this.introRoomThreadConv$$.next(response?.conversations);
        });
    }

    /**
     * @function fetchUnreadPreviews
     * @description Service to fetch intro-room thread conversations
     */
    fetchUnreadPreviews(chatroom_id: string | number) {
        const page = this.introThreadPageCount$$.value;
        const queryParams = { chatroom_id, paginate_by: 20, page };
        this.get(queryParams, FETCH_UNREAD_PREVIEWS_API).subscribe((response) => {
            const data = [...this.introRoomThreadConv$$.value, ...response?.conversations];
            this.introRoomThreadConv$$.next(data);
            this.introThreadPageCount$$.next(page + 1);
        });
    }

    /**
     * @function fetchUnreadPreviewsCount
     * @description Service to fetch intro-room thread conversations count
     */
    fetchUnreadPreviewsCount(chatroom_id: string | number) {
        const queryParams = { chatroom_id };
        this.get(queryParams, FETCH_UNREAD_PREVIEWS_COUNT_API).subscribe((response) => {
            if (!isNaN(response?.count)) this.introRoomThreadConvCount$$.next(response?.count);
        });
    }

    /**
     *
     * @function getSearchConversations
     * @description
     */
    getSearchConversations(chatroom_id: string | number, conversation_id: string | number, urlParams: any) {
        zip(
            this.getSearchUpwardScrollConversations(chatroom_id, conversation_id, urlParams),
            this.getSearchDownwardScrollConversations(chatroom_id, conversation_id, urlParams)
        ).subscribe((res) => {
            const data = { ...this.conversationGroups$$.value };
            data[chatroom_id] = [...res[0], ...res[1]];
            this.conversationGroups$$.next({
                ...data,
                removeCache: data.removeCache ? [...data.removeCache, +chatroom_id] : [+chatroom_id],
            });
        });
    }

    /**
     *
     * @function getSearchUpwardScrollConversations
     * @description
     */
    getSearchUpwardScrollConversations(chatroom_id: string | number, conversation_id: string | number, urlParams: any) {
        const queryParams = { chatroom_id, paginate_by: 50, scroll_direction: 0, conversation_id, ...urlParams };

        return this.get(queryParams, FETCH_CONVERSATION_API).pipe(map((res) => res.conversations));
    }

    /**
     *
     * @function getSearchDownwardScrollConversations
     * @description
     */
    getSearchDownwardScrollConversations(chatroom_id: string | number, conversation_id: string | number, urlParams: any) {
        const conversationData = this.conversationGroups$$.value[chatroom_id] ? this.conversationGroups$$.value[chatroom_id] : [];
        if (conversationData.length > 0 && +urlParams.conversation_id === +conversationData[conversationData.length - 1].id) {
            return;
        }
        const queryParams = { chatroom_id, paginate_by: 50, scroll_direction: 1, conversation_id, include: true, ...urlParams };
        return this.get(queryParams, FETCH_CONVERSATION_API).pipe(map((res) => res.conversations));
    }

    /**
     * @function getConversations
     * @description Service to fetch chatroom conversations
     */
    getConversations(chatroom_id: string | number, urlParams: any, trigger?: boolean, callDownwardScrollConversations?: boolean): void {
        const queryParams = { chatroom_id, ...urlParams };
        if (queryParams['scroll_direction']) queryParams['paginate_by'] = 50;
        else queryParams['paginate_by'] = 100;

        if (!trigger) {
            const conversationData = this.conversationGroups$$.value[chatroom_id] ? this.conversationGroups$$.value[chatroom_id] : [];
            const feedChatroomsList = this.homeFeedChatroomGroups$$.value?.home?.chatrooms
                ? this.homeFeedChatroomGroups$$.value?.home.chatrooms
                : [];
            const homeFeedChatroomData = feedChatroomsList.find((chatroom) => chatroom.chatroom.id === +chatroom_id);

            // to stop the call if the chatroom is synced with the home feed chatroom card.
            if (
                !urlParams.scroll_direction &&
                conversationData.length > 0 &&
                homeFeedChatroomData?.last_conversation &&
                homeFeedChatroomData.last_conversation.id === conversationData[conversationData.length - 1].id
            ) {
                return;
            }

            if (!urlParams.scroll_direction && conversationData.length > 0) {
                this.conversationGroups$$.next({ ...this.conversationGroups$$.value, chatroom_id: [] });
            }

            // to stop the call if the chatroom is already having the message in case of downward scroll.
            if (
                urlParams.scroll_direction &&
                urlParams.scroll_direction === '1' &&
                conversationData.length > 0 &&
                +urlParams.conversation_id === +conversationData[conversationData.length - 1].id
            ) {
                if (!callDownwardScrollConversations) return;
            }
        }

        this.get(queryParams, FETCH_CONVERSATION_API).subscribe((response) => {
            if (urlParams.scroll_direction) {
                if (urlParams.scroll_direction === '0') {
                    // const data = { ...this.conversationGroups$$.value };
                    // console.log("all conversation upward: ", [...response.conversations])
                    // data[chatroom_id] = [...response.conversations, ...data[chatroom_id]];
                    // this.conversationGroups$$.next({ ...data });

                    const data = { ...this.conversationGroups$$.value };
                    let updatedMessages = this.updateMicroPollMessages([...response.conversations]);
                    data[chatroom_id] = [...updatedMessages, ...data[chatroom_id]]; //[...response.conversations];
                    this.conversationGroups$$.next({ ...data });
                } else if (urlParams.scroll_direction === '1') {
                    const data = { ...this.conversationGroups$$.value };
                    data[chatroom_id] = _.union([...data[chatroom_id], ...response.conversations]);
                    this.conversationGroups$$.next({ ...data });
                }
            } else {
                const data = { ...this.conversationGroups$$.value };
                let updatedMessages = this.updateMicroPollMessages([...response.conversations]);
                data[chatroom_id] = updatedMessages; //[...response.conversations];
                this.conversationGroups$$.next({ ...data });
            }
        });
    }

    fetchConvoAfterMicropollSubmission(chatroom_id: string | number, urlParams: any): void {
        const queryParams = { chatroom_id, ...urlParams };
        this.get(queryParams, FETCH_CONVERSATION_API).subscribe((response) => {
            if (urlParams.scroll_direction) {
                if (urlParams.scroll_direction === '0') {
                    const data = { ...this.conversationGroups$$.value };
                    let updatedMessages = this.updateMicroPollMessages([...response.conversations]);
                    data[chatroom_id] = [...updatedMessages, ...data[chatroom_id]]; //[...response.conversations];
                    this.conversationGroups$$.next({ ...data });
                } else if (urlParams.scroll_direction === '1') {
                    const data = { ...this.conversationGroups$$.value };
                    data[chatroom_id] = _.union([...data[chatroom_id], ...response.conversations]);
                    this.conversationGroups$$.next({ ...data });
                }
            } else {
                const data = { ...this.conversationGroups$$.value };
                let updatedMessages = this.updateMicroPollMessages([...response.conversations]);
                data[chatroom_id] = updatedMessages; //[...response.conversations];
                this.conversationGroups$$.next({ ...data });
            }
        });
    }

    updateMicroPollMessages(conversationArray) {
        conversationArray.forEach((conversation) => {
            if (conversation?.polls) {
                if (conversation['poll_is_answered'] == undefined) {
                    let polls = conversation?.polls;
                    for (let poll of polls) {
                        if (poll?.is_selected) {
                            conversation['poll_is_answered'] = true;
                            return;
                        }
                    }
                    conversation['poll_is_answered'] == false;
                }
            }
        });
        return conversationArray;
    }

    fetchMicropollUsers(conversation_id: number | string, poll_id: number | string): Observable<any> {
        return this.get({ conversation_id, poll_id }, FETCH_MICROPOLL_USERS);
    }

    fetchPollUsers(chatroom_id: number | string, poll_id: number | string): Observable<any> {
        return this.get({ chatroom_id, poll_id }, FETCH_POLL_USERS);
    }

    updateConversation(messages: any): void {
        const data = { ...this.conversationGroups$$.value };
        messages.forEach((message: any) => {
            if (data[message.chatroom_id] && !data[message.chatroom_id].some((conversation) => +conversation.id === +message.id)) {
                data[message.chatroom_id] = [...data[message.chatroom_id], message];
                this.conversationGroups$$.next({ ...data });
            }
        });
    }

    /**
     * @function createConversation
     * @description Service to create conversation with files
     */
    createConversation(data: ConversationModel, messageId: number, followStatus): Observable<any> {
        return this.post(data, null, CREATE_CONVERSATION_API).pipe(
            tap((resp) => {
                if (messageId) {
                    const conversationData = this.conversationGroups$$.value;
                    if (conversationData[data.chatroom_id]) {
                        const index = conversationData[data.chatroom_id].findIndex((message) => message.id === messageId);
                        if (index) {
                            const newMessage = conversationData[data.chatroom_id][index];
                            newMessage.id = resp.id;
                            conversationData[data.chatroom_id].splice(index, 1, newMessage);
                            this.conversationGroups$$.next({ ...conversationData });
                        }
                    }
                }
                if (!followStatus) {
                    this.getChatroomDetail(data.chatroom_id, {});
                }
            })
        );
    }

    /**
     * @function createMicroPollConversation
     * @description Service to create conversation with files
     */
    createMicroPollConversation(data: any, messageId: number): Observable<any> {
        return this.chatroomService.createPollConversation(data).pipe(
            tap((resp) => {
                if (messageId) {
                    const conversationData = this.conversationGroups$$.value;
                    if (conversationData[data.chatroom_id]) {
                        const index = conversationData[data.chatroom_id].findIndex((message) => message.id === messageId);
                        if (index) {
                            //const newMessage = conversationData[data.chatroom_id][index];

                            const newMessage = conversationData[data.chatroom_id][index];
                            newMessage.id = resp.id;
                            newMessage['polls'] = resp?.conversation?.polls;
                            newMessage['poll_answer_text'] = resp?.conversation?.poll_answer_text;
                            conversationData[data.chatroom_id].splice(index, 1, newMessage);
                            this.conversationGroups$$.next({ ...conversationData });
                        }
                    }
                }
            })
        );
    }

    /**
     * @function createConversationWithFiles
     * @description Service to create conversation with files
     */
    createConversationWithFiles(
        data: ConversationModel,
        files,
        type: string,
        messageId,
        followStatus,
        thumbnail_object,
        audioDurations?,
        pages?
    ): Observable<any> {
        let apiResponse: any;
        let message: any;
        let mediaFile = [];

        return this.post(data, null, CREATE_CONVERSATION_API).pipe(
            tap((resp) => {
                apiResponse = resp;
                let currentlyLoadingMediaIds = this.currentlyLoadingMediaIds$$.value;
                currentlyLoadingMediaIds[resp.id] = true;
                this.currentlyLoadingMediaIds$$.next(currentlyLoadingMediaIds);
                if (messageId) {
                    const conversationData = this.conversationGroups$$.value;
                    if (conversationData[data.chatroom_id]) {
                        const index = conversationData[data.chatroom_id].findIndex((message) => message.id === messageId);

                        // STORE THE TEMP AND ORIGINAL IDS IN BEHAVIOURIAL SUBJECT
                        let mapTempToOriginalMessageID = this.mapTempToOriginalMessageIDs$$.value;
                        mapTempToOriginalMessageID[messageId] = resp.id;

                        if (index) {
                            const newMessage = conversationData[data.chatroom_id][index];
                            message = newMessage;
                            newMessage.id = resp.id;

                            // UPDATE THE MESSAGE ID STORED IN INDEXED DB
                            let lacalbaseMessageIdObject: any;
                            lacalbaseMessageIdObject = this.localStorageService.getSavedState(STORAGE_KEY.LOCABASE_INDEX);
                            if (!lacalbaseMessageIdObject) {
                                lacalbaseMessageIdObject = {};
                            }

                            lacalbaseMessageIdObject[`${resp.id}`] = messageId;

                            this.localStorageService.setSavedState(lacalbaseMessageIdObject, STORAGE_KEY.LOCABASE_INDEX);

                            // GET THE TOTAL FILE SIZE OF THE FILES BEING UPLOADED

                            conversationData[data.chatroom_id].splice(index, 1, newMessage);
                            this.conversationGroups$$.next({ ...conversationData });
                        }
                    }
                }
                if (!followStatus) {
                    this.getChatroomDetail(data.chatroom_id, {});
                }
            }),
            switchMap((resp) => {
                this.getTotalFileSize(resp.id, messageId, data.chatroom_id, files);
                return forkJoin(
                    files.map((file, idx) => {
                        mediaFile.push(file);
                        let imgObject = this.awsS3Bucket.uploadMedia(resp.id, data.chatroom_id, file, idx);
                        return from(imgObject);
                    })
                ).pipe(
                    switchMap((uploadedFiles) => {
                        return forkJoin(
                            uploadedFiles.map((file: any, index: number) => {
                                return this.uploadAllFiles(
                                    resp,
                                    file,
                                    index,
                                    type,
                                    uploadedFiles,
                                    files,
                                    audioDurations,
                                    thumbnail_object,
                                    pages
                                );
                            })
                        );
                    })
                );
            })
        );
    }

    uploadAllFiles(resp, file, index, type, uploadedFiles, files, audioDurations?, thumbnail_object?, pages?) {
        return this.uploadFiles({
            conversation_id: resp?.id,
            url: file?.Location,
            type,
            files_count: uploadedFiles?.length,
            index: `${index}`,
            width: thumbnail_object?.width,
            height: thumbnail_object?.height,
            thumbnail_url: thumbnail_object?.thumbnail_url ? thumbnail_object?.thumbnail_url : '',
            meta: {
                duration: audioDurations ? audioDurations[index] : null,
                size: files[index].size,
                number_of_page: pages ? pages[index] : null,
            },
            name: files[index].name,
        });
    }

    getTotalFileSize(messageId, tempMessageId, chatroomId, files) {
        let totalFileSize: number = 0;
        files.forEach((file) => {
            totalFileSize += file.size;
        });
        let finalSize = this.utilsService.bytesToSize(totalFileSize);
        let totalSizeObj = this.totalFileSize$$.value;
        totalSizeObj[`${chatroomId}`] = {};
        totalSizeObj[`${chatroomId}`][`${messageId}`] = finalSize;
        totalSizeObj[`${chatroomId}`][`${tempMessageId}`] = finalSize;
        this.totalFileSize$$.next(totalSizeObj);
    }

    ///////////////////////////////////////

    uploadMedia(messageId, chatroomId, file) {
        let imgObject = this.awsS3Bucket.getAWS().upload({
            Key: `files/collabcard/${chatroomId}/conversation/${messageId}/${file.name}`,
            Bucket: environment.awsBucket,
            Body: file,
            ACL: 'public-read-write',
            ContentType: file.type,
        });

        imgObject.send();

        setTimeout(() => {
            imgObject.abort();
            imgObject.send();
        }, 2500);

        imgObject.on('httpUploadProgress', function (progress) {
            console.log('THIS IS THE PROGRESS : ', progress.loaded, progress.total);
        });
        return imgObject.promise();
    }

    uploadAllMedias(messageId, chatroomId, files) {
        return Promise.all(
            Array.from(files).map(async (file) => {
                return await this.uploadMedia(messageId, chatroomId, file);
            })
        );
    }

    ////////////

    fetchDuration(path) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.src = path;
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration);
            });
        });
    }

    fetchAllAudioFilesDuration(files: any[]) {
        return Promise.all(
            Array.from(files).map(async (file) => {
                let url = URL.createObjectURL(file);
                return { duration: await this.fetchDuration(url), file: file };
            })
        );
    }

    ///////////////////////////////////////

    deleteConversation(ids, chatroomId, userId) {
        this.dialog
            .open(DeleteConfirmationComponent)
            .afterClosed()
            .pipe(filter((resp) => !!resp))
            .subscribe((_) => {
                const body = {
                    conversation_ids: [...ids],
                };
                this.post(body, null, DELETE_CONVERSATION_API).subscribe(
                    (resp) => {
                        if (resp.success) {
                            // const conversationGroup = this.conversationGroups$$.value;
                            // let conversations = conversationGroup[chatroomId];
                            // const respIds = new Set(resp.conversations.map((conversation) => conversation.id));
                            // conversations = conversations.map((oldConversation) => {
                            //     if (respIds.has(oldConversation.id)) {
                            //         oldConversation.deleted_by = userId;
                            //     }
                            //     return oldConversation;
                            // });
                            // conversationGroup[chatroomId] = [...conversations];
                            // this.conversationGroups$$.next(conversationGroup);

                            const conversationGroup = this.conversationGroups$$.value;
                            let conversations = [...conversationGroup[chatroomId]];
                            conversations = conversations.map((conversation) => {
                                if (conversation.id === ids) {
                                    return { ...resp.conversation, member: { ...conversation.member } };
                                }
                                return conversation;
                            });
                            conversationGroup[chatroomId] = [...conversations];
                            this.conversationGroups$$.next(conversationGroup);

                            // Delete the Cache of that message, if it is exists in LocalBase(IndexedDb)
                            this.indexedDbService.db
                                .collection('mediaFiles')
                                .doc(`${ids[0]}`)
                                .get()
                                .then((document) => {
                                    if (document) {
                                        this.indexedDbService.db.collection('mediaFiles').doc(`${ids[0]}`).delete();
                                    }
                                });

                            // this.refreshHomeFeed();
                            location.reload();
                        } else {
                            this.snackbar.open(resp.error_message || 'Something Went Wrong', null, {
                                duration: 5000,
                                panelClass: ['snackbar'],
                            });
                        }
                    },
                    (err) => {
                        this.snackbar.open('Something Went Wrong', null, {
                            duration: 5000,
                            panelClass: ['snackbar'],
                        });
                    }
                );
            });
        this.clearSelectedMsg();
    }

    editMessage({ chatroomId, conversationId, text, share_link }): void {
        this.post(
            `conversation_id=${conversationId}&text=${text}${share_link ? `&share_link=${share_link}` : ''}`,
            null,
            EDIT_CONVERSATION_API
        ).subscribe(
            (resp) => {
                if (resp.success) {
                    const conversationGroup = this.conversationGroups$$.value;
                    let conversations = [...conversationGroup[chatroomId]];
                    conversations = conversations.map((conversation) => {
                        if (conversation.id === conversationId) {
                            return { ...resp.conversation, member: { ...conversation.member } };
                        }
                        return conversation;
                    });
                    conversationGroup[chatroomId] = [...conversations];
                    this.conversationGroups$$.next(conversationGroup);
                } else {
                    this.snackbar.open(resp.error_message || 'Something Went Wrong', null, {
                        duration: 5000,
                        panelClass: ['snackbar'],
                    });
                }
            },
            (err) => {
                this.snackbar.open('Something Went Wrong', null, {
                    duration: 5000,
                    panelClass: ['snackbar'],
                });
            }
        );
        this.clearEditMessage();
        this.clearSelectedMsg();
    }

    /**
     * @function uploadFiles
     * @description Service to upload chatroom files ....
     *
     */

    //  data: ConversationModel,
    uploadFiles(params: any): Observable<any> {
        return this.post(params, null, CHATROOM_UPLOAD_FILES);
    }

    updateReplyMessage(reply): void {
        this.clearEditMessage();
        this.clearSelectedMsg();
        this.replyMessage$$.next(reply);
    }

    clearReplyMessage(): void {
        this.replyMessage$$.next(null);
    }

    updateEditMessage(msg): void {
        this.clearReplyMessage();
        this.clearSelectedMsg();
        this.editMessage$$.next(msg);
    }

    clearEditMessage(): void {
        this.editMessage$$.next(null);
    }

    reportMessage(messageId): void {
        this.clearSelectedMsg();
        this.dialog
            .open(ReportPopupComponent, {
                data: {
                    title: 'Report Message',
                    desc: 'You would be able to report this message after selecting a problem.',
                    label: 'Please describe in brief why you are reporting this message',
                },
            })
            .afterClosed()
            .pipe(filter((resp) => !!resp))
            .subscribe((data) => {
                data = { ...data, conversation_id: messageId };
                this.pushReport(data).subscribe(
                    (response) => {
                        if (response.success) {
                            this.dialog.open(ReportedPopupComponent, {
                                data: {
                                    title: 'Message is reported for review',
                                    desc: 'Our team will look into your feedback and will take appropriate action on this message.',
                                },
                            });
                        } else {
                            this.snackbar.open(response.error_message, undefined, {
                                panelClass: ['snackbar'],
                                duration: 3000,
                            });
                        }
                    },
                    (err) => {
                        this.snackbar.open('Something Went Wrong', undefined, {
                            panelClass: ['snackbar'],
                            duration: 3000,
                        });
                    }
                );
            });
    }

    pushReport(data): Observable<any> {
        return this.post(data, null, PUSH_REPORT);
    }

    selectMsg(msg): void {
        const selectedMsgs = { ...this.selectedMsg$$.value };
        if (selectedMsgs[msg.id]) {
            delete selectedMsgs[msg.id];
        } else {
            selectedMsgs[msg.id] = msg;
        }
        this.selectedMsg$$.next(selectedMsgs);
    }

    isSelected(): boolean {
        return;
        // return this.selectedMsg$$.value !== {};
    }

    async copyMessages(): Promise<void> {
        let text = '';
        const msgs: IMessage[] = Object.values(this.selectedMsg$$.value);
        if (msgs.length === 1 && !msgs[0].deleted_by) {
            text += MemberTagPipe.prototype.transform(msgs[0].answer, 'copy') || '';
        } else {
            msgs.forEach((msg: IMessage) => {
                if (msg.answer && !msg.deleted_by) {
                    text += `[${msg.date || ''}, ${msg.created_at || ''}] ${msg.member?.name || ''}: ${
                        MemberTagPipe.prototype.transform(msg.answer, 'copy') || ''
                    } \n`;
                }
            });
        }
        if (text) {
            copyTextToClipboard(text).subscribe((success) => {
                const snackMsg = success ? 'Message copied' : 'Something Went Wrong';
                this.snackbar.open(snackMsg, null, {
                    duration: 2000,
                    panelClass: ['snackbar'],
                });
            });
        }
        this.clearSelectedMsg();
    }

    clearSelectedMsg(): void {
        this.selectedMsg$$.next({});
    }

    followChatroom(followStatus: boolean, chatroomId): void {
        const user = JSON.parse(localStorage.getItem(STORAGE_KEY.LIKEMINDS_USER));
        if (!user) {
            return;
        }
        this.store.dispatch(StartLoading());
        this.chatroomService
            .followChatroom(chatroomId, user.id, followStatus)
            .pipe(filter((res) => !!res && res.success))
            .subscribe(
                (response) => {
                    // this.analyticsService.sendEvent(
                    //   MIXPANEL.CHATROOM_FOLLOWED, {
                    //     chatroom_id: this.chatroomId,
                    //     community_id: this.community.id,
                    //     source: CHATROOM_FOLLOW_SOURCE.CHATROOM_TELESCOPE
                    //   }
                    // );
                    this.store.dispatch(StopLoading());
                    const chatroomDetail = this.chatroomDetailGroup$$.value;
                    if (chatroomDetail[chatroomId]) {
                        chatroomDetail[chatroomId].chatroom = { ...chatroomDetail[chatroomId].chatroom, follow_status: followStatus };
                    }
                    this.chatroomDetailGroup$$.next(chatroomDetail);
                    this.snackbar.open(`You ${followStatus ? 'followed' : 'unfollowed'} this chatroom`, undefined, {
                        panelClass: ['snackbar'],
                        duration: 5000,
                    });
                },
                (error) => {
                    this.store.dispatch(StopLoading());
                }
            );
    }

    getHomeFeedUpdate(chatroomId): void {
        this.get({ chatroom_id: chatroomId }, HOME_FEED_META).subscribe((data) => {
            setTimeout(() => {
                const homeFeedGroup = this.homeFeedChatroomGroups$$.value;
                if (Object.keys(homeFeedGroup).length != 0) {
                    const chatroomIndex = homeFeedGroup.home.chatrooms.findIndex((chatroomData) => {
                        return chatroomData?.chatroom?.id === +chatroomId;
                    });
                    if (chatroomIndex > -1) {
                        homeFeedGroup.home.chatrooms.splice(chatroomIndex, 1);
                        homeFeedGroup.home.chatrooms = [data, ...homeFeedGroup.home.chatrooms];
                        this.homeFeedChatroomGroups$$.next(homeFeedGroup);
                    }
                }
            });
        });
    }
}

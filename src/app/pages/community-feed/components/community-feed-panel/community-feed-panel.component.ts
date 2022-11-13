import { Component, OnInit, HostListener, Output, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, zip } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

import { SetHeaderAction, StartLoading, StopLoading } from '../../../../shared/store/actions/app.action';
import { LocalStorageService } from '../../../../core/services/localstorage.service';
import { CommunityService } from '../../../../core/services/community.service';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { MEMBER_STATE } from '../../../../shared/enums/member-state.enum';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { ICommunity } from '../../../../shared/models/community.model';
import { IMemberState } from '../../../../shared/models/member.model';
import { IChatroom } from '../../../../shared/models/chatroom.model';
import { Payload } from '../../../../shared/models/app.model';
import { IUser } from '../../../../shared/models/user.model';
import { State } from '../../../../shared/store/reducers';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { MIXPANEL, RENEWAL_FLOW } from 'src/app/shared/enums/mixpanel.enum';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { BuyCommunityMembershipSheetComponent } from 'src/app/shared/entryComponents/buy-community-membership-sheet/buy-community-membership-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UtilsService } from 'src/app/core/services/utils.service';
import { COLLABCARD_PATH } from 'src/app/shared/constants/routes.constant';
import { CookieService } from 'ngx-cookie-service';
import { COMMMUNITY_OPENED } from 'src/app/shared/constants/app-constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from 'src/app/shared/entryComponents/custom-snackbar/custom-snackbar.component';

@Component({
    selector: 'app-community-feed-panel',
    templateUrl: './community-feed-panel.component.html',
    styleUrls: ['./community-feed-panel.component.scss'],
})
export class CommunityFeedPanelComponent implements OnInit, OnDestroy {
    createSectionState: boolean = false;
    user: IUser;
    community: ICommunity;
    memberState: IMemberState;
    admins: IUser[];
    communityId: number;
    chatrooms: IChatroom[] = [];
    pinnedChatrooms: any[] = [];
    showPinnedChatrooms: boolean = false;
    pinnedChatroomsView: boolean = false;
    pinnedChatroomIcon: boolean = false;
    imageList: any[] = [];
    page: number = 1;
    stopFetch: boolean = false;
    showChatroomList: boolean;
    showUpdateProfile: boolean;
    showChatroomDetail: boolean;
    isPinnedList: boolean = false;
    showPinnedBanner: boolean;
    pinnedTrueInLocalStorage: boolean;
    pinnedBanner: any;
    private destroy$$ = new Subject();
    mySubscribedCommunitiesMeta = {};
    subscribedCommunity: any;
    showCommunityFeedHeader = true;
    screenType: string;
    @Output() notAMember = new EventEmitter();
    mySubscriptions: any = null;
    showMySubscription: boolean = false;
    membership_state: any;
    showNewChatroomCommunityDetail: boolean;
    data;
    access;
    membershipIsExpired = false;
    mySubscription: any = null;
    warningBanner: any = null;
    communityApiPage: number = 3;
    pinnedApiPage: number = 3;
    filterOptions: any[] = ['Newest', 'Recently active', 'Most messages', 'Most participants'];
    selectedFilterOption: string = 'Newest';
    // @Output() communityId = new EventEmitter();

    @ViewChild('communityFeedScrollContainer') private communityFeedScrollContainer: ElementRef;
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.createSectionState = false;
    }

    constructor(
        private HomeFeedService: HomeFeedService,
        private router: Router,
        private localStorageService: LocalStorageService,
        private communityService: CommunityService,
        private activatedRoute: ActivatedRoute,
        private store: Store<State>,
        private homeFeedService: HomeFeedService,
        private chatroomService: ChatroomService,
        private cookieService: CookieService,
        private subscriptionService: SubscriptionService,
        private analyticsService: AnalyticsService,
        private bottomSheet: MatBottomSheet,
        private utilsService: UtilsService,
        private snackbar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        this.access = this.localStorageService.getSavedState(STORAGE_KEY.ACCESS)?.access;

        this.chatroomService?.showNewChatroomCommunityDetail$$.subscribe((res) => {
            if (window.location.href.split('/').length > 5) {
                if (this.screenType == 'mobile' && res && !this.showNewChatroomCommunityDetail) {
                    this.communityService.sendAccessDataToBottomSheet$$.subscribe((data) => {
                        if (!this.data && data && this.access && this.screenType == 'mobile') {
                            this.openChatroomDetailBottomSheet(data);
                            this.data = data;
                        }
                    });
                }
                this.showNewChatroomCommunityDetail = res;
                this.chatroomService.membershipIsExpired$$.subscribe((res) => {
                    this.membershipIsExpired = res;
                });
            }
        });

        this.subscriptionService.showMySubscriptions$$?.subscribe((res) => (this.showMySubscription = res));

        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((route) => {
                if (!this.communityId || (this.communityId && this.communityId != route.params.communityId)) {
                    this.store.dispatch(StartLoading());
                    this.store.dispatch(SetHeaderAction(new Payload(null))); // to remove previous header
                    this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
                    this.communityId = parseInt(route.params.communityId || this.cookieService.get(COMMMUNITY_OPENED));
                    if (!this.user && this.router.url === `/community/${this.communityId}`) this.router.navigateByUrl('/auth');
                    this.chatrooms = [];
                    if (this.user) this.subscribedCommunitiesMeta(this.communityId, this.user?.id); // this.getUserStatus(this.communityId, this.user?.id);
                    this.getUserStatus(this.communityId, this.user?.id);
                    this.fetchCommunityDetails(this.communityId);
                    if (route.queryParams) this.onGetCommunityDetails(this.communityId, route.queryParams.aj, route.queryParams.shared_by);
                    this.getCurrentCommunityData();
                    this.showMySubscriptions();
                    this.getPinnedChatrooms(this.communityId);
                    this.getChatrooms(this.communityId);
                    this.HomeFeedService.getInitialCommunityFeedChatrooms(this.communityId, 0);
                }
            });

        if (!window.location.pathname.includes(COLLABCARD_PATH))
            this.communityService.showCommunityHeader$$.next({ status: true, headerValue: 'CommunityFeedView' });
    }

    getCurrentCommunityData() {
        this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            const currentCommunity = response.findIndex((community) => community?.id === this.communityId);
            if (currentCommunity >= 0) {
                const currentCommunityData = response[currentCommunity];
                this.communityService?.currentCommunityData$$?.next(currentCommunityData);
            }
        });
    }

    onGetCommunityDetails(cId: any, aj: any, uId: any) {
        const data = {
            communityId: cId,
            aj: aj,
            member_id: uId,
        };
        this.communityService.getCommunityDetails(data).subscribe((data) => (this.community = data.community));
    }

    openChatroomDetailBottomSheet(data) {
        let backdropClass = data?.accessibleWithoutSubscription ? '' : 'blurr-backdrop';

        let sheet = this.bottomSheet.open(BuyCommunityMembershipSheetComponent, {
            // panelClass: 'send-response-modal',
            data: data,
            disableClose: !data?.accessibleWithoutSubscription,
            backdropClass: backdropClass,
        });
        this.utilsService.closeMatBottomSheet$$.subscribe((res) => {
            if (res) {
                sheet.dismiss();
                this.utilsService.closeMatBottomSheet$$.next(0);
            }
        });

        sheet.afterOpened().subscribe((res) => {});
    }

    getUserStatus(community_id: number | string, member_id: number | string) {
        this.communityService.getMemberState({ community_id, member_id }).subscribe((response) => {
            this.memberState = response;
            this.communityService.memberStateObj$$.next(this.memberState);

            this.membership_state = this.mySubscribedCommunitiesMeta[community_id]?.membership_state;

            if ([MEMBER_STATE.MEMBER, MEMBER_STATE.ADMIN].includes(this.memberState?.state)) {
                if (this.mySubscribedCommunitiesMeta[community_id]?.membership_state === 1) {
                    this.subscribedCommunity = this.mySubscribedCommunitiesMeta[community_id];
                    // this.showChatroomList = false;
                    // this.showUpdateProfile = false;
                    // this.showChatroomDetail = true;

                    this.showChatroomList = true;
                    this.showUpdateProfile = false;
                    this.showChatroomDetail = false;

                    this.communityService.showPendingStateMessage$$.next(false);
                    this.showCommunityFeedHeader = true;
                    //this.notAMember.emit({ show: 'true', communityName: this.community.name });
                    return;
                } else {
                    this.showChatroomList = true;
                    this.showUpdateProfile = false;
                    this.showChatroomDetail = false;
                    this.communityService.showPendingStateMessage$$.next(false);
                    this.showCommunityFeedHeader = true;
                    this.notAMember.emit({ show: 'false' });
                }
            }

            if (this.memberState?.state === MEMBER_STATE.NOT_A_MEMBER) {
                if (this.mySubscribedCommunitiesMeta[community_id]?.membership_state === 1) {
                    this.subscribedCommunity = this.mySubscribedCommunitiesMeta[community_id];
                    this.showChatroomList = false;
                    this.showUpdateProfile = false;
                    this.showChatroomDetail = true;
                    this.communityService.showPendingStateMessage$$.next(false);
                    this.showCommunityFeedHeader = false;
                    this.notAMember.emit({ show: 'true', communityName: this.community.name });
                    return;
                } else {
                    this.showChatroomList = false;
                    this.showUpdateProfile = false;
                    this.showChatroomDetail = false;
                }
            }

            if (this.memberState?.state === MEMBER_STATE.SKIPPED) {
                this.showChatroomList = true;
                this.showUpdateProfile = true;
                this.showChatroomDetail = false;
                this.communityService.showPendingStateMessage$$.next(false);
                this.showCommunityFeedHeader = true;
                this.notAMember.emit({ show: 'false' });
            }

            if (this.memberState?.state === MEMBER_STATE.PENDING_MEMBER) {
                this.showChatroomList = false;
                this.showUpdateProfile = false;
                this.showChatroomDetail = true;
                this.communityService.showPendingStateMessage$$.next(true);
                this.showCommunityFeedHeader = true;
                this.notAMember.emit({ show: 'false' });
            }

            this.chatroomService.showNewChatroomCommunityDetail$$.subscribe((res) => {
                if (res) {
                    this.showChatroomList = res;
                }
            });
        });
    }

    fetchCommunityDetails(communityId: number) {
        this.HomeFeedService.communityDetailGroup$.pipe(takeUntil(this.destroy$$)).subscribe((communityList) => {
            if (communityList[communityId]) {
                this.community = communityList[communityId]?.community;
                this.pinnedBanner = communityList[communityId]?.pinned_top_bar;
                this.checkPinnedInStorage(communityId.toString(), this.pinnedBanner?.sub_title);
            } else {
                if (this.user) this.HomeFeedService.getCommunityDetail(communityId);
            }
        });
    }

    hideOverlay($event) {
        if ($event === 'true') {
            this.notAMember.emit({ show: 'false' });
        }
    }

    checkPinnedInStorage(communityId: string, value: string) {
        if (!communityId || !value) return;
        let data = this.localStorageService.getSavedState(`comm${communityId}`);
        if (data) {
            if (data.value !== value) {
                data.value = value;
                data.show = true;
                this.showPinnedBanner = true;
                this.localStorageService.setSavedState(data, window.btoa(`comm${communityId}`));
            } else {
                this.showPinnedBanner = data.show;
            }
        } else {
            data = { value: value, show: true };
            this.localStorageService.setSavedState(data, `comm${communityId}`);
            this.showPinnedBanner = true;
        }
    }

    getPinnedChatrooms(communityId: any) {
        this.HomeFeedService.communityPinnedChatroomGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            if (response[communityId]) {
                this.pinnedChatrooms = response[communityId] || [];
            }
            this.store.dispatch(StopLoading());
        });
    }

    getSelectedFilterIndex(selectedOption: string): number {
        return this.filterOptions.findIndex((option) => option === selectedOption);
    }

    togglePinnedChatrooms(param: boolean) {
        const filterIdx = this.getSelectedFilterIndex(this.selectedFilterOption);
        if (param) {
            this.pinnedChatroomsView = true;
            this.showChatroomList = false;
            this.communityApiPage = 3;
            this.pinnedApiPage = 3;
            this.homeFeedService.getInitialCommunityFeedPinnedChatrooms(this.communityId, filterIdx);
            this.scrollToTop();
        } else {
            this.pinnedChatroomsView = false;
            this.showChatroomList = true;
            this.communityApiPage = 3;
            this.pinnedApiPage = 3;
            this.homeFeedService.getInitialCommunityFeedChatrooms(this.communityId, filterIdx);
            this.scrollToTop();
        }
    }

    getChatrooms(communityId: any) {
        this.HomeFeedService.communityFeedChatroomGroups$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            if (response['community'] && response['community'][communityId]) {
                this.chatrooms = response['community'][communityId] || [];

                if (response['communityPinnedChatroomsCount'][communityId] > 3) {
                    this.pinnedChatroomIcon = true;
                } else {
                    this.pinnedChatroomIcon = false;
                }
            }
            this.store.dispatch(StopLoading());
        });
    }

    createSectionComponent(event) {
        if (event === 'created') {
            this.page = 1;
            this.stopFetch = false;
            this.HomeFeedService.getInitialCommunityFeedChatrooms(this.communityId, 0);
        }
        this.createSectionState = !this.createSectionState;
    }

    filterChatrooms(event) {
        if (event.target?.innerText) {
            const filterIdx = this.getSelectedFilterIndex(event.target?.innerText);
            if (filterIdx >= 0) {
                if (this.pinnedChatroomsView) this.homeFeedService.getInitialCommunityFeedPinnedChatrooms(this.communityId, filterIdx);
                else this.HomeFeedService.getInitialCommunityFeedChatrooms(this.communityId, filterIdx);

                this.selectedFilterOption = event.target?.innerText;
                this.communityApiPage = 3;
                this.pinnedApiPage = 3;
                this.scrollToTop();
            }
        }
    }

    onScroll() {
        if (this.chatrooms.length) {
            const filterIdx = this.getSelectedFilterIndex(this.selectedFilterOption);
            if (this.pinnedChatroomsView)
                this.HomeFeedService.getCommunityFeedPinnedChatrooms(this.communityId, this.pinnedApiPage++, filterIdx);
            else this.HomeFeedService.getCommunityFeedChatrooms(this.communityId, this.communityApiPage++, filterIdx);
        }
    }

    scrollToTop(): void {
        setTimeout(() => {
            try {
                this.communityFeedScrollContainer.nativeElement.scrollTop = 0;
            } catch (err) {}
        }, 500);
    }

    removePinBanner(communityId: string) {
        let data = this.localStorageService.getSavedState(`comm${communityId}`);
        if (data) {
            data.show = false;
            this.localStorageService.setSavedState(data, `comm${communityId}`);
        }
        this.showPinnedBanner = false;
    }

    openRenewal() {
        this.analyticsService.sendEvent(RENEWAL_FLOW.RENEWAL_BUTTON_CLICKED, {
            community_id: this.communityId,
            community_name: this.community.name,
            source: 'community_feed',
            membership_state: this.membership_state,
        });

        if (this.screenType === 'mobile') {
            this.router.navigate(['/renewal/' + this.communityId], { queryParams: { renew: true, user_id: this.user.id } });
        } else {
            this.router.navigate(['/community_feed/' + this.communityId + '/renewal/' + this.communityId], {
                queryParams: { renew: 'true', user_id: this.user.id },
            });
        }
    }

    markRead(chatroom) {
        this.homeFeedService.clearReplyMessage();
        this.homeFeedService.clearEditMessage();
        this.chatroomService.feedChatroomCardTapped$$.next(true);
        let isAnyChatroomOpened = this.localStorageService.getSavedState(STORAGE_KEY.CHATROOM_OPENED);
        if (this.localStorageService.getSavedState(STORAGE_KEY.CURRENTLY_OPENED_CHATROOM_ID) && isAnyChatroomOpened) {
            let chatroomId = this.localStorageService.getSavedState(STORAGE_KEY.CURRENTLY_OPENED_CHATROOM_ID);
            this.chatroomService.markRead(`chatroom_id=${chatroomId}`).subscribe((_) => {});
        }

        this.analyticsService.sendEvent(MIXPANEL.CHATROOM_CLICKED, {
            community_id: this.communityId,
            community_name: this.community.name,
            chatroom_id: chatroom?.id,
            access_type: !chatroom?.access_without_subscription && this.membership_state === 1 ? 'restricted' : 'full',
        });

        this.localStorageService.setSavedState(true, STORAGE_KEY.CHATROOM_OPENED);
        this.chatroomService.markRead(`chatroom_id=${chatroom.id}`).subscribe((_) => {});
    }

    showMySubscriptions() {
        this.homeFeedService.mySubscriptions$.subscribe((subscriptions) => {
            this.mySubscription = subscriptions?.filter((subscription) => subscription?.community?.id === this.communityId)[0];
        });
    }

    getCommunities() {
        return this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$));
    }

    subscribedCommunitiesMeta(community_id, member_id) {
        this.homeFeedService.subscribedCommunitiesMetaGroup$.pipe(takeUntil(this.destroy$$)).subscribe((subscribedCommunities) => {
            this.mySubscribedCommunitiesMeta = subscribedCommunities;
            this.getUserStatus(community_id, member_id);
            this.getCommunities().subscribe((communities) => {
                this.mySubscribedCommunitiesMeta = subscribedCommunities;
                let valid_till_1: any = 0,
                    valid_till_2: any = 0,
                    valid_till_3: any = 0;
                let formatted_valid_till_2 = null;
                let community_id = null;
                let community_name = '';
                let enter_1 = true,
                    enter_2 = true,
                    enter_3 = true;
                let valid_till_grace_period_3 = null,
                    valid_till_grace_period_2 = null,
                    valid_till_grace_period_1 = null;
                let formatted_valid_till_grace_period_3 = null,
                    formatted_valid_till_grace_period_2 = null,
                    formatted_valid_till_grace_period_1 = null;
                let warningBanner3 = null,
                    warningBanner2 = null,
                    warningBanner1 = null,
                    warningBanner0 = null;

                communities.forEach((community) => {
                    if (community?.id === this.communityId) {
                        community_id = community.id;
                        community_name = community.name;
                        community_name = community_name.length > 15 ? community_name.slice(0, 15) + '...' : community_name;

                        if (subscribedCommunities[community.id]?.['membership_state'] === 3) {
                            enter_2 = enter_1 = false;
                            valid_till_3 = subscribedCommunities[community.id]['valid_till'];

                            this.membership_state = 3;

                            if (subscribedCommunities[community.id]['valid_till'] >= valid_till_3)
                                warningBanner3 = 'Renewal due for this community';
                        } else if (subscribedCommunities[community.id]?.['membership_state'] === 2 && enter_2) {
                            enter_1 = false;
                            enter_3 = false;
                            valid_till_2 = subscribedCommunities[community.id]['valid_till'];

                            this.membership_state = 2;

                            if (subscribedCommunities[community.id]['valid_till'] >= valid_till_2)
                                warningBanner2 = `Your membership has expired.`;
                        } else if (subscribedCommunities[community.id]?.['membership_state'] === 1 && enter_1) {
                            enter_3 = false;
                            valid_till_1 = subscribedCommunities[community.id]['valid_till'];

                            this.membership_state = 1;

                            if (subscribedCommunities[community.id]['valid_till'] >= valid_till_1)
                                warningBanner1 = `Your membership has expired.`;
                        } else if (subscribedCommunities[community.id]?.['membership_state'] === 0 && enter_3) {
                            warningBanner0 = null;
                        }

                        if (warningBanner3) {
                            this.warningBanner = warningBanner3;
                            return;
                        } else if (warningBanner2) {
                            this.warningBanner = warningBanner2;
                            return;
                        } else if (warningBanner1) {
                            this.warningBanner = warningBanner1;
                        } else {
                            this.warningBanner = null;
                        }
                    }
                });
            });
        });
    }

    ngOnDestroy() {
        this.communityService.showCommunityHeader$$.next({ status: false, headerValue: '' });
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

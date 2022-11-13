import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConnectionService } from 'ng-connection-service';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { IChatroom, MyChatroom } from '../../../../shared/models/chatroom.model';
import { IUser } from '../../../../shared/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { State } from '../../../../shared/store/reducers';
import { SetHeaderAction, StartLoading, StopLoading } from '../../../../shared/store/actions/app.action';
import { FirebaseDatabaseService } from '../../../../core/services/firebase-database.service';
import { AUTH_PATH } from 'src/app/shared/constants/routes.constant';
import { Payload } from '../../../../shared/models/app.model';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { CommunityService } from 'src/app/core/services/community.service';
import { IMemberState } from 'src/app/shared/models/member.model';
import { MEMBER_STATE } from '../../../../shared/enums/member-state.enum';
import { MyCommunity } from '../../../../shared/models/community.model';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { SessionstorageService } from 'src/app/core/services/sessionstorage.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { RENEWAL_FLOW } from 'src/app/shared/enums/mixpanel.enum';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BuyCommunityMembershipSheetComponent } from 'src/app/shared/entryComponents/buy-community-membership-sheet/buy-community-membership-sheet.component';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CookieService } from 'ngx-cookie-service';
import { COMMMUNITY_OPENED } from 'src/app/shared/constants/app-constant';
import { MatDialog } from '@angular/material/dialog';
import { UpgradeMembershipBottomSheetComponent } from '../../entryComponents/upgrade-membership-bottom-sheet/upgrade-membership-bottom-sheet.component';
import { DmService } from 'src/app/core/services/dm.services';
@Component({
    selector: 'app-home-feed-panel',
    templateUrl: './home-feed-panel.component.html',
    styleUrls: ['./home-feed-panel.component.scss'],
})
export class HomeFeedPanelComponent implements OnInit, OnDestroy {
    @Input() user: IUser;
    memberState: IMemberState;
    myChatrooms: MyChatroom[] = [];
    inactiveChatrooms: MyChatroom[] = [];
    inactiveChatroomsCount: number = 0;
    showChatroomList: boolean;
    showUpdateProfile: boolean;
    showChatroomDetail: boolean = false;
    stopFetch: boolean = false;
    showInactiveList: boolean = true;
    page: number = 3;
    pages: number;
    state: boolean = false;
    toReload: boolean = false;
    noActiveChatrooms: boolean = false;
    community: MyCommunity;
    mySubscribedCommunitiesMeta = {};
    warningBanner: any = null;
    chatroom: IChatroom;
    screenType: string;
    myCommunities = [];
    communityID = null;
    showMySubscription = false;
    mySubscription: any = null;
    membership_state: any;
    showNewChatroomCommunityDetail: boolean = false;
    showDetailToNonLoggedInUser: boolean = false;
    admins;
    buyMembershipUrl: string;
    chatroom_type: number | string;
    data: any = null;
    access;
    totalChatroomsCount: number;
    newChatroomsCount: number;
    newChatroomButtonStatus: boolean = false;
    currentCommunityData: any = null;
    showDmButton: boolean = false;
    showNewTag: boolean = false;
    showUnreadDmCount: boolean = false;
    unreadDmCount: number = 0;
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.state = false;
    }
    guestUser: any;
    private destroy$$ = new Subject();

    constructor(
        private homeFeedService: HomeFeedService,
        private authService: AuthService,
        private store: Store<State>,
        private router: Router,
        private firebaseService: FirebaseDatabaseService,
        private connectionService: ConnectionService,
        private chatroomService: ChatroomService,
        private communityService: CommunityService,
        private sessionStorageService: SessionstorageService,
        private localStorageService: LocalStorageService,
        private subscriptionService: SubscriptionService,
        private analyticsService: AnalyticsService,
        private activatedRoute: ActivatedRoute,
        private route: ActivatedRoute,
        private bottomSheet: MatBottomSheet,
        private utilsService: UtilsService,
        private cookieService: CookieService,
        private dialog: MatDialog,
        private dmService: DmService
    ) {}

    ngOnInit(): void {
        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        this.guestUser = this.localStorageService.getSavedState('__is_guest__');
        this.communityID = this.cookieService.get(COMMMUNITY_OPENED);
        this.handleRoutes();
        this.access = this.localStorageService.getSavedState(STORAGE_KEY.ACCESS)?.access;

        this.chatroomService?.showNewChatroomCommunityDetail$$.subscribe((res) => {
            if (this.screenType == 'mobile' && res && !this.showNewChatroomCommunityDetail) {
                this.communityService.sendAccessDataToBottomSheet$$.subscribe((data) => {
                    if (!this.data && data && this.access && this.screenType == 'mobile') {
                        this.openChatroomDetailBottomSheet(data);
                        this.data = data;
                    }
                });
            }
            this.showNewChatroomCommunityDetail = res;
        });

        if (this.user) {
            this.authService.setConfig();
            this.showDetailToNonLoggedInUser = false;
        } else if (this.router.url === '') this.router.navigateByUrl('/auth');
        else if (!this.user && window.location.pathname.split('/')[2] == 'collabcard') {
            this.showDetailToNonLoggedInUser = true;
            this.handleNonLoggedInUser();
            if (this.screenType == 'mobile') this.router.navigateByUrl(AUTH_PATH);
            return;
        }

        // this.fetchBuyMembershipUrl();

        // this.store.dispatch(SetHeaderAction(new Payload(null))); // to remove previous header
        this.store.dispatch(StartLoading());
        if (this.user) {
            this.firebaseService.listenToHomeFeed();
            this.listenToConnection();
            this.listenToTabChange();
        }

        // this.getCommunityData();
        // this.getMemberState();
        // this.subscribedCommunitiesMeta();
        this.getChatrooms();

        // this.communityService.currentCommunityData$$.subscribe((data) => {
        //     if (this.currentCommunityData != data) this.currentCommunityData = data;
        // });
        // this.subscriptionService.showMySubscriptions$$.subscribe((res) => (this.showMySubscription = res));
    }

    handleNonLoggedInUser() {
        // let chatroom_id = window.location.pathname.split('/')[3];
        const chatroom_id = this.router.url.split('/')[3];
        this.chatroomService.fetchAccessChatroom(chatroom_id).subscribe((response) => {
            this.community = response?.community;
            this.buyMembershipUrl = response?.community?.website_url;
            this.chatroom_type = response?.chatroom_type;
            let data = {
                community: this.community,
                buyMembershipUrl: this.buyMembershipUrl,
                chatroom_type: this.chatroom_type,
            };
            data['accessibleWithoutSubscription'] = response?.access_without_subscription;
            let community_is_paid = response?.community?.is_paid;
            this.getCommunityAdmins(response?.community?.id).subscribe((response) => {
                this.admins = response.members;
                data['admins'] = this.admins;
                data['!data?.accessibleWithoutSubscription'];
                if (this.screenType == 'mobile' && community_is_paid) {
                    this.openChatroomDetailBottomSheet(data);
                }
            });
            window.localStorage.clear();
            this.storeUrl();
        });
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

    storeUrl() {
        this.route.queryParams.subscribe((res) => {
            this.localStorageService.setSavedState({ path: location.pathname, queryParams: res }, STORAGE_KEY.URL_PATTERN);
        });
    }

    fetchBuyMembershipUrl() {
        // let chatroom_id = window.location.pathname.split('/')[4];
        const chatroom_id = this.router.url.split('/')[3];
        if (chatroom_id) {
            this.chatroomService.fetchAccessChatroom(chatroom_id).subscribe((response) => {
                this.buyMembershipUrl = response?.community?.website_url;
                this.chatroom_type = response?.chatroom_type;
            });
        }
    }

    getCommunityAdmins(community_id: number | string): Observable<any> {
        return this.communityService.getCommunityAdminList({ community_id });
        //.subscribe((response) => {
        //     this.admins = response.members;
        // });
    }

    updateDmClicked() {
        if (this.showNewTag) {
            const params = {
                clicked: true,
            };
            this.dmService
                .updateDmTutorial(params)
                .pipe(takeUntil(this.destroy$$))
                .subscribe(
                    (res) => {
                        this.openDmFeed();
                        if (res?.success) {
                            this.fetchDmHomeFeedInfo(this.communityID);
                        }
                    },
                    (err) => {
                        this.openDmFeed();
                        this.fetchDmHomeFeedInfo(this.communityID);

                        console.log(err);
                    }
                );
        } else {
            this.openDmFeed();
        }
    }

    fetchDmHomeFeedInfo(communityId) {
        return;
        if (communityId) {
            this.dmService
                .fetchDmHome({ community_id: communityId })
                .pipe(takeUntil(this.destroy$$))
                .subscribe(
                    (res) => {
                        if (res?.success) {
                            if (res?.hide_dm_tab === true) this.showDmButton = false;
                            else this.showDmButton = true;
                            if ((res?.clicked == null || res?.clicked == undefined) && res?.clicked != false) {
                                if (res?.is_cm) {
                                    this.showUnreadDmCount = false;
                                    this.showNewTag = false;
                                    this.unreadDmCount = 0;
                                } else {
                                    this.showUnreadDmCount = false;
                                    this.showNewTag = false;
                                    this.unreadDmCount = 0;
                                }
                            } else if (res?.clicked == false) {
                                this.showNewTag = true;
                                this.showUnreadDmCount = false;
                            } else {
                                this.showNewTag = false;
                                this.showUnreadDmCount = res?.unread_dm_count && res?.unread_dm_count > 0 ? true : false;
                                this.unreadDmCount = res?.unread_dm_count;
                            }
                        } else {
                            this.showNewTag = false;
                            this.showUnreadDmCount = false;
                            this.unreadDmCount = 0;
                        }
                    },
                    (err) => {
                        this.showNewTag = false;
                        this.showUnreadDmCount = false;
                        this.unreadDmCount = 0;
                        console.log(err);
                    }
                );
        }
    }

    handleRoutes(): void {
        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((route) => {
                const currentId = +route?.params?.communityId;
                if (this.communityID !== currentId) {
                    this.communityID = +route?.params?.communityId || this.cookieService.get(COMMMUNITY_OPENED);
                    this.chatroomService?.showNewChatroomCommunityDetail$$.next(false);
                    this.homeFeedService.getInitialCommunityHomeFeedChatrooms(this.communityID);
                    this.getCurrentCommunityData();
                    this.showMySubscriptions();
                    this.getMemberState();
                    this.subscribedCommunitiesMeta();
                    this.fetchDmHomeFeedInfo(this.communityID);
                    this.state = false;
                }
            });
    }

    getMemberState() {
        const payload = { community_id: this.communityID, member_id: this.user?.id };
        this.communityService
            .getMemberState(payload)
            .pipe(takeUntil(this.destroy$$))
            .subscribe(
                (response) => {
                    const createChatroomMemberRights = response.member_rights[0];
                    if (createChatroomMemberRights?.state === 0 && createChatroomMemberRights?.is_selected)
                        this.newChatroomButtonStatus = true;
                    else this.newChatroomButtonStatus = false;
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    getCommunityData() {
        if (this.user?.id === MEMBER_STATE.NOT_A_MEMBER) {
            this.showChatroomList = false;
            // this.showChatroomDetail = true;
        }
        if (this.router.url === '/') {
            this.showChatroomList = true;
            // this.showChatroomDetail = false;
            return;
        }
        if (this.community) this.getUserStatus(this.cookieService?.get(COMMMUNITY_OPENED), this.user.id);
        else {
            setTimeout(() => {
                this.community = this.sessionStorageService.getSessionState(STORAGE_KEY?.COMMUNITY);
                this.chatroom = this.sessionStorageService.getSessionState(STORAGE_KEY?.CHATROOM);
                this.getUserStatus(this.cookieService?.get(COMMMUNITY_OPENED), this.user?.id);
            }, 2500);
        }
    }

    getUserStatus(community_id: number | string, member_id: number | string) {
        this.communityService.getMemberState({ community_id, member_id }).subscribe((response) => {
            this.memberState = response;
            this.communityService.memberStateObj$$.next(this.memberState);

            // if(MEMBER_STATE.MEMBER === this.memberState.state){
            if ([MEMBER_STATE.MEMBER, MEMBER_STATE.ADMIN].includes(this.memberState?.state)) {
                this.showChatroomList = true;
                this.showChatroomDetail = false;
            } else {
                this.showChatroomList = false;
                //this.showChatroomDetail = true;
            }
        });
    }

    hideChatroomDetailEmitter($event) {
        this.showChatroomDetail = false;
        if ($event == 'true') {
            this.showChatroomDetail = false;
            this.showChatroomList = true;
        }
    }

    listenToConnection() {
        this.connectionService
            .monitor()
            .pipe(takeUntil(this.destroy$$))
            .subscribe((isOnline) => {
                if (!isOnline) {
                    this.toReload = true;
                }
            });
    }

    openCommunityFeed() {
        this.router.navigateByUrl(`/community_feed/${this.currentCommunityData.id}`);
    }

    openDmFeed() {
        this.router.navigateByUrl(`direct_messages/${this.currentCommunityData.id}`);
    }

    listenToTabChange() {}

    updateChatroomList() {
        if (!this.stopFetch) {
            this.homeFeedService.getCommunityHomeFeedChatrooms(this.communityID, this.page);
            this.page += 1;
            if (this.page > this.pages) this.stopFetch = true;
        } else return;
    }

    getChatrooms() {
        this.homeFeedService.homeFeedChatroomGroups$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            console.log(response);
            if (response.home) {
                this.myChatrooms = [];
                this.inactiveChatrooms = [];
                this.inactiveChatroomsCount = response['home']['inactive_chatroom_count'];
                this.pages = response['home']['total_pages'];
                for (let chatroom of response['home']['chatrooms']) {
                    if (chatroom.chatroom?.state === 0) this.homeFeedService.markChatroomSeen(chatroom.chatroom, this.user.id);
                    if (chatroom.chatroom.active) this.myChatrooms.push(chatroom);
                    else this.myChatrooms.push(chatroom);
                }
                if (this.myChatrooms.length === 0) this.noActiveChatrooms = true;
            }
            this.store.dispatch(StopLoading());
        });
    }

    onScroll() {
        if (this.user) this.updateChatroomList();
    }

    toggleList() {
        this.showInactiveList = !this.showInactiveList;
    }

    createSectionComponent(event) {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }
        if (event.status === 'created') {
            this.page = 1;
            this.stopFetch = false;
            this.updateChatroomList();
        }
        this.state = !this.state;
        this.chatroomService.closeMediaPopup$$.next(false);
    }

    showWarningBanner(communityMeta) {}

    getCommunities() {
        return this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$));
    }

    showMySubscriptions() {
        this.homeFeedService.mySubscriptions$.subscribe((subscriptions) => {
            this.mySubscription = subscriptions?.filter((subscription) => subscription?.community?.id === parseInt(this.communityID))[0];
            this.showUpgradeMembershipBottomSheet();
        });
    }

    showUpgradeMembershipBottomSheet() {
        if (this.mySubscription?.show_upgrade_membership && this.mySubscription?.community?.name) {
            this.dialog.closeAll();
            this.dialog.open(UpgradeMembershipBottomSheetComponent, {
                panelClass: ['upgrade-membership-bs'],
                data: {
                    mySubscription: this.mySubscription,
                },
            });
        }
    }

    getCurrentCommunityData() {
        this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            const currentCommunity = response.findIndex((community) => community?.id === this.communityID);
            if (currentCommunity >= 0) {
                const currentCommunityData = response[currentCommunity];
                this.totalChatroomsCount = currentCommunityData?.chatroom_count;
                this.newChatroomsCount = currentCommunityData?.collabcard_unseen;
                this.communityService?.currentCommunityData$$?.next(currentCommunityData);
            }
        });
    }

    subscribedCommunitiesMeta() {
        this.homeFeedService.subscribedCommunitiesMetaGroup$.pipe(takeUntil(this.destroy$$)).subscribe((subscribedCommunities) => {
            this.getCommunities().subscribe((communities) => {
                this.myCommunities = communities;
                this.mySubscribedCommunitiesMeta = subscribedCommunities;
                let valid_till_1: any = 0,
                    valid_till_2: any = 0,
                    valid_till_3: any = 0;
                let formatted_valid_till_1 = null;
                let formatted_valid_till_3 = null;
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

                this.myCommunities.forEach((community) => {
                    if (community?.id === this.communityID) {
                        community_id = community.id;
                        community_name = community.name;
                        community_name = community_name.length > 15 ? community_name.slice(0, 15) + '...' : community_name;

                        if (subscribedCommunities[community.id]?.['membership_state'] === 3) {
                            enter_2 = enter_1 = false;
                            valid_till_3 = subscribedCommunities[community.id]['valid_till'];
                            valid_till_3 = new Date(valid_till_3);
                            valid_till_grace_period_3 = subscribedCommunities[community.id]['valid_till_grace_period'];
                            valid_till_grace_period_3 = new Date(valid_till_grace_period_3);

                            this.membership_state = 3;

                            if (subscribedCommunities[community.id]['valid_till'] >= valid_till_3) {
                                formatted_valid_till_3 =
                                    valid_till_3.getDate() +
                                    ' ' +
                                    valid_till_3.toLocaleDateString('default', { month: 'short' }) +
                                    ' ' +
                                    valid_till_3.getFullYear() +
                                    ', ' +
                                    valid_till_3.toLocaleTimeString().slice(0, 5);

                                warningBanner3 = `Renew your membership before ${formatted_valid_till_3} to avoid removal.`;
                            }
                        } else if (subscribedCommunities[community.id]?.['membership_state'] === 2 && enter_2) {
                            enter_1 = false;
                            enter_3 = false;
                            valid_till_2 = subscribedCommunities[community.id]['valid_till'];
                            valid_till_grace_period_2 = subscribedCommunities[community.id]['valid_till_grace_period'];
                            valid_till_grace_period_2 = new Date(valid_till_grace_period_2);

                            this.membership_state = 2;

                            if (subscribedCommunities[community.id]['valid_till'] >= valid_till_2) {
                                // this.communityID = community.id;

                                formatted_valid_till_grace_period_2 =
                                    valid_till_grace_period_2.getDate() +
                                    ' ' +
                                    valid_till_grace_period_2.toLocaleDateString('default', { month: 'short' }) +
                                    ', ' +
                                    valid_till_grace_period_2.toLocaleTimeString().slice(0, 5);

                                warningBanner2 = `Renew your membership before ${formatted_valid_till_grace_period_2}. PM to avoid removal`;
                            }
                        } else if (subscribedCommunities[community.id]?.['membership_state'] === 1 && enter_1) {
                            enter_3 = false;
                            valid_till_1 = subscribedCommunities[community.id]['valid_till'];
                            valid_till_1 = new Date(valid_till_1);
                            valid_till_grace_period_1 = subscribedCommunities[community.id]['valid_till_grace_period'];
                            valid_till_grace_period_1 = new Date(valid_till_grace_period_1);

                            this.membership_state = 1;

                            formatted_valid_till_1 =
                                valid_till_1.getDate() +
                                ' ' +
                                valid_till_1.toLocaleDateString('default', { month: 'short' }) +
                                ' ' +
                                valid_till_1.getFullYear() +
                                ', ' +
                                valid_till_1.toLocaleTimeString().slice(0, 5);

                            if (subscribedCommunities[community.id]['valid_till'] >= valid_till_1) {
                                warningBanner1 = `Your subscription to this community expired on ${formatted_valid_till_1}`;
                            }
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

    openRenewal() {
        let membershipState;
        if (this.membership_state === 3) {
            membershipState = 'active';
        } else if (this.membership_state === 2) {
            membershipState = 'grace_period';
        } else if (this.membership_state === 1) {
            membershipState = 'expired';
        }

        this.analyticsService.sendEvent(RENEWAL_FLOW.RENEWAL_BUTTON_CLICKED, {
            community_id: this.communityID,
            source: 'home_snack_bar',
            membership_state: membershipState,
        });

        if (this.screenType === 'mobile') {
            this.router.navigate(['/renewal/' + this.communityID], { queryParams: { renew: true, user_id: this.user.id } });
        } else {
            this.router.navigate(['/community_feed/' + this.communityID + '/renewal/' + this.communityID], {
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
        this.localStorageService.setSavedState(true, STORAGE_KEY.CHATROOM_OPENED);
        this.chatroomService.markRead(`chatroom_id=${chatroom?.chatroom?.id}`).subscribe((_) => {});
    }

    ngOnDestroy(): void {
        // this.homeFeedService.clearRefreshSubscription();
        this.firebaseService.clearHomeFeedSubscription();
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

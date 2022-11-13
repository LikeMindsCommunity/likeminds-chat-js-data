import { Component, OnInit, ViewChild, ElementRef, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { IUser } from '../../../../shared/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { LocalStorageService } from '../../../../core/services/localstorage.service';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import {
    COMMUNITY_FEED_PATH,
    DETAIL,
    EVENT_FEED_PATH,
    MEMBER_DIRECTORY_PATH,
    ROOT_PATH,
    DIRECT_MESSAGE_PATH,
} from 'src/app/shared/constants/routes.constant';
import { Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { IMemberState } from 'src/app/shared/models/member.model';
import { RENEWAL_FLOW } from 'src/app/shared/enums/mixpanel.enum';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { EventFeedService } from 'src/app/core/services/event-feed.service';
import { PaymentModalDialogComponent } from 'src/app/shared/entryComponents/payment-modal-dialog/payment-modal-dialog.component';
import { CommunityService } from 'src/app/core/services/community.service';
import { DmService } from 'src/app/core/services/dm.services';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { YourResponseComponent } from 'src/app/pages/community-detail/entryComponents/your-response/your-response.component';
// import { YourResponseSheetComponent } from 'src/app/pages/community-detail/components/your-response-sheet/your-response-sheet.component';
import { StopLoading, StartLoading } from 'src/app/shared/store/actions/app.action';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ResizeService } from 'src/app/core/services/resize.service';
import _ from 'lodash';
import { LocalStorage } from 'aws-sdk/clients/autoscaling';
import { SessionstorageService } from 'src/app/core/services/sessionstorage.service';
@Component({
    selector: 'app-left-panel',
    templateUrl: './left-panel.component.html',
    styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent implements OnInit, OnDestroy {
    public circleColor: string;
    private colors = [
        '#B71C1C', //red
        '#880E4F', //pink
        '#4A148C', //Purple
        '#311B92', //Deep Purple
        '#1A237E', //Indigo
        '#0D47A1', //Blue
        '#01579B', //Light Blue
        '#006064', //Cyan
        '#004D40', //Teal
        '#1B5E20', //Green
        '#33691E', //Light Green
        '#827717', //Lime
        '#F57F17', //Yellow
        '#FF6F00', //Amber
        '#E65100', //Orange
        '#BF360C', //Deep Orange
        '#3E2723', //Brown
    ];

    user: IUser;
    memberState: IMemberState;
    screenType: string;
    myCommunities: any; //MyCommunity[] = [];
    // MAKE A ENUM FOR THIS
    admin_community_ids: any[] = [];
    page: number = 1;
    statusList: any[] = [];
    actions: any[] = [];
    colSize: number;
    rowSize: number;
    any_paid_communitiy: Boolean = false;
    gridHeight: number;
    gridWidth: number;
    panelWidth: number = 96;
    imgInitShow: boolean = true;
    imgInit1: any;
    expiredOrExpiringCommunityCount: number = 0;
    eventTabActive = false;
    access: boolean;
    communityFeedRoute: string = '';
    homeFeedRoute: string = '';
    eventFeedRoute: string = '';
    dmFeedRoute: any = [];
    currentCommunityData: any;
    subscriptionStatusValue = 'Subscription status';
    subscriptionStatus: boolean = false;
    subscriptionRedBubbleStatus: boolean = false;
    COMMUNITY_ACTIONS = {
        COMMUNITY_DETAILS: 'Community details',
        MEMBER_DIRECTORY: 'Member directory',
        INVITE_MEMBERS: 'Invite members',
        MANAGEMENT_TOOLS: 'Management tools',
        SUBSCRIPTION_STATUS: 'Subscription status',
    };
    showDmButton: boolean = false;
    showNewTag: boolean = false;
    showUnreadDmCount: boolean = false;
    unreadDmCount: number = 0;
    hide_dm_text: string;
    showHideDMText: boolean = false;
    private destroy$$ = new Subject();
    currentCommunityId: any;
    @ViewChild('communityList') panel: ElementRef;
    communityData: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private store: Store<State>,
        private bottomSheet: MatBottomSheet,
        private homeFeedService: HomeFeedService,
        private resizeService: ResizeService,
        private localStorageService: LocalStorageService,
        private authService: AuthService,
        private router: Router,
        public chatroomService: ChatroomService,
        private cookieService: CookieService,
        private subscriptionService: SubscriptionService,
        private analyticsService: AnalyticsService,
        private eventFeedService: EventFeedService,
        private activatedRoute: ActivatedRoute,
        private communityService: CommunityService,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private dmService: DmService,
        private sessionStorageService: SessionstorageService
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        }
        this.resizeService.onResize$.subscribe((response) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        });

        if (this.router.url.split('/')[1] === 'event_feed') {
            this.eventTabActive = true;
        } else {
            this.eventTabActive = false;
        }

        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.access = this.localStorageService.getSavedState(STORAGE_KEY.ACCESS)?.access;

        if (this.user) {
            this.getCommunities();
            this.subscribedCommunitiesMeta();
            // this.getEventCounts();
            let path = window.location.pathname;
        } else {
            let path = window.location.pathname;
            console.log(path);
            if (path?.split('/')[2] == 'collabcard') {
                if (this.isNumeric(path.split('/')[3])) {
                    this.getCommunities();
                }
            }
        }
        //get branding
        this.communityData = this.sessionStorageService.getSessionState('__community__');
        if (this.communityData?.id) this.communityService.getBranding(this.communityData?.id);

        this.communityService.currentCommunityData$$.pipe(takeUntil(this.destroy$$)).subscribe((data) => {
            if (!_.isEqual(this.currentCommunityData, data)) {
                this.currentCommunityData = data;
                this.subscribedCommunitiesMeta();
                this.filterCommunityActions(this.currentCommunityData?.actions);
                this.getMemberState(this.currentCommunityData?.id, this.user?.id);
                this.fetchDmHomeFeedInfo(this.currentCommunityData?.id);
                this.dmFeedRoute = [`${DIRECT_MESSAGE_PATH}/${this.currentCommunityData?.id}`];
            }
        });

        this.handleRouteChange();

        // this.dmService.getTotalCountDM.subscribe((res) => {
        //     if (res) {
        //         this.fetchDmHomeFeedInfo(res);
        //     }
        // });

        // this.getOverflowMenus();
    }

    // getOverflowMenus() {
    //     const params = {
    //         // community_id: this.cookieService.get('__community-opened__'),
    //         chatroom_id: 27305,
    //         api_type: 1,
    //     };
    //     this.homeFeedService.getOverflowMenu(params).subscribe((res) => {
    //         console.log(res);
    //     });
    // }

    handleRouteChange(): void {
        const communityId = this.cookieService.get('__community-opened__');
        this.currentCommunityId = communityId;
        this.communityFeedRoute = `/${COMMUNITY_FEED_PATH}/${communityId}`;
        this.homeFeedRoute = `/${communityId}`;

        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((route) => {
                if (route?.firstChild?.firstChild) {
                    // let communityIdUrl = route.firstChild.firstChild.params.communityId;
                    let communityIdUrl = this.currentCommunityId;
                    if (communityIdUrl) {
                        this.communityFeedRoute = `/${COMMUNITY_FEED_PATH}/${communityIdUrl}`;
                        this.homeFeedRoute = `/${communityIdUrl}`;
                        console.log(this.communityFeedRoute);
                    } else {
                        this.communityFeedRoute = `/${COMMUNITY_FEED_PATH}/${this.currentCommunityData?.id}`;
                        this.homeFeedRoute = `/`;
                        console.log(this.communityFeedRoute);
                    }
                    this.eventFeedRoute = `/${EVENT_FEED_PATH}/${communityIdUrl}`;
                }
            });
    }

    filterCommunityActions(communityActions): void {
        if (communityActions)
            this.actions = [...communityActions?.filter((action) => action.title !== this.COMMUNITY_ACTIONS.MANAGEMENT_TOOLS)];
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
                        if (res?.success) {
                            this.fetchDmHomeFeedInfo(this.currentCommunityData?.id);
                        }
                    },
                    (err) => {
                        this.fetchDmHomeFeedInfo(this.currentCommunityData?.id);
                        console.log(err);
                    }
                );
        }
    }

    fetchDmHomeFeedInfo(communityId) {
        if (communityId) {
            this.dmService
                .fetchDmHome({ community_id: communityId })
                .pipe(takeUntil(this.destroy$$))
                .subscribe(
                    (res) => {
                        if (res?.success) {
                            if (res?.hide_dm_tab === true) this.showDmButton = false;
                            else {
                                this.showDmButton = true;
                                if (res?.hide_dm_text != null) {
                                    this.showHideDMText = true;
                                    setTimeout(() => {
                                        this.showHideDMText = false;
                                    }, 3000);
                                    this.hide_dm_text = res?.hide_dm_text;
                                }
                            }

                            if (res?.clicked == false) {
                                this.showNewTag = true;
                                this.showUnreadDmCount = false;
                            } else {
                                this.showNewTag = false;
                                this.showUnreadDmCount = res?.unread_dm_count && res?.unread_dm_count > 0 ? true : false;
                                this.unreadDmCount = res?.unread_dm_count;
                            }
                        } else {
                            this.showDmButton = false;
                            this.showNewTag = false;
                            this.showUnreadDmCount = false;
                            this.unreadDmCount = 0;
                        }
                    },
                    (err) => {
                        this.showDmButton = false;
                        this.showNewTag = false;
                        this.showUnreadDmCount = false;
                        this.unreadDmCount = 0;
                        console.log(err);
                    }
                );
        }
    }

    takeAction(action): void {
        switch (action.title) {
            case this.COMMUNITY_ACTIONS.COMMUNITY_DETAILS:
                this.router.navigate([`${COMMUNITY_FEED_PATH}/${this.currentCommunityData.id}/${DETAIL}`]);
                break;
            case this.COMMUNITY_ACTIONS.MEMBER_DIRECTORY:
                this.router.navigate([COMMUNITY_FEED_PATH, this.currentCommunityData.id, MEMBER_DIRECTORY_PATH]);
                break;
            case this.COMMUNITY_ACTIONS.SUBSCRIPTION_STATUS:
                this.subscriptionService.showMySubscriptions$$.next(true);
                break;
            case this.COMMUNITY_ACTIONS.INVITE_MEMBERS:
                this.openInviteMemberFlow();
                break;
            default:
                this.snackbar.open('Coming Soon', null, {
                    duration: 4000,
                    panelClass: ['snackbar'],
                });
        }
    }

    getMemberState(community_id, member_id) {
        this.communityService.getMemberState({ community_id, member_id }).subscribe(
            (response) => {
                this.memberState = response;
            },
            (err) => {
                this.store.dispatch(StopLoading());
            }
        );
    }

    openInviteMemberFlow() {
        if (this.screenType === 'desktop') {
            this.openShareUrlPopup();
        } else {
            this.openShareUrlPopupMobile();
        }
    }

    getShareURL(): Observable<any> {
        return this.communityService.getCommunityShareURL(parseInt(this.currentCommunityData.id));
    }

    openShareUrlPopup() {
        this.store.dispatch(StartLoading());

        this.getShareURL().subscribe((res) => {
            this.store.dispatch(StopLoading());
        });
    }

    openShareUrlPopupMobile() {
        this.store.dispatch(StartLoading());
        this.getShareURL().subscribe((res) => {
            this.store.dispatch(StopLoading());
            // const sheet = this.bottomSheet.open(YourResponseSheetComponent, {
            //     panelClass: 'send-response-modal',
            //     data: {
            //         data: this.user,
            //         task: 'shareUrlPopupMobile',
            //         state: this.memberState.state,
            //         url: res,
            //         communityId: this.currentCommunityData.id,
            //     },
            // });
            // sheet.afterDismissed().subscribe((response) => {});
        });
    }

    checkActiveTab(event?: any) {
        if (event) this.eventTabActive = true;
        else this.eventTabActive = false;
    }

    isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    openPaymentModal() {
        this.dialog.open(PaymentModalDialogComponent, {
            data: {
                showExpiredCommunityPopup: false,
            },
            panelClass: 'modal-white-background',
        });
    }

    markAciveAndSetWidth(community) {
        this.setWidth('collapse');
        this.chatroomService.showNewChatroomCommunityDetail$$.next(false);
        this.markActive();
        if (!community?.nonClickable) {
            this.router.navigate(['/community_feed/' + `${community?.id}`]);
        }
    }

    setWidth(state: string) {
        if (state === 'expand') this.panel.nativeElement.style.width = this.gridWidth + 'px';
        if (state === 'collapse') this.panel.nativeElement.style.width = '96px';
    }

    onImgError(event, name): void {
        this.imgInit1 = this.userInit(name);
        this.imgInitShow = false;
    }
    userInit(name) {
        this.circleColor = this.colors[Math.floor(Math.random() * Math.floor(this.colors.length))];
        let initials = '';
        let namesList = name.split(' ');
        for (let name of namesList) {
            if (name[0] !== ' ' && name[0]) {
                initials += name[0]?.toUpperCase();
                if (initials.length === 2) break;
            }
        }
        return initials;
    }

    getCommunities() {
        this.homeFeedService.watchCommunity$$.subscribe((res) => {
            this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
                this.myCommunities = response;
                this.myCommunities.map((community: any) => {
                    if (community.member_state === 1) {
                        this.admin_community_ids.push(community.id);
                    }
                });
                this.myCommunities.map((community: any) => {
                    if (community.is_paid === true) {
                        this.any_paid_communitiy = true;
                        return;
                    }
                });

                if (res) {
                    let tempCommunity = res;
                    tempCommunity[0]['nonClickable'] = true;
                    this.myCommunities = [...tempCommunity, ...this.myCommunities];
                }
            });
        });
    }

    subscribedCommunitiesMeta() {
        this.homeFeedService.subscribedCommunitiesMetaGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            if (this.currentCommunityData) {
                if (response[this.currentCommunityData?.id]) this.subscriptionStatus = true;
                else this.subscriptionStatus = false;

                const membershipState = response[this.currentCommunityData?.id]?.membership_state;
                if (membershipState === 1 || membershipState === 2 || membershipState === 3) this.subscriptionRedBubbleStatus = true;
                else this.subscriptionRedBubbleStatus = false;

                // this.subscriptionStatus = this.currentCommunityData.click_state_subscription_value;
            }
        });
    }

    /**
     * @function getEventCounts
     * @param params
     * @description This function is used fetch unseen event feed counts
     */
    unseenFeed: any;
    getEventCounts() {
        this.eventFeedService
            .getUnseenEventFeedCount()
            .pipe(takeUntil(this.destroy$$))
            .subscribe((res) => {
                this.unseenFeed = res;
            });
    }

    /**
     * @function onLogout
     * @param params
     * @description This function is used to logout user
     */
    // onLogout() {
    //     this.subscriptionService.showMySubscriptions$$.next(false);
    //     this.authService
    //         .logout()
    //         .pipe(takeUntil(this.destroy$$))
    //         .subscribe(
    //             (res) => {
    //                 this.clearLocalData();
    //             },
    //             (err) => {
    //                 this.clearLocalData();
    //             }
    //         );
    // }

    /**
     * @function clearLocalData
     * @param
     * @description This function is used to clear all local, session, cookies storage
     */
    clearLocalData() {
        localStorage.clear();
        sessionStorage.clear();
        this.cookieService.deleteAll();
        this.router.navigate(['auth']);
        this.hideMediaPopup();
    }

    /**
     * @function loggedInUser
     * @param
     * @description This function is used to show logged in user profile
     */
    loggedInUser(): void {
        // this.router.navigate([`/${COMMUNITY_FEED_PATH}/${this.message?.community_id}/${PROFILE}/${this.user.id}`]);
    }

    /**
     * @function markActive
     * @param
     * @description This function is used to show to mark active chat in case the user come from an opened chatroom and clicks on home button
     */
    markActive() {
        let isAnyChatroomOpened = this.localStorageService.getSavedState(STORAGE_KEY.CHATROOM_OPENED);
        this.hideMediaPopup();
        if (this.localStorageService.getSavedState(STORAGE_KEY.CURRENTLY_OPENED_CHATROOM_ID) && isAnyChatroomOpened) {
            let chatroomId = this.localStorageService.getSavedState(STORAGE_KEY.CURRENTLY_OPENED_CHATROOM_ID);
            this.chatroomService.markRead(`chatroom_id=${chatroomId}`).subscribe((_) => {});
        }
        this.localStorageService.setSavedState(false, STORAGE_KEY.CHATROOM_OPENED);
        this.localStorageService.setSavedState(false, STORAGE_KEY.MY_SUBSCRIPTION_IS_OPENED);
        this.subscriptionService.showMySubscriptions$$.next(false);

        this.checkActiveTab(false);
    }

    hideMediaPopup(): void {
        this.chatroomService.closeMediaPopup$$.next(false);
    }

    cmDashboardClick() {
        this.analyticsService.sendEvent('Dashboard view');
        // Converts the route into a string that can be used
        // with the window.open() function
        const url = this.router.serializeUrl(this.router.createUrlTree([`/dashboard/${this.admin_community_ids[0]}`]));
        window.open(url, '_blank');
    }

    getMySubscription(): void {
        this.analyticsService.sendEvent(RENEWAL_FLOW.MY_SUBSCRIPTIONS_CLICKED);

        this.router.navigate([`${ROOT_PATH}`]);
        this.subscriptionService.showMySubscriptions$$.next(true);
    }

    ngOnDestroy(): void {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

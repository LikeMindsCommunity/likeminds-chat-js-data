import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Observable } from 'rxjs';
import _ from 'lodash';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { IUser } from '../../../../shared/models/user.model';
import { MIXPANEL } from '../../../../shared/enums/mixpanel.enum';
import { environment } from '../../../../../environments/environment';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { IMemberState } from 'src/app/shared/models/member.model';
import {
    BLOCKER,
    CHATROOM_PATH,
    CHATROOM_SETTINGS,
    COLLABCARD_PATH,
    COMMUNITY_FEED_PATH,
    DETAIL,
    MEMBER_DIRECTORY_PATH,
    PINNED,
    RENEWAL_PATH,
    ROOT_PATH,
    DM,
    DIRECT_MESSAGE_PATH,
    PROFILE,
    EVENT_FEED_PATH,
    DIRECT_MESSAGE_MEMBER_PATH,
} from '../../../../shared/constants/routes.constant';
import { PinChatroomPopupComponent } from '../../../../shared/entryComponents/pin-chatroom-popup/pin-chatroom-popup.component';
import {
    ANDROID,
    APPSTORE,
    IOS,
    ONE_DAY_SECONDS,
    PLAYSTORE,
    ACTIONS_MAP,
    ALLOWED_CHATROOM_ACTIONS,
    ALLOWED_COMMUNITY_ACTIONS,
} from '../../../../shared/constants/app-constant';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CommunityService } from 'src/app/core/services/community.service';
import { DmService } from 'src/app/core/services/dm.services';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { CHATROOM_TYPE_CODE } from 'src/app/shared/enums/chatroom-type.enum';
import { EventsService } from 'src/app/core/services/events.service';
import { Location } from '@angular/common';
import { getDevice } from 'src/app/shared/utils';
import { ConfirmBlockDialogComponent } from 'src/app/pages/collabcard/components/confirm-block-dialog/confirm-block-dialog.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() toggleDrawer: EventEmitter<any> = new EventEmitter();
    @Output() showSideBar: EventEmitter<any> = new EventEmitter();
    @Input() changeAppHeader: boolean;

    private destroy$$ = new Subject();
    routeElements: string[];
    memberState: IMemberState;
    pinned = PINNED;
    communityFeedPath = COMMUNITY_FEED_PATH;
    collabCardPath = COLLABCARD_PATH;
    data: string; // either 'logo' or 'detail'
    dataImage: string; // either 'single' or 'multi-part'
    dataImageUrl: string;
    heading: string;
    actions = [];
    subHeading: string;
    chatroomData: any;
    selectedMsgLength = 0;
    selectedMsgs = [];
    isSingleSelectedMsg = false;
    isAllSelectedMyMsg = false;
    isAnyDeletedMsg = false;
    user: IUser = JSON.parse(localStorage.getItem(STORAGE_KEY.LIKEMINDS_USER));
    chatroomId = 0;
    chatRoomMemberIdAndState = {};
    communityId: number;
    showCounter: boolean = false;
    counterText: any;
    totalCounter: number;
    screenType: string;
    state: number;
    mySubscribedCommunitiesMeta = [];
    expiredOrExpiringCommunityCount = 0;
    communityMembershipState: number;
    showSubscriptionHeader: boolean;
    showHistoryHeader: boolean = false;
    isIntroductionsRoom = false;
    introRoomThreadConvCount: number = 0;
    showIntroThreadView = false;
    showAttachmentScreenProps: any;
    currentView: any = null;
    hideHeader: boolean = false;
    currentCommunityData: any;
    subscriptionStatusValue = 'Subscription status';
    drawerRedBubbleStatus = false;
    communityHeaderData: any = {};
    subscriptionRedBubbleStatus: boolean = false;
    pinnedIconStatus: boolean = false;
    isCollabcard: boolean = false;
    isMobileRenewalPage: boolean = false;
    branding: any;
    isWhiteLabel: boolean;
    disableHeader: boolean = false;
    showSearchList: boolean = false;
    openMobileSearch: boolean = false;
    clearMobileSearchInput: boolean = false;
    searchValue: string = '';

    COMMUNITY_ACTIONS = {
        COMMUNITY_DETAILS: 'Community details',
        MEMBER_DIRECTORY: 'Member directory',
        INVITE_MEMBERS: 'Invite members',
        MANAGEMENT_TOOLS: 'Management tools',
        SUBSCRIPTION_STATUS: 'Subscription status',
    };

    constructor(
        private router: Router,
        private bottomSheet: MatBottomSheet,
        private homeFeedService: HomeFeedService,
        private chatroomService: ChatroomService,
        private snackbar: MatSnackBar,
        private analyticsService: AnalyticsService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private communityService: CommunityService,
        private dmService: DmService,
        private subscriptionService: SubscriptionService,
        private store: Store<State>,
        private localStorageService: LocalStorageService,
        private eventsService: EventsService,
        private utilsService: UtilsService,
        private cdr: ChangeDetectorRef,
        private _location: Location
    ) {}

    ngOnInit(): void {
        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router)
            )
            .subscribe((route: any) => {
                if (!route.url.includes('collabcard')) this.isIntroductionsRoom = false;
                else this.currentView = null;

                this.routeElements = route.url.split('/');

                this.showHistoryHeader = false;
                if (
                    this.routeElements[2] === COLLABCARD_PATH ||
                    this.routeElements[3] === COLLABCARD_PATH ||
                    this.routeElements[4] === COLLABCARD_PATH
                )
                    this.isCollabcard = true;
                else this.isCollabcard = false;

                if (this.routeElements[1] === RENEWAL_PATH) this.isMobileRenewalPage = true;
                else this.isMobileRenewalPage = false;

                this.chatroomId = +this.routeElements[this.routeElements.length - 1];

                this.subscriptionService.showSubscriptionHeader$$?.subscribe((res) => {
                    if (res && getDevice() === 'mobile') {
                        if (this.routeElements[2]?.split('?')[0] === 'history') this.currentView = 'MembershipHistoryView';
                        else this.currentView = 'SubscriptionView';
                    } else if (this.currentView === 'SubscriptionView' || this.currentView === 'MembershipHistoryView')
                        this.currentView = null;
                });

                if (getDevice() === 'mobile') this.updateHeaderData();

                this.getCommunityUnseenCount();
                this.homeFeedService.introRoomThreadConvCount$$?.next(0);
                this.handleBackButtonEventAttachment();
                this.cdr.detectChanges();
            });

        if (window.innerWidth <= 470) {
            this.listenToSelectedMsg();
            if (!this.user) this.hideHeader = true;
        }

        this.communityService.memberStateObj$$.subscribe((state) => {
            this.state = state.state;
        });

        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';

        this.homeFeedService.introRoomThreadConvCount$$.subscribe((res) => {
            this.introRoomThreadConvCount = res;
            this.cdr.detectChanges();
        });

        this.homeFeedService.showIntroThreadView$$.subscribe((res) => {
            this.showIntroThreadView = res;
            if (this.showIntroThreadView && this.screenType === 'mobile') this.currentView = 'IntroThreadView';
            else if (!this.showIntroThreadView && this.currentView === 'IntroThreadView') this.currentView = null;
            this.cdr.detectChanges();
        });

        this.homeFeedService?.homePageProfileUpdated$$?.subscribe((res) => {
            if (res) {
                this.user = this.localStorageService?.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
                this.homeFeedService?.homePageProfileUpdated$$?.next(false);
            }
        });

        this.eventsService.showEventAttachmentScreenProps$$.subscribe((res) => {
            this.showAttachmentScreenProps = res;
            if (this.showAttachmentScreenProps?.show && this.screenType === 'mobile') this.currentView = 'EventAttachmentView';
            else if (!this.showAttachmentScreenProps?.show && this.currentView === 'EventAttachmentView') this.currentView = null;
            this.cdr.detectChanges();
        });

        this.utilsService.showAccountHeader$$.subscribe((res) => {
            if (res && this.screenType === 'mobile') this.currentView = 'AccountView';
            else if (!res && this.currentView === 'AccountView') this.currentView = null;
            this.cdr.detectChanges();
        });

        this.communityService.currentCommunityData$$.pipe(takeUntil(this.destroy$$)).subscribe((data) => {
            if (!_.isEqual(this.currentCommunityData, data)) {
                this.currentCommunityData = data;
                this.subscribedCommunitiesMeta();
                this.getMemberState(this.currentCommunityData?.id, this.user?.id);
                if (this.isNumeric(this.routeElements[1]) || this.routeElements[1] === RENEWAL_PATH)
                    this.getCommunityData(+this.routeElements[1]);
            }
        });

        this.dmService.showDmHeader$$.subscribe((res) => {
            if (getDevice() === 'mobile') {
                this.currentView = res.headerValue;
            }
        });

        this.eventsService.hideMobileHeaderForOverlay$$.subscribe((res) => {
            if (getDevice() === 'mobile') {
                this.disableHeader = res;
                this.cdr.detectChanges();
            }
        });

        this.communityService.showCommunityHeader$$.subscribe((res) => {
            if (getDevice() === 'mobile') {
                const communityViews = ['CommunityFeedView', 'PinnedView', 'MemberDirectoryView'];
                if (res?.status) {
                    if (!(this.currentView === communityViews[2])) this.currentView = res.headerValue;
                } else if (
                    this.currentView === communityViews[0] ||
                    this.currentView === communityViews[1] ||
                    this.currentView === communityViews[2]
                )
                    this.currentView = null;

                this.setCommunityFeedPinnedIcon(this.currentCommunityData?.id);
            }
        });

        this.eventsService.showEventHeader$$.subscribe((res) => {
            if (getDevice() === 'mobile') {
                const eventViews = ['EventFeedView', 'CreateEventView', 'EditEventView'];
                if (res.status) this.currentView = res.headerValue;
                else if (this.currentView === eventViews[0] || this.currentView === eventViews[1] || this.currentView === eventViews[2])
                    this.currentView = null;
            }
        });

        this.communityService.currentCommunityBranding$$.pipe(takeUntil(this.destroy$$)).subscribe((branding) => {
            this.branding = branding;
        });
        this.communityService.isWhiteLabel$$.pipe(takeUntil(this.destroy$$)).subscribe((isWhiteLabel) => {
            this.isWhiteLabel = isWhiteLabel;
        });
    }

    setCommunityFeedPinnedIcon(communityId: number) {
        this.homeFeedService.communityDetailGroup$.pipe(takeUntil(this.destroy$$)).subscribe((communityList) => {
            if (communityList[communityId]) {
                this.pinnedIconStatus = communityList[communityId]?.pinned_top_bar;
            }
        });
    }

    checkIntroductionRoom(): void {
        this.isIntroductionsRoom = this.chatroomData?.chatroom?.type === CHATROOM_TYPE_CODE.CARD_INTRODUCTIONS || false;
    }

    handleThreadButtonClick() {
        this.homeFeedService.showIntroThreadView$$.next(true);
    }

    handleBackButtonClick() {
        this.homeFeedService.showIntroThreadView$$.next(false);
    }

    handleBackButtonEventAttachment() {
        this.eventsService.showEventAttachmentScreenProps$$.next({ ...this.showAttachmentScreenProps, show: false });
    }

    handleBackButtonSubscriptionPage() {
        this.subscriptionService.showSubscriptionHeader$$.next(false);
        this.subscriptionService.showMySubscriptions$$.next(false);
    }

    handleBackButtonAccountPage() {
        this.utilsService.showAccountHeader$$.next(false);
        this._location.back();
    }

    handleBackButton(view?: string) {
        if (view === 'MembershipHistoryView') this.currentView = 'SubscriptionView';
        else if (view === 'PinnedView') this.currentView = 'CommunityFeedView';
        else if (this.routeElements[3] === 'collabcard') this.currentView = 'CommunityFeedView';
        else if (
            (this.routeElements[1] === DIRECT_MESSAGE_PATH || this.routeElements[1] === DIRECT_MESSAGE_MEMBER_PATH) &&
            this.routeElements[4] === 'collabcard'
        ) {
            this.currentView = 'DmFeedView';
        } else if (this.routeElements[3] === DM && this.routeElements[4] !== 'collabcard') {
            this.currentView = null;
        } else if (this.routeElements[4] === 'collabcard') this.currentView = 'PinnedView';
        else this.currentView = null;

        this._location.back();
    }

    showSideBarIfHidden(): void {
        this.showSideBar.emit(true);
    }

    handleSearchResultsList(value) {
        this.showSearchList = value;
    }

    closeMobileSearch() {
        this.openMobileSearch = false;
    }

    handleMobileSearch(value) {
        this.openMobileSearch = value;
        this.handleSearchResultsList(false);
    }

    listenToSelectedMsg(): void {
        this.homeFeedService.selectedMsg$.pipe(takeUntil(this.destroy$$)).subscribe((msgs) => {
            this.selectedMsgLength = Object.keys(msgs).length;
            this.selectedMsgs = [...Object.values(msgs)];
            this.isSingleSelectedMsg = this.selectedMsgLength === 1 && !this.selectedMsgs[0].deleted_by;
            if (this.user) {
                this.isAllSelectedMyMsg = !this.selectedMsgs.some((msg) => msg.member.id !== this.user.id) || false;
            }
            this.isAnyDeletedMsg = this.selectedMsgs.some((msg) => msg.deleted_by);
        });
    }

    markActive() {
        this.showSideBarIfHidden();
        this.localStorageService.setSavedState(false, STORAGE_KEY.MY_SUBSCRIPTION_IS_OPENED);
        this.subscriptionService.showMySubscriptions$$.next(false);
        let isAnyChatroomOpened = this.localStorageService.getSavedState(STORAGE_KEY.CHATROOM_OPENED);

        if (this.localStorageService.getSavedState(STORAGE_KEY.CURRENTLY_OPENED_CHATROOM_ID) && isAnyChatroomOpened) {
            let chatroomId = this.localStorageService.getSavedState(STORAGE_KEY.CURRENTLY_OPENED_CHATROOM_ID);
            this.chatroomService.markRead(`chatroom_id=${chatroomId}`).subscribe((_) => {});
        }
        this.localStorageService.setSavedState(false, STORAGE_KEY.CHATROOM_OPENED);
    }

    getCommunityUnseenCount() {
        this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            let counter = 0;
            for (let community of response) {
                if (community?.collabcard_unseen) {
                    counter += community?.collabcard_unseen;
                    if (counter > 99) break;
                }
            }

            if (counter + this.expiredOrExpiringCommunityCount > 99) this.counterText = '99+';
            else {
                this.counterText = counter + this.expiredOrExpiringCommunityCount;
            }

            // else this.counterText = counter.toString();
            //else this.totalCounter = counter;
            if (counter + this.expiredOrExpiringCommunityCount > 0) {
                this.showCounter = true;
            }
        });
    }

    subscribedCommunitiesMeta() {
        this.homeFeedService.subscribedCommunitiesMetaGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.mySubscribedCommunitiesMeta = response;

            if (this.currentCommunityData) {
                const membershipState = response[this.currentCommunityData?.id]?.membership_state;
                const bubbleTruthyCondition =
                    this.currentCommunityData.click_state === 2 ||
                    this.currentCommunityData.click_state === 3 ||
                    this.currentCommunityData.click_state === 4 ||
                    this.currentCommunityData.collabcard_unseen ||
                    membershipState === 1 ||
                    membershipState === 2 ||
                    membershipState === 3;
                if (bubbleTruthyCondition) this.drawerRedBubbleStatus = true;
                else this.drawerRedBubbleStatus = false;

                if (membershipState === 1 || membershipState === 2 || membershipState === 3) this.subscriptionRedBubbleStatus = true;
                else this.subscriptionRedBubbleStatus = false;
            }
        });
    }

    getChatroomData(chatroomId: number) {
        this.homeFeedService.chatroomDetailGroup$.pipe(takeUntil(this.destroy$$)).subscribe((chatroomList) => {
            if (chatroomList[chatroomId]) {
                this.chatroomData = chatroomList[chatroomId];
                this.checkIntroductionRoom();
                this.heading =
                    this.chatroomData?.chatroom?.type == 10
                        ? this.getChatroomName(this.chatroomData?.chatroom)
                        : this.chatroomData?.chatroom?.header || '';
                if (this.chatroomData?.chatroom?.type === 9) this.subHeading = this.chatroomData?.chatroom?.community_name;
                else this.subHeading = this.chatroomData?.participant_count + ' participants';
                this.filterChatroomActions(this.chatroomData?.chatroom_actions);
                this.chatRoomMemberIdAndState[chatroomId] = this.getChatroomMemberIdAndState(this.chatroomData?.chatroom);
            } else this.homeFeedService.getChatroomDetail(chatroomId, {});
        });
    }

    getMemberState(community_id, member_id) {
        this.communityService.getMemberState({ community_id, member_id }).subscribe(
            (response) => {
                this.memberState = response;
                // console.log(response)
            },
            (err) => {
                this.store.dispatch(StopLoading());
            }
        );
    }

    getCurrentCommunityData(community_id) {
        this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            const currentCommunity = response.findIndex((community) => community?.id === community_id);
            if (currentCommunity >= 0) {
                const currentCommunityData = response[currentCommunity];
                this.communityService?.currentCommunityData$$?.next(currentCommunityData);
            }
        });
    }

    getCommunityData(communityId: number) {
        if (this.currentCommunityData && !this.isCollabcard) {
            this.communityId = communityId;
            this.dataImageUrl = this.currentCommunityData.image_url;
            this.heading = this.currentCommunityData.name;
            this.subHeading = null;
            if (this.routeElements[1] === RENEWAL_PATH) this.getRenewalPageData();

            this.filterCommunityActions(this.currentCommunityData.actions);
            if (this.mySubscribedCommunitiesMeta[communityId]?.membership_state === 1) {
                this.communityMembershipState = 1;
            }
        } else if (this.routeElements[1] === RENEWAL_PATH && !this.currentCommunityData) {
            this.getCurrentCommunityData(communityId);
        }
    }

    getRenewalPageData() {
        this.subHeading = this.heading;
        this.heading = 'Renew Membership';
    }

    getPinnedChatroomData() {
        this.subHeading = this.heading;
        this.heading = 'Pinned Chat rooms';
    }

    filterCommunityActions(actions): void {
        this.actions = [...actions?.filter((action) => action.title !== this.COMMUNITY_ACTIONS.MANAGEMENT_TOOLS)];
    }

    filterChatroomActions(actions): void {
        this.actions = [...actions?.filter((action) => ALLOWED_CHATROOM_ACTIONS.includes(action.id))];
    }

    updateHeaderData() {
        if (this.routeElements[0] === ROOT_PATH) {
            this.data = 'logo';

            if (this.isNumeric(this.routeElements[1])) {
                this.data = 'detail';
                this.dataImage = 'single';
                if (getDevice() === 'mobile') this.currentView = null;

                this.getCommunityData(parseInt(this.routeElements[1]));
            }

            if (this.routeElements[2] === CHATROOM_PATH && this.isNumeric(this.routeElements[3])) {
                this.data = 'detail';
                this.dataImage = null;
                this.getChatroomData(parseInt(this.routeElements[3]));
            }

            if (this.routeElements[1] === COMMUNITY_FEED_PATH && this.isNumeric(this.routeElements[2])) {
                this.data = 'detail';
                this.dataImage = 'single';
                this.getCommunityData(parseInt(this.routeElements[2]));
                if (this.routeElements[3] === CHATROOM_PATH && this.isNumeric(this.routeElements[4])) {
                    this.dataImage = null;
                    this.getChatroomData(parseInt(this.routeElements[4]));
                }

                if (this.routeElements[3] === PINNED) {
                    this.getPinnedChatroomData();
                    if (this.routeElements[4] === CHATROOM_PATH && this.isNumeric(this.routeElements[5])) {
                        this.dataImage = null;
                        this.getChatroomData(parseInt(this.routeElements[5]));
                    }
                }

                if (this.routeElements[3] === MEMBER_DIRECTORY_PATH) {
                    if (getDevice() === 'mobile') this.currentView = 'MemberDirectoryView';
                }
            }

            if (this.routeElements[1] === EVENT_FEED_PATH && this.isNumeric(this.routeElements[2])) {
                this.data = 'detail';
                this.dataImage = 'single';

                if (this.routeElements[3] === CHATROOM_PATH && this.isNumeric(this.routeElements[4])) {
                    this.dataImage = null;
                    this.getChatroomData(parseInt(this.routeElements[4]));
                }
            }

            if (this.routeElements[1] === DIRECT_MESSAGE_PATH || this.routeElements[1] === DIRECT_MESSAGE_MEMBER_PATH) {
                this.data = 'detail';
                this.dataImage = 'single';
                if (this.routeElements[3] === CHATROOM_PATH && this.isNumeric(this.routeElements[4])) {
                    this.dataImage = null;
                    this.getChatroomData(parseInt(this.routeElements[4]));
                } else {
                    if (getDevice() === 'mobile') this.currentView = 'DmFeedView';
                }
            }

            if (this.routeElements[1] === RENEWAL_PATH) {
                this.data = 'detail';
                this.dataImage = 'single';
                this.getCommunityData(parseInt(this.routeElements[2].split('?')[0]));
            }

            if (
                (this.routeElements.length > 2 && this.routeElements[2]?.split('?')[0] === 'success') ||
                this.routeElements[2]?.split('?')[0] === 'failure'
            ) {
                this.data = 'logo';
            }
        }
    }

    isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    toggle() {
        this.toggleDrawer.emit(true);
    }

    toggleProfile() {
        const profileDrawerStatus = this.chatroomService.openHomePageProfileDrawer$$.value;
        this.chatroomService.openHomePageProfileDrawer$$.next(!profileDrawerStatus);
    }

    downloadApp(store: string) {
        const type = store === PLAYSTORE ? ANDROID : IOS;
        this.trackDownloadApp(type);
        if (store === APPSTORE) window.open(environment.appstoreLink, '_blank');
        else if (store === PLAYSTORE) window.open(environment.playstoreLink, '_blank');
    }

    trackDownloadApp(type: string) {
        this.analyticsService.sendEvent(MIXPANEL.DOWNLOAD_APP, {
            source: 'pop_up',
            type,
        });
    }

    copyMessage(): void {
        this.homeFeedService.copyMessages();
    }

    replyMessage(): void {
        this.homeFeedService.updateReplyMessage(this.selectedMsgs[0]);
    }

    editMessage(): void {
        this.homeFeedService.updateEditMessage({
            id: this.selectedMsgs[0].id,
            answer: this.selectedMsgs[0].answer,
            member: { name: 'Edit Message' },
        });
    }

    getChatroomName(chatroom) {
        if (this.user?.id == chatroom?.chatroom_with_user?.id) {
            return chatroom?.member?.name;
        } else {
            return chatroom?.chatroom_with_user?.name;
        }
    }

    getChatroomMemberIdAndState(chatroom) {
        if (this.user?.id == chatroom?.chatroom_with_user?.id) {
            return {
                id: chatroom?.member?.id,
                state: chatroom?.member?.state,
            };
        } else {
            return {
                id: chatroom?.chatroom_with_user?.id,
                state: chatroom?.chatroom_with_user?.state,
            };
        }
    }

    deleteMessage(): void {
        this.homeFeedService.deleteConversation([...this.selectedMsgs.map((msg) => msg.id)], this.chatroomId, this.user.id);
    }

    cancelSelection(): void {
        this.homeFeedService.clearSelectedMsg();
    }

    reportMessage(): void {
        this.homeFeedService.reportMessage(this.selectedMsgs[0].id);
    }

    takeAction(action): void {
        if (this.isNumeric(this.routeElements[1]) && this.routeElements?.length === 2) {
            switch (action.title) {
                case this.COMMUNITY_ACTIONS.COMMUNITY_DETAILS:
                    this.router.navigate([`${COMMUNITY_FEED_PATH}/${this.communityId}/${DETAIL}`]);
                    break;
                case this.COMMUNITY_ACTIONS.MEMBER_DIRECTORY:
                    this.router.navigate([COMMUNITY_FEED_PATH, this.communityId, MEMBER_DIRECTORY_PATH]);
                    break;
                case this.COMMUNITY_ACTIONS.SUBSCRIPTION_STATUS:
                    this.subscriptionService.showMySubscriptions$$.next(true);
                    break;
                case this.COMMUNITY_ACTIONS.INVITE_MEMBERS:
                    this.openInviteMemberFlow();
                    break;
                case ACTIONS_MAP.VIEW_PROFILE:
                    this.viewMemberProfile();
                    break;
                default:
                    this.snackbar.open('Coming Soon...', null, {
                        duration: 4000,
                        panelClass: ['snackbar'],
                    });
            }
        } else {
            switch (action.id) {
                case ACTIONS_MAP.MARK_ACTIVE:
                    this.changeActive(true);
                    break;
                case ACTIONS_MAP.SETTINGS:
                    this.router.navigateByUrl(
                        `/community_feed/${this.currentCommunityData?.id}/${CHATROOM_SETTINGS}?chatroom_id=${this.chatroomId}&&title=${this.chatroomData?.chatroom?.title}`
                    );
                    break;
                case ACTIONS_MAP.MARK_INACTIVE:
                    this.changeActive(false);
                    break;
                case ACTIONS_MAP.UNFOLLOW_CHATROOM:
                    this.homeFeedService.followChatroom(false, this.chatroomId);
                    break;
                case ACTIONS_MAP.VIEW_COMMUNTIY:
                    this.router.navigate([`${COMMUNITY_FEED_PATH}/${this.currentCommunityData?.id}/${DETAIL}`]);
                    break;
                case ACTIONS_MAP.VIEW_PINNED_CHATROOMS:
                    this.router.navigate([COMMUNITY_FEED_PATH, this.currentCommunityData?.id, PINNED]);
                    break;
                case ACTIONS_MAP.MEMBER_DIRECTORY:
                    this.router.navigate([COMMUNITY_FEED_PATH, this.currentCommunityData?.id, MEMBER_DIRECTORY_PATH]);
                    break;
                case ACTIONS_MAP.UNPIN_CHATROOM:
                    this.homeFeedService.pinChatroom(this.chatroomId.toString(), false).subscribe((response) => {
                        if (response.success) {
                            this.snackbar.open('Removed from pinned chat rooms', null, {
                                duration: 4000,
                                panelClass: ['snackbar'],
                            });
                            this.homeFeedService.getCommunityDetail(this.currentCommunityData?.id);
                            this.homeFeedService.getChatroomDetail(this.chatroomId, {});
                        }
                    });
                    break;
                case ACTIONS_MAP.PIN_CHATROOM:
                    this.dialog.open(PinChatroomPopupComponent, {
                        data: {
                            chatroom_id: this.chatroomId,
                            community_id: this.currentCommunityData?.id,
                        },
                        disableClose: true,
                    });
                    break;
                case ACTIONS_MAP.VIEW_PROFILE:
                    this.viewMemberProfile();
                    break;
                case ACTIONS_MAP.BLOCK:
                    this.dialog
                        .open(ConfirmBlockDialogComponent, { panelClass: ['reject-dm-dialog'], data: { name: this.heading } })
                        .afterClosed()
                        .subscribe((res) => {
                            if (res === 'confirm') this.callBlock(0);
                        });
                    break;
                case ACTIONS_MAP.UNBLOCK:
                    this.callBlock(1);
                    break;
                default:
                    this.snackbar.open('Coming Soon', null, {
                        duration: 4000,
                        panelClass: ['snackbar'],
                    });
            }
        }
    }

    callBlock(status) {
        this.dmService.chatroomBlock({ chatroom_id: this.chatroomId, status }).subscribe((res) => {
            if (res?.success) {
                if (status == 1) {
                    this.snackbar.open('Member Unblocked', null, { duration: 2000 });
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else location.reload();
            }
        });
    }

    viewMemberProfile() {
        const chatroomDetails = this.chatRoomMemberIdAndState[this.chatroomId];
        this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_VIEW, {
            community_id: this.currentCommunityData?.id,
            viewed_member_id: chatroomDetails?.id,
            viewed_member_state: chatroomDetails?.state,
            source: 'chatroom',
        });
        this.router.navigateByUrl(`/${COMMUNITY_FEED_PATH}/${this.currentCommunityData?.id}/${PROFILE}/${chatroomDetails?.id}`);
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
            // console.log("This is the url , : ", res);
            this.store.dispatch(StopLoading());
            // const dialog = this.dialog.open(YourResponseComponent, {
            //     panelClass: 'send-response-modal',
            //     data: {
            //         data: this.user,
            //         task: 'shareUrlPopup',
            //         state: this.memberState.state,
            //         url: res,
            //         communityId: this.currentCommunityData.id,
            //     },
            // });
            // dialog.afterClosed().subscribe((response) => {
            //     // if (response) this.confirmLeaveCommunity();
            // });
        });
    }

    openShareUrlPopupMobile() {
        // this.showCancelMembership = false;
        this.store.dispatch(StartLoading());
        // this.utilsService.closeMatBottomSheet$$.next(false);
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

    leaveCommunity() {
        this.store.dispatch(StartLoading());
        this.subscriptionService.cancelSubscription({ community_id: this.communityId }).subscribe((res) => {
            this.subscriptionService.leaveCommunity(`community_id=${this.communityId}`).subscribe((res) => {
                this.store.dispatch(StopLoading());
                console.log(4);
                this.router.navigate([`${BLOCKER}`]);
            });
        });
    }

    changeActive(value): void {
        this.chatroomService
            .changeChatroomActive({
                chatroom_id: this.chatroomId,
                duration: ONE_DAY_SECONDS,
                value,
            })
            .subscribe(
                (resp) => {
                    if (resp.success) {
                        this.homeFeedService.getChatroomDetail(this.chatroomId, {});
                        this.openSnackbar(`Chatroom marked ${value ? 'active' : 'inactive'}`);
                        this.homeFeedService.getInitialCommunityHomeFeedChatrooms(this.currentCommunityData?.id);
                    } else {
                        this.openSnackbar(resp.error_message);
                    }
                },
                (err) => {
                    this.openSnackbar('Something Went Wrong');
                }
            );
    }

    openSnackbar(msg): void {
        this.snackbar.open(msg, null, {
            duration: 4000,
            panelClass: ['snackbar'],
        });
    }

    viewParticipants() {
        this.router.navigateByUrl(`/${this.currentCommunityData?.id}/collabcard/${this.chatroomId}/view_participants`);
    }

    ngOnDestroy() {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

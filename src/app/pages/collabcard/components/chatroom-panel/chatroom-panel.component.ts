import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    PLATFORM_ID,
    Inject,
    Input,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { select, Store } from '@ngrx/store';
import _ from 'lodash';
import { Subject, fromEvent, Subscription, Observable } from 'rxjs';
import { filter, map, startWith, takeUntil, debounceTime, tap } from 'rxjs/operators';

import { State } from '../../../../shared/store/reducers';
import { ResizeService } from '../../../../core/services/resize.service';
import { EventsService } from '../../../../core/services/events.service';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { CommunityService } from '../../../../core/services/community.service';
import { DmService } from 'src/app/core/services/dm.services';
import { VoterListService } from '../../../../core/services/voter-list.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { LocalStorageService } from '../../../../core/services/localstorage.service';
import { CreateChatroomService } from '../../../../core/services/create-chatroom.service';
import { FirebaseDatabaseService } from '../../../../core/services/firebase-database.service';
import { PollChatroomRenameSheetComponent } from '../../../../shared/entryComponents/poll-chatroom-rename-sheet/poll-chatroom-rename-sheet.component';
import { PollChatroomRenamePopupComponent } from '../../../../shared/entryComponents/poll-chatroom-rename-popup/poll-chatroom-rename-popup.component';
import { ScrollDirective } from '../../../../shared/directives/scroll.directive';
import { IUser } from '../../../../shared/models/user.model';
import { IUrlParams } from '../../../../shared/models/auth.model';
import { IChatroom } from '../../../../shared/models/chatroom.model';
import { ICommunity } from '../../../../shared/models/community.model';
import { IMember, IMemberState } from '../../../../shared/models/member.model';
import { SetHeaderAction, StartLoading, StopLoading } from '../../../../shared/store/actions/app.action';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { MEMBER_STATE } from '../../../../shared/enums/member-state.enum';
import { CHATROOM_FOLLOW_SOURCE, LANDING_TYPE, LINK_TYPE, MIXPANEL } from '../../../../shared/enums/mixpanel.enum';
import { CHATROOM_TYPE_CODE, MESSAGE_STATE } from '../../../../shared/enums/chatroom-type.enum';
import { getRedirectUrl } from '../../../../shared/store/selectors/app.selector';
import { BLOCKER, COMMUNITY_QUESTION_PATH } from '../../../../shared/constants/routes.constant';
import {
    ALLOWED_CHATROOM_ACTIONS,
    CHATROOM_TYPE_MAP,
    CHATROOM_SOURCE,
    MESSAGE_TIMESTAMP_LIMIT,
} from '../../../../shared/constants/app-constant';
import { Payload } from '../../../../shared/models/app.model';
import { SessionstorageService } from '../../../../core/services/sessionstorage.service';
import { AwsS3BucketService } from 'src/app/core/services/aws-s3-bucket.service';
import { BuyCommunityMembershipSheetComponent } from 'src/app/shared/entryComponents/buy-community-membership-sheet/buy-community-membership-sheet.component';
import { RejectDmDialogComponent } from '../reject-dm-dialog/reject-dm-dialog.component';
import { ApproveDmRequestDialogComponent } from '../approve-dm-request-dialog/approve-dm-request-dialog.component';
import { getDevice } from 'src/app/shared/utils';
import { CustomSnackbarComponent } from 'src/app/shared/entryComponents/custom-snackbar/custom-snackbar.component';

@Component({
    selector: 'app-chatroom-panel',
    templateUrl: './chatroom-panel.component.html',
    styleUrls: ['./chatroom-panel.component.scss'],
})
export class ChatroomPanelComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(ScrollDirective) scrollDirective;
    @Input() notAMemberFlag;

    screenType: string;
    communityId: string;
    chatroomId: string;
    chatroom: IChatroom;
    community: ICommunity;
    chatroomActions: any[];
    conversationUsers: IMember[];
    conversations: any[] = [];
    user: IUser;
    memberState: IMemberState;
    urlParams: IUrlParams = {};
    fetchShareUrl = '';
    admins: IUser[];
    attendingMembers: any[];
    tagUserData: string;

    events: string[] = [];
    opened: boolean = false;

    ajExpired: boolean = true;
    showFollow = true;
    newMessageCount = 0;
    chatroomInputHeight = '-5px';
    isLoading: boolean;
    prevScrollPos = 0;
    showGoToBottom = false;
    isOverlayActive = true;
    showVotersList: boolean;
    votePollId: number = null;
    isPollSubmitable = false;
    addScrollBehavior = true;
    showPopup = true;
    private destroy$$ = new Subject();
    readonly POPUP_COOKIE = 'showPopup';
    voterListSubscription: any;
    source: string;

    restoreId = 0;
    chatroomParticipantsCount: number;
    newRoom: string = 'false';
    showTagButton = true;
    subscriptions: Subscription[] = [];
    initialLoad = true;
    galleryPopupData;
    preventScrollToBottom: boolean = false;
    introData$ = new Observable();
    showIntroThreadView = false;
    showAttachmentScreenProps: any;
    showMembershipExpiredMessage: boolean = false;
    subscribedCommunities: any;
    accessibleWithoutSubscription: boolean;
    access: boolean;
    // isCommunityPath : boolean = false;

    //This variable is to set the flag , wheter to show the pop or not
    showMediaPopup = false;
    closeMediaPopupSub = false;
    showNewChatroomCommunityDetail: boolean = false;
    currentCommunityId: any = null;
    warning_input: string;
    showApproveRejectDM: boolean = false;
    showChatConversation: boolean = false;
    searchedConversationId: string | number = null;
    previousChatId: string | number = null;
    // isFetchConv: boolean = false;
    fetchDownwardConv: boolean = false;

    dropFiles = [];

    @ViewChild('myScrollContainer') private myScrollContainer: ElementRef;
    @ViewChild('chatroomCard', { static: false }) chatroomCard: ElementRef;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private resizeService: ResizeService,
        private homeFeedService: HomeFeedService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private store: Store<State>,
        private snackbar: MatSnackBar,
        private chatroomService: ChatroomService,
        private communityService: CommunityService,
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionstorageService,
        private firebaseDbService: FirebaseDatabaseService,
        private voterListService: VoterListService,
        private cookieService: CookieService,
        private eventService: EventsService,
        private dialog: MatDialog,
        private sheet: MatBottomSheet,
        private analyticsService: AnalyticsService,
        private createChatroomService: CreateChatroomService,
        private awsS3BucketService: AwsS3BucketService,
        private cdr: ChangeDetectorRef,
        private utilsService: UtilsService,
        private dmService: DmService
    ) {}

    ngOnInit(): void {
        this.initialiseComponent();
        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot),
                tap((_) => {
                    this.clearSubscription();
                })
            )
            .subscribe((route) => {
                this.prevScrollPos = 0;
                this.warning_input = '';
                this.showApproveRejectDM = false;
                this.store.dispatch(SetHeaderAction(new Payload(null))); //to remove previous header

                this.chatroomId = route.params.chatroomId;
                this.dmService.showDmHeader$$.next({ status: false });
                this.source = this.router?.url?.includes('community_feed')
                    ? 'community'
                    : this.router?.url?.includes('direct_message')
                    ? 'dm'
                    : 'home';
                this.newRoom = route.queryParams.newroom;
                this.chatroomParticipantsCount = null;
                this.urlParams = route.queryParams;
                this.initialLoad = true;
                this.showChatConversation = false;
                this.getChatroomDetail(this.chatroomId);

                const conversationIdRouterState = +this.router.getCurrentNavigation()?.extras?.state?.conversationId;

                if (conversationIdRouterState) {
                    this.searchedConversationId = conversationIdRouterState;
                    this.chatroomService.refreshChatroomConversations$$.next({ chatroomId: +this.chatroomId, urlParams: this.urlParams });
                } else {
                    this.chatroomService.refreshChatroomConversations$$.next({ chatroomId: null, urlParams: null });
                    this.searchedConversationId = null;
                }

                this.getConversations();
                this.listenToFirebaseDB();
                this.subscribeToFirebaseService();
                this.subscribeVoterListService();
                this.eventService.showEventAttachmentScreenProps$$.next({ ...this.showAttachmentScreenProps, show: false });
                this.newMessageCount = this.homeFeedService.updateChatroomCount(parseInt(this.chatroomId));
                if (route.queryParams.roomtype === 'poll') this.pollChatRoomName();
                this.homeFeedService.refreshEvent.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
                    if (res) this.refresh();
                });
            });

        // For closing Media Popup :
        this.chatroomService.closeMediaPopup$$.subscribe((res) => {
            this.closeMediaPopupSub = res;
        });

        this.homeFeedService.showIntroThreadView$$.subscribe((res) => {
            if (this.showIntroThreadView !== res) {
                this.showIntroThreadView = res;
                this.cdr.detectChanges();
            }
        });

        this.eventService.showEventAttachmentScreenProps$$.subscribe((res) => {
            this.showAttachmentScreenProps = res;
            this.cdr.detectChanges();
        });

        this.communityService.currentCommunityData$$.subscribe((community) => {
            if (community && community.id !== this.currentCommunityId) {
                this.currentCommunityId = community.id;
            }
        });
    }

    refresh() {
        this.homeFeedService
            .fetchChatroomDetail(this.chatroom.id, { community_id: this.chatroom.community_id, api_type: 1 })
            .subscribe((res) => {
                this.community = res?.community;
                this.chatroomActions = res?.chatroom_actions?.filter((action) => ALLOWED_CHATROOM_ACTIONS.includes(action?.id));
                this.chatroom = res?.chatroom;
                if (this.chatroom?.chat_request_state === 0) {
                    if (this.chatroom?.chat_requested_by[0]?.id === this.user?.id) {
                        this.warning_input = 'Connection request pending. Messaging would be enabled once your request is approved.';
                    } else {
                        this.showApproveRejectDM = true;
                    }
                } else {
                    this.showApproveRejectDM = false;
                }
            });
        this.homeFeedService.getConversations(this.chatroomId, this.urlParams);
    }

    canDM() {
        this.dmService
            .canDM({ community_id: this.community?.id, req_from: 'chatroom', chatroom_id: this.chatroomId })
            .pipe(takeUntil(this.destroy$$))
            .subscribe((res) => {
                if (res?.sucess) {
                    if (res?.show_dm === false) {
                        this.warning_input = 'Direct messaging among members has been disabled by the community manager.';
                    }
                }
            });
    }

    approveDMRequest() {
        this.dialog
            .open(ApproveDmRequestDialogComponent, { panelClass: ['reject-dm-dialog'], data: { chatroom_id: this.chatroom.id } })
            .afterClosed()
            .subscribe((res) => {
                if (res === 'accept') {
                    // location.reload();
                    this.refresh();
                }
            });
    }
    showRejectModal() {
        this.dialog.open(RejectDmDialogComponent, { data: { chatroom: this.chatroom }, panelClass: ['reject-dm-dialog'] });
    }

    initialiseComponent(): void {
        if (isPlatformBrowser(this.platformId)) this.screenType = getDevice();

        this.getSubscribedCommunityMeta();

        this.resizeService.onResize$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.screenType = getDevice();
        });

        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.awsS3BucketService.pauseUpload();

        this.homeFeedService.conversationGroups$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            const previosChatIdCopy = +this.previousChatId;
            this.previousChatId = this.activatedRoute.snapshot.params.chatroomId;
            if (+this.chatroomId && res.removeCache?.length && +this.chatroomId !== previosChatIdCopy) {
                const resCopy = _.cloneDeep(res);
                for (let x of resCopy.removeCache) {
                    if (+x !== +this.chatroomId) {
                        resCopy[x] = [];
                        resCopy['removeCache'] = resCopy.removeCache?.filter((cacheId) => +cacheId !== +x);
                    }
                }
                this.homeFeedService.updateConversationGroup(resCopy);
            }

            // if (
            //     +this.chatroomId &&
            //     res.removeCache &&
            //     +this.chatroomId !== +route.params.chatroomId &&
            //     res.removeCache?.includes(+this.chatroomId)
            // ) {
            //     const resCopy = _.cloneDeep(res);
            //     for (let x of resCopy.removeCache) {
            //         delete resCopy[x];
            //     }
            //     delete resCopy['removeCache'];
            //     console.log(res, resCopy);
            //     this.done = true;
            //     this.homeFeedService.updateConversationGroup(resCopy);
            // }
        });

        this.chatroomService.scrollToBottom$$.subscribe((res) => {
            if (res) {
                this.chatroomService.scrollToBottom$$.next(false);
                this.scrollToBottom();
            }
        });

        this.chatroomService.micropollUpdated$$.subscribe((res) => {
            if (res) {
                this.updateConversations();
                this.chatroomService.micropollUpdated$$.next(false);
            }
        });

        this.chatroomService.refreshChatroomConversations$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            if (res.chatroomId) this.fetchDownwardConv = true;
            else this.fetchDownwardConv = false;
        });

        // this.chatroomService.fetchUpdatedConversations$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
        //     if (res.fetch) {
        //         this.isFetchConv = true;
        //         this.searchedConversationId = null;
        //         this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        //         this.router.navigate([`/${this.currentCommunityId}/collabcard/${this.chatroomId}`]);
        //         // setTimeout(() => {
        //         this.chatroomService.fetchUpdatedConversations$$.next({ chatroomId: this.chatroom.id, fetch: false, fetched: true });
        //         // }, 1000);
        //         // this.getConversations();
        //     } else this.isFetchConv = false;
        //     // if (!res.fetch && !res.fetched) this.scrollToBottom();
        // });
    }

    checkAccess(chatroomId): void {
        this.access = this.localStorageService.getSavedState(STORAGE_KEY.ACCESS)?.access;

        this.chatroomService
            .fetchAccessChatroom(chatroomId)
            .pipe(takeUntil(this.destroy$$))
            .subscribe((response) => {
                if (response?.remove_state === 1) {
                    if (this.user && !this.access) {
                        this.store.dispatch(StartLoading());
                        this.homeFeedService.memberRemovedFromCommunityData$$.next(response);
                        // this.router.navigate([`${BLOCKER}`]);
                    } else {
                        this.localStorageService.setSavedState(true, STORAGE_KEY.RELOAD);
                        window.location.href = window.location.origin;
                        return;
                    }
                }
            });

        /// NEW BLOCK

        if (!this.community?.is_paid) {
            this.showMembershipExpiredMessage = false;

            if (this.memberState?.state == 1 || this.memberState?.state == 4) {
                return;
            } else {
                if (!this.chatroom?.access_without_subscription) {
                    this.openSnackbar('Chatroom inaccessible to non members');
                    // this.router.navigate(['/']);
                    return;
                } else {
                    return;
                }
            }
        }

        this.showMembershipExpiredMessage = false;

        if (!this.chatroom?.access_without_subscription) {
            this.chatroomService.accessibleWithoutSubscription$$.next(false);
            this.accessibleWithoutSubscription = false;
        }

        if (this.chatroom?.access_without_subscription) {
            this.chatroomService.accessibleWithoutSubscription$$.next(true);
            this.accessibleWithoutSubscription = true;
        }

        this.homeFeedService.subscribedCommunitiesMetaGroup$.subscribe((subscribedCommunities) => {
            this.subscribedCommunities = subscribedCommunities;

            if (this.subscribedCommunities[this.community?.id]) {
                if (this.subscribedCommunities[this.community?.id]?.membership_state === 1) {
                    // SHOW DIFFERENT TEXT RENEW ONE
                    this.chatroomService.membershipIsExpired$$.next(true);

                    if (this.chatroom?.type != 2 && this.chatroom?.type != 6) {
                        this.chatroomService.feedChatroomCardTapped$$.subscribe((res) => {
                            if (!res) {
                                this.chatroomService.showNewChatroomCommunityDetail$$.next(true);
                                let data = {
                                    community: this.community,
                                    buyMembershipUrl: this.community?.website_url,
                                    chatroom_type: this.chatroom?.type,
                                    accessibleWithoutSubscription: this.accessibleWithoutSubscription,
                                };
                                this.communityService.sendAccessDataToBottomSheet$$.next(data);
                            } else this.chatroomService.showNewChatroomCommunityDetail$$.next(false);
                        });

                        if (!this.chatroom?.access_without_subscription) {
                            this.showMembershipExpiredMessage = true;
                            if (this.screenType == 'mobile') {
                                if (this.chatroom?.type != 2 && this.chatroom?.type != 6) {
                                    let data = {
                                        community: this.community,
                                        showExpiredMembershipMessage: 'showExpiredMembershipMessage',
                                    };
                                    this.openChatroomDetailBottomSheet(data);
                                }
                            }
                        }
                    }
                }
            } else if (this.memberState?.state === 0) {
                this.chatroomService.membershipIsExpired$$.next(false);
                this.chatroomService.feedChatroomCardTapped$$.subscribe((res) => {
                    if (!res) {
                        if (window.location.href.split('/').length > 4) {
                            this.chatroomService.showNewChatroomCommunityDetail$$.next(true);
                        }

                        /// DATA FOR BOTTOM SHEET
                        if (this.chatroom?.type != 2 && this.chatroom?.type != 6) {
                            let data = {
                                community: this.community,
                                buyMembershipUrl: this.community?.website_url,
                                chatroom_type: this.chatroom?.type,
                                accessibleWithoutSubscription: this.accessibleWithoutSubscription,
                            };
                            this.communityService.sendAccessDataToBottomSheet$$.next(data);
                        }
                    } else this.chatroomService.showNewChatroomCommunityDetail$$.next(false);
                });

                this.showMembershipExpiredMessage = false;
            } else {
                this.showMembershipExpiredMessage = false;
                return;
            }
        });
    }

    openChatroomDetailBottomSheet(data) {
        let backdropClass = data?.accessibleWithoutSubscription ? '' : 'blurr-backdrop';

        let sheet = this.sheet.open(BuyCommunityMembershipSheetComponent, {
            // panelClass: 'send-response-modal',
            data: data,
            disableClose: true,
            backdropClass: backdropClass,
        });
        this.utilsService.closeMatBottomSheet$$.subscribe((res) => {
            if (res) sheet.dismiss();
        });
    }

    getSubscribedCommunityMeta() {
        this.homeFeedService.subscribedCommunitiesMetaGroup$.subscribe((subscribedCommunities) => {
            this.subscribedCommunities = subscribedCommunities;
        });
    }

    dropImage(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        this.dropFiles = files;
    }

    dragImage(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    ngAfterViewInit(): void {
        this.listenToScroll();
        this.setChatroomHeight();
    }

    fireFbPixelEvent() {
        // this.fbPixelService.registerPixelEvent('trackCustom', 'ViewContent', {
        //     community_id: this.sessionStorageService.getSessionState(STORAGE_KEY.COMMUNITY).id,
        //     page: 'chatroom',
        // });
    }

    toggleAttachmentDrawer(sideDrawerProps) {
        if (this.screenType === 'desktop') sideDrawerProps.toggle();
        else if (this.screenType === 'mobile') {
            this.eventService.showEventAttachmentScreenProps$$.next({ ...this.showAttachmentScreenProps, show: true });
        }
    }

    onScrollIntroThread() {
        this.homeFeedService.fetchUnreadPreviews(this.chatroom?.id);
    }

    storeUrl() {
        this.activatedRoute.queryParams.subscribe((res) => {
            this.localStorageService.setSavedState({ path: location.pathname, queryParams: res }, STORAGE_KEY.URL_PATTERN);
        });
    }

    openRenewal() {
        if (this.screenType === 'mobile') {
            this.router.navigate(['/renewal/' + this.community?.id], { queryParams: { renew: true, user_id: this.user.id } });
        } else {
            this.router.navigate(['/community_feed/' + this.community?.id + '/renewal/' + this.community?.id], {
                queryParams: { renew: 'true', user_id: this.user.id },
            });
        }
    }

    getChatroomDetail(chatroomId: number | string) {
        this.subscriptions.push(
            this.homeFeedService.chatroomDetailGroup$.subscribe((chatroomList) => {
                if (chatroomList[chatroomId]) {
                    let response = chatroomList[chatroomId];
                    if (response && !_.isEqual(response.chatroom, this.chatroom)) {
                        if (response?.chatroom?.aj_expired) this.ajExpired = response?.aj_expired;
                        else this.ajExpired = null;

                        //  Secret chatroom not accessable
                        if (response.chatroom.is_secret && !response.can_access_secret_chatroom) {
                            this.router.navigateByUrl('/');
                        }

                        this.sessionStorageService.setSessionState(STORAGE_KEY.COMMUNITY, response.community);
                        this.sessionStorageService.setSessionState(STORAGE_KEY.CHATROOM, response.chatroom);
                        //fire fb pixel event after getting community ID
                        this.fireFbPixelEvent();
                        this.chatroomParticipantsCount = response.participant_count;
                        this.chatroom = response.chatroom;
                        this.community = response.community;
                        if (this.chatroom.type === 10 && this.chatroom.is_private_member === true) this.canDM();
                        if (this.chatroom?.chat_request_state === 0) {
                            if (this.chatroom?.chat_requested_by[0]?.id === this.user?.id) {
                                this.warning_input =
                                    'Connection request pending. Messaging would be enabled once your request is approved.';
                            } else {
                                this.showApproveRejectDM = true;
                            }
                        }
                        // else if (this.chatroom?.chat_request_state === 2) {
                        //     this.warning_input = 'You can not respond to a rejected connection. Approve to send a message.';

                        // }
                        if (!this.user) this.homeFeedService.updateCommunityDetail(this.community);
                        this.chatroomActions = response?.chatroom_actions?.filter((action) =>
                            ALLOWED_CHATROOM_ACTIONS.includes(action?.id)
                        );

                        this.conversationUsers = response.conversation_users;
                        this.checkChatroomAccess(this.chatroom?.community_id, this.user?.id);

                        // MixPanel
                        const payload: any = {
                            chatroom_id: this.chatroomId,
                            community_id: this.chatroom?.community_id,
                            chatroom_type: CHATROOM_TYPE_MAP[this.chatroom?.type],
                            source: CHATROOM_SOURCE[this.source],
                        };

                        if (this.urlParams.source) {
                            payload.source = this.urlParams.source;
                        }
                        if (this.urlParams?.source_analytics) {
                            payload.source = this.urlParams?.source_analytics;
                        }

                        if (this.urlParams.source_chatroom_id) {
                            payload.source_chatroom_id = this.urlParams.source_chatroom_id;
                        }

                        if (this.urlParams.source_community_id) {
                            payload.source_community_id = this.urlParams.source_community_id;
                        }

                        this.analyticsService.sendEvent(MIXPANEL.CHATROOM_OPENED, payload);
                        if (this.chatroom?.type === CHATROOM_TYPE_CODE.CARD_INTRODUCTIONS) {
                            const introductionRoomPayload = {
                                source: CHATROOM_SOURCE[this.source],
                                community_id: this.chatroom.community_id,
                            };
                            if (this.urlParams?.source_analytics) {
                                introductionRoomPayload.source = this.urlParams?.source_analytics;
                            }
                            this.analyticsService.sendEvent(MIXPANEL.INTRODUCTION_OPENED, introductionRoomPayload);
                        }
                        if (this.chatroom?.type === CHATROOM_TYPE_CODE.CARD_INTRO) {
                            let introRoomPayloadSource = CHATROOM_SOURCE[this.source];

                            if (this.urlParams?.intro_source_analytics) introRoomPayloadSource = this.urlParams?.intro_source_analytics;

                            const introRoomPayload = {
                                source: introRoomPayloadSource,
                            };
                            this.analyticsService.sendEvent(MIXPANEL.INTRO_ROOM_OPENED, introRoomPayload);
                        }

                        this.analyticsService.sendEvent(MIXPANEL.WEB_PAGE_VIEW, {
                            landing_type: LANDING_TYPE.CHATROOM_JOIN,
                            // link_type: this.urlParams.aj,
                            link_type: this.urlParams.aj
                                ? this.ajExpired
                                    ? LINK_TYPE.PRIVATE_EXPIRED
                                    : LINK_TYPE.PRIVATE_ACTIVE
                                : LINK_TYPE.PUBLIC,
                            user_id: this.user && this.user.id,
                            community_id: this.community?.id,
                            utm_source: this.urlParams.utm_source,
                            utm_campaign: this.urlParams.utm_campaign,
                            utm_content: this.urlParams.utm_content,
                            shared_by: this.urlParams.source || null,
                            distinct_id: this.user && this.user.id,
                        });
                    }
                } else {
                    if (!this.user) {
                        this.storeUrl();
                        if (
                            window.location.pathname.split('/')[2] === 'collabcard' ||
                            (window.location.pathname.split('/')[1] === 'event_feed' &&
                                window.location.pathname.split('/')[2] === 'collabcard')
                        ) {
                            this.handleChatroomSharing(chatroomId);
                        } else {
                            this.router.navigate(['/auth']);
                        }
                    } else this.homeFeedService.getChatroomDetail(chatroomId, this.urlParams);
                }
            })
        );
    }

    handleChatroomSharing(chatroomId): void {
        this.chatroomService.fetchAccessChatroom(chatroomId).subscribe((response) => {
            // IF FREE COMMUNITY THEN IN THIS CASE REDIRECT TO LOGIN SCREEN ///

            if (!response?.community?.is_paid) {
                this.storeUrl();
                this.router.navigate(['/auth']);
                return;
            }

            this.chatroomService.showNewChatroomCommunityDetail$$.next(true);
            this.showNewChatroomCommunityDetail = true;
            if (response?.access_without_subscription) {
                this.chatroomService.accessibleWithoutSubscription$$.next(true);
            } else if (!response?.access_without_subscription) {
                this.chatroomService.accessibleWithoutSubscription$$.next(false);
            }
            this.homeFeedService.watchCommunity$$.next([response?.community]);
        });
    }

    checkChatroomAccess(community_id: number | string, member_id: number | string) {
        this.communityService
            .getMemberState({ community_id, member_id })
            .pipe(takeUntil(this.destroy$$))
            .subscribe((response) => {
                this.memberState = response;
                this.store.dispatch(StopLoading());
                if ([CHATROOM_TYPE_CODE.CARD_PRIVATE_EVENT, CHATROOM_TYPE_CODE.CARD_PUBLIC_EVENT].includes(this.chatroom?.type)) {
                    this.getMembersAttendingEvent(community_id, this.chatroom?.id);
                }
                this.getCommunityAdmins(community_id);

                this.checkAccess(this.chatroom?.id);
            });
    }

    pollChatRoomName() {
        if (this.screenType !== 'mobile') {
            const dialogRef = this.dialog
                .open(PollChatroomRenamePopupComponent, {
                    data: {
                        message: 'Join community to get the updates on the conversations. ',
                    },
                    disableClose: true,
                    panelClass: 'event-join-community-popup',
                })
                .afterClosed()
                .subscribe((resdata) => {
                    this.updateChatRoom(resdata);
                });
        } else {
            const sheet = this.sheet.open(PollChatroomRenameSheetComponent, {
                data: {
                    message: 'Join community to get the updates on the conversations. ',
                },
                disableClose: true,
            });
            sheet.afterDismissed().subscribe((resdata) => {
                this.updateChatRoom(resdata);
            });
        }
    }

    updateChatRoom(crName: string) {
        const formData = new FormData();
        formData.append('header', crName);
        formData.append('chatroom_id', this.chatroomId);
        formData.append('first_time_rename', 'true');

        this.createChatroomService.renameChatRoom(formData).subscribe((resData) => {
            let currentUrl = `/${this.currentCommunityId}/collabcard/${this.chatroomId}`;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([currentUrl]);
            });
        });
    }

    tagUser() {
        this.tagUserData = '@';
        this.showTagButton = false;
    }

    setChatroomHeight() {
        this.chatroomCard.nativeElement.style['min-height'] = `${window.innerHeight - 125}px`;
    }

    onScrolledUp() {
        const lastConversation_id = this.conversations && this.conversations.length ? this.conversations[0].id : null;

        if (!this.isLoading && +this.restoreId !== +lastConversation_id) {
            this.fetchMoreConversation(0);
        }
    }

    onScrolledDown() {
        if (this.fetchDownwardConv && this.searchedConversationId) this.fetchMoreConversation(1);
    }

    listenToScroll(): void {
        fromEvent(this.myScrollContainer.nativeElement, 'scroll')
            .pipe(takeUntil(this.destroy$$), debounceTime(100))
            .subscribe((e: any) => {
                const scrollContainer = this.myScrollContainer.nativeElement;
                const elementScrollTop = e.target.scrollTop;
                this.showGoToBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight > 100;
                if (!this.showGoToBottom) {
                    this.newMessageCount = 0;
                }
                this.prevScrollPos = elementScrollTop;
            });
    }

    preventScrollToBottomFunc(event) {
        this.preventScrollToBottom = event;
    }

    getCommunityAdmins(community_id) {
        this.communityService
            .getCommunityAdminList({ community_id })
            .pipe(takeUntil(this.destroy$$))
            .subscribe((response) => (this.admins = response.members));
    }

    getMembersAttendingEvent(community_id, collabcard_id) {
        this.eventService
            .getMembersAttendingEvent({ page: 1, community_id, collabcard_id })
            .pipe(takeUntil(this.destroy$$))
            .subscribe((response) => (this.attendingMembers = response && response.members));
    }

    getConversations() {
        this.isLoading = true;
        if (this.searchedConversationId)
            this.homeFeedService.getSearchConversations(+this.chatroomId, +this.searchedConversationId, this.urlParams);
        else this.homeFeedService.getConversations(this.chatroomId, this.urlParams);
        this.subscriptions.push(
            this.homeFeedService.conversationGroups$.subscribe((response) => {
                this.isLoading = false;
                this.conversations = response[this.chatroomId] || [];
                if (!this.preventScrollToBottom) {
                    if (this.restoreId) {
                        this.restoreScroll();
                    }
                    if (this.initialLoad && this.searchedConversationId) {
                        const searchedConversationIdCopy = +this.searchedConversationId;
                        this.showChatConversation = true;
                        this.initialLoad = false;
                        this.chatroomService.showMessageHighlight$$.next({
                            messageId: searchedConversationIdCopy,
                            show: true,
                            scrollToMessage: true,
                        });
                    } else if ((this.initialLoad || this.newMessageCount) && this.conversations?.length) this.scrollToBottom();
                }

                this.preventScrollToBottom = false;
            })
        );
    }

    updateConversations() {
        this.isLoading = true;
        this.homeFeedService.fetchConvoAfterMicropollSubmission(this.chatroomId, this.urlParams);
        this.subscriptions.push(
            this.homeFeedService.conversationGroups$.subscribe((response) => {
                this.isLoading = false;
                this.conversations = response[this.chatroomId] || [];
                if (!this.preventScrollToBottom) {
                    if (this.restoreId) {
                        this.restoreScroll();
                    }
                    if ((this.initialLoad || this.newMessageCount) && this.conversations?.length) this.scrollToBottom();
                }
                this.preventScrollToBottom = false;
            })
        );
    }

    listenToFirebaseDB(): void {
        this.firebaseDbService.listenToDb(this.chatroomId);
    }

    subscribeToFirebaseService() {
        this.subscriptions.push(
            this.firebaseDbService.message$
                .pipe(filter((res) => !!res && res.conversations && res.conversations.length))
                .subscribe((msg) => {
                    this.newMessageCount = this.newMessageCount + msg.conversations.length;
                    this.homeFeedService.updateConversation(msg.conversations);
                    // if (!this.showGoToBottom) this.scrollToBottom();
                })
        );
    }

    subscribeVoterListService() {
        this.voterListSubscription = this.voterListService.votersListParamsState.subscribe((data) => {
            this.showVotersList = data.showVotersList;
            this.votePollId = data.pollId;
        });
    }

    fetchMoreConversation(direction, followingChatroom = false): void {
        if (
            (this.conversations && this.conversations.length && this.conversations[0].state !== MESSAGE_STATE.FIRST_MESSAGE) ||
            followingChatroom
        ) {
            this.isLoading = true;
            const obj = {
                ...this.urlParams,
                conversation_id: null,
                scroll_direction: null,
            };
            this.restoreId = 0;
            if (direction === 0) {
                obj.conversation_id = this.conversations && this.conversations.length ? this.conversations[0].id : null;
                obj.scroll_direction = '0';
                this.restoreId = obj.conversation_id;
            } else if (direction === 1) {
                const lastConversationId =
                    this.conversations && this.conversations.length ? this.conversations[this.conversations.length - 1].id : null;
                if (lastConversationId > MESSAGE_TIMESTAMP_LIMIT) {
                    this.isLoading = false;
                    return;
                }
                obj.conversation_id = lastConversationId;
                obj.scroll_direction = '1';
            }
            this.isLoading = false;
            this.homeFeedService.getConversations(this.chatroomId, obj, null, true);
        }
    }

    findLastSeen(conversations): void {
        const selectedMsg = conversations.find((conversation) => conversation.last_seen);
        if (this.initialLoad && selectedMsg) {
            this.initialLoad = false;
            this.scrollToMessage(selectedMsg.id);
        }
    }

    scrollToMessage(id: string): void {
        if (id) {
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView();
                }
            }, 500);
        }
    }

    restoreScroll(): void {
        this.addScrollBehavior = false;
        this.scrollDirective.prepareFor('up');

        setTimeout(() => {
            this.scrollDirective.restore();
            // this.restoreId = 0;
            this.addScrollBehavior = true;
        });
    }

    scrollToBottom(): void {
        setTimeout(() => {
            try {
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
                this.newMessageCount = 0;
                this.showChatConversation = true;
                this.initialLoad = false;
            } catch (err) {}
        }, 400);
    }

    followChatroom(followStatus: boolean): void {
        if (!this.user) {
            this.analyticsService.sendEvent(MIXPANEL.CHATROOM_FOLLOW_BEFORE_LOGIN, {
                chatroom_id: this.chatroomId,
                community_id: this.community.id,
                chatroom_type: CHATROOM_TYPE_MAP[this.chatroom?.type],
            });
            this.router.navigateByUrl('/auth');
            return;
        }

        this.showFollow = false;

        this.chatroomService
            .followChatroom(this.chatroomId, this.user.id, followStatus, this.urlParams?.aj, this.urlParams?.source_id)
            .pipe(filter((res) => !!res && res.success))
            .subscribe(
                (response) => {
                    if (response) {
                        this.homeFeedService.getHomeFeedUpdate(this.chatroomId);
                        this.homeFeedService.getChatroomDetail(this.chatroomId, {});
                        this.fetchMoreConversation(1, true);
                    }

                    let chatroomType: string;
                    if (this.chatroom.type === 0) chatroomType = 'normal';
                    else if (this.chatroom.type === 1) chatroomType = 'poll';
                    else chatroomType = 'event';
                    this.analyticsService.sendEvent(MIXPANEL.CHATROOM_FOLLOWED, {
                        chatroom_id: this.chatroomId,
                        community_id: this.community.id,
                        chatroom_type: chatroomType,
                        source: CHATROOM_FOLLOW_SOURCE.CHATROOM_TELESCOPE,
                    });
                    this.openSnackbar(`You ${followStatus ? 'followed' : 'unfollowed'} this chatroom`);
                    this.chatroomService.hideChatroomFollowButton$$.next({ chatroom_id: this.chatroom?.id, status: followStatus });
                },
                (error) => {
                    this.store.dispatch(StopLoading());
                    this.showFollow = true;
                    this.openSnackbar('Something went wrong');
                }
            );
    }

    muteChatroom(muteStatus): void {
        if (!this.user) {
            return;
        }
        this.store.dispatch(StartLoading());
        this.chatroomService.muteChatroom(this.chatroomId, muteStatus).subscribe(
            (resp) => {
                if (resp.success) {
                    this.homeFeedService.getChatroomDetail(this.chatroomId, {});
                    this.openSnackbar(`You ${!muteStatus ? 'followed' : 'unfollowed'} this chatroom`);
                    this.homeFeedService.getInitialCommunityHomeFeedChatrooms(this.chatroom?.community_id);
                    this.store.dispatch(StopLoading());
                } else {
                    this.openSnackbar(resp.error_message);
                    this.store.dispatch(StopLoading());
                }
            },
            (err) => {
                this.store.dispatch(StopLoading());
                this.openSnackbar('Something Went Wrong');
            }
        );

        this.homeFeedService.getChatroomDetail(this.chatroomId, {});
        this.openSnackbar(`You ${!muteStatus ? 'followed' : 'unfollowed'} this chatroom`);
        this.homeFeedService.getInitialCommunityHomeFeedChatrooms(this.chatroom?.community_id);
        this.store.dispatch(StopLoading());
    }

    openSnackbar(msg): void {
        if (this.screenType === 'mobile')
            this.snackbar.open(msg, null, {
                duration: 3000,
                panelClass: ['black-bottom-event-attachment-snackbar'],
            });
        else
            this.snackbar.openFromComponent(CustomSnackbarComponent, {
                duration: 3000,
                panelClass: ['black-bottom-left-snackbar'],
                data: msg,
            });
    }

    addNewMessage(event): void {
        const messages = [event];
        this.homeFeedService.updateConversation(messages);
        this.showPopup = !this.cookieService.check(this.POPUP_COOKIE);
        if (this.memberState?.state === MEMBER_STATE.NOT_A_MEMBER && this.showPopup) {
            this.showPopup = false;
            this.cookieService.set(this.POPUP_COOKIE, `${this.showPopup}`, 0.16); // 0.16 is 4 hours (4/24)
            this.openJoinCommunityPopup();
        }
        this.scrollToBottom();
    }

    joinCommunity(): void {
        if (this.user) {
            this.router.navigate([`${COMMUNITY_QUESTION_PATH}/${this.community.id}`], { queryParams: this.urlParams });
            return;
        } else if (!this.user) {
            let redirectUrl = '';
            this.store.pipe(select(getRedirectUrl)).subscribe((url) => (redirectUrl = url));
            if (redirectUrl.includes('?')) {
                redirectUrl = `${redirectUrl}&page=generate_otp`;
            } else {
                redirectUrl = `${redirectUrl}?page=generate_otp`;
            }
            this.router.navigateByUrl(`${redirectUrl}`);
            return;
        }
    }

    setChatroomInputHeight(event): void {
        this.chatroomInputHeight = `${event - 115}px`;
    }

    openJoinCommunityPopup(): void {
        // if (this.screenType !== 'mobile') {
        //   const dialogRef = this.dialog.open(EventJoinCommunityPopupComponent, {
        //     data: {
        //       chatroom: this.chatroom,
        //       community: this.community,
        //       admins: this.admins,
        //       message: 'Join community to get the updates on the conversations. '
        //     },
        //     panelClass: 'event-join-community-popup'
        //   });
        //   dialogRef.afterClosed().pipe(take(1), filter(resp => !!resp)).subscribe(resp => {
        //     this.trackDownloadApp();
        //     const newTab = window.open('', '_blank');
        //     newTab.location.href = this.fetchShareUrl;
        //   });
        // } else {
        //   const sheet = this.sheet.open(EventJoinCommunitySheetComponent, {
        //     data: {
        //       chatroom: this.chatroom,
        //       community: this.community,
        //       admins: this.admins,
        //       message: 'Join community to get the updates on the conversations. '
        //     }
        //   });
        //   sheet.afterDismissed().pipe(take(1), filter(resp => !!resp)).subscribe(_ => {
        //     this.trackDownloadApp();
        //     const newTab = window.open('', '_blank');
        //     newTab.location.href = this.fetchShareUrl;
        //   });
        // }
    }

    openMediaGallery(evt) {
        this.galleryPopupData = evt;
    }

    closeMediaPopup() {
        this.showMediaPopup = false;
    }

    clearSubscription() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions = [];
    }

    ngOnDestroy(): void {
        this.clearSubscription();
        this.destroy$$.next(null);
        this.destroy$$.complete();
        this.voterListSubscription.complete();
    }
}

import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { filter, startWith, take, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { IUser } from 'src/app/shared/models/user.model';
import { Payload } from '../../shared/models/app.model';
import { SetHeaderAction } from '../../shared/store/actions/app.action';
import { State } from '../../shared/store/reducers';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import {
    AUTH_PATH,
    BLOCKER,
    CHATROOM_PATH,
    COLLABCARD_PATH,
    COMMUNITY_FEED_PATH,
    DIRECT_MESSAGE_MEMBER_PATH,
    DIRECT_MESSAGE_PATH,
    EVENT_CHATROOM_PATH,
    EVENT_FEED_PATH,
    PAGE_NOT_FOUND_PATH,
    RENEWAL_PATH,
    ROOT_PATH,
} from 'src/app/shared/constants/routes.constant';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { MessagingService } from 'src/app/core/services/messaging.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { EventFeedService } from 'src/app/core/services/event-feed.service';
import { EventsService } from 'src/app/core/services/events.service';
import { CommunityService } from 'src/app/core/services/community.service';

import { AuthService } from 'src/app/core/services/auth.service';
import { COMMMUNITY_OPENED } from 'src/app/shared/constants/app-constant';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AllowGuideDialogComponent } from 'src/app/shared/entryComponents/allow-guide-dialog/allow-guide-dialog.component';
import { AllowNotificationDialogComponent } from 'src/app/shared/entryComponents/allow-notification-dialog/allow-notification-dialog.component';
import { DmService } from 'src/app/core/services/dm.services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') private drawer: ElementRef;
    hideSideBar = false;
    hideHeader: boolean = false;
    showFullHeight: boolean = false;
    chatroomId: any;
    routeElements: any;
    changeAppHeader: boolean = false;
    user: IUser;
    message: any;
    screenType: string;
    page: any;
    fullHeightSection = false;
    is_cm = false;
    activeTab: string;
    userPaid = true;
    private destroy$$ = new Subject();
    paymentStatus: any;
    showAttachmentScreenProps: any;
    user_exist: boolean;
    isChatroom: boolean = false;
    isEventFeed: boolean = false;
    isHomeFeed: boolean = false;
    isDM: boolean = false;
    backgroundBackdropEnabled: boolean = false;
    communityEvent: any;
    communityId: string | number;
    showDmButton: boolean = false;
    unreadDmCount: number = 0;
    hide_dm_text: string;
    show_dm_text: boolean = false;

    constructor(
        private store: Store<State>,
        private router: Router,
        private localStorageService: LocalStorageService,
        private route: ActivatedRoute,
        private homeFeedService: HomeFeedService,
        private messagingService: MessagingService,
        private _notificationSvc: NotificationService,
        public chatroomService: ChatroomService,
        public eventFeedService: EventFeedService,
        private eventsService: EventsService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        public utilsService: UtilsService,
        private cookieService: CookieService,
        private dialog: MatDialog,
        private communityService: CommunityService,
        private dmService: DmService
    ) {}

    ngOnInit(): void {
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.user_exist = this.localStorageService.getSavedState(STORAGE_KEY.USER_EXIST)?.access;

        this.communityService.currentCommunityData$$.pipe(takeUntil(this.destroy$$)).subscribe((data) => {
            if (data) {
                if (this.communityId !== data?.id) this.communityId = data?.id;
                this.fetchDmHomeFeedInfo(this.communityId);
            }
        });

        this.updateFCMTockent();

        // let user = this.user;
        // if (user) {
        //     this.homeFeedService.getMyCommunities(1);
        // }

        this.store.dispatch(SetHeaderAction(new Payload(null)));

        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';

        this.homeFeedService.backgroundBackdropEnabled$$.subscribe((res) => {
            this.backgroundBackdropEnabled = res;
        });

        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router)
            )
            .subscribe((route: any) => {
                if (route?.url === '/' || route?.urlAfterRedirects === '/') {
                    if (this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER)) {
                        this.router.navigate([`/${this.cookieService?.get(COMMMUNITY_OPENED)}`]);
                    } else {
                        // this.router.navigate([`/${AUTH_PATH}`]);
                    }
                }

                if (route.url.includes(`/${COMMUNITY_FEED_PATH}?community_id`)) this.redirectWithCommunityIdQueryParam(route);

                this.routeElements = route.url.split('/');
                if (route?.url?.includes(`${COLLABCARD_PATH}`)) this.isChatroom = true;
                else this.isChatroom = false;
                if (this.routeElements[1] === EVENT_FEED_PATH) {
                    this.activeTab = `${EVENT_FEED_PATH}`;
                    if (this.routeElements?.length === 3) this.isEventFeed = true;
                    else this.isEventFeed = false;
                } else if (this.routeElements[1] === DIRECT_MESSAGE_PATH || this.routeElements[1] === DIRECT_MESSAGE_MEMBER_PATH) {
                    this.activeTab = 'direct-message';
                    if (this.routeElements?.length === 3) this.isDM = true;
                    else this.isDM = false;
                } else {
                    this.activeTab = 'home-feed';
                    if (Number(+this.routeElements[1]) && this.routeElements?.length === 2) this.isHomeFeed = true;
                    else this.isHomeFeed = false;
                }

                this.chatroomId = this.routeElements[2];
                if (this.routeElements[1] === RENEWAL_PATH) {
                    this.hideSideBar = true;
                    if (!this.user_exist) {
                        this.hideHeader = true;
                        this.showFullHeight = true;
                    }
                    this.changeAppHeader = false;
                    if (this.screenType === 'mobile') {
                        this.fullHeightSection = true;
                    }
                } else if (this.routeElements[3] === 'detail') {
                    if (this.screenType === 'mobile') {
                        this.changeAppHeader = true;
                    }
                } else {
                    this.hideSideBar = false;
                    this.changeAppHeader = false;
                }
            });

        this.store.dispatch(SetHeaderAction(new Payload(null)));

        this.route.queryParams.subscribe((params: Params) => {
            this.page = params;
            if (JSON.stringify(params) == '{}') {
                if (this.localStorageService.getSavedState(STORAGE_KEY.ACCESS) != null) {
                    const { access } = JSON.parse(localStorage.getItem(STORAGE_KEY.ACCESS));
                    if (!access) {
                        let urlPattern = JSON.parse(localStorage.getItem(STORAGE_KEY.URL_PATTERN));
                        let path = window.location.pathname;
                        if (urlPattern !== null && Object.keys(urlPattern)?.length !== 0) {
                            // paid event page
                            if (urlPattern.path === `/${EVENT_CHATROOM_PATH}`) {
                                this.userPaid = false;

                                if (!this.localStorageService.getSavedState('isPaymentStatus')) {
                                    this.router.navigate([`${urlPattern.path}`], { queryParams: urlPattern.queryParams });
                                } else {
                                    this.router.navigate([`${COLLABCARD_PATH}/${urlPattern.queryParams.chatroom_id}`]);
                                }
                            }
                        }

                        if (path?.split('/')[2] == COLLABCARD_PATH) {
                            if (this.isNumeric(path.split('/')[3])) {
                                this.router.navigate([`/${path.split('/')[1]}/${CHATROOM_PATH}/${path.split('/')[3]}`]);
                            } else {
                                this.router.navigate([`${PAGE_NOT_FOUND_PATH}`]);
                            }
                            return;
                        } else {
                            console.log(3);
                            this.router.navigate([`/${BLOCKER}`]);
                        }
                    }
                }
            }
        });
        document.addEventListener('visibilitychange', () => {
            // if (this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER) === null) {
            //     const otp = JSON.parse(localStorage.getItem('otpSend'));
            //     if (!otp) this.router.navigate(['auth']);
            // }
        });

        this.eventsService.showEventAttachmentScreenProps$$.subscribe((res) => {
            this.showAttachmentScreenProps = res;
            this.cdr.detectChanges();
        });

        // this.getEventCounts();

        if (!this.localStorageService.getSavedState('nonMemberEvent')) {
            this.showNotificationToUser();
        }
    }

    fetchDmHomeFeedInfo(communityId) {
        if (communityId) {
            this.dmService
                .fetchDmHome({ community_id: communityId })
                .pipe(takeUntil(this.destroy$$))
                .subscribe((res) => {
                    if (res?.success) {
                        if (res?.hide_dm_tab === true) {
                            this.showDmButton = false;
                            this.unreadDmCount = 0;
                        } else {
                            this.showDmButton = true;
                            this.unreadDmCount = res?.unread_dm_count;
                            if (res?.hide_dm_text) {
                                this.hide_dm_text = res?.hide_dm_text;
                                this.show_dm_text = true;
                                setTimeout(() => {
                                    this.show_dm_text = false;
                                }, 3000);
                            }
                        }
                    }
                });
        }
    }

    showNotificationToUser() {
        // Get the user-agent string
        let userAgentString = navigator.userAgent;
        // Detect Chrome
        let chromeAgent = userAgentString.indexOf('Chrome') > -1;
        // Detect Safari
        let safariAgent = userAgentString.indexOf('Safari') > -1;
        // Discard Safari since it also matches Chrome
        if (chromeAgent && safariAgent) {
            safariAgent = false;
        }
        if (!safariAgent) {
            const notification = this.cookieService.get(STORAGE_KEY.NOTIFICATION);
            if (this.user && (notification === null || notification === '')) {
                this.allowNotification();
            }
        }
    }

    allowNotification(): void {
        if (this.screenType !== 'mobile') {
            const dialogRef = this.dialog.open(AllowNotificationDialogComponent, {
                disableClose: true,
            });
            dialogRef
                .afterClosed()
                .pipe(
                    take(1),
                    filter((resp) => !!resp)
                )
                .subscribe((resp) => {
                    if (resp === 'true') this.allowNotificationGuide();
                    else {
                        const dateNow = new Date();
                        dateNow.setDate(dateNow.getDate() + 3);
                        this.cookieService.set(STORAGE_KEY.NOTIFICATION, 'false', { expires: dateNow, sameSite: 'Lax' });
                    }
                });
        }
    }

    allowNotificationGuide(): void {
        if (this.screenType !== 'mobile') {
            const dialogRef = this.dialog.open(AllowGuideDialogComponent, {
                disableClose: true,
                backdropClass: 'dialogBg-none',
            });
            dialogRef
                .afterClosed()
                .pipe(
                    take(1),
                    filter((resp) => !!resp)
                )
                .subscribe((resp) => {
                    this.cookieService.set(STORAGE_KEY.NOTIFICATION, resp);
                });
        }
    }

    fetchAccess() {
        this.authService.fetchAppAccess().subscribe((res) => {
            if (res?.access) {
                localStorage.setItem(STORAGE_KEY.ACCESS, JSON.stringify({ access: res?.access }));
                this.router.navigate([`${ROOT_PATH}`]);
            }
        });
    }

    redirectWithCommunityIdQueryParam(route: any) {
        const queryParamsObj = route.currentUrlTree.queryParams;
        const communityId = +queryParamsObj['community_id'];
        delete queryParamsObj.community_id;
        this.router.navigate([`/${COMMUNITY_FEED_PATH}/${communityId}`], { queryParams: queryParamsObj });
    }

    isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    /**
     * @function updateFCMTockent
     * @param
     * @description Notification token updated
     */
    updateFCMTockent() {
        if (this.user) {
            this.messagingService.receiveMessage();
            this.messagingService.currentMessage.pipe(takeUntil(this.destroy$$)).subscribe((data) => {
                this.message = data;
                this.sendInfo(this.message?.data);
            });
        }
    }

    /**
     * @function sendInfo
     * @param data
     * @description Web notification object
     */
    sendInfo(data: any) {
        const url = location.href;
        if (url.split(`${COLLABCARD_PATH}/`)[1] === data?.route.split('=')[1].split('&')[0]) return;
        else if (data) {
            this._notificationSvc.info(data.community_logo, data.community_name, data?.title, data?.sub_title, data?.route, 3000);
            this.notificationAlert();
        }
    }

    /**
     * @function notificationAlert
     * @param
     * @description Web notification alert sound.
     */
    notificationAlert() {
        let audio = new Audio();
        audio.src = '../../../assets/audio/notification.mp3';
        audio.load();
        audio.play();
    }

    showSideBar(event) {
        this.hideSideBar = false;
    }

    /**
     * @function selectTab
     * @param params
     * @description This function is used select the tabs
     */
    selectTab() {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router)
            )
            .subscribe((route: any) => {
                this.routeElements = route.url.split('/');
                if (this.routeElements[1] === EVENT_FEED_PATH) {
                    this.activeTab = EVENT_FEED_PATH;
                } else if (this.routeElements[1] === DIRECT_MESSAGE_PATH || this.routeElements[1] === DIRECT_MESSAGE_MEMBER_PATH) {
                    this.activeTab = 'direct-message';
                } else {
                    this.activeTab = 'home-feed';
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

    ngOnDestroy(): void {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

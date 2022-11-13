import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    PLATFORM_ID,
    SimpleChanges,
} from '@angular/core';
import { IChatroom } from 'src/app/shared/models/chatroom.model';
import { IMember, IMemberState } from 'src/app/shared/models/member.model';
import { AttendEventPopupComponent } from '../../entryComponents/attend-event-popup/attend-event-popup.component';
import { AttendEventSheetComponent } from '../../entryComponents/attend-event-sheet/attend-event-sheet.component';
import { IUser } from 'src/app/shared/models/user.model';
import { UpdateProfileSheetComponent } from '../../entryComponents/update-profile-sheet/update-profile-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { getRedirectUrl } from 'src/app/shared/store/selectors/app.selector';
import { Router } from '@angular/router';
import { COMMUNITY_QUESTION_PATH } from 'src/app/shared/constants/routes.constant';
import { IUrlParams } from 'src/app/shared/models/auth.model';
import { ICommunity } from 'src/app/shared/models/community.model';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ResizeService } from 'src/app/core/services/resize.service';
import { isPlatformBrowser } from '@angular/common';
import { UpdateProfilePopupComponent } from '../../entryComponents/update-profile-popup/update-profile-popup.component';
import { EventJoinCommunitySheetComponent } from '../../entryComponents/event-join-community-sheet/event-join-community-sheet.component';
import { EventJoinCommunityPopupComponent } from '../../entryComponents/event-join-community-popup/event-join-community-popup.component';
import { CHATROOM_TYPE_CODE } from 'src/app/shared/enums/chatroom-type.enum';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MIXPANEL } from '../../../../shared/enums/mixpanel.enum';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import {
    CHATROOM_TYPE_MAP,
    EDIT_EVENT_ATTACHMENT_SCREEN,
    MEMBER_STATE_MAP,
    SAVED_EVENT_ATTACHMENT_SCREEN,
} from '../../../../shared/constants/app-constant';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventsService } from 'src/app/core/services/events.service';
import { EventCommunityPaymentComponent } from 'src/app/shared/entryComponents/event-community-payment/event-community-payment.component';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { EventCommunityPaymentSheetComponent } from 'src/app/shared/entryComponents/event-community-payment-sheet/event-community-payment-sheet.component';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
    selector: 'event-detail-section',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailComponent implements OnInit, OnChanges, OnDestroy {
    @Output() refreshChatroom: EventEmitter<any> = new EventEmitter();
    @Output() toggleAttachmentDrawer: EventEmitter<any> = new EventEmitter();

    @Input() chatroom: IChatroom;
    @Input() chatroomId: any;
    @Input() community: ICommunity;
    @Input() user: IUser;
    @Input() memberState: IMemberState;
    @Input() attendingMembers: IMember[];
    @Input() urlParams: IUrlParams;
    @Input() admins: IUser[];
    private destroy$$ = new Subject();

    eventEnded: boolean;
    hasAttendingMembers: boolean;
    showToast: boolean;
    mobiles: string;
    emails: string;
    screenType: string;
    isUpdateProfilePopupOpen: boolean;
    isUpdateProfileSheetOpen: boolean;
    isAttendEventPopupOpen: boolean;
    isAttendEventSheetOpen: boolean;
    isJoinCommunityPopupOpen: boolean;
    isJoinCommunitySheetOpen: boolean;
    aboutAndRecordingUrlCount: number = 0;
    linksObj: any = null;
    now = new Date().getTime();
    isPaid: boolean;
    isCheckable: boolean;
    communityPlanObj;
    membershipState;

    customOptionsWeb: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        navSpeed: 700,
        autoplay: true,
        autoplaySpeed: 2000,
        // navText: [`<img src="https://web.likeminds.community/assets/images/svg/left-arrow-grey.svg"/>`, `<img src="https://web.likeminds.community/assets/images/svg/right-arrow-grey.svg"/>`],
        responsive: {
            0: {
                items: 1,
            },
            400: {
                items: 1,
            },
            740: {
                items: 1,
            },
            940: {
                items: 1,
            },
        },
        nav: false,
        dots: false,
    };

    ticketCost: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private store: Store<State>,
        private router: Router,
        private dialog: MatDialog,
        private sheet: MatBottomSheet,
        private resizeService: ResizeService,
        private analyticsService: AnalyticsService,
        private snackbar: MatSnackBar,
        private eventsService: EventsService,
        private chatroomService: ChatroomService,
        private subscriptionService: SubscriptionService,
        private homeFeedService: HomeFeedService,
        private utilsService: UtilsService
    ) {}

    ngOnInit() {
        this.initialiseComponent();
    }

    fetchAccess() {
        this.chatroomService.fetchAccessChatroom(this.chatroomId).subscribe((res) => {
            this.isPaid = res?.community?.is_paid ? true : false;
            this.isCheckable = res?.access_without_subscription ? true : false;
        });
    }

    initialiseComponent() {
        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        }
        this.fetchCommunityCost();
        this.resizeService.onResize$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
            if (this.isUpdateProfilePopupOpen || this.isUpdateProfileSheetOpen) {
                if (this.screenType === 'mobile' && this.isUpdateProfilePopupOpen) {
                    this.dialog.closeAll();
                    this.openUpdateProfileSheet();
                } else if (this.screenType === 'desktop' && this.isUpdateProfileSheetOpen) {
                    this.sheet.dismiss();
                    this.openUpdateProfilePopup();
                }
            }
            if (this.isAttendEventPopupOpen || this.isAttendEventSheetOpen) {
                if (this.screenType === 'mobile' && this.isAttendEventPopupOpen) {
                    this.dialog.closeAll();
                    this.openAttendEventSheet();
                } else if (this.screenType === 'desktop' && this.isAttendEventSheetOpen) {
                    this.sheet.dismiss();
                    this.openAttendEventPopup();
                }
            }
            if (this.isJoinCommunityPopupOpen || this.isJoinCommunitySheetOpen) {
                if (this.screenType === 'mobile' && this.isJoinCommunityPopupOpen) {
                    this.dialog.closeAll();
                    this.openJoinCommunitySheet();
                } else if (this.screenType === 'desktop' && this.isJoinCommunitySheetOpen) {
                    this.sheet.dismiss();
                    this.openJoinCommunityPopup();
                }
            }
        });

        this.fetchEventCost();
        this.onFetchEventLinks();
        this.fetchAccess();
        this.checkMembershipState();

        if (this.chatroom?.about_recording || this.chatroom?.recording_url_og_tags?.url) this.aboutAndRecordingUrlCount = 1;
    }

    checkMembershipState() {
        this.homeFeedService.subscribedCommunitiesMetaGroup$.subscribe((subscriptions) => {
            this.membershipState = subscriptions[this.community?.id]?.membership_state;
        });
    }

    openBuyDialogue(event_plan_id, type) {
        if (this.isPaid) {
            if (this.memberState?.state === 0) {
                if (type == 'paid') {
                    const data = {
                        community: this.community,
                        isCheckable: this.isCheckable,
                        eventCost: {
                            event_cost: this.ticketCost?.event_plans[0]?.cost,
                            strike_cost: this.ticketCost?.event_plans[0]?.strike_cost,
                            event_plan_id: this.ticketCost?.event_plans[0]?.event_plan_id,
                        },
                        communityPlanObj: this.communityPlanObj,
                        memberState: this.memberState,
                        membershipState: this.membershipState,
                        eventName: this.chatroom?.title,
                    };

                    if (this.screenType != 'mobile') {
                        const dialog = this.dialog.open(EventCommunityPaymentComponent, {
                            data,
                            panelClass: 'overflow-modal',
                        });
                        dialog.afterClosed().subscribe((response) => {});
                    } else if (this.screenType == 'mobile') {
                        const sheet = this.sheet.open(EventCommunityPaymentSheetComponent, {
                            data,
                            panelClass: 'overflow-modal',
                        });

                        this.utilsService.closeMatBottomSheet$$.subscribe((res) => {
                            if (res) {
                                sheet.dismiss();
                                this.utilsService.closeMatBottomSheet$$.next(false);
                            }
                        });
                    }
                } else if (type == 'free') {
                    if (!this.isCheckable) {
                        const data = {
                            community: this.community,
                            isCheckable: this.isCheckable,
                            eventCost: {
                                event_cost: 'FREE',
                                strike_cost: 'FREE',
                                event_plan_id: this.ticketCost?.event_plans[0]?.event_plan_id,
                            },
                            communityPlanObj: this.communityPlanObj,
                            memberState: this.memberState,
                            membershipState: this.membershipState,
                            eventName: this.chatroom?.title,
                            chatroomId: this.chatroomId,
                        };

                        if (this.screenType != 'mobile') {
                            const dialog = this.dialog.open(EventCommunityPaymentComponent, {
                                data,
                                panelClass: 'overflow-modal',
                            });
                            dialog.afterClosed().subscribe((response) => {});
                        } else if (this.screenType == 'mobile') {
                            const sheet = this.sheet.open(EventCommunityPaymentSheetComponent, {
                                data,
                                panelClass: 'overflow-modal',
                            });

                            this.utilsService.closeMatBottomSheet$$.subscribe((res) => {
                                if (res) {
                                    sheet.dismiss();
                                    this.utilsService.closeMatBottomSheet$$.next(false);
                                }
                            });
                        }
                    } else {
                        this.attendEvent(event_plan_id, type, true);
                    }
                }
            } else {
                this.attendEvent(event_plan_id, type, true);
            }
        } else {
            this.attendEvent(event_plan_id, type, true);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.user && changes.user.currentValue) {
            this.mobiles =
                this.user.mobiles &&
                this.user.mobiles.reduce((items, item, index) => {
                    items = `+${item.country_code}-${item.mobile_no}${this.user.mobiles[index + 1] ? ',' : ''}`;
                    return items;
                }, '');

            this.emails =
                this.user.emails &&
                this.user.emails.reduce((items, item, index) => {
                    items = `${item.email}${this.user.emails[index + 1] ? ',' : ''}`;
                    return items;
                }, '');
        }

        if (changes.chatroom && changes.chatroom.currentValue) {
            const { date_time, duration, co_hosts, member } = this.chatroom;
            if (!co_hosts || (co_hosts && !co_hosts.length)) {
                this.chatroom = { ...this.chatroom, co_hosts: [member] };
            } else {
                this.chatroom.co_hosts = [...this.chatroom.co_hosts, member];
            }
            let endDate = moment.unix(date_time / 1000 + duration / 1000);
            let today = moment(new Date().valueOf());
            // this.eventEnded = today.isAfter(endDate);
            this.eventEnded = today > this.chatroom.end_date;

            this.initialiseComponent();

            if (this.chatroom?.about_recording || this.chatroom?.recording_url_og_tags?.url) this.aboutAndRecordingUrlCount = 1;
            else this.aboutAndRecordingUrlCount = 0;
        }

        if (changes.attendingMembers && changes.attendingMembers.currentValue) {
            this.hasAttendingMembers = this.attendingMembers && this.attendingMembers.some((member) => member.attending_status);
        }
    }

    viewAttachmentDrawer(): void {
        if (this.screenType === 'mobile') {
            let viewMessageHeader = '';
            const recordingAttachmentView = this.chatroom?.recordings_attachments_view;
            if (recordingAttachmentView === 0) {
                viewMessageHeader = EDIT_EVENT_ATTACHMENT_SCREEN;
            } else if (recordingAttachmentView === 3 || recordingAttachmentView === 2) viewMessageHeader = SAVED_EVENT_ATTACHMENT_SCREEN;
            this.eventsService.showEventAttachmentScreenProps$$.next({ show: true, viewMessage: viewMessageHeader });
        } else this.toggleAttachmentDrawer.emit();
    }

    ytBanner(url: any) {
        if (url?.includes('youtube.com') || url?.includes('youtu.be')) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            const image_url = `https://img.youtube.com/vi/${match && match[2].length === 11 ? match[2] : null}/maxresdefault.jpg`;
            return image_url;
        }
    }

    fetchEventCost() {
        this.eventsService.fetchEventPlan(this.chatroomId).subscribe((res) => {
            this.ticketCost = res;
        });
    }

    fetchCommunityCost() {
        this.subscriptionService.fetchSubscriptionPlans(this.community?.id).subscribe((res) => {
            this.communityPlanObj = res;
            this.subscriptionService.broadcastSubscriptionPlans$$.next(res);
        });
    }

    onFetchEventLinks() {
        this.eventsService.fetchLinks({ chatroom_id: this.chatroomId }).subscribe((res) => {
            this.linksObj = res;
        });
    }

    joinEvent() {
        const paramObj = {
            chatroom_id: this.ticketCost?.event_plans[0]?.chatroom_id,
        };
        this.eventsService.eventAttended(paramObj).subscribe((_) => {
            console.log(_);
        });
    }

    viewedDirectory() {
        this.analyticsService.sendEvent(MIXPANEL.VIEWED_DIRECTORY, {
            community_id: this.community?.id,
            member_id: this.user?.id,
        });
    }

    attendEvent(epId?: string, eventType?: string, regEvt?: boolean) {
        if (!this.user && this.chatroom.type === CHATROOM_TYPE_CODE.CARD_PUBLIC_EVENT) {
            this.redirectToLogin();
            return;
        }

        if (eventType === 'paid') {
            if (parseInt(this.ticketCost?.event_plans[0]?.cost) === 0) {
                this.doEventAttend(regEvt);
                return;
            }
            if (this.user?.id) {
                this.router.navigateByUrl(`/event_pay?${this.chatroom?.event_payment_link.split('?')[1]}&user_id=${this.user.id}`);
            } else {
                this.router.navigateByUrl(`/event_pay?${this.chatroom?.event_payment_link.split('?')[1]}`);
            }
        } else {
            this.doEventAttend(regEvt);
        }
    }

    doEventAttend(evtVal?: any) {
        const paramObj = {
            chatroom_id: this.chatroomId,
            attending_status: evtVal,
        };
        let regMsg;
        if (evtVal === true) {
            regMsg = `You're registered for this event`;
        } else {
            regMsg = `You're unregistered for this event`;
        }
        this.eventsService.eventAttend(paramObj).subscribe((res) => {
            if (res) {
                this.snackbar.open(`${regMsg}`, undefined, {
                    panelClass: ['snackbar'],
                    duration: 3000,
                    horizontalPosition: 'left',
                });
                location.reload();
            }
        });
    }

    getDuration(chatroom: IChatroom): any {
        const { date_time, duration, end_date } = chatroom;
        let startDate = moment.unix(date_time / 1000).format('DD/MM/YYYY HH:mm:ss');
        let endDate = moment.unix(end_date / 1000 + duration / 1000).format('DD/MM/YYYY HH:mm:ss');

        let diff = moment.duration(moment(endDate, 'DD/MM/YYYY HH:mm:ss').diff(moment(startDate, 'DD/MM/YYYY HH:mm:ss')));
        let mins = diff.minutes() ? (diff.minutes() > 1 ? diff.minutes() + ' minutes' : diff.minutes() + ' minute') : '';
        let hours = diff.hours() ? (diff.hours() > 1 ? diff.hours() + ' hours' : diff.hours() + ' hour') : '';
        let days = diff.days() ? (diff.days() > 1 ? diff.days() + ' days' : diff.days() + ' day') : '';
        let months = diff.months() ? (diff.months() > 1 ? diff.months() + ' months' : diff.months() + ' month') : '';
        let years = diff.years() ? (diff.years() > 1 ? diff.years() + ' years' : diff.years() + ' year') : '';

        const timeLeft = `${years ? years : ''} ${months ? months : ''} ${days ? days : ''} ${hours ? hours : ''} ${mins ? mins : ''}`;
        return timeLeft;
    }

    downloadApp() {
        const data = {
            heading: 'Approval pending',
            subHeading1:
                'Closed communities need the approval from community managers. The community manager has received your request and would take a decision on your membership for this community. Once approved, we would inform you immediately.',
            subHeading2: 'Meanwhile you can download our app.',
        };
        // const dialog = this.dialog.open(DownloadAppComponent, {
        //     panelClass: 'download-app-modal',
        //     data,
        // });
        // dialog.afterClosed().subscribe((response) => {});
    }

    openJoinCommunitySheet() {
        this.isJoinCommunitySheetOpen = true;
        const sheet = this.sheet.open(EventJoinCommunitySheetComponent, {
            data: {
                chatroom: this.chatroom,
                community: this.community,
                admins: this.admins,
                message: 'This is a private event. Login and join the community to attend this event.',
            },
        });
        sheet.afterDismissed().subscribe((response) => {
            this.isJoinCommunitySheetOpen = false;
            if (response && !this.user) {
                let redirectUrl: string;
                this.store.pipe(select(getRedirectUrl)).subscribe((url) => (redirectUrl = url));
                if (redirectUrl.includes('?')) redirectUrl = `${redirectUrl}&page=generate_otp`;
                else redirectUrl = `${redirectUrl}?page=generate_otp`;
                this.router.navigateByUrl(`${redirectUrl}`);
                return;
            } else if (response && this.user) {
                this.router.navigate([`${COMMUNITY_QUESTION_PATH}/${this.community.id}`], {
                    queryParams: {
                        ...this.urlParams,
                        source_chatroom_type: CHATROOM_TYPE_MAP[this.chatroom?.type] || '',
                        source_chatroom_name: this.chatroom?.header || '',
                    },
                });
            }
        });
    }

    openJoinCommunityPopup() {
        this.isJoinCommunityPopupOpen = true;
        const dialog = this.dialog.open(EventJoinCommunityPopupComponent, {
            data: {
                chatroom: this.chatroom,
                community: this.community,
                admins: this.admins,
                message: `This is a private event. ${!this.user ? 'Login and join' : 'Join'} the community to attend this event.`,
            },
            panelClass: 'event-join-community-popup',
        });
        dialog.afterClosed().subscribe((response) => {
            this.isJoinCommunityPopupOpen = false;
            if (response && !this.user) {
                this.redirectToLogin();
                return;
            } else if (response && this.user) {
                this.router.navigate([`${COMMUNITY_QUESTION_PATH}/${this.community.id}`], {
                    queryParams: {
                        ...this.urlParams,
                        source_chatroom_type: CHATROOM_TYPE_MAP[this.chatroom?.type] || '',
                        source_chatroom_name: this.chatroom?.header || '',
                    },
                });
            }
        });
    }

    private redirectToLogin() {
        let redirectUrl: string;
        this.store.pipe(select(getRedirectUrl)).subscribe((url) => (redirectUrl = url));
        if (redirectUrl.includes('?')) redirectUrl = `${redirectUrl}&page=generate_otp`;
        else redirectUrl = `${redirectUrl}?page=generate_otp`;
        this.snackbar.open('You need to login to attend the event', undefined, {
            panelClass: ['snackbar'],
            duration: 5000,
        });
        this.router.navigateByUrl(`${redirectUrl}`);
    }

    openUpdateProfileSheet() {
        this.isUpdateProfileSheetOpen = true;
        const sheet = this.sheet.open(UpdateProfileSheetComponent, {
            data: {
                user: this.user,
                community_id: this.community.id,
            },
        });
        sheet.afterDismissed().subscribe((response) => {
            this.isUpdateProfileSheetOpen = false;
            if (response) this.router.navigate([`${COMMUNITY_QUESTION_PATH}/${this.community.id}`], { queryParams: this.urlParams });
        });
    }

    openUpdateProfilePopup() {
        this.isUpdateProfilePopupOpen = true;
        const dialog = this.dialog.open(UpdateProfilePopupComponent, {
            data: {
                user: this.user,
                community_id: this.community.id,
            },
            panelClass: 'update-profile-popup',
        });
        dialog.afterClosed().subscribe((response) => {
            this.isUpdateProfilePopupOpen = false;
            if (response) this.router.navigate([`${COMMUNITY_QUESTION_PATH}/${this.community.id}`], { queryParams: this.urlParams });
        });
    }

    openAttendEventPopup() {
        this.isAttendEventPopupOpen = true;
        const dialog = this.dialog.open(AttendEventPopupComponent, {
            panelClass: 'attend-event-modal',
            data: {
                chatroom: this.chatroom,
            },
        });
        dialog.afterClosed().subscribe((response) => {
            this.isAttendEventPopupOpen = false;
            if (response && response.value) {
                this.refreshChatroom.emit();
                this.sendAnalytics();
                this.chatroom.attending_status = response.attending;
                if (!response.attending) return;
                this.showToast = true;
                setTimeout(() => (this.showToast = false), 5000);
            }
        });
    }

    openAttendEventSheet() {
        this.isAttendEventSheetOpen = true;
        const dialog = this.sheet.open(AttendEventSheetComponent, {
            panelClass: 'attend-event-modal',
            data: {
                chatroom: this.chatroom,
            },
        });
        dialog.afterDismissed().subscribe((response) => {
            this.isAttendEventSheetOpen = false;
            if (response && response.value) {
                this.refreshChatroom.emit();
                this.sendAnalytics();
                this.chatroom.attending_status = response.attending;
                if (!response.attending) return;
                this.showToast = true;
                setTimeout(() => (this.showToast = false), 5000);
            }
        });
    }

    sendAnalytics(): void {
        this.analyticsService.sendEvent(MIXPANEL.EVENT_ATTENDED, {
            chatroom_id: this.chatroom,
            community_id: this.community.id,
            chatroom_type: CHATROOM_TYPE_MAP[this.chatroom.type],
            member_state: MEMBER_STATE_MAP[this.memberState?.state],
        });
    }

    viewLocationOnMap() {
        if (!this.chatroom.location_lat || !this.chatroom.location_long) return;
        const url = ` https://www.google.com/maps/search/?api=1&query=${this.chatroom.location_lat},${this.chatroom.location_long}`;
        window.open(url, 'blank');
    }

    ngOnDestroy(): void {
        this.destroy$$.next();
        this.destroy$$.complete();
    }
}

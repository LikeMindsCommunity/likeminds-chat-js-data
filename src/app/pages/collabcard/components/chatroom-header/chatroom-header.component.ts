import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IMember } from '../../../../shared/models/member.model';
import { IChatroom } from '../../../../shared/models/chatroom.model';
import { ICommunity } from '../../../../shared/models/community.model';
import { ACTIONS_MAP } from '../../../../shared/constants/app-constant';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { CHATROOM_TYPE_CODE } from '../../../../shared/enums/chatroom-type.enum';
import { PinChatroomPopupComponent } from '../../../../shared/entryComponents/pin-chatroom-popup/pin-chatroom-popup.component';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { filter } from 'rxjs/operators';
import { CHATROOM_SETTINGS, COMMUNITY_FEED_PATH, PROFILE } from 'src/app/shared/constants/routes.constant';
import { ModerationService } from 'src/app/core/services/moderation.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { EventsService } from 'src/app/core/services/events.service';
import { CommunityService } from 'src/app/core/services/community.service';
import { SessionstorageService } from 'src/app/core/services/sessionstorage.service';

import { Location } from '@angular/common';
import { DmService } from 'src/app/core/services/dm.services';
import { ConfirmBlockDialogComponent } from '../confirm-block-dialog/confirm-block-dialog.component';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
@Component({
    selector: 'app-chatroom-header',
    templateUrl: './chatroom-header.component.html',
    styleUrls: ['./chatroom-header.component.scss'],
})
export class ChatroomHeaderComponent implements OnInit, OnChanges {
    @Input() communityId: any;
    @Input() chatroomId: any;

    @Input() chatroom: IChatroom;
    @Input() chatroomActions: IChatroom;
    @Input() community: ICommunity;
    @Input() conversationUsers: IMember[];
    @Input() participantsCount: number;
    @Output() changeActive = new EventEmitter();
    @Output() unfollowChatroom = new EventEmitter();
    @Output() block = new EventEmitter();
    imageList: any[] = [];
    isIntroductionsRoom = false;
    showIntroThreadView = false;
    introRoomThreadConvCount: number = 0;
    cId: any;
    user: any;
    currentCommunityData: any = null;
    guestUser: any;

    constructor(
        private snackbar: MatSnackBar,
        private moderationService: ModerationService,
        private eventService: EventsService,
        private router: Router,
        private homeFeedService: HomeFeedService,
        private dialog: MatDialog,
        private analyticsService: AnalyticsService,
        private cdr: ChangeDetectorRef,
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionstorageService,
        private communityService: CommunityService,
        private location: Location,
        private dmService: DmService,
        private chatroomService: ChatroomService
    ) {}

    ngOnInit(): void {
        this.currentCommunityData = this.sessionStorageService.getSessionState(STORAGE_KEY?.COMMUNITY);
        console.log(this.currentCommunityData);
        this.guestUser = this.localStorageService.getSavedState('__is_guest__');
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.homeFeedService.showIntroThreadView$$.subscribe((res) => {
            if (this.showIntroThreadView !== res) {
                this.showIntroThreadView = res;
                this.cdr.detectChanges();
            }
        });

        this.homeFeedService.introRoomThreadConvCount$$.subscribe((res) => {
            this.introRoomThreadConvCount = res;
            this.cdr.detectChanges();
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((_) => {
            this.homeFeedService.introRoomThreadConvCount$$.next(0);
        });

        // this.communityService.currentCommunityData$$.subscribe((data) => {
        //     if (this.currentCommunityData !== null) this.currentCommunityData = data;
        // });
    }

    checkIntroductionRoom(): void {
        this.isIntroductionsRoom = this.chatroom?.type === CHATROOM_TYPE_CODE.CARD_INTRODUCTIONS || false;
    }

    ngOnChanges(): void {
        this.updateImageList();
        this.checkIntroductionRoom();
        if (this.chatroom?.id) this.getIntroRoomThreadConvCount();
        // if (this.user) {
        //     // this.onGetChatroomDetails(this.chatroomId);
        // }
    }

    getIntroRoomThreadConvCount() {
        this.homeFeedService.fetchUnreadPreviewsCount(this.chatroom?.id);
    }

    updateImageList() {
        if (this.chatroom?.type == 10) {
            this.imageList = [
                {
                    image_url: this.getChatroomUrl(),
                    name: this.getChatroomName(),
                },
            ];
        } else {
            if (this.conversationUsers) {
                this.imageList = [this.chatroom.member, ...this.conversationUsers];
            }
        }
    }

    handleThreadButtonClick() {
        this.homeFeedService.showIntroThreadView$$.next(true);
    }

    handleBackButtonClick() {
        this.homeFeedService.showIntroThreadView$$.next(false);
    }

    public back(): void {
        const { conversationId } = <any>this.location.getState();
        if (conversationId) this.router?.navigateByUrl(`/${this.community.id}`);
        else this.location.back();
    }

    takeAction(action): void {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }

        switch (action.id) {
            case ACTIONS_MAP.VIEW_PARTICIPANTS:
                this.viewParticipants();
                break;
            case ACTIONS_MAP.MUTE_NOTIFICATIONS:
                this.changeActive.emit(true);
                break;

            case ACTIONS_MAP.LEAVE_CHATROOM:
                this.changeActive.emit(true);
                break;
            case ACTIONS_MAP.MARK_ACTIVE:
                this.changeActive.emit(true);
                break;
            case ACTIONS_MAP.MARK_INACTIVE:
                this.changeActive.emit(false);

                this.analyticsService.sendEvent(MIXPANEL.MARK_CHATROOM_INACTIVE, {
                    chatroom_id: this.chatroom.id,
                    community_id: this.community.id,
                    source: 'chatroom_overflow_menu',
                });

                break;
            case ACTIONS_MAP.UNFOLLOW_CHATROOM:
                this.unfollowChatroom.emit(false);
                this.chatroomService.stopAudioRecording$$.next(true);
                break;
            case ACTIONS_MAP.VIEW_COMMUNTIY:
                // this.router.navigate(['community_detail', this.community.id]);
                this.router.navigate(['community_feed', this.community.id, 'detail']);
                this.analyticsService.sendEvent(MIXPANEL.MARK_CHATROOM_INACTIVE, {
                    chatroom_id: this.chatroom?.id,
                    community_id: this.community.id,
                    source1: 'homefeed_feed',
                    source2: 'chatroom_overflow_menu',
                });
                break;
            case ACTIONS_MAP.UNPIN_CHATROOM:
                this.homeFeedService.pinChatroom(this.chatroom.id.toString(), false).subscribe((response) => {
                    if (response.success) {
                        this.snackbar.open('Removed from pinned chat rooms', null, {
                            duration: 4000,
                            panelClass: ['snackbar'],
                        });
                        this.homeFeedService.getCommunityDetail(this.community.id);
                        this.homeFeedService.getChatroomDetail(this.chatroom.id, {});
                    }
                });
                break;
            case ACTIONS_MAP.PIN_CHATROOM:
                this.dialog.open(PinChatroomPopupComponent, {
                    data: {
                        chatroom_id: this.chatroom.id.toString(),
                        community_id: this.community.id.toString(),
                    },
                    disableClose: true,
                });
                break;
            case ACTIONS_MAP.VIEW_PROFILE:
                this.viewMemberProfile();
                break;

            case ACTIONS_MAP.BLOCK:
                this.dialog
                    .open(ConfirmBlockDialogComponent, { panelClass: ['reject-dm-dialog'], data: { name: this.getChatroomName() } })
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

    callBlock(status) {
        this.dmService.chatroomBlock({ chatroom_id: this.chatroom?.id, status }).subscribe((res) => {
            if (res?.success) {
                if (status == 1) {
                    this.snackbar.open('Member Unblocked', null, { duration: 2000 });
                    setTimeout(() => {
                        this.block.emit();
                    }, 200);
                } else this.block.emit();
            }
        });
    }

    viewMemberProfile() {
        const memberStateAndId = this.getChatroomMemberIdAndState();
        this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_VIEW, {
            community_id: this.chatroom?.community_id,
            viewed_member_id: memberStateAndId?.id,
            viewed_member_state: memberStateAndId?.state,
            source: 'chatroom',
        });
        this.router.navigate([`/${COMMUNITY_FEED_PATH}/${this.chatroom?.community_id}/${PROFILE}/${memberStateAndId?.id}`]);
    }

    onGetChatroomDetails(chatroomId) {
        this.eventService.chatroomDetails({ chatroom_id: chatroomId }).subscribe((res) => {
            this.chatroom = res.chatroom;
            this.getCommunityManager(this.chatroom?.community_id);
        });
    }

    is_cm: boolean = false;
    getCommunityManager(cid: any) {
        const params = {
            community_id: cid,
            user_id: this.user?.id,
        };

        this.moderationService.getManagerRight(params).subscribe((res) => {
            if (res?.member?.state === 1) {
                this.is_cm = true;
            } else {
                this.is_cm = false;
            }
        });
    }

    goToPage() {
        if (this.router.url.split('/')[2] === 'collabcard') {
            this.router.navigateByUrl(
                `/community_feed/${this.chatroom.community_id}/${CHATROOM_SETTINGS}?chatroom_id=${this.chatroom.id}&&title=${this.chatroom.title}`
            );
        } else if (this.router.url.split('/')[1] === 'community_feed') {
            this.router.navigateByUrl(
                `/community_feed/${this.chatroom.community_id}/${CHATROOM_SETTINGS}?chatroom_id=${this.chatroom.id}&&title=${this.chatroom.title}`
            );
        } else if (this.router.url.split('/')[1] === 'event_feed') {
            this.router.navigateByUrl(`/event_feed/${CHATROOM_SETTINGS}?chatroom_id=${this.chatroomId}`);
        }
    }

    viewParticipants() {
        if (this.router.url.split('/')[1] === 'community_feed') {
            console.log(this.router.url.split('/')[1]);
            this.router.navigateByUrl(`/community_feed/${this.chatroom.community_id}/collabcard/${this.chatroomId}/view_participants`);
        } else {
            console.log(this.currentCommunityData);
            this.router.navigateByUrl(`/${this.currentCommunityData?.id}/collabcard/${this.chatroomId}/view_participants`);
        }
    }

    getChatroomName() {
        if (this.user?.id == this.chatroom?.chatroom_with_user?.id) {
            return this.chatroom?.member?.name;
        } else {
            return this.chatroom?.chatroom_with_user?.name;
        }
    }

    getChatroomMemberIdAndState() {
        if (this.user?.id == this.chatroom?.chatroom_with_user?.id) {
            return {
                id: this.chatroom?.member?.id,
                state: this.chatroom?.member?.state,
            };
        } else {
            return {
                id: this.chatroom?.chatroom_with_user?.id,
                state: this.chatroom?.chatroom_with_user?.state,
            };
        }
    }

    getChatroomUrl() {
        if (this.user?.id == this.chatroom?.chatroom_with_user?.id) {
            return this.chatroom?.member?.image_url;
        } else {
            return this.chatroom?.chatroom_with_user?.image_url;
        }
    }
}

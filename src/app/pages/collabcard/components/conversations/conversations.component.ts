import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
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
    ViewChild,
} from '@angular/core';
import { IUser } from 'src/app/shared/models/user.model';
import { IMemberState } from 'src/app/shared/models/member.model';
import { IChatroom } from 'src/app/shared/models/chatroom.model';
import { ICommunity } from 'src/app/shared/models/community.model';
import { combineLatest, Observable, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ResizeService } from 'src/app/core/services/resize.service';
import * as _ from 'lodash';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { GALLERY_CONF, GALLERY_IMAGE, NgxImageGalleryComponent } from 'ngx-image-gallery';
import { CHATROOM_TYPE_CODE, MESSAGE_STATE } from 'src/app/shared/enums/chatroom-type.enum';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { DmService } from 'src/app/core/services/dm.services';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';

@Component({
    selector: 'app-conversations',
    templateUrl: './conversations.component.html',
    styleUrls: ['./conversations.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationsComponent implements OnInit, OnChanges, OnDestroy {
    destroy = new Subject();

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private cdr: ChangeDetectorRef,
        private resizeService: ResizeService,
        private chatroomService: ChatroomService,
        private homeFeedService: HomeFeedService,
        private router: Router,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private analyticsService: AnalyticsService,
        private dmService: DmService,
        private localStorageService: LocalStorageService
    ) {}

    @Input() isLoading: boolean;
    @Input() totalResponseCount = 0;
    @Input() conversations: any[] = [];
    @Input() user: IUser;
    @Input() memberState: IMemberState;
    @Input() chatroom: IChatroom;
    @Input() community: ICommunity;
    @Input() preventScrollToBottom: boolean;
    @Output() followChatroom: EventEmitter<any> = new EventEmitter();
    @Output() changeActive = new EventEmitter();
    @Output() muteChatroom = new EventEmitter();
    @Output() showMediaPopup: EventEmitter<any> = new EventEmitter();
    @Output() preventScrollToBottomEvent: EventEmitter<any> = new EventEmitter();
    screenType: string;
    introThreadConv = null;
    hideRetryButton = {};
    groupedData$ = new Observable();
    introData: any;
    showIntroThreadView = false;
    is_cm: boolean = null;

    destroy$$ = new Subject();
    isNewMessage = false;
    selectedMsgs = {};
    selectedMsgsLength = 0;
    showFollowTelescope = false;
    showFollowAutoTag = false;
    showActive = false;
    playGifFile: any = {};
    playingAudioId: string | number;
    showNewChatroomCommunityDetail: boolean;
    hideChatroomFollowButton: boolean;
    guestUser: any;

    @ViewChild(NgxImageGalleryComponent) ngxImageGallery: NgxImageGalleryComponent;

    // gallery configuration
    conf: GALLERY_CONF = {
        imageOffset: '10px',
        showDeleteControl: false,
        showImageTitle: true,
        closeOnEsc: true,
        reactToRightClick: true,
    };

    galleryImages: GALLERY_IMAGE[] = [];

    ngOnInit(): void {
        this.guestUser = this.localStorageService.getSavedState('__is_guest__');
        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        }
        this.resizeService.onResize$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        });

        this.listenToSelectedMsgs();
        this.chatroomService.markActiveChatroom$$.subscribe((res) => {
            this.showActive = !res;
        });

        this.chatroomService.hideChatroomFollowButton$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            if (res.status === null) return;
            if (this.chatroom?.id === res.chatroom_id) {
                this.hideChatroomFollowButton = res.status;
                this.showFollowTelescope = !res.status;
                this.cdr.detectChanges();
            }
        });

        this.chatroomService.playGifFile$$.subscribe((res) => {
            this.playGifFile = res;
        });

        this.chatroomService.hideRetryButton$$.subscribe((res) => {
            this.hideRetryButton = res;
        });

        this.chatroomService.preventScrollToBottomEvent$$.subscribe((res) => {
            this.preventScrollToBottomFunc(res);
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((val) => {
            this.homeFeedService.showIntroThreadView$$.next(false);
        });

        this.homeFeedService.introRoomThreadConv$.subscribe((res) => {
            this.introData = res;
            this.cdr.detectChanges();
        });
        this.homeFeedService.showIntroThreadView$$.subscribe((res) => {
            if (this.showIntroThreadView !== res) {
                this.showIntroThreadView = res;
                this.cdr.detectChanges();
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.checkBottomGraphic();
        if (changes.chatroom || changes.community) this.generateData();

        if (changes.memberState) {
            if (changes.memberState.currentValue?.state === 1) this.is_cm = true;
            else this.is_cm = null;
        }

        if ((changes.conversations && changes.conversations.currentValue) || (changes.chatroom && changes.chatroom.currentValue)) {
            this.isNewMessage = true;
        }
    }

    checkBottomGraphic(): void {
        if (this.chatroom) {
            const isActive = this.chatroom.active;
            this.showFollowTelescope = false;
            this.showFollowAutoTag = false;
            this.showActive = false;
            if (!this.chatroom.follow_status) {
                this.showFollowTelescope = true;
            }
            if (this.chatroom.member?.id === this.user?.id) {
                this.showFollowTelescope = false;
            }
            if (isActive && this.chatroom.is_tagged) {
                this.showFollowTelescope = false;
                this.showActive = false;
                this.showFollowAutoTag = true;
            }
            if (!isActive && this.chatroom.follow_status) {
                this.showFollowTelescope = false;
                this.showActive = true;
                this.showFollowAutoTag = false;
            }
            this.cdr.detectChanges();
        }
    }

    playingAudioIdEventFunc(event) {
        this.playingAudioId = event;
    }

    onFollowed() {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }
        this.showFollowTelescope = false;
        this.followChatroom.emit(true);
    }

    preventScrollToBottomFunc(event) {
        this.preventScrollToBottomEvent.emit(event);
    }

    getFormattedMessage(message_type, message) {
        if (message_type === 20) {
            return `You and ${
                this.chatroom.chatroom_with_user.id == this.user.id
                    ? this.chatroom.chat_requested_by[0].name
                    : this.chatroom.chatroom_with_user.name
            } are now connected.`;
        } else if (message_type === 19) {
            return `${message} ${this.chatroom.chat_requested_by[0].id !== this.user.id ? 'Tap to undo' : ''}`;
        }
    }

    undoDMRequest() {
        if (this.chatroom.chat_requested_by[0].id === this.user.id) return;
        this.dmService.chatroomBlock({ chatroom_id: this.chatroom.id, status: 1 }).subscribe((res) => {
            this.homeFeedService.refreshEvent.next(true);
        });
    }

    trackByFn(index: number, item: any): number {
        return item.id;
    }

    generateData(): void {
        this.groupedData$ = combineLatest([
            this.homeFeedService.conversationGroups$,
            this.activatedRoute.params,
            this.homeFeedService.chatroomDetailGroup$,
        ]).pipe(
            takeUntil(this.destroy$$),
            map(([resp, routerEvt, chatroomLists]) => {
                if (!resp[routerEvt.chatroomId]) {
                    return [];
                }
                const selectedChatroom = chatroomLists[routerEvt.chatroomId]?.chatroom;
                if (!selectedChatroom) {
                    return [];
                }
                const conversationArray = [..._(resp[routerEvt.chatroomId]).sortBy('created_epoch').value()];
                this.homeFeedService.disableInputView$$.next(conversationArray);
                const firstMsgIndex = conversationArray.findIndex((conversation) => {
                    return conversation.state === MESSAGE_STATE.FIRST_MESSAGE;
                });
                if (firstMsgIndex > -1) {
                    if (selectedChatroom.type === CHATROOM_TYPE_CODE.CARD_POLL) {
                        conversationArray.splice(firstMsgIndex + 1, 0, {
                            answer: selectedChatroom.title,
                            answer_bubble: '',
                            answer_text: selectedChatroom.answer_text,
                            chatroom_id: selectedChatroom.id,
                            community_id: this.community.id,
                            created_at: selectedChatroom.created_at,
                            date: selectedChatroom.date,
                            id: null,
                            images: selectedChatroom.images,
                            is_edited: false,
                            member: selectedChatroom.member,
                            member_id: selectedChatroom.member.id,
                            pdf: [],
                            state: 0,
                            polls_count: selectedChatroom.polls_count,
                            poll_type_text: selectedChatroom.poll_type_text,
                            poll_type: selectedChatroom.poll_type,
                            polls: selectedChatroom.polls,
                            is_anonymous: selectedChatroom.is_anonymous,
                            multiple_select_no: selectedChatroom.multiple_select_no,
                            multiple_select_state: selectedChatroom.multiple_select_state,
                            allow_add_option: selectedChatroom.allow_add_option,
                            is_pending: selectedChatroom.is_pending,
                            expiry_time: selectedChatroom.expiry_time,
                            reactions: selectedChatroom?.reactions,
                        });
                    } else if (
                        [
                            CHATROOM_TYPE_CODE.CARD_NORMAL,
                            CHATROOM_TYPE_CODE.CARD_INTRO,
                            CHATROOM_TYPE_CODE.CARD_PURPOSE,
                            CHATROOM_TYPE_CODE.CARD_INTRODUCTIONS,
                        ].includes(selectedChatroom.type)
                    ) {
                        conversationArray.splice(firstMsgIndex + 1, 0, {
                            answer: selectedChatroom.title,
                            answer_bubble: '',
                            chatroom_id: selectedChatroom.id,
                            community_id: this.community.id,
                            created_at: selectedChatroom.created_at,
                            date: selectedChatroom.date,
                            id: null,
                            attachments: selectedChatroom.attachments,
                            is_edited: false,
                            member: selectedChatroom.member,
                            member_id: selectedChatroom.member.id,
                            pdf: selectedChatroom.pdf,
                            state: 0,
                            reactions: selectedChatroom?.reactions,
                        });
                    }
                }
                const groupedMessages = _(conversationArray).groupBy('date').value();
                let resultArray = [];
                Object.keys(groupedMessages).forEach((key, index) => {
                    resultArray = [
                        ...resultArray,
                        {
                            id: index,
                            type: 'date',
                            date: key,
                        },
                        ...groupedMessages[key].map((convo, i) => {
                            return {
                                type: 'msg',
                                id: convo.id,
                                msg: convo,
                                isOtherMember: groupedMessages[key][i]?.member?.id !== groupedMessages[key][i - 1]?.member?.id,
                                wrapperClass: this.setConversationCategory(convo, groupedMessages[key][i + 1]),
                            };
                        }),
                    ];
                });
                return resultArray;
            })
        );
    }

    setConversationCategory(currMsg, nextMsg): string {
        let classToBeAppend = '';
        if (!this.user) {
            classToBeAppend += 'same';
        } else if (currMsg && nextMsg && this.user) {
            if (currMsg.member.id === this.user.id) {
                classToBeAppend += nextMsg.member.id === this.user.id ? ' same' : ' different';
            } else {
                classToBeAppend += nextMsg.member.id !== this.user.id ? ' same' : ' different';
            }
        }
        if (currMsg && nextMsg) {
            classToBeAppend += currMsg.member.id === nextMsg.member.id ? ' same-user' : ' different-user';
        }

        return classToBeAppend;
    }

    galleryOpened(event): void {
        // To make gallery detect changes as the changeDetection is set to onPush.
        this.cdr.detectChanges();
    }

    openMediaGallery(evt): void {
        this.showMediaPopup.emit(evt);
    }

    listenToSelectedMsgs(): void {
        if (window.innerWidth <= 470) {
            this.homeFeedService.selectedMsg$
                .pipe(
                    filter((msgs) => !!msgs),
                    takeUntil(this.destroy$$)
                )
                .subscribe((msgs) => {
                    this.selectedMsgs = { ...msgs };
                    this.selectedMsgsLength = Object.values(msgs).length;
                    this.cdr.detectChanges();
                });
        }
    }

    getChatroomName() {
        if (this.user?.id == this.chatroom?.chatroom_with_user?.id) {
            return this.chatroom?.member?.name;
        } else {
            return this.chatroom?.chatroom_with_user?.name;
        }
    }

    ngOnDestroy(): void {
        this.chatroomService.updateConversations([]);
        this.chatroomService.hideChatroomFollowButton$$.next(false);
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

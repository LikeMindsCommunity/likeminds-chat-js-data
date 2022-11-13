import {
    Component,
    ElementRef,
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
import { select, Store } from '@ngrx/store';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { MentionConfig } from 'angular-mentions';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil, filter, startWith, map, tap, delay } from 'rxjs/operators';
import * as _ from 'lodash';
import { ConversationModel, IChatroom } from '../../../../shared/models/chatroom.model';
import { ICommunity } from '../../../../shared/models/community.model';
import { IUser } from '../../../../shared/models/user.model';
import { IMember, IMemberState } from '../../../../shared/models/member.model';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { ConversationsComponent } from '../conversations/conversations.component';
import { State } from '../../../../shared/store/reducers';
import { DEFAULT_PROFILE_PHOTO_LINK } from '../../../../shared/constants/api.constant';
import { getRedirectUrl } from '../../../../shared/store/selectors/app.selector';
import { ResizeService } from '../../../../core/services/resize.service';
import { MEMBER_RIGHT, MEMBER_STATE } from '../../../../shared/enums/member-state.enum';
import { DOWNLOAD_BUTTON_SOURCE, DOWNLOAD_BUTTON_TYPE, MIXPANEL } from '../../../../shared/enums/mixpanel.enum';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { CHATROOM_TYPE_MAP, MEMBER_STATE_MAP } from '../../../../shared/constants/app-constant';
import { IUrlParams } from '../../../../shared/models/auth.model';
import { CHATROOM_TYPE_CODE } from '../../../../shared/enums/chatroom-type.enum';
import { ChoiceSheetComponent } from '../../../../shared/entryComponents/choice-sheet/choice-sheet.component';
import { ChoiceDialogData } from '../../../../shared/models/choice.model';
import { ChoiceDialogComponent } from '../../../../shared/entryComponents/choice-dialog/choice-dialog.component';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { MemberTagPipe } from '../../../../shared/pipes/member-tag.pipe';
import * as moment from 'moment';
import * as gifFrames from 'gif-frames';
import { PollsChatCardComponent } from 'src/app/shared/entryComponents/polls-chat-card/polls-chat-card.component';
import { UtilsService } from 'src/app/core/services/utils.service';
import { FileSizePipe } from 'src/app/shared/pipes/file-size.pipe';
import { IndexedDbService } from 'src/app/core/services/indexed-db.service';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';
import { emailPattern, getDevice, isInternalLink, urlPattern } from 'src/app/shared/utils';
import { FetchLinksService } from 'src/app/core/services/fetch-links.service';
import { DmService } from 'src/app/core/services/dm.services';
import { ConfirmDmRequestDialogComponent } from '../confirm-dm-request-dialog/confirm-dm-request-dialog.component';
import { ApproveDmRequestDialogComponent } from '../approve-dm-request-dialog/approve-dm-request-dialog.component';
import { AwsS3BucketService } from 'src/app/core/services/aws-s3-bucket.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { AudioService } from 'src/app/core/services/audio.service';

import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { AudioPermissionPopupComponent } from '../../entryComponents/audio-permission-popup/audio-permission-popup.component';

const MAX_FILE_SIZE_IN_MBS = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_IN_MBS * 1024 * 1024;
const MAX_FILE_COUNT = 10;
const BASE64_MARKER = ';base64,';
// declare var gifFrames: any;

@Component({
    selector: 'chatroom-input',
    templateUrl: './chatroom-input.component.html',
    styleUrls: ['./chatroom-input.component.scss'],
})
export class ChatroomInputComponent implements OnInit, OnChanges, OnDestroy {
    Math = Math;
    @Input() chatroom: IChatroom;
    @Input() ajExpired: any;
    @Input() user: IUser;
    @Input() community: ICommunity;
    @Input() memberState: IMemberState;
    @Input() fetchShareUrl = '';
    @Input() urlParams: IUrlParams;
    @Output() setChatroomInputHeight: EventEmitter<any> = new EventEmitter();
    @Output() addNewMessage: EventEmitter<any> = new EventEmitter();
    @Output() changeActive: EventEmitter<any> = new EventEmitter();
    placeholder = 'Type your message';
    isLoading: boolean;
    sendingMessage = false;
    sendingMessageFile = false;
    showImageUpload = false;
    imagesToBeUpload = [];
    message = '';
    defaultProfileLink = DEFAULT_PROFILE_PHOTO_LINK;
    sendingMessageId = -1;
    mentionTemplateOpen: boolean;
    screenType: string;
    memberCanRespondInRoom: boolean;
    destroy$$ = new Subject();
    canSendMessage = true;
    readonly memberTagRegex = /<<[a-zA-Z0-9!@#\\'\" \$%\^\&*\)\(+=._-]+\|route:\/\/member\/[0-9]+>>/g;
    replyMessage: any;
    editMessage: any;
    linkPreview: any;
    showLinkPreview: any = { status: 'always', not_for: '' };
    fetchingLink: boolean = false;
    fetchingSub: any;
    messageExist: boolean = false;
    groupedData$ = new Observable();
    inputBlockMessage: string = '';
    disableInput: boolean = false;
    @ViewChild('textArea') textArea: ElementRef;
    @ViewChild('inputBox') inputBox: ElementRef;
    @ViewChild('conversation') conversationComponent: ConversationsComponent;
    @Input('childToMaster') masterName: string;
    @Input() droppedFiles: any[];

    @Input('tagUserData')
    set tagUserData(tagUserData: any) {
        this.openUserList(tagUserData);
    }

    approved: boolean = false;
    base64data: any;

    chatroomMembers: IMember[] = [];
    mentionConfig: MentionConfig = {
        dropUp: true,
        maxItems: 30,
        labelKey: 'name',
        allowSpace: true,
        mentionSelect: (item: any) => {
            setTimeout(() => this.addItem(item), 0);
            return '';
        },
        mentionFilter: (searchString: string, items: any[]) => {
            const searchStringLowerCase = searchString.toLowerCase();
            return items.filter((e) => e[this.mentionConfig.labelKey].toLowerCase().includes(searchStringLowerCase));
        },
    };

    audioRecorder: MediaRecorder;
    audioPlayer: HTMLAudioElement;
    audioFile: any = null;
    audioChunk: any[] = [];
    audioTimestampInterval: any;
    recorded: boolean = false;
    currentTime: number = 1;
    totalDuration: number;
    playerState: any;
    recording: boolean = false;
    recordingLock: boolean = false;
    showHelperTooltip: boolean = false;
    showLockHelperTooltip: boolean = false;
    pressAndHoldHandler: any;
    fromLock: boolean = false;
    audioBlob: any;
    refreshConversationsData: any = null;

    //voice recorder methods
    mouseup(e?) {
        console.log('mouseup');

        if (this.pressAndHoldHandler) {
            clearTimeout(this.pressAndHoldHandler);
            console.log('cancelled');
            this.showHelperTooltip = true;
            setTimeout(() => {
                this.showHelperTooltip = false;
            }, 3000);
            this.pressAndHoldHandler = null;
        } else {
            if (!this.recordingLock) this.stopRecording();
        }
    }

    // Touch events for mobile

    disableContextMenu(event) {
        if (getDevice() === 'mobile') event.preventDefault();
    }

    onTouchMove(e) {
        const clientX = e.changedTouches[0].clientX;
        const clientY = e.changedTouches[0].clientY;

        if (clientY < 615) {
            if (!this.recordingLock) this.recordingLock = true;
        } else if (clientX < 180) {
            if (this.audioRecorder) this.clearRecording();
        }
    }

    mousedown() {
        if (!this.recording)
            this.pressAndHoldHandler = setTimeout(() => {
                this.pressAndHoldHandler = null;
                this.startRecording();
                this.showLockHelperTooltip = true;
                setTimeout(() => {
                    this.showLockHelperTooltip = false;
                }, 3000);
                console.log(this.showLockHelperTooltip);
            }, 1000);
    }

    startRecording() {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }
        this.clearRecording();
        this.audioService.isAudioRecording$$.next(true);
        navigator.mediaDevices.enumerateDevices().then((res) => {
            let noDevice: boolean;
            for (const device of res) {
                if (device.kind === 'audioinput' && device.deviceId === '') {
                    //code to show permission dialog
                    if (this.screenType !== 'mobile') {
                        this.dialog.open(AudioPermissionPopupComponent, {
                            panelClass: ['bg-transparent', 'audio-permission-dialog'],
                            backdropClass: ['audio-permission-dialog-backdrop'],
                            disableClose: true,
                        });
                        navigator.mediaDevices.getUserMedia({ audio: true });
                    } else break;
                    noDevice = true;
                    break;
                }
            }
            if (noDevice) return;
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                const recorder = new MediaRecorder(stream);
                this.audioRecorder = recorder;
                recorder.ondataavailable = ({ data }) => {
                    this.audioChunk.push(data);
                };

                recorder.onstop = () => {
                    this.audioBlob = new Blob(this.audioChunk, { type: 'audio/aac' });

                    const reader = new FileReader();
                    reader.readAsDataURL(this.audioBlob);
                    reader.addEventListener(
                        'load',
                        () => {
                            this.base64data = reader.result;
                        },
                        false
                    );
                    this.audioFile = URL.createObjectURL(this.audioBlob);

                    this.sendAnalytics(MIXPANEL.VOICE_MESSAGE_RECORDED, null, 0, true);
                };

                recorder.start();
                if (this.screenType === 'mobile') {
                    this.placeholder = '';
                    this.recording = true;
                }
                this.audioTimestampInterval = setInterval(() => {
                    this.currentTime += 1;
                    this.totalDuration = this.currentTime;
                    if (this.currentTime >= 900) this.stopRecording();
                }, 1000);
            });
        });
    }

    droppedInto(into) {
        switch (into) {
            case 'lockingZone':
                this.recordingLock = true;
                break;
            case 'deleteZone':
                this.clearRecording();
                break;
        }
    }

    stopRecording() {
        if (this.audioRecorder?.state === 'recording') {
            this.audioService.isAudioRecording$$.next(false);
            this.recording = false;
            this.audioRecorder.stop();
            clearInterval(this.audioTimestampInterval);
            this.recorded = true;
            this.audioService.isAudioRecorded$$.next(true);
        }
    }

    clearRecording() {
        if (this.audioPlayer) this.pauseAudio();

        this.audioService.isAudioRecording$$.next(false);
        this.audioService.isAudioRecorded$$.next(false);
        this.audioRecorder = null;
        this.audioFile = null;
        this.audioChunk = [];
        this.audioPlayer = null;
        this.currentTime = 0;
        this.totalDuration = null;
        this.recorded = false;
        this.playerState = null;
        this.recordingLock = false;
        this.recording = false;
        clearInterval(this.audioTimestampInterval);
        this.fromLock = false;
        this.placeholder = 'Type your message';
        this.sendAnalytics(MIXPANEL.VOICE_MESSAGE_CANCELLED, null, 0, true);
    }

    playAudio() {
        this.audioPlayer = new Audio(this.audioFile);
        this.audioPlayer.ontimeupdate = () => {
            this.currentTime = this.audioPlayer.currentTime;
        };
        this.audioPlayer.onplaying = () => {
            this.playerState = 'playing';
            this.audioService.isAudioRecordedPreviewPlaying$$.next(true);
        };
        this.audioPlayer.onended = () => {
            this.playerState = null;
            this.audioService.isAudioRecordedPreviewPlaying$$.next(false);
            this.sendAnalytics(MIXPANEL.VOICE_MESSAGE_PREVIEWED, null, 0, true);
        };
        this.audioPlayer.onpause = () => {
            this.playerState = 'paused';
            this.audioService.isAudioRecordedPreviewPlaying$$.next(false);
        };
        if (this.playerState === 'paused') {
            this.audioPlayer.currentTime = this.currentTime;
        }
        this.audioPlayer.play();
    }

    formatCurrentTime(showTotalTime?: boolean) {
        if (showTotalTime) return this.utilsService.secondsTo_HH_MM_SS_converter(this.totalDuration);
        return this.utilsService.secondsTo_HH_MM_SS_converter(this.currentTime);
    }

    stopAudio() {
        this.pauseAudio();
        if (this.audioPlayer) this.audioPlayer.currentTime = 0;
        this.audioService.isAudioRecordedPreviewPlaying$$.next(false);
        setTimeout(() => (this.playerState = 'stopped'), 0);
    }

    pauseAudio() {
        this.audioPlayer?.pause();
    }

    createAudioMessageConversation() {
        if (this.recordingLock) {
            this.stopRecording();
            this.recordingLock = false;
        }
        setTimeout(() => {
            this.sendImages(
                {
                    files: [
                        {
                            // file: new File(this.audioChunk, `VOC_${new Date().getTime()}.aac`, { type: 'audio/aac' }),
                            // blob: this.base64data,
                            file: new File([this.audioBlob], `VOC_${new Date().getTime()}.aac`, { type: 'audio/aac' }),
                            blob: this.base64data,
                            duration: this.totalDuration,
                        },
                    ],
                    text: '',
                },
                true
            );
        }, 0);
    }
    //voice recorder methods end

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private chatroomService: ChatroomService,
        private store: Store<State>,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private snackbar: MatSnackBar,
        private sanitizer: DomSanitizer,
        private resizeService: ResizeService,
        private analyticsService: AnalyticsService,
        private dialog: MatDialog,
        private sheet: MatBottomSheet,
        public homeFeedService: HomeFeedService,
        private utilsService: UtilsService,
        private indexedDbService: IndexedDbService,
        private linkService: FetchLinksService,
        private dmService: DmService,
        private awsService: AwsS3BucketService,
        private localStorageService: LocalStorageService,
        private audioService: AudioService
    ) {}

    ngAfterViewInit() {
        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((router) => {
                if (!this.ajExpired) this.textArea?.nativeElement.focus();
            });
    }

    guestUser: any;
    ngOnInit(): void {
        this.guestUser = this.localStorageService.getSavedState('__is_guest__');

        window.addEventListener('paste', (e: any) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            this.showImageUpload = true;
            for (const item of items) {
                if (item.type.indexOf('image') === 0) {
                    var file = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.imagesToBeUpload.push({
                            file: file,
                            blob: event.target.result,
                        });
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((router) => {
                this.checkResponseRights();
                this.clearInput();
                this.clearRecording();
                this.linkPreview = null;
                if (this.user) this.getUserTagedList(router.params.chatroomId);
            });

        this.listenToReply();
        this.listenToEdit();
        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        }
        this.resizeService.onResize$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        });

        this.chatroomSettings();
        this.audioService.isAudioPlaying$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            if (res) this.stopAudio();
        });
        this.chatroomService.closeMediaPopup$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            if (res && this.audioRecorder?.state === 'recording') this.stopRecording();
        });
        this.chatroomService.stopAudioRecording$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            if (res) {
                this.stopRecording();
                this.chatroomService.stopAudioRecording$$.next(false);
            }
        });
        this.chatroomService.refreshChatroomConversations$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            this.refreshConversationsData = res;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.memberState && changes.memberState.currentValue) {
            const memberRights: any[] = [...this.memberState.member_rights];
            this.memberCanRespondInRoom =
                memberRights && memberRights.find((right) => right.state === MEMBER_RIGHT.RESPOND_IN_ROOM && right.is_selected);
            this.checkResponseRights();
        }
        if (changes.chatroom && changes.chatroom.currentValue) {
            this.checkResponseRights();
            this.chatroomSettings();
            this.homeFeedService.disableInputView$$.subscribe((res) => {
                this.disableInput = false;
                this.inputBlockMessage = '';
                if (res && res.length > 0) {
                    let convo = res[res.length - 1];
                    if (convo?.state == 13) {
                        if (convo?.answer.includes('remove')) {
                            this.inputBlockMessage = 'This member was removed from the community. Messaging is disabled.';
                        } else if (convo?.answer.includes('left')) {
                            this.inputBlockMessage = 'This member left the community. Messaging is disabled.';
                        }
                        this.disableInput = true;
                    } else if (convo?.state == 19) {
                        this.inputBlockMessage = `You can not respond to a rejected connection. Approve to send a message.`;
                        this.disableInput = true;
                    }
                }
            });
        }

        if (changes.droppedFiles) {
            for (const file of this.droppedFiles) {
                if (file.type.indexOf('image') === 0) {
                    this.showImageUpload = true;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.imagesToBeUpload = [
                            ...this.imagesToBeUpload,
                            {
                                file: file,
                                blob: event.target.result,
                            },
                        ];
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    }

    memberCanMsg = true;
    is_cm: boolean = false;
    chatroomSettings() {
        const params = {
            member_id: this.user.id,
            community_id: this.community?.id,
        };
        this.chatroomService.fetchMembersState(params).subscribe(
            (res) => {
                if (res.member.state === 1) {
                    this.is_cm = true;
                }
            },
            (err) => {
                this.is_cm = false;
            }
        );
    }

    getUserTagedList(chatroomId: number) {
        this.chatroomService.getTaggingList(this.community?.id, chatroomId).subscribe(
            (res) => {
                this.chatroomMembers = [...res.members, ...res.participants];
                // this.chatroomMembers = [...res.participants];
                this.mentionConfig.items = this.chatroomMembers;
            },
            (err) => {
                console.log('Something went wrong: ' + JSON.stringify(err));
            }
        );
    }

    listenToReply(): void {
        this.homeFeedService.replyMessage$
            .pipe(
                tap((_) => this.clearInput()),
                takeUntil(this.destroy$$)
            )
            .subscribe((reply) => {
                this.replyMessage = reply;
                if (this.replyMessage) {
                    this.textArea?.nativeElement.focus();
                }
            });
    }

    listenToEdit(): void {
        this.homeFeedService.editMessage$
            .pipe(
                tap((_) => this.clearInput()),
                takeUntil(this.destroy$$)
            )
            .subscribe((msg) => {
                this.editMessage = msg;
                if (this.textArea && msg) {
                    this.textArea.nativeElement.innerHTML = MemberTagPipe.prototype.transform(msg.answer, 'input');
                }
            });
    }

    checkResponseRights(): void {
        if (this.chatroom && this.memberState) {
            this.canSendMessage = !(
                this.chatroom.type === CHATROOM_TYPE_CODE.CARD_PURPOSE && this.memberState.state !== MEMBER_STATE.ADMIN
            );
            if (!this.canSendMessage) {
                this.placeholder = 'Only community manager can send message here';
            } else {
                this.placeholder = 'Type your message';
            }
        }
    }

    openUserList(char) {
        if (!char) return;
        if (window.getSelection) {
            document.getElementById('editor').focus();
            let code = char === '@' ? 'Digit2' : 'Digit3';
            let event = new KeyboardEvent('keydown', { key: `${char}`, code: `${code}` });
            document.getElementById('editor').dispatchEvent(event); //keyboard event first
            let r = window.getSelection().getRangeAt(0).cloneRange();
            window.getSelection().removeAllRanges();
            const a = document.createTextNode(`${char}`);
            r.insertNode(a);
            r.setStartAfter(a);
            window.getSelection().addRange(r); //inserting @ or # later
        }
    }

    sdkGuestuser() {
        alert('Guest user');
        return;
    }
    createConversation(): void {
        if (!this.user && !this.textArea) {
            return;
        }

        if (this.guestUser) {
            alert('Guest user');
            return;
        }
        const textMsg = this.parseMsg();

        if (!textMsg) {
            return;
        }

        if (this.linkPreview?.delete) this.linkPreview = null;

        if (this.chatroom.type === 10 && this.chatroom.is_private_member === true && this.chatroom.chat_request_state === null) {
            this.dialog
                .open(ConfirmDmRequestDialogComponent, { panelClass: ['reject-dm-dialog'] })
                .afterClosed()
                .subscribe((res) => {
                    if (res === 'confirm')
                        this.dmService
                            .requestDM({ chatroom_id: this.chatroom.id, chat_request_state: 0, text: textMsg })
                            .pipe(takeUntil(this.destroy$$))
                            .subscribe((res) => {
                                this.clearInput();
                                this.snackbar.open('Direct messaging request sent', null, { duration: 2000 });
                                setTimeout(() => {
                                    // location.reload();
                                    this.homeFeedService.refreshEvent.next(true);
                                }, 200);
                            });
                });
            return;
        } else if (
            this.chatroom.type === 10 &&
            this.chatroom.is_private_member === true &&
            this.chatroom.chat_request_state == 0 &&
            this.approved === false &&
            this.chatroom?.chat_requested_by[0]?.id !== this.user?.id
        ) {
            this.dialog
                .open(ApproveDmRequestDialogComponent, { panelClass: ['reject-dm-dialog'], data: { chatroom_id: this.chatroom.id } })
                .afterClosed()
                .subscribe((res) => {
                    if (res === 'accept') {
                        this.approved = true;
                        this.createConversation();
                    }
                });
            return;
        }

        this.chatroomService.markActiveChatroom$$.next(true);
        if (this.editMessage) {
            this.homeFeedService.editMessage({
                chatroomId: this.chatroom.id,
                conversationId: this.editMessage.id,
                text: textMsg,
                share_link: this.linkPreview?.og_tags?.url || this.linkPreview?.preview?.internal_link,
            });
            this.clearInput();
        } else {
            this.sendingMessageId = new Date().getTime();
            const conversationObj: ConversationModel = {
                chatroom_id: this.chatroom.id,
                text: textMsg,
                has_files: false,
                created_at: this.sendingMessageId,
                ...(this.linkPreview || ''),
            };
            if (this.urlParams.aj) {
                conversationObj.aj = this.urlParams.aj;
            }
            if (this.urlParams.source_id) {
                conversationObj.source_id = this.urlParams.source_id;
            }
            if (this.replyMessage) {
                conversationObj.replied_conversation_id = this.replyMessage.id;
            }
            this.addMessage(textMsg, this.sendingMessageId, [], [], this.linkPreview);
            this.sendingMessage = true;
            if (!this.chatroom.active) this.changeActive.emit(true);
            this.homeFeedService.createConversation(conversationObj, this.sendingMessageId, this.chatroom.follow_status).subscribe(
                (response) => {
                    this.sendingMessage = false;
                    this.sendAnalytics(MIXPANEL.CHATROOM_RESPONDED, textMsg);
                    this.showLinkPreview = { status: 'always', not_for: '' };
                    if (this.approved) {
                        // location.reload();
                        this.homeFeedService.refreshEvent.next(true);
                    } else if (this.refreshConversationsData.chatroomId) {
                        this.homeFeedService.refreshEvent.next(true);
                        this.chatroomService.refreshChatroomConversations$$.next({ chatroomId: null, urlParams: null });
                    }
                },
                (err) => {
                    this.sendingMessage = false;
                }
            );
        }
    }

    addMessage(textMsg, createdEpoch, images?, docs?, preview?): void {
        let totalFileSize = 0;
        if (images) {
            images.forEach((file) => {
                totalFileSize += file?.meta?.size;
            });
        } else if (images) {
            images.forEach((file) => {
                totalFileSize += file?.meta?.size;
            });
        }

        const conversation: any = {
            answer: textMsg,
            answer_bubble: '',
            chatroom_id: this.chatroom.id,
            community_id: this.community.id,
            created_at: moment(new Date()).format('HH:mm'),
            created_epoch: createdEpoch,
            date: moment(new Date()).format('DD MMM YYYY'),
            id: this.sendingMessageId,
            attachments: images && images.length ? [...images] : null,
            is_edited: false,
            member: {
                id: this.user.id,
                name: this.user.name,
                image_url: this.user.image_url,
            },
            member_id: this.user.id,
            pdf: docs && docs.length ? [...docs] : [],
            state: 0,
            totalFileSize,
            ...(preview || {}),
        };

        if (this.replyMessage) {
            conversation.reply_conversation = this.replyMessage.id;
            conversation.reply_conversation_object = { ...this.replyMessage };
        }

        this.addNewMessage.emit(conversation);
        this.homeFeedService.clearReplyMessage();

        this.clearInput();
    }

    clearInput(): void {
        if (this.textArea) {
            this.textArea.nativeElement.innerHTML = '';
        }
        this.linkPreview = null;
        this.messageExist = false;
        this.placeholder = 'Type your message';
    }

    parseMsg(): string {
        let innerHtml = this.textArea.nativeElement;

        if (navigator.userAgent.toLowerCase().indexOf('chrome/') == -1) {
            if (innerHtml) {
                let finalString = '';
                finalString = innerHtml.innerHTML.split('<div>')[0] + '\n';
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(innerHtml.innerHTML, 'text/html');

                let domEle = htmlDoc.getElementsByTagName('div');

                for (let i = 0; i < domEle.length; i++) {
                    finalString += domEle[i].innerHTML + '\n';
                }

                innerHtml.innerHTML = finalString;
            }
        }

        let textMsgString = '';
        if (innerHtml) {
            innerHtml.childNodes.forEach((node) => {
                if (node.tagName && node.tagName.toLowerCase() === 'span') {
                    const selectedMember = this.chatroomMembers.find((item) => item.name === node.textContent);
                    textMsgString += selectedMember ? `<<${selectedMember.name}|route://member/${selectedMember.id}>>` : node.textContent;
                } else if (node.tagName && node.tagName.toLowerCase() === 'br') {
                    textMsgString += '\n';
                } else {
                    textMsgString += node.textContent;
                }
            });
        }
        //console.log("final : ", textMsgString.replace('&nbsp;', ' ').trim());
        return textMsgString.replace('&nbsp;', ' ').trim();
    }

    addItem(event): void {
        let sel, range;
        const html = `<span contenteditable="false" class="tagged-span">${event.name}</span>&nbsp;`;
        if (!window.getSelection) {
            return;
        }
        // IE9 and non-IE
        sel = window.getSelection();
        if (!sel.getRangeAt && !sel.rangeCount) {
            return;
        }
        range = sel.getRangeAt(0);
        range.deleteContents();

        // Range.createContextualFragment() would be useful here but is
        // only relatively recently standardized and is not supported in
        // some browsers (IE9, for one)
        const el = document.createElement('div');
        el.innerHTML = html;
        let frag = document.createDocumentFragment(),
            node,
            lastNode;
        while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        // Preserve the selection
        if (!lastNode) {
            return;
        }
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    uploadImage(event): void {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }

        this.imagesToBeUpload = [];
        if (this.checkIfErrorInFiles(event.target.files)) {
            return;
        }

        for (const file of event.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagesToBeUpload = [
                    ...this.imagesToBeUpload,
                    {
                        file,
                        blob: reader.result,
                    },
                ];
            };
            reader.readAsDataURL(file);
        }
        this.showImageUpload = true;
    }

    showMessage(success: boolean, message: string): void {
        const config = new MatSnackBarConfig();
        config.panelClass = ['snackbar'];
        config.duration = 3000;
        this.snackbar.open(message, undefined, config);
    }

    startDocumentUpload(event) {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }

        if (this.checkIfErrorInFiles(event?.target?.files)) {
            return;
        }
        const pages = [];
        const files = Array.from(event.target.files);
        files.forEach((file: any) => {
            const reader: any = new FileReader();
            const fileInfo = file;
            if (fileInfo) {
                reader.readAsBinaryString(file);
                reader.onloadend = () => {
                    console.log(file, 9999999);
                    pages.push(reader.result.match(/\/Type[\s]*\/Page[^s]/g).length);
                    if (pages?.length === files?.length) this.uploadDocument(event?.text, files, pages);
                };
            }
        });
    }

    uploadDocument(eventText, documents, pages): void {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }

        this.sendingMessageId = new Date().getTime();

        this.addMessage(
            eventText,
            this.sendingMessageId,
            [],
            documents.map((file, index) => {
                return {
                    type: file?.type?.split('/')[1],
                    name: file?.name,
                    number_of_page: pages[index],
                    size: file?.size,
                    index,
                };
            })
        );
        this.sendingMessageFile = true;
        this.chatroomService.sendImageFilesEmitted$$.next(true);
        this.homeFeedService
            .createConversationWithFiles(
                {
                    chatroom_id: this.chatroom.id,
                    text: '',
                    has_files: true,
                    created_at: this.sendingMessageId,
                    attachment_count: documents?.length,
                },
                documents,
                'pdf',
                this.sendingMessageId,
                this.chatroom.follow_status,
                '',
                null,
                pages
            )
            .subscribe(
                (res) => {
                    this.sendingMessageFile = false;
                    this.chatroomService.sendImageFilesEmitted$$.next(false);
                    this.sendAnalytics(MIXPANEL.CHATROOM_RESPONDED, eventText, documents.length);
                    // Right now we are just appending the message locally (Calling addMessage function).
                    // We need to update it from the server whenever we add socket to it.
                    // this.conversationComponent.fetchMoreConversation(1);
                },
                (err) => {
                    this.sendingMessageFile = false;
                    this.chatroomService.sendImageFilesEmitted$$.next(false);
                }
            );
    }

    uploadAudio(event): void {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }
        this.imagesToBeUpload = [];
        if (this.checkIfErrorInFiles(event.target.files)) {
            return;
        }

        this.utilsService.fetchAllAudioFilesDuration(event.target.files).then((fileObjects) => {
            fileObjects.forEach((fileObject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagesToBeUpload = [
                        ...this.imagesToBeUpload,
                        {
                            file: fileObject.file,
                            blob: reader.result,
                            duration: parseInt(`${fileObject.duration}`.toString()),
                        },
                    ];
                };
                reader.readAsDataURL(fileObject.file);
            });
        });

        this.showImageUpload = true;
    }

    openPollsModal() {
        let dialog = this.dialog.open(PollsChatCardComponent, {
            panelClass: 'micropoll-modal',
            maxHeight: '85vh',
            //backgroundColor : "green",
            data: {
                community: this.community,
                user: this.user,
                chatroom: this.chatroom,
            },
        });
        this.utilsService.closeMatDialogBox$$.subscribe((res) => {
            if (res) {
                dialog.close();
                this.utilsService.closeMatDialogBox$$.next(false);
            }
        });
    }

    checkIfErrorInFiles(files): boolean {
        if (files.length > MAX_FILE_COUNT) {
            this.showMessage(false, `Can't send more than ${MAX_FILE_COUNT} attachments.`);
            return true;
        }
        const fileArray: any[] = Array.from(files);
        if (fileArray.find((file) => file.size > MAX_FILE_SIZE_BYTES)) {
            this.showMessage(false, `Maximum allowed size is ${MAX_FILE_SIZE_IN_MBS} Mbs.`);
            return true;
        }
        return false;
    }

    closeDialog(): void {
        this.showImageUpload = false;
        this.imagesToBeUpload = [];
    }

    convertDataURIToBinary(dataURI) {
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    sendImages(event, voice_note?): void {
        this.closeDialog();
        this.sendingMessageId = new Date().getTime();
        this.imagesToBeUpload = [];

        if (event.files[0].file.type == 'image/gif') {
            gifFrames({ url: event.files[0].blob, frames: 'all', outputType: 'canvas', cumulative: true })
                .then((frameData) => {
                    let thumbnail_url = frameData[0].getImage().toDataURL();
                    let height = frameData[0].frameInfo.height;
                    let width = frameData[0].frameInfo.width;
                    let thumbnail_object = { thumbnail_url, height, width };
                    this.createImageGifConversation(event, thumbnail_object);
                })
                .catch(console.error.bind(console));
            return;
        } else this.createImageGifConversation(event, '', voice_note);
    }

    storeFileInIndexedDB(event, thumbnail_object) {
        console.log('THESE ARE FILES ', event.files);
        return this.indexedDbService.db
            .collection('mediaFiles')
            .doc(`${this.sendingMessageId}`)
            .set({
                message: event.text,
                files: event.files,
            })
            .then((res) => {
                this.createImageGifConversation(event, thumbnail_object);
            });
    }

    createImageGifConversation(event, thumbnail_object, voice_note?) {
        // STORE THE FILES IN INDEXED DB WHILE THEY ARE UPLOADING

        this.addMessage(
            event.text,
            this.sendingMessageId,
            event.files.map((file, index) => {
                let url = file.blob;
                return {
                    url,
                    index,
                    type: voice_note ? 'voice_note' : file.file.type.split('/')[0],
                    thumbnail_url: thumbnail_object?.thumbnail_url,
                    name: file.file.name,
                    meta: {
                        duration: file?.duration,
                        size: file?.file?.size,
                    },
                };
            })
        );

        this.chatroomService.sendImageFilesEmitted$$.next(true);

        let type = voice_note ? 'voice_note' : event.files[0].file.type.split('/')[0];

        this.clearRecording();

        this.homeFeedService
            .createConversationWithFiles(
                {
                    chatroom_id: this.chatroom.id,
                    text: event.text,
                    has_files: true,
                    created_at: this.sendingMessageId,
                    attachment_count: event.files.length,
                },
                event.files.map((file) => file.file),
                type,
                this.sendingMessageId,
                this.chatroom.follow_status,
                thumbnail_object,
                event.files.map((file) => file.duration)
            )
            .subscribe(
                (resp) => {
                    // this.chatroomService.micropollUpdated$$.next(true);

                    if (resp.length === event.files.length) {
                        this.homeFeedService.deleteIndexedDBvalues.next(true);
                    }

                    // RETRIEVE THE ORIGINAL MESSAGE ID FROM BEHAVIOURIAL SUBJECT
                    let mapTempToOriginalMessageID = this.homeFeedService.mapTempToOriginalMessageIDs$$.value;
                    let originalMessageID = mapTempToOriginalMessageID[this.sendingMessageId];
                    let val = this.homeFeedService.currentlyLoadingMediaIds$$;
                    val[originalMessageID] = false;
                    this.homeFeedService.currentlyLoadingMediaIds$$.next(val);
                    ///

                    this.chatroomService.sendImageFilesEmitted$$.next(false);
                    this.sendAnalytics(MIXPANEL.CHATROOM_RESPONDED, event.text, event.files.length);
                    if (voice_note) {
                        this.sendAnalytics(MIXPANEL.VOICE_MESSAGE_SENT, null, 0, true, originalMessageID);
                        const conversationData = this.homeFeedService.conversationGroupsBehavior$.value;
                        if (conversationData[this.chatroom.id]) {
                            const index = conversationData[this.chatroom.id].findIndex((message) => message.id === originalMessageID);

                            // STORE THE TEMP AND ORIGINAL IDS IN BEHAVIOURIAL SUBJECT
                            let mapTempToOriginalMessageID = this.homeFeedService.mapTempToOriginalMessageIDs$$.value;
                            mapTempToOriginalMessageID[originalMessageID] = resp.id;

                            if (index) {
                                const newMessage = conversationData[this.chatroom.id][index];
                                newMessage.id = resp.id;

                                // UPDATE THE MESSAGE ID STORED IN INDEXED DB
                                let lacalbaseMessageIdObject: any;
                                lacalbaseMessageIdObject = this.localStorageService.getSavedState(STORAGE_KEY.LOCABASE_INDEX);
                                if (!lacalbaseMessageIdObject) {
                                    lacalbaseMessageIdObject = {};
                                }

                                lacalbaseMessageIdObject[`${resp.id}`] = originalMessageID;

                                this.localStorageService.setSavedState(lacalbaseMessageIdObject, STORAGE_KEY.LOCABASE_INDEX);

                                conversationData[this.chatroom.id].splice(index, 1, newMessage);
                                this.homeFeedService.conversationGroupsBehavior$.next({ ...conversationData });
                                // this.chatroomService.scrollToBottom$$.next(true);
                            }
                        }
                    }
                },
                (err) => {
                    this.chatroomService.sendImageFilesEmitted$$.next(false);
                    // Show Retry Button
                    console.log('This is the error : ', err);
                }
            );
    }

    handleInputChange(evt): boolean {
        this.setChatroomInputHeight.emit(this.inputBox.nativeElement.offsetHeight);
        if (evt.key === 'Enter' && !evt.shiftKey && !evt.metaKey && !evt.altKey && !evt.ctrlKey) {
            if (!this.mentionTemplateOpen) {
                this.createConversation();
            }
            evt.preventDefault();
            return false;
        }
        return true;
    }

    getMemberListWidth(): string {
        if (this.screenType !== 'mobile') {
            return;
        }
        const mentionListPadding = 36; // need to be changed if padding of mention list is changed
        return this.textArea?.nativeElement?.offsetWidth + mentionListPadding + 'px';
    }
    getSerchResult(event): void {
        const searchResult: boolean = this.chatroomMembers.some(
            (memeber) => memeber.name.toLocaleLowerCase().indexOf(String(event).toLocaleLowerCase()) !== -1
        );
        if (this.mentionTemplateOpen && !searchResult) {
            this.setMentionTemplateOpen(false);
        }
        if (searchResult) {
            this.setMentionTemplateOpen(true);
        }
    }

    setMentionTemplateOpen(value): void {
        setTimeout(() => (this.mentionTemplateOpen = value), 0);
    }

    joinCommunity(): void {
        if (!this.memberState) {
            return;
        }
        if (!this.memberState.state) {
            let redirectUrl: string;
            this.store.pipe(select(getRedirectUrl)).subscribe((url) => (redirectUrl = url));
            this.router.navigate(['auth']);
            if (redirectUrl.includes('?')) {
                redirectUrl = `${redirectUrl}&page=generate_otp`;
            } else {
                redirectUrl = `${redirectUrl}?page=generate_otp`;
            }
            this.router.navigateByUrl(`${redirectUrl}`);
        }
    }

    onImgError(event): void {
        if (event) {
            event.target.src = this.defaultProfileLink;
        }
    }

    sendAnalytics(eventType, textMsg?, fileCount = 0, voice_note_event?, message_id?): void {
        let payload: any = {
            chatroom_id: this.chatroom.id,
            community_id: this.community.id,
            chatroom_type: CHATROOM_TYPE_MAP[this.chatroom.type],
        };
        if (message_id) {
            payload = {
                message_id,
                ...payload,
            };
        }
        if (!voice_note_event) {
            payload = {
                no_of_users_tagged: ((textMsg && textMsg.match(this.memberTagRegex)) || []).length,
                no_of_files_attached: fileCount,
                member_state: MEMBER_STATE_MAP[this.memberState?.state],
                ...payload,
            };
        }
        this.analyticsService.sendEvent(eventType, payload);
    }

    setPlaceholder(evt): void {
        const inputLength = evt.target.innerText.trim().length;
        this.message = evt.target.innerText;

        if (!inputLength) {
            evt.target.innerHTML = '';
            this.messageExist = false;
        } else this.messageExist = true;
        this.placeholder = inputLength ? '' : 'Type your message';

        this.fetchLink(this.message);
    }

    removePreview() {
        this.showLinkPreview = { status: 'never', not_for: this.linkPreview?.og_tags?.url || this.linkPreview?.preview?.internal_link };
        this.linkPreview = null;
    }

    fetchLink(message: String) {
        let links = message.match(urlPattern());
        let onlyEmailPresent = true;
        if (links) {
            for (let i = 0; i < links.length; i++) {
                if (!links[i].match(emailPattern())) {
                    onlyEmailPresent = false;
                    links[0] = links[i];
                    break;
                }
            }
        }

        if (this.showLinkPreview.status === 'never' && links[0] !== this.showLinkPreview?.not_for) {
            this.showLinkPreview = { status: 'always', not_for: '' };
        }

        if (this.showLinkPreview.status === 'never' && links[0] === this.showLinkPreview?.not_for) {
            this.fetchingLink = false;
            return;
        }

        if (!links || links.length === 0) {
            this.linkPreview = null;
            this.fetchingLink = false;
            return;
        }

        if (onlyEmailPresent) return;

        if (this.linkPreview?.og_tags?.url === links[0] || this.linkPreview?.preview?.url === links[0]) {
            this.fetchingLink = false;
            return;
        } else {
            if (this.fetchingSub) {
                this.fetchingSub.unsubscribe();
                this.fetchingSub = null;
            }
            if (isInternalLink(links[0])) {
                this.fetchingSub = this.linkService.fetchInternalLink(links[0]).subscribe(
                    (res) => {
                        this.linkPreview = null;
                        this.fetchingLink = false;
                        if (this.messageExist)
                            this.linkPreview = {
                                preview: res.preview || null,
                            };
                    },
                    (err) => {
                        this.fetchingLink = false;
                        const url = decodeURIComponent(
                            err.message?.slice(err.message?.indexOf('url=') + 4, err.message?.lastIndexOf(': 500'))
                        );

                        if (url === links[0]) this.linkPreview = { preview: { url }, delete: true };
                    }
                );
            } else {
                this.fetchingSub = this.linkService.decodeExternalLink(links[0]).subscribe(
                    (res) => {
                        // if (!res.og_tags.title && !res.og_tags.description && !res.og_tags.image) {
                        this.linkPreview = null;
                        this.fetchingLink = false;
                        if (this.messageExist) {
                            this.linkPreview = {
                                og_tags: { ...res.og_tags },
                            };
                        }
                    },
                    (err) => {
                        this.fetchingLink = false;
                        const url = decodeURIComponent(
                            err.message?.slice(err.message?.indexOf('url=') + 4, err.message?.lastIndexOf(': 500'))
                        );

                        if (url === links[0]) this.linkPreview = { og_tags: { url }, delete: true };
                    }
                );
            }
        }
    }

    pasteItem(evt): void {
        this.imagesToBeUpload = [];
        let content: any;

        evt.preventDefault();

        if (evt.clipboardData) {
            content = evt.clipboardData.getData('Text');
            if (window.getSelection) {
                const selObj = window.getSelection();
                const selRange = selObj.getRangeAt(0);
                selRange.deleteContents();
                selRange.insertNode(document.createTextNode(content));
                selObj.removeAllRanges();
                const textareaRange = document.createRange();
                textareaRange.selectNodeContents(this.textArea.nativeElement);
                textareaRange.collapse(false);
                selObj.addRange(textareaRange);
                setTimeout((_) => (this.textArea.nativeElement.scrollTop = this.textArea.nativeElement.scrollHeight), 0);
            }
        } else if (evt.originalEvent.clipboardData) {
            content = (evt.originalEvent || evt).clipboardData.getData('text/plain');
            document.execCommand('insertText', false, content);
        }
        this.message = content;
        this.messageExist = true;
        if (!this.fetchingLink) {
            this.fetchingLink = true;
            this.fetchLink(this.message);
        }

        // const items = (evt.clipboardData || evt.originalEvent.clipboardData).items;
        // const image: any = Array.from(items).find((item: any) => {
        //   const itemType = item.type.split('/');
        //   return (itemType[0] === 'image' && ['jpg', 'svg', 'jpeg', 'png'].includes(itemType[1]));
        // });
        // if (image) {
        //   const reader = new FileReader();
        //   reader.onload = (event) => {
        //     this.imagesToBeUpload = [...this.imagesToBeUpload, {
        //       file: image,
        //       blob: event.target.result
        //     }];
        //   };
        //   reader.readAsDataURL(image.getAsFile());
        //   this.showImageUpload = true;
        // }
    }

    downloadApp(): void {
        this.trackDownloadApp();
        window.open(this.fetchShareUrl, '_blank');
    }

    trackDownloadApp(): void {
        this.analyticsService.sendEvent(MIXPANEL.DOWNLOAD_APP, {
            source: DOWNLOAD_BUTTON_SOURCE.BOTTOM_BAR,
            type: DOWNLOAD_BUTTON_TYPE.GENERAL,
            community_id: this.community?.id,
            chatroom_id: this.chatroom?.id,
            chatroom_type: CHATROOM_TYPE_MAP[this.chatroom.type],
        });
    }

    checkPurposeRoom(event): boolean {
        if (this.chatroom.type === CHATROOM_TYPE_CODE.CARD_PURPOSE && this.memberState.state !== MEMBER_STATE.ADMIN) {
            event.stopPropagation();
            event.preventDefault();
            this.showRightPopup();
            return false;
        }
        return true;
    }

    showRightPopup(): void {
        const data: ChoiceDialogData = {
            subTitle:
                'Responses in this chatroom are disabled to reduce any potential spam. However, you may start a new chatroom to share your views.',
            choices: ['Ok'],
        };
        if (this.screenType === 'mobile') {
            const sheetRef = this.sheet.open(ChoiceSheetComponent, {
                data,
            });
        } else {
            const dialogRef = this.dialog.open(ChoiceDialogComponent, {
                panelClass: 'attend-event-modal',
                data,
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$$.next();
        this.destroy$$.complete();
        this.clearRecording();
    }
}

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewRef,
} from '@angular/core';
import * as moment from 'moment';
import _ from 'lodash';
import { IUser } from 'src/app/shared/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DEFAULT_PROFILE_PHOTO_LINK } from 'src/app/shared/constants/api.constant';
import { Router } from '@angular/router';
import { COLLABCARD_PATH, COMMUNITY_FEED_PATH, EVENT_DETAIL, EVENT_FEED_PATH, PROFILE } from 'src/app/shared/constants/routes.constant';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { MIXPANEL, SOURCE } from 'src/app/shared/enums/mixpanel.enum';
import { ProfileNotExistPopupComponent } from 'src/app/shared/entryComponents/profile-not-exist-popup/profile-not-exist-popup.component';
import { createMixPanelPayload, createWebUrlForHomeFeed, getDevice } from '../../../../shared/utils';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { BehaviorSubject, fromEvent, of, Subject, Observable, forkJoin, combineLatest } from 'rxjs';
import { delay, map, mergeMap, takeUntil } from 'rxjs/operators';
import { CHATROOM_TYPE_CODE, MESSAGE_STATE } from '../../../../shared/enums/chatroom-type.enum';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';
import { IndexedDbService } from 'src/app/core/services/indexed-db.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { memberNameWithEmojiRegex, memberTagWithEmojiRegex } from 'src/app/shared/regex';
import { memberTagWithEmojiRegexProfile } from 'src/app/shared/regexProfile';
import { AwsS3BucketService } from 'src/app/core/services/aws-s3-bucket.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AudioService } from 'src/app/core/services/audio.service';
import { EmojiListDialogComponent } from 'src/app/shared/entryComponents/emoji-list-dialog/emoji-list-dialog.component';
import { EmojiListMobileSheetComponent } from 'src/app/shared/entryComponents/emoji-list-mobile-sheet/emoji-list-mobile-sheet.component';
//import {regex} from "./emojisRegex";

@Component({
    selector: 'normal-chat-card',
    templateUrl: './normal-chat-card.component.html',
    styleUrls: ['./normal-chat-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormalChatroomComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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

    @Input() isOtherMember: boolean;
    @Input() message: any;
    @Input() user: IUser;
    @Input() wrapperClass: string;
    @Input() isNewMessage: boolean;
    @Input() communityId = 0;
    @Input() chatroomId = 0;
    @Input() chatroom: any;
    @Input() chatroomType = 0;
    @Input() is_cm;
    @Input() selected = false;
    @Input() selectedMsgLength = 0;
    @Input() playGifFile;
    @Input() preventScrollToBottom: boolean;
    @Input() hideRetryButton;
    @Input() playingAudioId;
    @Output() showGallery: EventEmitter<any> = new EventEmitter();
    @Output() showMediaGallery: EventEmitter<any> = new EventEmitter();
    @Output() playingAudioIdEvent: EventEmitter<any> = new EventEmitter();
    @Output() followChatroom: EventEmitter<any> = new EventEmitter();

    remainingMediaFile: number;
    readonly profileSubHeading = 'Please download the app to see member profile and connect with the community.';
    readonly defaultProfileLink = DEFAULT_PROFILE_PHOTO_LINK;
    deletedText = '';
    imgInit1;
    imgInitShow: boolean = true;
    remainingMediaToBeUploaded: any[] = [];
    hideRetryButtonDiv = false;

    readonly MSG_BATCH_SIZE = 1000;
    charCount = 1000;
    isMyMsg = false;
    destroy$$ = new Subject();
    touchstart$$: Observable<any>;
    touchend$$: Observable<any>;
    touchMoved$$: Observable<any>;
    isIntroductionsRoom = false;
    sendingMessageFile: any;
    showLoader = true;
    showLoaderTesting = false;
    currentlyLoadingMediaId: number;
    totLoaderPercentageValue: number = 0;
    totProgressPercentage$$ = new BehaviorSubject<number>(0);
    uploadPercentageEmitter$$ = new BehaviorSubject<number>(0);
    uploadPercentageEmitter = this.uploadPercentageEmitter$$.value;
    messageParsing = [];
    memberTags: any[] = [];
    memberTagsString: any[] = [];
    randomString = 'lkjfgl;sj5989dnksjhst34589fdjdfg0dg-0';
    memberTagValue: any;
    openGifMedia: boolean;
    value = 'first';
    num = 0;
    playingAudio: boolean = false;
    showAllAudios: boolean = false;
    totalUploadedBytes: any = 0;
    totalFileSize: number | string = null;
    uniqueId: string;
    showEmojiPicker: boolean = false;
    showMobileEmojiPicker: boolean = false;
    isDifferentClass: boolean = false;
    isSameClass: boolean = false;
    reactions: any[] = [];
    hasMoreReactions: boolean = false;
    openedEmojiPickerId: number = null;
    displayMessageOptions: boolean = true;
    disableClickFlag: boolean = false;
    ignoreTouchEndEvent: boolean = true;
    timeout: any = null;
    screenType: string;
    startsInTimeText: string = '';
    eventEnded: boolean = false;
    bannerImage: string;
    @ViewChild('messageWrap') messageWrap: ElementRef;
    @ViewChild('audioEle') audioEle: ElementRef;
    task: AngularFireUploadTask;
    allConversations: any[] = [];
    allChatroomDetail: any = {};
    showMessageHighlight: any = { messageId: null, show: false };
    guestUser: any;
    constructor(
        private dialog: MatDialog,
        private router: Router,
        private analyticsService: AnalyticsService,
        private homeFeedService: HomeFeedService,
        private chatroomService: ChatroomService,
        private indexedDbService: IndexedDbService,
        private localStorageService: LocalStorageService,
        private _cdr: ChangeDetectorRef,
        private awsS3BucketService: AwsS3BucketService,
        private utilsService: UtilsService,
        private snackBar: MatSnackBar,
        private _bottomSheet: MatBottomSheet,
        private audioService: AudioService,
        private elementRef: ElementRef
    ) {}

    ngOnInit(): void {
        this.guestUser = this.localStorageService.getSavedState('__is_guest__');

        this.screenType = getDevice();
        if (this.message?.answer) {
            this.message.answer = this.message?.answer.replace('* This is a gif message. Please update your app *', '');
        }

        this.hideRetryButtonDiv = this.message?.attachments_uploaded;

        this.isFileUploading();
        this.uniqueId = this.chatroomId?.toString() + this.message.id?.toString();

        this.awsS3BucketService.totalBytesUploadedObject$$.subscribe((value) => {});

        this.memberTagValue = this.message.answer;
        let regex;
        if (this.memberTagValue?.search('member_profile') != -1) {
            regex = memberTagWithEmojiRegexProfile;
        } else {
            regex = memberTagWithEmojiRegex;
        }
        this.memberTagValue = this.message?.answer?.replace(/[\u{0080}-\u{FFFF}]/gu, '');

        this.memberTags = this.memberTagValue?.match(regex);
        this.memberTagsString = this.memberTagValue?.match(regex);
        if (this.memberTags) {
            this.messageParsing = this.memberTagValue.split(new RegExp(this.memberTags.join('|'), 'g'));

            this.memberTags =
                this.memberTags &&
                this.memberTags.map((member) => `<b class="text-capitalize">${member.match(memberNameWithEmojiRegex)[2]}</b>`);

            let i = 0;

            this.messageParsing.forEach((message, index) => {
                if (message === '|') {
                    this.messageParsing[index] = this.randomString + this.memberTags[i] + `${i}`;
                    i += 1;
                }
            });
        }

        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);

        this.homeFeedService.currentlyLoadingMediaIds$$.subscribe((res) => {
            this.currentlyLoadingMediaId = res[this.message.id];
        });

        this.homeFeedService.conversationGroups$.subscribe((res) => {
            if (!_.isEqual(res, this.allConversations)) this.allConversations = res;
        });
        this.homeFeedService.chatroomDetailGroup$.subscribe((res) => {
            if (!_.isEqual(res, this.allChatroomDetail)) this.allChatroomDetail = res;
        });

        this.chatroomService.playingAudio$$.subscribe((res) => {
            this.playingAudio = res;
        });
        this.chatroomService.openedEmojiPickerId$$.subscribe((res) => {
            if (res && !this.message?.id) {
                if (this.chatroomId !== res) {
                    this.showEmojiPicker = false;
                    this._cdr.detectChanges();
                }
            } else if (res && this.message?.id !== res && this.showEmojiPicker) {
                this.showEmojiPicker = false;
                this._cdr.detectChanges();
            }
        });

        this.hasDifferentClass();
        this.hasSameClass();
        this.sortReactions(this.message?.reactions);
        this.announcementRoomPermissions();
        this.setStartsInTime();
        this.setBannerImage();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setDeletedStrings();
        this.checkMyMsg();
        this.replaceDeletedString();

        this.isIntroductionsRoom = [CHATROOM_TYPE_CODE.CARD_INTRODUCTIONS].includes(this.chatroomType);
        if (changes.message && changes.message.currentValue) {
            const attachments: any[] = this.message.attachments;
            const mediaLength: number = this.message.attachments && this.message.attachments.length;
            this.message.reactions = changes.message.currentValue.reactions;
            this.sortReactions(this.message.reactions, true);
            this.message.attachments =
                attachments &&
                attachments.reduce((items, item, index) => {
                    item = {
                        ...item,
                        isLastTile: (mediaLength === 3 && index === 1) || (mediaLength > 4 && index === 3),
                        showTile: [1, 2, 4].includes(mediaLength)
                            ? true
                            : (mediaLength === 3 && index < 1) || (mediaLength > 4 && index < 3),
                    };
                    items.push(item);
                    return items;
                }, []);
            if (mediaLength > 2) {
                this.remainingMediaFile = mediaLength - (mediaLength === 3 ? 1 : mediaLength > 4 ? 3 : 0);
            }
        }
    }

    ngAfterViewInit(): void {
        this.listenToClick();
        this.chatroomService.showMessageHighlight$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            if (res.scrollToMessage) {
                setTimeout(() => {
                    this.scrollToMessage(res.messageId);
                    return;
                }, 150);
            } else if (res.show && this.message?.id === res.messageId) {
                this.showMessageHighlight = { messageId: res.messageId, show: res.show };
                this._cdr.detectChanges();
                this.elementRef?.nativeElement?.querySelector(`#messagehighlight${res?.messageId}`)?.addEventListener(
                    'animationend',
                    (ev) => {
                        if (ev.type === 'animationend') {
                            this.showMessageHighlight = { messageId: res.messageId, show: false };
                            this._cdr.detectChanges();
                        }
                    },
                    false
                );
                this.chatroomService.showMessageHighlight$$.next({ messageId: null, show: false, scrollToMessage: false });
            }
        });
    }

    scrollToMessage(id: string, messageId?: string | number): void {
        if (id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ block: 'center' });
                this.chatroomService.showMessageHighlight$$.next({ messageId: id, show: true, scrollToMessage: false });
            }
        }
    }

    setBannerImage(): void {
        if (this.chatroom) {
            const imageAttachments = this.chatroom.attachments?.filter((attachment) => attachment.type === 'image');
            this.bannerImage = imageAttachments ? imageAttachments[0]?.url : 'assets/images/png/gradient.png';
        }
    }

    setStartsInTime() {
        if (this.chatroom) {
            let today = moment(new Date().valueOf());

            if (today > this.chatroom.end_date) {
                this.eventEnded = true;
            } else if (today <= this.chatroom.date_time) {
                const timeDiff = moment.duration(moment(this.chatroom.date_time).diff(moment(new Date().valueOf())));

                if (Math.floor(timeDiff.asDays()) > 0) {
                    if (Math.floor(timeDiff.asDays()) === 1) this.startsInTimeText = `Starts in 1 day`;
                    else this.startsInTimeText = `Starts in ${Math.floor(timeDiff.asDays())} days`;
                } else if (Math.floor(timeDiff.asHours()) > 0) {
                    if (Math.floor(timeDiff.asHours()) === 1) this.startsInTimeText = `Starts in 1 hour`;
                    else this.startsInTimeText = `Starts in ${Math.floor(timeDiff.asHours())} hours`;
                } else if (Math.floor(timeDiff.asMinutes())) {
                    if (Math.floor(timeDiff.asMinutes()) === 1) this.startsInTimeText = `Starts in 1 minute`;
                    else this.startsInTimeText = `Starts in ${Math.floor(timeDiff.asMinutes())} minutes`;
                }
            } else if (today > this.chatroom.date_time) {
                const timeDiff = moment.duration(moment(new Date().valueOf()).diff(moment(this.chatroom.date_time)));

                if (Math.floor(timeDiff.asDays()) > 0) {
                    if (Math.floor(timeDiff.asDays()) === 1) this.startsInTimeText = `Ends in 1 day`;
                    else this.startsInTimeText = `Ends in ${Math.floor(timeDiff.asDays())} days`;
                } else if (Math.floor(timeDiff.asHours()) > 0) {
                    if (Math.floor(timeDiff.asHours()) === 1) this.startsInTimeText = `Ends in 1 hour`;
                    else this.startsInTimeText = `Ends in ${Math.floor(timeDiff.asHours())} hours`;
                } else if (Math.floor(timeDiff.asMinutes())) {
                    if (Math.floor(timeDiff.asMinutes()) === 1) this.startsInTimeText = `Ends in 1 minute`;
                    else this.startsInTimeText = `Ends in ${Math.floor(timeDiff.asMinutes())} minutes`;
                }
            }
        }
    }

    announcementRoomPermissions(): void {
        const isAnnouncementRoom = [CHATROOM_TYPE_CODE.CARD_PURPOSE].includes(this.chatroomType);
        if (isAnnouncementRoom && !this.chatroom?.member_can_message && !this.is_cm) this.displayMessageOptions = false;
        else this.displayMessageOptions = true;
    }

    handleViewEventRoute() {
        this.router.navigate([`/${EVENT_FEED_PATH}/${this.communityId}/${COLLABCARD_PATH}/${this.chatroomId}/${EVENT_DETAIL}`]);
    }

    sortReactions(reactions: any[], trigger?: boolean) {
        const reactionsList: any[] = reactions?.reduce((result: any[], reaction) => {
            const reactionIndex = result?.findIndex((el) => el?.emoji === reaction?.reaction);

            if (reactionIndex >= 0) result[reactionIndex].value++;
            else result.push({ emoji: reaction?.reaction, value: 1 });

            return result;
        }, []);

        if (getDevice() === 'mobile') {
            this.reactions = reactionsList?.slice(0, 2);
            if (reactionsList?.length > 2) this.hasMoreReactions = true;
            else this.hasMoreReactions = false;
        } else {
            this.reactions = reactionsList?.slice(0, 5);
            if (reactionsList?.length > 5) this.hasMoreReactions = true;
            else this.hasMoreReactions = false;
        }
        if (trigger) this._cdr.detectChanges();
    }

    hasDifferentClass() {
        this.isDifferentClass = this.wrapperClass?.includes('different ');
    }

    hasSameClass() {
        this.isSameClass = this.wrapperClass?.includes('same-user');
    }

    cancelSelection(): void {
        this.homeFeedService.clearSelectedMsg();
    }

    openMobileEmojiPicker(event) {
        event.stopPropagation();
        const mixPanelPayload = {
            from: 'long press',
            message_id: this.message?.id,
            chatroom_id: this.chatroomId,
            community_id: this.communityId,
        };
        this.analyticsService.sendEvent(MIXPANEL.EMOTICON_TRAY_OPENED, mixPanelPayload);
        this.showMobileEmojiPicker = !this.showMobileEmojiPicker;
        this.cancelSelection();
    }

    toggleEmojiPicker(event, messageId) {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }
        event.stopPropagation();
        this.showEmojiPicker = !this.showEmojiPicker;
        if (this.message?.id) this.chatroomService.openedEmojiPickerId$$.next(this.message?.id);
        else this.chatroomService.openedEmojiPickerId$$.next(this.chatroomId);
        if (this.showEmojiPicker) {
            const mixPanelPayload = {
                from: 'reaction button',
                message_id: this.message?.id,
                chatroom_id: this.chatroomId,
                community_id: this.communityId,
            };
            this.analyticsService.sendEvent(MIXPANEL.EMOTICON_TRAY_OPENED, mixPanelPayload);
        }
    }

    closeEmojiPicker(event) {
        if (this.showEmojiPicker) this.showEmojiPicker = false;
    }

    closeMobileEmojiPicker(event) {
        if (this.showMobileEmojiPicker) this.showMobileEmojiPicker = false;
    }

    updateOrAddEmojiMessage(reaction, action?: string) {
        const messageIdx = this.allConversations[this.chatroomId].findIndex((conv) => conv.id === this.message.id);

        const messageCopy = _.cloneDeep(this.allConversations[this.chatroomId][messageIdx]);
        // const messageCopy = _.cloneDeep(this.message);
        if (action === 'delete') {
            const reactionsCopy = _.cloneDeep(this.message.reactions);
            const filteredReactionsCopy = reactionsCopy.filter((r) => r.member.id !== this.user.id);
            messageCopy.reactions = filteredReactionsCopy;
        } else {
            const hasUserReacted = messageCopy.reactions?.some((r) => r.member.id === this.user.id);

            if (hasUserReacted) {
                messageCopy.reactions.forEach((r) => {
                    if (r.member.id === this.user.id) r.reaction = reaction;
                });
            } else {
                const reactionObj = {
                    member: {
                        id: this.user.id,
                        image_url: this.user.image_url,
                        name: this.user.name,
                    },
                    reaction,
                };
                if (messageCopy.reactions) messageCopy.reactions.push(reactionObj);
                else messageCopy['reactions'] = [reactionObj];
            }
        }
        // console.log(messageCopy, this.allConv[this.chatroomId][messageIdx], this.allConv);
        this.allConversations[this.chatroomId][messageIdx] = messageCopy;

        this.homeFeedService.updateConversationGroup(this.allConversations);
        // this.message = messageCopy;
        // this.sortReactions(this.message.reactions, true);
    }

    updateOrAddEmojiTitle(reaction, action?: string) {
        const allChatroomDetailCopy = _.cloneDeep(this.allChatroomDetail);
        const currentChatroom = allChatroomDetailCopy[this.chatroomId];

        if (action === 'delete') {
            const filteredReactionsCopy = currentChatroom.chatroom.reactions?.filter((r) => r.member.id !== this.user.id);
            currentChatroom.chatroom.reactions = filteredReactionsCopy;
        } else {
            const hasUserReacted = currentChatroom.chatroom.reactions?.some((r) => r.member.id === this.user.id);

            if (hasUserReacted) {
                currentChatroom.chatroom.reactions.forEach((r) => {
                    if (r.member.id === this.user.id) r.reaction = reaction;
                });
            } else {
                const reactionObj = {
                    member: {
                        id: this.user.id,
                        image_url: this.user.image_url,
                        name: this.user.name,
                    },
                    reaction,
                };
                if (currentChatroom.chatroom.reactions) currentChatroom.chatroom.reactions.push(reactionObj);
                else currentChatroom.chatroom['reactions'] = [reactionObj];
            }
        }

        allChatroomDetailCopy[this.chatroomId] = currentChatroom;

        this.homeFeedService.updateChatroomDetailGroup(allChatroomDetailCopy);
    }

    updateOrAddEmoji(reaction, action?: string) {
        if (this.message?.id) this.updateOrAddEmojiMessage(reaction, action);
        else this.updateOrAddEmojiTitle(reaction, action);
    }

    addEmoji(event) {
        const payload = {
            chatroom_id: this.chatroomId,
            reaction: event?.emoji?.native,
        };
        if (this.message?.id) payload['conversation_id'] = this.message?.id;
        this.chatroomService.addConversationReaction(payload).subscribe(
            (res) => {
                this.chatroomService.preventScrollToBottomEvent$$.next(true);
                this.updateOrAddEmoji(event?.emoji?.native);
                const mixPanelPayload = {
                    reaction: event?.emoji?.native,
                    from: getDevice() === 'mobile' ? 'long press' : 'reaction button',
                    message_id: this.message?.id,
                    chatroom_id: this.chatroomId,
                    community_id: this.communityId,
                };
                this.analyticsService.sendEvent(MIXPANEL.REACTION_ADDED, mixPanelPayload);
                if (!this.chatroom?.follow_status) this.followChatroom.emit();
            },
            (error) => {
                this.snackBar.open('Something went wrong', 'OK', {
                    duration: 3000,
                    panelClass: ['black-bottom-left-snackbar'],
                });
            }
        );
        if (this.showEmojiPicker) this.showEmojiPicker = false;
        else if (this.showMobileEmojiPicker) this.showMobileEmojiPicker = false;
        this.cancelSelection();
    }

    showEmojiList(reaction) {
        const mixPanelPayload = {
            message_id: this.message?.id,
            chatroom_id: this.chatroomId,
            community_id: this.communityId,
        };
        this.analyticsService.sendEvent(MIXPANEL.REACTION_LIST_OPENED, mixPanelPayload);
        if (getDevice() === 'mobile') {
            const bottomSheetRef = this._bottomSheet.open(EmojiListMobileSheetComponent, {
                data: {
                    reactionsList: this.message?.reactions,
                    reaction: reaction?.emoji ? reaction?.emoji : reaction,
                    chatroom_id: this.chatroomId,
                    conversation_id: this.message?.id,
                    community_id: this.communityId,
                },
            });
            bottomSheetRef.afterDismissed().subscribe((result) => {
                if (result) this.removeEmoji();
            });
        } else {
            const dialogRef = this.dialog.open(EmojiListDialogComponent, {
                panelClass: 'emoji-list-dialog',
                data: {
                    reactionsList: this.message?.reactions,
                    reaction: reaction?.emoji ? reaction?.emoji : reaction,
                },
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result) this.removeEmoji();
            });
        }
    }

    removeEmoji() {
        const payload = {
            chatroom_id: this.chatroomId,
        };
        if (this.message?.id) payload['conversation_id'] = this.message?.id;
        this.chatroomService.removeConversationReaction(payload).subscribe(
            (res) => {
                this.chatroomService.preventScrollToBottomEvent$$.next(true);
                this.updateOrAddEmoji(null, 'delete');
                const mixPanelPayload = {
                    message_id: this.message?.id,
                    chatroom_id: this.chatroomId,
                    community_id: this.communityId,
                };
                this.analyticsService.sendEvent(MIXPANEL.REACTION_REMOVED, mixPanelPayload);
                this.snackBar.open('Reaction removed.', 'OK', {
                    duration: 3000,
                    panelClass: [getDevice() === 'mobile' ? 'black-bottom-event-attachment-snackbar' : 'black-bottom-left-snackbar'],
                });
            },
            (error) => {
                this.snackBar.open('Something went wrong', 'OK', {
                    duration: 3000,
                    panelClass: [getDevice() === 'mobile' ? 'black-bottom-event-attachment-snackbar' : 'black-bottom-left-snackbar'],
                });
            }
        );
    }

    addAllBytes(bytesArray) {
        let totalBytes = 0;
        bytesArray?.forEach((val) => {
            totalBytes += val;
        });
        return this.utilsService.bytesToSize(totalBytes);
    }

    change() {
        this.chatroomService.playGifFile$$.next(!this.playGifFile);
    }

    getAttachmentsFromIndexedDB(id) {
        let indexValue = this.localStorageService.getSavedState(STORAGE_KEY.LOCABASE_INDEX)[`${id}`];

        /// WE HAVE TO CHANGE VALUE FOR IMAGES AND DOCUMENT FILES HERE FOR IT TO WORK

        //IF ATTATACHMENTS ARE NOT UPLOADED THE SHOW THEN FETCH THE ATTACHMENTS FROM INDEXED DB
        if (!this.message.attachments_uploaded) {
            this.indexedDbService.db
                .collection('mediaFiles')
                .doc(`${indexValue}`)
                .get()
                .then((document) => {
                    if (document) {
                        //let totalFileSize = 0;
                        this.message.attachments = document.files.map((file, index) => {
                            this.totalFileSize += file?.file?.size;
                            this.remainingMediaToBeUploaded.push(file);
                            return {
                                index,
                                meta: { duration: file?.duration, size: file?.file?.size },
                                name: file?.file?.name,
                                type: file?.file?.type?.split('/')[0],
                                url: file?.blob,
                                showTile: index < 3 ? true : false,
                                isLastTile: index == 3 ? true : false,
                            };
                        });

                        // this.homeFeedService.getTotalFileSize(this.message.id , null, this.chatroomId , document.files.map(file=> file.file))

                        this.message['totalFileSize'] = this.totalFileSize;
                        this.homeFeedService.updateConversation([this.message]);
                        if (this._cdr && !(this._cdr as ViewRef).destroyed) {
                            this._cdr.detectChanges();
                        }
                    }
                });
        }

        //IF ATTATACHMENTS HAVE BEEN UPLOADED, THEn DELETE ATTACHMENTS FROM INDEXED DB  THE SHOW THEN FETCH THE ATTACHMENTS FROM INDEXED DB
        else {
            this.indexedDbService.db.collection('mediaFiles').doc(`${indexValue}`).delete();
        }
    }

    //// RETRY TO UPLOAD UN UPLOADED MEDIA

    playingAudioIdEventFunc(event) {
        this.playingAudioId = event;
        this.playingAudioIdEvent.emit(event);
    }

    getTotalFileSize() {
        this.totalFileSize = 0;
        this.message?.attachments?.forEach((file) => {
            this.totalFileSize += file?.meta?.size;
        });
    }

    isFileUploading() {
        this.chatroomService.sendImageFilesEmitted$$.subscribe((val) => {
            this.hideRetryButtonFunc(val);
        });
    }

    hideRetryButtonFunc(val) {
        let hideRetryButtonObject = this.chatroomService.hideRetryButton$$.value;
        hideRetryButtonObject[this.message.id] = val;
        this.chatroomService.hideRetryButton$$.next(hideRetryButtonObject);
        this.currentlyLoadingMediaId = this.message.id;
    }

    uploadRemainingMedia() {
        this.getTotalFileSize();
        this.uploadMedia();
    }

    uploadMedia(): any {
        this.hideRetryButtonFunc(true);

        return this.awsS3BucketService
            .uploadRemainingMedias(
                this.message?.id,
                this.chatroomId,
                this.remainingMediaToBeUploaded.map((file) => {
                    return file.file;
                })
            )
            .then((uploadedFiles) => {
                forkJoin(
                    uploadedFiles.map((file, index) => {
                        return this.homeFeedService.uploadFiles({
                            conversation_id: this.message?.id,
                            url: file.Location,
                            type: this.remainingMediaToBeUploaded[index]?.file?.type?.split('/')[0],
                            files_count: this.remainingMediaToBeUploaded.length,
                            index: `${index}`,
                            // width: thumbnail_object?.width,
                            // height: thumbnail_object?.height,
                            // thumbnail_url: thumbnail_object?.thumbnail_url ? thumbnail_object?.thumbnail_url : '',
                            meta: {
                                duration: this.remainingMediaToBeUploaded[index].duration,
                                size: this.remainingMediaToBeUploaded[index]?.file?.size,
                            },
                            name: this.remainingMediaToBeUploaded[index]?.file?.name,
                        });
                    })
                ).subscribe((res) => {
                    this.chatroomService.micropollUpdated$$.next(true);
                });
            });
    }

    stopUploading() {
        let hideRetryButtonObject = this.chatroomService.hideRetryButton$$.value;
        hideRetryButtonObject[this.message.id] = false;
        if (this._cdr && !(this._cdr as ViewRef).destroyed) {
            this._cdr.detectChanges();
        }
        this.awsS3BucketService.pauseUpload();
    }

    checkIfAudioMessageUploaded(message) {
        let attachments = message?.attachments;
        if (attachments && attachments[0].type == 'audio' && attachments[0].url.includes('data:audio/')) {
            this.chatroomService.preventScrollToBottomEvent$$.next(true);
            this.chatroomService.getConvoData$$.next(true);
        }
    }

    truncate(text: String, limit: number) {
        return limit <= text?.length ? text.slice(0, limit) + '...' : text;
    }

    listenToClick(): void {
        if (window.innerWidth <= 470 && this.messageWrap && !this.isIntroductionsRoom) {
            this.touchstart$$ = fromEvent(this.messageWrap.nativeElement, 'touchstart');
            this.touchend$$ = fromEvent(this.messageWrap.nativeElement, 'touchend');
            this.touchMoved$$ = fromEvent(this.messageWrap.nativeElement, 'touchmove');
            this.touchMoved$$.pipe().subscribe(() => {
                // click event is getting diabled So that Chat bubble
                // does not get selected if user scrolls on the chatroom
                this.disableClickFlag = true;
            });
            this.touchstart$$.pipe().subscribe((evt) => {
                if (this.selectedMsgLength) {
                    // If any message is selected then activating touchend Event funcationality
                    // by changing the flags
                    this.disableClickFlag = false;
                    this.ignoreTouchEndEvent = false;
                } else {
                    // If first time clicking a chat bubble for longer than 500ms
                    this.timeout = setTimeout(() => {
                        if (!this.disableClickFlag) {
                            evt.stopPropagation();
                            evt.preventDefault();
                            const mixPanelPayload = {
                                from: 'long press',
                                message_id: this.message?.id,
                                chatroom_id: this.chatroomId,
                                community_id: this.communityId,
                            };
                            this.analyticsService.sendEvent(MIXPANEL.EMOTICON_TRAY_OPENED, mixPanelPayload);
                            // For first time selection of message touchEnd event
                            // functionality should get deactivated so changing flag to true
                            this.ignoreTouchEndEvent = true;
                            this.selectMsg();
                        }
                    }, 500);
                }
            });
            this.touchend$$.pipe().subscribe((evt) => {
                //Clearing timeout when touchstart event ends.
                clearTimeout(this.timeout);
                if (this.ignoreTouchEndEvent) {
                    this.disableClickFlag = false;
                    return;
                }
                if (!this.disableClickFlag) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    const mixPanelPayload = {
                        from: 'long press',
                        message_id: this.message?.id,
                        chatroom_id: this.chatroomId,
                        community_id: this.communityId,
                    };
                    this.analyticsService.sendEvent(MIXPANEL.EMOTICON_TRAY_OPENED, mixPanelPayload);
                    this.selectMsg();
                    //if this message is not selected than deactivate the touchendevent
                    // functionality  by changing flag
                    this.ignoreTouchEndEvent = this.selected ? false : true;
                }
            });
        }
    }

    checkMyMsg(): void {
        this.isMyMsg = this.user?.id === this.message?.member?.id;
    }

    replaceDeletedString(): void {
        if (this.message && this.message.answer) {
            this.message.answer = this.message.answer.replace('* This is a video message. Please update your app *', '').trim();
        }
    }

    setDeletedStrings(): void {
        this.deletedText = this.checkDeletedMsg(this.message?.member?.id, this.message?.deleted_by);
    }

    checkDeletedMsg(memberId, deletedById): string {
        if (memberId && deletedById) {
            const userId = this.user?.id;
            if (memberId === userId) {
                if (deletedById === userId) {
                    return 'You deleted this message.';
                } else {
                    return 'Your message was deleted by a community manager.';
                }
            } else {
                if (memberId === deletedById) {
                    return 'This message was deleted.';
                } else {
                    return 'This message was deleted by a community manager.';
                }
            }
        } else {
            return '';
        }
    }

    openProfile(): void {
        if (this.message?.member && this.message?.member?.custom_click_text) {
            this.dialog.open(ProfileNotExistPopupComponent, {
                data: {
                    intro: this.message?.member?.custom_intro_text,
                    message: this.message?.member?.custom_click_text,
                },
            });
        } else {
            this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_VIEW, {
                community_id: this.message?.community_id,
                viewed_member_id: this.message?.member.id,
                viewed_member_state: this.message?.state,
                source: SOURCE.CHATROOM,
            });
            this.router.navigate([`/${COMMUNITY_FEED_PATH}/${this.message?.community_id}/${PROFILE}/${this.message?.member.id}`]);
        }
    }

    playGif() {
        let val = this.playGifFile;
        val[this.message.id] = true;
        this.chatroomService.playGifFile$$.next(val);
        window.setTimeout(() => {
            val[this.message.id] = false;
            this.chatroomService.playGifFile$$.next(val);
            this.openGifMedia = false;
            this.chatroomService.preventScrollToBottomEvent$$.next(true);
            this.chatroomService.getConvoData$$.next(true);
            if (this._cdr && !(this._cdr as ViewRef).destroyed) {
                this._cdr.detectChanges();
            }
        }, 3800);
    }

    downloadApp(heading?: string, subHeading1?: string): void {
        const data = {
            heading: heading || 'Download app',
            subHeading1: subHeading1 || 'Please download the app to see all the chat rooms and connect with the community.',
        };
        // const _ = this.dialog.open(DownloadAppComponent, {
        //     panelClass: 'download-app-modal',
        //     data,
        // });
    }

    openTagged(ele: HTMLElement, str: any, index: any): void {
        if (ele.querySelector('b')) {
            let member = this.memberTagsString[parseInt(index)];
            let usrId = member.substring(member.lastIndexOf('/') + 1, member.lastIndexOf('>>'));
            this.router.navigate([`/${COMMUNITY_FEED_PATH}/${this.communityId}/${PROFILE}/${usrId}`]);
        }
    }

    onImgError(event, name): void {
        this.imgInit1 = this.userInit(name);
        this.imgInitShow = false;
    }
    userInit(name) {
        this.circleColor = this.colors[Math.floor(Math.random() * Math.floor(this.colors.length))];
        let initials = '';
        let namesList = name?.split(' ');
        if (namesList) {
            for (let name of namesList) {
                if (name[0] !== ' ' && name[0]) {
                    initials += name[0]?.toUpperCase();
                    if (initials.length === 2) break;
                }
            }
        }

        return initials;
    }

    openGallery(message, index): void {
        if (this.user) {
            this.showGallery.emit({ message, index });
        }
    }

    openMedia(media, index, answer, message): void {
        this.audioService.stop();
        if (media[0].type == 'gif' && !this.openGifMedia) {
            this.openGifMedia = true;
            return;
        }

        if (this.user) {
            this.chatroomService.closeMediaPopup$$.next(true);
            this.showMediaGallery.emit({ media, index, answer, message });
        }
    }

    showMessage(newCharCount: number): void {
        this.charCount = newCharCount;
    }

    redirectUrl(event): void {
        event.stopPropagation();
        const route = createWebUrlForHomeFeed(
            this.message.preview.action_route,
            this.message.preview.preview_type,
            this.chatroomId,
            this.communityId,
            'introduction_rooms',
            'introductions_cta'
        );
        if (route) {
            this.trackLinkClick();
            this.router.navigate(route.path, { queryParams: route.queryParams });
        } else {
            console.log('Route not found');
        }
    }

    trackLinkClick(): void {
        const mixpanelPayload = createMixPanelPayload(this.message.preview);
        this.analyticsService.sendEvent(mixpanelPayload.eventName, {
            ...mixpanelPayload.payload,
            community_id: this.communityId || 0,
        });
    }

    replyToMsg(): void {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }
        this.homeFeedService.updateReplyMessage(this.message);
    }

    deleteMessage(): void {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }
        this.homeFeedService.deleteConversation([this.message.id], this.chatroomId, this.user.id);
        // this.homeFeedService.refreshHomeFeed();
    }

    editMessage(): void {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }
        this.homeFeedService.updateEditMessage({ id: this.message.id, answer: this.message.answer, member: { name: 'Edit Message' } });
        this.chatroomService.micropollUpdated$$.next(true);
    }

    handleAttachmentOpenedInNewTab() {
        this.chatroomService.stopAudioRecording$$.next(true);
    }

    reportMessage(): void {
        if (this.guestUser) {
            alert('Guest user');
            return;
        }
        this.homeFeedService.reportMessage(this.message.id);
    }

    selectMsg(): void {
        this.homeFeedService.selectMsg(this.message);
    }

    ngOnDestroy(): void {
        this.destroy$$.next();
        this.destroy$$.unsubscribe();
        //this.stopUploading();
        //this.chatroomService.playGifFile$$.next({});
    }
}

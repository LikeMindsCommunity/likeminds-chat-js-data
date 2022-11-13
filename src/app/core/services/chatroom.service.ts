import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, from, Observable } from 'rxjs';

import {
    FETCH_CHATROOM_API,
    CREATE_CONVERSATION_API,
    CHATROOM_UPLOAD_FILES,
    TAGGING_LIST_API,
    FOLLOW_CHATROOM_API,
    CONVERSATION_META,
    FETCH_CONVERSATION_API,
    FETCH_SHARE_URL,
    SUBMIT_POLL,
    ADD_POLL,
    FETCH_POLL_USERS,
    SET_CHATROOM_ACTIVE,
    CHATROOM_MUTE,
    MARK_READ,
    SUBMIT_MICRO_POLL,
    ADD_MICRO_POLL,
    CHATROOM_FETCH_SETTINGS,
    UPDATE_ACCESS,
    FETCH_CHATROOM_ACCESS,
    MEMBERS_STATE,
    ADD_REACTION,
    REMOVE_REACTION,
    FETCH_CHATROOM_DETAIL,
} from '../../shared/constants/api.constant';
import { ConversationModel } from 'src/app/shared/models/chatroom.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { last, switchMap, tap } from 'rxjs/operators';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { LocalStorageService } from './localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';

@Injectable({
    providedIn: 'root',
})
export class ChatroomService extends BaseService {
    private conversations$$ = new BehaviorSubject<any[]>([]);
    public closeMediaPopup$$ = new BehaviorSubject<any>(null);
    public stopAudioRecording$$ = new BehaviorSubject<boolean>(false);
    public sendingMessageFile$$ = new BehaviorSubject<any>(false);
    public pollOption$$ = new BehaviorSubject<any>(null);
    public sendImageFilesEmitted$$ = new BehaviorSubject<any>(false);
    public scrollToBottom$$ = new BehaviorSubject<boolean>(false);
    public markActiveChatroom$$ = new BehaviorSubject<any>(false);
    public micropollUpdated$$ = new BehaviorSubject<any>(false);
    public openGifMedia$$ = new BehaviorSubject<any>(false);
    public playGifFile$$ = new BehaviorSubject<any>({});
    public getConvoData$$ = new BehaviorSubject<boolean>(false);
    public preventScrollToBottomEvent$$ = new BehaviorSubject<boolean>(false);
    public playingAudio$$ = new BehaviorSubject<boolean>(false);
    public mediaToBeUploaded$$ = new BehaviorSubject<any[]>([]);
    public mediaPreviewOpened$$ = new BehaviorSubject<boolean>(false);
    public hideRetryButton$$ = new BehaviorSubject<any>({});
    public showOverlayAudioUpload$$ = new BehaviorSubject<any>(false);
    public showNewChatroomCommunityDetail$$ = new BehaviorSubject<any>(false);
    public accessibleWithoutSubscription$$ = new BehaviorSubject<any>(false);
    public openedEmojiPickerId$$ = new BehaviorSubject<number>(null);
    public hideChatroomFollowButton$$ = new BehaviorSubject<any>({ chatroom_id: null, status: null });
    public membershipIsExpired$$ = new BehaviorSubject<boolean>(false);
    public feedChatroomCardTapped$$ = new BehaviorSubject<boolean>(false);
    public openHomePageProfileDrawer$$ = new BehaviorSubject<boolean>(false);
    public showMessageHighlight$$ = new BehaviorSubject<any>({ messageId: null, show: false, scrollToMessage: false });
    public refreshChatroomConversations$$ = new BehaviorSubject<any>({ chatroomId: null, urlParams: null });

    public get conversations$(): Observable<any> {
        return this.conversations$$.asObservable();
    }

    constructor(private httpClient: HttpClient, private afStorage: AngularFireStorage, private localStorageService: LocalStorageService) {
        super(httpClient);
    }

    /**
     * @function getChatroomDetail
     * @description Service to fetch chatroom detail
     */
    getChatroomDetail(chatroom_id: string | number, urlParams: any): Observable<any> {
        const queryParams = { chatroom_id, ...urlParams };
        return this.get(queryParams, FETCH_CHATROOM_API);
    }

    /**
     * @function getConversations
     * @description Service to fetch chatroom conversations
     */
    getConversations(chatroom_id: string | number, urlParams: any): Observable<any> {
        const queryParams = { chatroom_id, ...urlParams };
        return this.get(queryParams, FETCH_CONVERSATION_API).pipe(
            tap((resp) => {
                if (urlParams.scroll_direction) {
                    if (urlParams.scroll_direction === '0') {
                        this.conversations$$.next([...resp.conversations, ...this.conversations$$.value]);
                    } else if (urlParams.scroll_direction === '1') {
                        this.conversations$$.next([...this.conversations$$.value, ...resp.conversations]);
                    }
                } else {
                    this.conversations$$.next([...resp.conversations]);
                }
            })
        );
    }

    updateConversations(conversations): void {
        this.conversations$$.next(conversations);
    }

    /**
     * @function createConversationWithFiles
     * @description Service to create conversation with files
     */
    createConversation(data: ConversationModel): Observable<any> {
        return this.post(data, null, CREATE_CONVERSATION_API);
    }

    /**
     * @function createConversationWithFiles
     * @description Service to create conversation with files
     */
    addConversationReaction(data: any): Observable<any> {
        return this.post(data, null, ADD_REACTION);
    }

    removeConversationReaction(data: any): Observable<any> {
        return this.post(data, null, REMOVE_REACTION);
    }

    createPollConversation(data: any): Observable<any> {
        return this.post(data, null, CREATE_CONVERSATION_API);
    }

    createConversationWithFiles(data: ConversationModel, files, type: string): Observable<any> {
        return this.post(data, null, CREATE_CONVERSATION_API).pipe(
            switchMap((resp) => {
                return forkJoin(
                    files.map((file) => {
                        return this.afStorage.upload(`files/collabcard/${data.chatroom_id}/conversation/${resp.id}/${file.name}`, file);
                    })
                ).pipe(
                    switchMap((uploadedFiles) => {
                        return forkJoin(
                            uploadedFiles.map((file: UploadTaskSnapshot, index: number) => {
                                return from(file.ref.getDownloadURL()).pipe(
                                    switchMap((url) => {
                                        return this.uploadFiles(data, {
                                            answer_id: resp.id,
                                            url,
                                            type,
                                            files_count: uploadedFiles.length,
                                            index: `${index}`,
                                        });
                                    }),
                                    last()
                                );
                            })
                        );
                    })
                );
            })
        );
    }

    /**
     * @function getConversationMeta
     * @description Service to get message details from DB
     */
    getMessageDetail(chatroom_id: string | number, conversation_id: string): Observable<any> {
        const queryParams = { chatroom_id, conversation_id };
        return this.get(queryParams, CONVERSATION_META);
    }

    /**
     * @function getTaggingList
     * @description Service to get tagging list
     */
    getTaggingList(community_id: number | string, chatroom_id: number | string) {
        return this.get({ community_id, chatroom_id }, TAGGING_LIST_API);
    }

    /**
     * @function uploadFiles
     * @description Service to upload chatroom files
     */
    uploadFiles(data: ConversationModel, params: any): Observable<any> {
        return this.post(data, params, CHATROOM_UPLOAD_FILES);
    }

    /**
     * @function followChatroom
     * @description Service to follow chatroom
     */
    followChatroom(collabcard_id: number | string, member_id: number | string, value: boolean, aj?: any, source_id?: any) {
        return this.post(null, { collabcard_id, member_id, value, aj, source_id }, FOLLOW_CHATROOM_API);
    }

    changeChatroomActive(body) {
        return this.post(body, null, SET_CHATROOM_ACTIVE);
    }
    /**
     * @function fetchShareUrl
     * @description Fetch Share URL
     */
    fetchShareUrl(communityId: number) {
        return this.get({ community_id: communityId }, FETCH_SHARE_URL);
    }

    /**
     * @function submitPoll
     * @description Service to submit poll
     */
    submitPoll(data: any): Observable<any> {
        return this.post(data, null, SUBMIT_POLL);
    }

    submitMicroPoll(data: any): Observable<any> {
        return this.post(data, null, SUBMIT_MICRO_POLL);
    }

    /**
     * @function addPoll
     * @description Service to add new poll
     */
    addPoll(data: any): Observable<any> {
        return this.post(data, null, ADD_POLL);
    }

    /**
     * @function addPoll
     * @description Service to add new Micro poll
     */
    addMicroPoll(data: any): Observable<any> {
        return this.post(data, null, ADD_MICRO_POLL);
    }

    /**
     * @function fetchPollUsers
     * @description Service to fetch poll users
     */
    fetchPollUsers(chatroom_id: number | string, poll_id: number | string): Observable<any> {
        return this.get({ chatroom_id, poll_id }, FETCH_POLL_USERS);
    }

    /**
     * @function fetchChatroomSettings
     * @description Service to fetch chatroom setting
     */
    fetchChatroomSettings(params: any): Observable<any> {
        return this.get(params, CHATROOM_FETCH_SETTINGS);
    }

    /**
     * @function fetchMembersState
     * @description Service to fetch chatroom setting
     */
    fetchMembersState(params: any): Observable<any> {
        return this.get(params, MEMBERS_STATE);
    }

    /**
     * @function markRead
     * @description Service to mark messages as read.
     */
    markRead(body): Observable<any> {
        let chatroomId = body.split('=')[1];
        this.localStorageService.setSavedState(chatroomId, STORAGE_KEY.CURRENTLY_OPENED_CHATROOM_ID);
        return this.post(body, null, MARK_READ);
    }

    //this.communityService.leaveCommunity(`community_id=${communityId}`)

    muteChatroom(chatroom_id, value): Observable<any> {
        return this.post(`chatroom_id=${chatroom_id}&value=${value}`, null, CHATROOM_MUTE);
    }

    updateChatroomAccess(chatroom_id, value: boolean): Observable<any> {
        let body = { chatroom_id, value };
        return this.post(body, null, UPDATE_ACCESS);
    }

    fetchAccessChatroom(chatroom_id): Observable<any> {
        return this.get({ chatroom_id }, FETCH_CHATROOM_ACCESS);
    }

    fetchConversation(conversation_id: string) {
        return this.get({ conversation_id }, FETCH_CONVERSATION_API);
    }

    fetchChatroom(chatroom_id: string) {
        return this.get({ chatroom_id }, FETCH_CHATROOM_DETAIL);
    }
}

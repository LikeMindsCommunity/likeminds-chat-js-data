import { Router } from '@angular/router';
import { Component, Input, OnInit, EventEmitter, Output, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

import { StartLoading, StopLoading } from '../../../../shared/store/actions/app.action';
import { CreateChatroomService } from '../../../../core/services/create-chatroom.service';
import { IChatroom } from '../../../models/chatroom.model';
import { ICommunity } from '../../../models/community.model';
import { State } from '../../../../shared/store/reducers';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { MIXPANEL } from '../../../../shared/enums/mixpanel.enum';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IndexedDbService } from 'src/app/core/services/indexed-db.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { SecretChatroomDialogComponent } from 'src/app/shared/entryComponents/secret-chatroom-dialog/secret-chatroom-dialog.component';
import { MemberDirectoryService } from 'src/app/core/services/member-directory.service';
import { ModerationService } from 'src/app/core/services/moderation.service';
import { ResizeService } from 'src/app/core/services/resize.service';
import { SecretChatroomSheetComponent } from 'src/app/shared/entryComponents/secret-chatroom-sheet/secret-chatroom-sheet.component';
import { CommunityService } from 'src/app/core/services/community.service';

const MAX_FILE_SIZE_IN_MBS = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_IN_MBS * 1024 * 1024;
const MAX_FILE_COUNT = 10;

@Component({
    selector: 'app-chatroomform',
    templateUrl: './chatroomform.component.html',
    styleUrls: ['./chatroomform.component.scss', './../create-chatroom.component.scss'],
})
export class ChatroomformComponent implements OnInit {
    private destroy$$ = new Subject();
    chatroom: IChatroom;
    @Input() createChatRoomData: any;
    @Input() community: ICommunity;
    user: any;
    @Output() addNewMessage: EventEmitter<any> = new EventEmitter();

    @Output() closeForm = new EventEmitter<Object>();
    @Output() chatRoomSuccess = new EventEmitter<Object>();
    @Output() formValues = new EventEmitter<any>();

    imageURL: string;
    chatRoomForm: FormGroup;
    submitted = false;

    model: any = {};
    roomDescription: any;

    fileToBeUpload = [];
    imgCount: number;
    videoCount: number;
    audioCount: number;
    pdfCount: number;
    sendingMessage = false;
    showImageUpload = false;
    sendingMessageId = -1;
    placeholder = 'Type your response';
    creatRoomOptions: string = 'normal';
    timeFormatter: any;
    showWarning: boolean = false;
    crType: string = 'open';
    screenType: string;
    previewUrl: any;

    crParams: any;
    is_cm: boolean = false;
    isSecretCR: boolean = false;
    memberList: any;
    memberListObj: any = [];
    memberPage: number = 1;
    stopPagination: boolean = true;
    selectedMemberList: any = [];
    currentCommunityData: any = null;
    branding: any;

    constructor(
        private store: Store<State>,
        private createChatroom: CreateChatroomService,
        private fb: FormBuilder,
        private snackbar: MatSnackBar,
        private router: Router,
        private analyticsService: AnalyticsService,
        private utilsService: UtilsService,
        private indexedDbService: IndexedDbService,
        private localStorageService: LocalStorageService,
        public chatroomService: ChatroomService,
        private dialog: MatDialog,
        private bottomSheet: MatBottomSheet,
        private memberDirectoryService: MemberDirectoryService,
        @Inject(PLATFORM_ID) private platformId: object,
        private moderationService: ModerationService,
        private resizeService: ResizeService,
        private communityService: CommunityService
    ) {
        // Reactive Form
        this.chatRoomForm = this.fb.group({
            conversationArea: ['', [Validators.required, Validators.minLength(10)]],
            chatroomName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
        });
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        }

        this.resizeService.onResize$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        });

        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.timeFormatter = this.utilsService.secondsTo_HH_MM_SS_converter;

        this.chatroomService.mediaToBeUploaded$$.subscribe((res) => {
            this.fileToBeUpload = res;
        });

        this.getCommunityManager(this.community?.id);

        // MixPanel: Chatroom creation started
        this.analyticsService.sendEvent(MIXPANEL.CHATROOM_CREATION_STARTED, {
            chatroom_type: this.creatRoomOptions,
            community_id: this.community?.id,
            source: 'chatroom',
        });

        this.communityService.currentCommunityData$$.subscribe((data) => {
            if (data !== this.currentCommunityData) this.currentCommunityData = data;
        });

        this.communityService.currentCommunityBranding$$.pipe(takeUntil(this.destroy$$)).subscribe((branding) => {
            this.branding = branding;
        });
    }

    getStrokeColour() {
        return this.branding?.advanced?.buttons_icons_colour || this.branding?.basic?.primary_colour || '#00CAB3';
    }

    uploadFiles(event, docType: string): void {
        if (this.fileToBeUpload[0]?.type !== docType) this.fileToBeUpload = [];

        if (this.checkIfErrorInFiles(event.target.files)) {
            return;
        }

        this.store.dispatch(StartLoading());

        if (docType === 'image') {
            for (const file of event.target.files) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.fileToBeUpload = [
                        ...this.fileToBeUpload,
                        {
                            file,
                            blob: reader.result,
                            type: docType,
                            fileName: file.name,
                        },
                    ];
                    //this.chatroomService.mediaToBeUploaded$$.next(this.fileToBeUpload);
                    this.chatroomService.mediaToBeUploaded$$.next(this.fileToBeUpload);
                    this.store.dispatch(StopLoading());
                    // this.chatroomService.showOverlayAudioUpload$$.next(true);
                };
                reader.readAsDataURL(file);
            }
            this.showImageUpload = true;
            this.imgCount = event.target.files.length;
        }

        if (docType === 'video') {
            for (const file of event.target.files) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    this.fileToBeUpload = [...this.fileToBeUpload, { file, blob: reader.result, type: docType, fileName: file.name }];
                    this.chatroomService.mediaToBeUploaded$$.next(this.fileToBeUpload);
                    this.store.dispatch(StopLoading());
                };
                reader.readAsDataURL(file);
            }
            this.showImageUpload = true;
            this.videoCount = event.target.files.length;
        }

        if (docType === 'pdf') {
            for (const file of event.target.files) {
                this.fileToBeUpload = [...this.fileToBeUpload, { file, type: docType, fileName: file.name }];
            }
            this.chatroomService.mediaToBeUploaded$$.next(this.fileToBeUpload);
            this.showImageUpload = true;
            this.pdfCount = event.target.files.length;
            this.store.dispatch(StopLoading());
        }

        if (docType === 'audio') {
            this.utilsService.fetchAllAudioFilesDuration(event.target.files).then((fileObjects) => {
                fileObjects.forEach((fileObject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.fileToBeUpload = [
                            ...this.fileToBeUpload,
                            {
                                file: fileObject.file,
                                blob: reader.result,
                                fileName: fileObject.file.name,
                                type: docType,
                                meta: {
                                    duration: parseInt(`${fileObject.duration}`.toString()),
                                    size: fileObject.file.size,
                                },
                            },
                        ];
                        this.chatroomService.mediaToBeUploaded$$.next(this.fileToBeUpload);
                        this.store.dispatch(StopLoading());
                        this.chatroomService.showOverlayAudioUpload$$.next(true);
                    };
                    reader.readAsDataURL(fileObject.file);
                });
            });

            this.showImageUpload = true;
            this.audioCount = event.target.files.length;
        }
    }

    removeImg(index: number) {
        this.fileToBeUpload.splice(index, 1);
    }

    showMessage(success: boolean, message: string): void {
        const config = new MatSnackBarConfig();
        config.panelClass = ['snackbar'];
        config.duration = 3000;
        this.snackbar.open(message, undefined, config);
    }

    checkIfErrorInFiles(files): boolean {
        if (files.length > MAX_FILE_COUNT) {
            this.showMessage(false, `Can't send more than ${MAX_FILE_COUNT} attachments.`);
            return true;
        }
        const fileArray: any[] = Array.from(files);
        if (fileArray.find((file) => file.size > MAX_FILE_SIZE_BYTES)) {
            // this.showMessage(false, `Maximum allowed size is ${MAX_FILE_SIZE_IN_MBS}Mbs.`);
            this.showWarning = true;
            return true;
        }
        return false;
    }

    closeDialog(): void {
        this.showImageUpload = false;
    }

    // convenience getter for easy access to form fields
    get formDataValue() {
        return this.chatRoomForm.controls;
    }

    storeMediaIfAnyInIndexedDB(filesToBeUploaded, tempId) {
        // {
        //   file: fileObject.file,
        //   blob: reader.result,
        //   fileName : fileObject.file.name,
        //   type : docType,
        //   meta : {
        //     duration: parseInt(`${fileObject.duration}`.toString()),
        //     size : fileObject.file.size
        //   }
        // }
        return this.indexedDbService.db
            .collection('mediaFiles')
            .doc(tempId)
            .set({
                files: filesToBeUploaded.map((file) => {
                    return {
                        file: file.file,
                        blob: file.blob,
                        duration: file?.meta?.duration,
                    };
                }),
            });
    }

    onCreateChatRoom() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.chatRoomForm.invalid) return;

        this.crParams = {
            community_id: this.community.id,
            header: this.chatRoomForm.value.chatroomName,
            title: this.chatRoomForm.value.conversationArea,
            attachment_count: 0 || this.fileToBeUpload.length,
            image_count: 0 || this.imgCount,
            pdf_count: 0 || this.pdfCount,
            video_count: 0 || this.videoCount,
            audio_count: 0 || this.audioCount,
            type: 0,
            is_secret: false,
        };

        if (this.fileToBeUpload.length > 0) {
            // STORE TEMO CHATROOM ID STORED IN LOCALSTORAGE
            let tempId = `${Math.random()}`;
            this.localStorageService.setSavedState(tempId, STORAGE_KEY.TEMP_CHATROOM_ID);
        }

        if (this.crType === 'secret') {
            this.isSecretCR = true;
            this.crParams.is_secret = true;
            this.onShowMemberList();

            // MixPanel: Secret Chatroom creation started
            this.analyticsService.sendEvent(MIXPANEL.CHATROOM_CREATION_STARTED, {
                chatroom_type: this.creatRoomOptions,
                community_id: this.community?.id,
                source: 'chatroom',
                chatroom_category: this.crType,
            });
        } else {
            this.createChatRoom(this.crParams);
        }
    }

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

    back() {
        this.isSecretCR = false;
        this.memberListObj = [];
        this.selectedMemberList = [];
    }

    searchHeader: boolean = false;
    searchBtn() {
        this.searchHeader = !this.searchHeader;
    }

    onShowMemberList() {
        this.memberDirectoryService
            .getAllMembers({
                page: this.memberPage,
                community_id: this.community.id,
            })
            .subscribe((resData) => {
                if (resData) {
                    this.memberList = resData;
                    this.memberListObj.push(...this.memberList.members);
                    if (this.memberList?.total_filtered_members > 10) {
                        this.memberPage++;
                        this.stopPagination = true;
                    } else {
                        this.stopPagination = false;
                    }
                }
            });
    }

    onScroll() {
        if (this.stopPagination) {
            this.onShowMemberList();
        }
    }

    selectMember(id): void {
        const index = this.selectedMemberList.indexOf(id);
        if (index > -1) this.selectedMemberList.splice(index, 1);
        else this.selectedMemberList.push(id);

        this.crParams.secret_chatroom_participants = this.selectedMemberList;
        this.selectedClass(id);
    }

    selectedClass(id: number) {
        const foundVal = this.selectedMemberList.indexOf(id);
        if (foundVal > -1) return 'selected';
        else return 'class-b';
    }

    onCreateSecretChatroom() {
        this.crParams.secret_chatroom_participants = this.selectedMemberList;
        this.chatroomFn(this.crParams);
    }

    createChatRoom(params: any) {
        if (this.crType !== 'Secret') this.chatroomFn(params);
    }

    chatroomFn(params: any) {
        this.store.dispatch(StartLoading()); // THis is for showing  the loader
        this.createChatroom.chatRoom(params).subscribe(
            (resData) => {
                if (this.fileToBeUpload.length) {
                    // UPDATE THE MESSAGE ID(CHATROOM ID THIS CASE) STORED IN INDEXED DB
                    let savedTempChatroomId = this.localStorageService.getSavedState(STORAGE_KEY.TEMP_CHATROOM_ID);
                    let lacalbaseMessageIdObject: any;

                    lacalbaseMessageIdObject = this.localStorageService.getSavedState(STORAGE_KEY.LOCABASE_INDEX);
                    if (!lacalbaseMessageIdObject) {
                        lacalbaseMessageIdObject = {};
                    }

                    lacalbaseMessageIdObject[`${resData.chatroom.id}`] = savedTempChatroomId;
                    this.localStorageService.setSavedState(lacalbaseMessageIdObject, STORAGE_KEY.LOCABASE_INDEX);

                    //// UPLOAD THE MEDIA TO S3
                    this.createChatroom.uploadMedia([...this.fileToBeUpload.map((file) => file)], resData.chatroom.id);
                    this.createChatroom.uploadMediaStatus$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
                        if (res) this.createStatus(resData);
                    });
                } else this.createStatus(resData);

                // MixPanel: Chatroom creation completed
                this.analyticsService.sendEvent(MIXPANEL.CHATROOM_CREATION_COMPLETED, {
                    chatroom_type: this.creatRoomOptions,
                    chatroom_id: resData?.chatroom?.id,
                    is_named: true,
                    images_count: resData?.chatroom?.image_count,
                    pdf_cound: resData?.chatroom?.pdf_count,
                    chatroom_category: this.crType,
                });
            },
            (err) => {
                console.log(err);
            }
        );
    }

    createStatus(status: any) {
        this.onReset(); /* Form Reset */
        const crSuccess = {
            status: 'created',
            chatroom: status,
        };
        this.chatRoomSuccess.emit(crSuccess);
        this.store.dispatch(StopLoading());
        this.router.navigate([`/${this.currentCommunityData?.id}/collabcard/${status.chatroom.id}`], {
            queryParams: { newroom: 'tagmembers' },
        });
    }

    onReset() {
        this.submitted = false;
        this.chatRoomForm.invalid;
        this.chatRoomForm.value.conversationArea = '';
        this.chatRoomForm.value.chatroomName = '';
        this.fileToBeUpload = [];
        this.chatRoomForm.reset();
    }

    secretChatroomDialog() {
        if (this.screenType === 'mobile')
            this.bottomSheet
                .open(SecretChatroomSheetComponent, {
                    data: {
                        title: this.crType,
                    },
                    backdropClass: 'dialogBg-none',
                    // disableClose: true,
                })
                .afterDismissed()
                .subscribe((res) => {
                    if (res) this.crType = res.action;
                });

        if (this.screenType != 'mobile') {
            this.dialog
                .open(SecretChatroomDialogComponent, {
                    data: {
                        title: this.crType,
                    },
                    panelClass: 'secretCRDialog',
                })
                .afterClosed()
                .subscribe((res) => {
                    if (res) this.crType = res.action;
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$$.next(null);
        this.destroy$$.complete();
        this.chatroomService.mediaToBeUploaded$$.next([]);
    }
}

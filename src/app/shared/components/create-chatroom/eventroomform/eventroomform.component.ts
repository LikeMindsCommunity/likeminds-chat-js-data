import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Component, Input, OnInit, PLATFORM_ID, EventEmitter, Output, Inject, ViewEncapsulation, ViewChild } from '@angular/core';

import { StartLoading, StopLoading } from '../../../../shared/store/actions/app.action';
import { CreateChatroomService } from '../../../../core/services/create-chatroom.service';
import { IChatroom } from '../../../models/chatroom.model';
import { ICommunity } from '../../../models/community.model';
import { IUser } from '../../../models/user.model';
import { State } from '../../../../shared/store/reducers';
import { EventPrivacyPopupComponent } from './event-privacy-popup/event-privacy-popup.component';
import { EventPrivacySheetComponent } from './event-privacy-sheet/event-privacy-sheet.component';
import { ResizeService } from '../../../../core/services/resize.service';
import { BannerGuidelineSheetComponent } from './banner-guideline-sheet/banner-guideline-sheet.component';
import { BannerGuidelinePopupComponent } from './banner-guideline-popup/banner-guideline-popup.component';
import { OnlineUrlGuidelinePopupComponent } from './online-url-guideline-popup/online-url-guideline-popup.component';
import { OnlineUrlGuidelineSheetComponent } from './online-url-guideline-sheet/online-url-guideline-sheet.component';
import { MemberDirectoryService } from '../../../../core/services/member-directory.service';
import { SecretChatroomSheetComponent } from 'src/app/shared/entryComponents/secret-chatroom-sheet/secret-chatroom-sheet.component';
import { SecretChatroomDialogComponent } from 'src/app/shared/entryComponents/secret-chatroom-dialog/secret-chatroom-dialog.component';
import { ModerationService } from 'src/app/core/services/moderation.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { CommunityService } from 'src/app/core/services/community.service';

const MAX_FILE_SIZE_IN_MBS = 16;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_IN_MBS * 1024 * 1024;
const MAX_FILE_COUNT = 10;

@Component({
    selector: 'app-eventroomform',
    templateUrl: './eventroomform.component.html',
    styleUrls: ['./eventroomform.component.scss', './../create-chatroom.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EventroomformComponent implements OnInit {
    @ViewChild('picker') picker: any;
    @Input() community: ICommunity;
    @Input() user: IUser;
    @Output() addNewMessage: EventEmitter<any> = new EventEmitter();
    @Output() chatRoomSuccess = new EventEmitter<Object>();

    public date: moment.Moment;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = false;
    public touchUi = false;
    public enableMeridian = false;
    public minDate = new Date();
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public stepHours = [1, 2, 3, 4, 5];
    public stepMinutes = [1, 5, 10, 15, 20, 25];
    public stepSeconds = [1, 5, 10, 15, 20, 25];
    public minEndDate = new Date();

    screenType: string;
    chatroom: IChatroom;

    imageURL: string;
    eventRoomForm: FormGroup;
    submitted = false;

    model: any = {};
    roomDescription: any;

    fileToBeUpload = [];
    sendingMessage = false;
    showImageUpload = false;
    sendingMessageId = -1;
    placeholder = 'Type your response';
    onLineUrlInput: any;
    offLineInput: boolean = true;
    memberList: any;
    selectedMembers = [];
    private destroy$$ = new Subject();

    crType: string = 'open';
    crParams: any;
    is_cm: boolean = false;
    isSecretCR: boolean = false;
    addMemberList: any;
    memberListObj: any = [];
    memberPage: number = 1;
    stopPagination: boolean = true;
    selectedMemberList: any = [];
    creatRoomOptions: string = 'event';
    currentCommunityData: any = null;
    branding: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        @Inject(DOCUMENT) private _document,
        private resizeService: ResizeService,
        private store: Store<State>,
        private createChatroom: CreateChatroomService,
        private fb: FormBuilder,
        private router: Router,
        private dialog: MatDialog,
        private sheet: MatBottomSheet,
        private snackbar: MatSnackBar,
        private memberDirectory: MemberDirectoryService,
        private bottomSheet: MatBottomSheet,
        private moderationService: ModerationService,
        private localStorageService: LocalStorageService,
        private memberDirectoryService: MemberDirectoryService,
        private analyticsService: AnalyticsService,
        private communityService: CommunityService
    ) {
        // Reactive Form
    }

    offlineLocation = {
        address: '',
        lat: '',
        lng: '',
    };

    ngOnInit(): void {
        this.initControlForm();

        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        }

        this.resizeService.onResize$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        });
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.getMembers(this.community?.id);
        this.getCommunityManager(this.community?.id);

        // MixPanel: Event room creation started
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

    initControlForm() {
        this.eventRoomForm = this.fb.group({
            eventTitle: ['', [Validators.required, Validators.minLength(10)]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            aboutEvent: [''],
            onlineLink: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
            coHost: [null],
            eventType: [false],
        });
    }
    setFieldValue(index, value) {
        this.offlineLocation.address = value;
    }
    geometry(value) {
        this.offlineLocation.lat = value.lat;
        this.offlineLocation.lng = value.lng;
    }

    getMembers(cmId: number) {
        let param = {
            community_id: cmId,
            page: 1,
        };
        this.memberDirectory.getAllMembers(param).subscribe((resData) => {
            this.memberList = [...resData.members];
        });
    }

    select(member: any) {
        this.selectedMembers.push(member);
        setTimeout(() => {
            this.eventRoomForm.controls.coHost.reset();
        });
    }
    removeMember(index) {
        this.selectedMembers.splice(index, 1);
    }

    selectStartDate(ref) {
        this.minEndDate = this.eventRoomForm.value.startDate;
        this.eventRoomForm.controls.endDate.reset();
    }
    selectEndDate(ref) {
        this.minEndDate = this.eventRoomForm.value.startDate;
    }

    openPublicEvent() {
        if (this.screenType === 'mobile')
            this.sheet.open(EventPrivacySheetComponent, {
                disableClose: true,
            });

        if (this.screenType != 'mobile')
            this.dialog.open(EventPrivacyPopupComponent, {
                disableClose: true,
            });
    }

    bannerGuide() {
        if (this.screenType === 'mobile')
            this.sheet.open(BannerGuidelineSheetComponent, {
                disableClose: true,
            });

        if (this.screenType != 'mobile')
            this.dialog.open(BannerGuidelinePopupComponent, {
                disableClose: true,
            });
    }

    onlineUrlGuide() {
        if (this.screenType === 'mobile')
            this.sheet.open(OnlineUrlGuidelineSheetComponent, {
                disableClose: true,
            });

        if (this.screenType != 'mobile')
            this.dialog.open(OnlineUrlGuidelinePopupComponent, {
                disableClose: true,
            });
    }

    onLocationSelect() {
        this.offLineInput = !this.offLineInput;
    }

    uploadFiles(event, docType: string): void {
        this.fileToBeUpload = [];
        if (this.checkIfErrorInFiles(event.target.files)) {
            return;
        }

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
            };
            reader.readAsDataURL(file);
        }
        this.showImageUpload = true;
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
            this.showMessage(false, `Maximum allowed size is ${MAX_FILE_SIZE_IN_MBS}Mbs.`);
            return true;
        }
        return false;
    }

    closeDialog(): void {
        this.showImageUpload = false;
    }

    // convenience getter for easy access to form fields
    get formObject() {
        return this.eventRoomForm.controls;
    }

    onCreateEventRoom() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.eventRoomForm.invalid) {
            return;
        }
        this.crParams = {
            community_id: this.community.id,
            title: this.eventRoomForm.value.eventTitle,
            header: this.eventRoomForm.value.eventTitle,
            image_count: 0 || this.fileToBeUpload.length,
            attachment_count: 0 || this.fileToBeUpload.length,
            type: 2,
            date_time: new Date(this.eventRoomForm.value.startDate).getTime(),
            end_date: new Date(this.eventRoomForm.value.endDate).getTime(),
            duration: new Date(this.eventRoomForm.value.endDate).getTime() - new Date(this.eventRoomForm.value.startDate).getTime(),
            about: this.eventRoomForm.value.aboutEvent,
        };

        if (this.eventRoomForm.value.eventType) this.crParams['online_link'] = this.eventRoomForm.value.onlineLink;
        else {
            this.crParams['location'] = this.offlineLocation.address;
            this.crParams['location_lat'] = this.offlineLocation.lat;
            this.crParams['location_long'] = this.offlineLocation.lng;
        }
        if (this.selectedMembers.length > 0) {
            this.crParams['co_hosts'] = [...this.selectedMembers.map((member) => member.id)];
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

    createChatRoom(params: any) {
        if (this.crType !== 'Secret') this.chatroomFn(params);
    }

    chatroomFn(params: any) {
        this.store.dispatch(StartLoading());
        this.createChatroom.chatRoom(this.crParams).subscribe((resData) => {
            // MixPanel: Chatroom creation completed
            this.analyticsService.sendEvent(MIXPANEL.CHATROOM_CREATION_COMPLETED, {
                chatroom_type: this.creatRoomOptions,
                chatroom_id: resData?.chatroom?.id,
                is_named: true,
                images_count: resData?.chatroom?.image_count,
                pdf_cound: resData?.chatroom?.pdf_count,
                chatroom_category: this.crType,
            });

            if (this.fileToBeUpload.length) {
                this.createChatroom.uploadMedia([...this.fileToBeUpload.map((file) => file)], resData.chatroom.id);
                this.createChatroom.uploadMediaStatus$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
                    if (res) this.createStatus(resData);
                });
            } else this.createStatus(resData);
        });
    }

    back() {
        this.isSecretCR = false;
        this.memberListObj = [];
        this.selectedMemberList = [];
    }

    onShowMemberList() {
        this.memberDirectoryService
            .getAllMembers({
                page: this.memberPage,
                community_id: this.community.id,
            })
            .subscribe((resData) => {
                if (resData) {
                    this.addMemberList = resData;
                    this.memberListObj.push(...this.addMemberList.members);
                    if (this.addMemberList?.total_filtered_members > 10) {
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

    createStatus(status: any) {
        this.onReset(); /* Form Reset */
        const crSuccess = {
            status: 'created',
            chatroom: status,
        };
        this.chatRoomSuccess.emit(crSuccess);
        this.store.dispatch(StopLoading());
        this.router.navigate([`/${this.currentCommunityData?.id}/collabcard/${status.chatroom.id}`]);
    }

    onReset() {
        this.submitted = false;
        this.eventRoomForm.invalid;
        this.eventRoomForm.reset();
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
}

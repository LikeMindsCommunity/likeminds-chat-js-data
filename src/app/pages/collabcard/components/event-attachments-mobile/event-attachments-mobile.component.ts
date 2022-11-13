import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { EventsService } from 'src/app/core/services/events.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { EDIT_EVENT_ATTACHMENT_SCREEN, SAVED_EVENT_ATTACHMENT_SCREEN } from 'src/app/shared/constants/app-constant';
import { EventRemoveAttachmentDialogComponent } from 'src/app/shared/entryComponents/event-remove-attachment-dialog/event-remove-attachment-dialog.component';
import { IUrlParams } from 'src/app/shared/models/auth.model';
import { StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { validURL } from 'src/app/shared/utils';
import { State } from '../../../../shared/store/reducers';

@Component({
    selector: 'app-event-attachments-mobile',
    templateUrl: './event-attachments-mobile.component.html',
    styleUrls: ['./event-attachments-mobile.component.scss'],
})
export class EventAttachmentsMobileComponent implements OnInit, OnDestroy {
    @ViewChild('fileInput') fileInput: any;
    edit: boolean;
    urlParams: IUrlParams = {};
    chatroomId: string;

    chatroomData: any;
    aboutRecording: string;
    recordingUrl: string;
    attachmentData: any[];
    recordingUrlOgTags: any;
    file: any;
    showAttachmentScreenProps: any;
    attachmentView: any;
    enableDoneBtn: boolean;
    doneBtnClicked: boolean = false;

    subscriptions: Subscription[] = [];

    constructor(
        private homeFeedService: HomeFeedService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private eventsService: EventsService,
        private store: Store<State>,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((route) => {
                this.urlParams = route.queryParams;
                this.chatroomId = route.params.chatroomId;
                this.getChatroomDetail(this.chatroomId);
            });

        this.subscriptions.push(
            this.homeFeedService.chatroomDetailGroup$.subscribe((chatroomList) => {
                if (chatroomList[this.chatroomId]) {
                    let response = chatroomList[this.chatroomId];
                    if (response) {
                        this.chatroomData = response.chatroom;
                        this.attachmentData = response?.chatroom?.recordings_attachments;
                        if (isNaN(parseInt(this.attachmentView))) {
                            this.aboutRecording = response?.chatroom?.about_recording;
                            if (
                                response?.chatroom?.recording_url_og_tags &&
                                Object.keys(response?.chatroom?.recording_url_og_tags).length !== 0
                            )
                                this.recordingUrlOgTags = response?.chatroom?.recording_url_og_tags;
                            else this.recordingUrlOgTags = null;
                            this.recordingUrl = response?.chatroom?.recording_url_og_tags?.url;
                            this.attachmentView = response?.chatroom?.recordings_attachments_view;
                        } else {
                            if (this.doneBtnClicked) {
                                this.aboutRecording = response?.chatroom?.about_recording;
                                if (
                                    response?.chatroom?.recording_url_og_tags &&
                                    Object.keys(response?.chatroom?.recording_url_og_tags).length !== 0
                                )
                                    this.recordingUrlOgTags = response?.chatroom?.recording_url_og_tags;
                                else this.recordingUrlOgTags = null;
                                this.recordingUrl = response?.chatroom?.recording_url_og_tags?.url;
                                this.attachmentView = response?.chatroom?.recordings_attachments_view;
                                this.doneBtnClicked = false;
                            }
                        }
                        if (this.recordingUrl || this.aboutRecording || this.attachmentData.length > 0) this.enableDoneBtn = true;
                        else this.enableDoneBtn = false;
                    }
                } else this.homeFeedService.getChatroomDetail(this.chatroomId, this.urlParams);
            })
        );

        this.eventsService.showEventAttachmentScreenProps$$.subscribe((res) => {
            this.showAttachmentScreenProps = res;
            if (this.showAttachmentScreenProps?.viewMessage === SAVED_EVENT_ATTACHMENT_SCREEN) this.edit = false;
            else if (this.showAttachmentScreenProps?.viewMessage === EDIT_EVENT_ATTACHMENT_SCREEN) this.edit = true;
            this.cdr.detectChanges();
        });
    }

    getChatroomDetail(chatroomId: number | string) {
        this.homeFeedService.getChatroomDetail(chatroomId, this.urlParams);
    }

    uploadFiles(imagesToBeUpload, unsupportedFilesLength) {
        this.eventsService
            .uploadEventAttachmentFiles(imagesToBeUpload, this.chatroomId)
            .then((res) => {
                this.getChatroomDetail(this.chatroomId);
                this.store.dispatch(StopLoading());

                if (unsupportedFilesLength)
                    this.snackBar.open('Unsupported file type.', null, {
                        duration: 3000,
                        panelClass: ['black-bottom-event-attachment-snackbar'],
                    });
            })
            .catch((error) => {
                this.store.dispatch(StopLoading());
                this.snackBar.open('Failed to upload file', null, {
                    duration: 3000,
                    panelClass: ['black-bottom-event-attachment-snackbar'],
                });
            });
    }

    uploadAllFiles(files) {
        const imagesToBeUpload = [];
        let idx = this.attachmentData.length;
        let unsupportedFilesLength = 0;

        if (files && files[0]) {
            this.store.dispatch(StartLoading());
            for (let i = 0; i < files?.length; i++) {
                const reader = new FileReader();

                reader.onload = (event: any) => {
                    if (files[i].type.match('image.*') || files[i].type.match('video.*') || files[i].type.match('application/pdf'))
                        imagesToBeUpload.push({ file: files[i], index: idx++ });
                    else unsupportedFilesLength++;

                    if (imagesToBeUpload.length + unsupportedFilesLength === files.length)
                        this.uploadFiles(imagesToBeUpload, unsupportedFilesLength);
                };

                reader.readAsDataURL(files[i]);
            }
        }
    }

    prependHttps(link) {
        if (link.indexOf('http://') == -1 && link.indexOf('https://') == -1) {
            this.recordingUrl = 'https://' + this.recordingUrl;
        }
    }

    uploadRecordingsMeta() {
        if (this.enableDoneBtn) {
            if (this.recordingUrl && !validURL(this.recordingUrl)) {
                this.snackBar.open('Please enter a valid URL', null, {
                    duration: 3000,
                    panelClass: ['black-bottom-snackbar'],
                });
                return;
            }
            this.store.dispatch(StartLoading());
            this.doneBtnClicked = true;
            if (this.recordingUrl || this.aboutRecording) {
                if (this.recordingUrl) this.prependHttps(this.recordingUrl);

                let payload = {};
                if (this.recordingUrl) payload = { recording_url: this.recordingUrl };
                if (this.aboutRecording) payload = { ...payload, about_recording: this.aboutRecording };
                this.eventsService.eventUploadRecordingsMeta(this.chatroomId, payload).subscribe(
                    (res) => {
                        this.getChatroomDetail(this.chatroomId);
                        this.store.dispatch(StopLoading());
                        this.snackBar.open('Recording/Attachment added.', null, {
                            duration: 3000,
                            panelClass: ['black-bottom-event-attachment-snackbar'],
                        });
                        this.goToSaved();
                    },
                    (error) => {
                        this.store.dispatch(StopLoading());
                        this.doneBtnClicked = false;
                        this.snackBar.open('Something went wrong', null, {
                            duration: 3000,
                            panelClass: ['black-bottom-event-attachment-snackbar'],
                        });
                    }
                );
            } else {
                this.eventsService.eventDeleteRecordingsMeta(this.chatroomId).subscribe(
                    (res) => {
                        this.getChatroomDetail(this.chatroomId);
                        this.store.dispatch(StopLoading());
                        this.snackBar.open('Recording/Attachment added.', null, {
                            duration: 3000,
                            panelClass: ['black-bottom-event-attachment-snackbar'],
                        });
                        this.goToSaved();
                    },
                    (error) => {
                        this.store.dispatch(StopLoading());
                        this.doneBtnClicked = false;
                        this.snackBar.open('Something went wrong', null, {
                            duration: 3000,
                            panelClass: ['black-bottom-event-attachment-snackbar'],
                        });
                    }
                );
            }
        }
    }

    handleAboutRecordingChange = (inputVal) => {
        if (inputVal) {
            this.enableDoneBtn = true;
        } else {
            if (this.recordingUrl || this.attachmentData.length > 0) this.enableDoneBtn = true;
            else this.enableDoneBtn = false;
        }
    };

    handleRecordingUrlChange = (inputVal) => {
        if (inputVal) {
            this.enableDoneBtn = true;
        } else {
            if (this.aboutRecording || this.attachmentData.length > 0) this.enableDoneBtn = true;
            else this.enableDoneBtn = false;
        }
    };

    goToSaved = () => {
        this.eventsService.showEventAttachmentScreenProps$$.next({
            ...this.showAttachmentScreenProps,
            viewMessage: SAVED_EVENT_ATTACHMENT_SCREEN,
        });
        this.edit = false;
    };

    goToEdit = () => {
        // this.edit = true;
        this.eventsService.showEventAttachmentScreenProps$$.next({
            ...this.showAttachmentScreenProps,
            viewMessage: EDIT_EVENT_ATTACHMENT_SCREEN,
        });
        this.edit = true;
    };

    openLinkNewTab(url) {
        if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
            window.open('https://' + url, '_blank');
        } else window.open(url, '_blank');
    }

    openFileNewTab(attachment) {
        window.open(attachment?.url, '_blank');
    }

    confirmDeleteAttachmentFile(fileId) {
        const dialogRef = this.dialog.open(EventRemoveAttachmentDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.deleteAttachmentFile(fileId);
        });
    }

    deleteAttachmentFile(fileId) {
        this.store.dispatch(StartLoading());
        this.eventsService.deleteEventAttachmentFile(fileId).subscribe(
            (res) => {
                this.getChatroomDetail(this.chatroomId);
                this.store.dispatch(StopLoading());
                this.snackBar.open('Attachment removed', null, {
                    duration: 3000,
                    panelClass: ['black-bottom-event-attachment-snackbar'],
                });
            },
            (error) => {
                this.store.dispatch(StopLoading());
                this.snackBar.open('Attachment remove failed', null, {
                    duration: 3000,
                    panelClass: ['black-bottom-event-attachment-snackbar'],
                });
            }
        );
    }

    clearSubscription() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions = [];
    }

    ngOnDestroy() {
        this.clearSubscription();
    }
}

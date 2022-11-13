import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { EventsService } from 'src/app/core/services/events.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { EventRemoveAttachmentDialogComponent } from 'src/app/shared/entryComponents/event-remove-attachment-dialog/event-remove-attachment-dialog.component';
import { IUrlParams } from 'src/app/shared/models/auth.model';
import { validURL } from 'src/app/shared/utils';
import { StartLoading, StopLoading } from '../../../../shared/store/actions/app.action';
import { State } from '../../../../shared/store/reducers';

@Component({
    selector: 'app-event-attachments-drawer',
    templateUrl: './event-attachments-drawer.component.html',
    styleUrls: ['./event-attachments-drawer.component.scss'],
})
export class EventAttachmentsDrawerComponent implements OnInit {
    @ViewChild('fileInput') fileInput: any;
    edit: boolean = true;
    chatroomData: any;
    chatroomId: string;
    aboutRecording: string;
    recordingUrl: string;
    attachmentData: any[];
    recordingUrlOgTags: any;
    attachmentView: any;
    file: any;
    enableDoneBtn: boolean;
    doneBtnClicked: boolean = false;

    private destroy$$ = new Subject();
    subscriptions: Subscription[] = [];
    urlParams: IUrlParams = {};

    @Output() closeAttachmentDrawer: EventEmitter<any> = new EventEmitter();

    constructor(
        private homeFeedService: HomeFeedService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private eventService: EventsService,
        private store: Store<State>,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((route) => {
                this.hideAttachmentDrawer();
                this.urlParams = route.queryParams;
                this.chatroomId = route.params.chatroomId;
                this.getChatroomDetail(this.chatroomId);
                this.attachmentView = null;
            });

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
                        if (this.attachmentView === 2 || this.attachmentView === 3) this.goToSaved();
                        else this.goToEdit();
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
                            if (this.attachmentView === 2 || this.attachmentView === 3) this.goToSaved();
                            else this.goToEdit();
                            this.doneBtnClicked = false;
                        }
                    }

                    if (this.recordingUrl || this.aboutRecording || this.attachmentData?.length > 0) this.enableDoneBtn = true;
                    else this.enableDoneBtn = false;
                }
            } else this.homeFeedService.getChatroomDetail(this.chatroomId, this.urlParams);
        });
    }

    getChatroomDetail(chatroomId: number | string) {
        this.homeFeedService.getChatroomDetail(chatroomId, this.urlParams);
    }

    uploadFiles(imagesToBeUpload, unsupportedFilesLength) {
        this.eventService
            .uploadEventAttachmentFiles(imagesToBeUpload, this.chatroomId)
            .then((url: any) => {
                this.getChatroomDetail(this.chatroomId);
                this.fileInput.nativeElement.value = '';
                this.store.dispatch(StopLoading());

                if (unsupportedFilesLength)
                    this.snackBar.open('Unsupported file type.', 'OK', {
                        duration: 3000,
                        panelClass: ['black-bottom-left-snackbar'],
                    });
            })
            .catch((error) => {
                console.log(error, 'error');
                this.store.dispatch(StopLoading());
                this.snackBar.open('Failed to upload file', 'OK', {
                    duration: 3000,
                    panelClass: ['black-bottom-left-snackbar'],
                });
            });
    }

    uploadAllFiles = (files) => {
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
    };

    confirmDeleteAttachmentFile(fileId) {
        const dialogRef = this.dialog.open(EventRemoveAttachmentDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.deleteAttachmentFile(fileId);
        });
    }

    deleteAttachmentFile(fileId) {
        this.store.dispatch(StartLoading());
        this.eventService.deleteEventAttachmentFile(fileId).subscribe(
            (res) => {
                this.getChatroomDetail(this.chatroomId);
                this.store.dispatch(StopLoading());
                this.snackBar.open('Recording/Attachment removed.', 'OK', {
                    duration: 3000,
                    panelClass: ['black-bottom-left-snackbar'],
                });
            },
            (error) => {
                this.store.dispatch(StopLoading());
                this.snackBar.open('Attachment remove failed', null, {
                    duration: 3000,
                    panelClass: ['black-bottom-left-snackbar'],
                });
            }
        );
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

    openFileNewTab(attachment) {
        window.open(attachment?.url, '_blank');
    }

    openLinkNewTab(url) {
        if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
            window.open('https://' + url, '_blank');
        } else window.open(url, '_blank');
    }

    goToEdit() {
        this.edit = true;
    }

    goToSaved() {
        this.edit = false;
    }

    prependHttps(link) {
        if (link.indexOf('http://') == -1 && link.indexOf('https://') == -1) {
            this.recordingUrl = 'https://' + this.recordingUrl;
        }
    }

    uploadRecordingsMeta() {
        if (this.enableDoneBtn) {
            if (this.recordingUrl && !validURL(this.recordingUrl)) {
                this.snackBar.open('Please enter a valid URL', 'OK', {
                    duration: 3000,
                    panelClass: ['black-bottom-left-snackbar'],
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
                this.eventService.eventUploadRecordingsMeta(this.chatroomId, payload).subscribe(
                    (res) => {
                        this.getChatroomDetail(this.chatroomId);
                        this.store.dispatch(StopLoading());
                        this.snackBar.open('Recording/Attachment added.', 'OK', {
                            duration: 3000,
                            panelClass: ['black-bottom-left-snackbar'],
                        });
                        this.goToSaved();
                    },
                    (error) => {
                        this.doneBtnClicked = false;
                        this.store.dispatch(StopLoading());
                        this.snackBar.open('Something went wrong', 'OK', {
                            duration: 3000,
                            panelClass: ['black-bottom-left-snackbar'],
                        });
                    }
                );
            } else {
                this.eventService.eventDeleteRecordingsMeta(this.chatroomId).subscribe(
                    (res) => {
                        this.getChatroomDetail(this.chatroomId);
                        this.store.dispatch(StopLoading());
                        this.snackBar.open('Recording/Attachment added.', 'OK', {
                            duration: 3000,
                            panelClass: ['black-bottom-left-snackbar'],
                        });
                        this.goToSaved();
                    },
                    (error) => {
                        this.doneBtnClicked = false;
                        this.store.dispatch(StopLoading());
                        this.snackBar.open('Something went wrong', 'OK', {
                            duration: 3000,
                            panelClass: ['black-bottom-left-snackbar'],
                        });
                    }
                );
            }
        }
    }

    hideAttachmentDrawer() {
        this.closeAttachmentDrawer.emit();
    }
}

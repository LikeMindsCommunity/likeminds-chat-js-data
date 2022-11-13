import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { AudioService } from 'src/app/core/services/audio.service';
import { AwsS3BucketService } from 'src/app/core/services/aws-s3-bucket.service';

import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { CHATROOM_TYPE_MAP } from 'src/app/shared/constants/app-constant';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
@Component({
    selector: 'app-voice-message',
    templateUrl: './voice-message.component.html',
    styleUrls: ['./voice-message.component.scss'],
})
export class VoiceMessageComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() audioAttachement: any;
    @Input() index;
    @Input() messageId;
    @Input() message;
    @Input() chatroom;
    @Input() audioAttachmentsUploaded: boolean;
    @Input() isMyMsg;
    @Input() uniqueId;

    audioName: string;
    audioUrl: string;
    audioDuration: string | number;

    audio: any;
    audioId: string;
    sendImageFilesEmitted: boolean;

    /// NEW STATES
    audioState: any;
    showAudioFrames: boolean;
    audVal: any;
    audMax: any;
    displayTime: any;
    progress: number = 0;

    // Slider track ref
    sliderTrackHigh: HTMLElement;
    sliderTrackSelected: HTMLElement;
    sliderTrackThumb: HTMLElement;

    private destroy$$ = new Subject();

    constructor(
        private chatroomService: ChatroomService,
        private cdr: ChangeDetectorRef,
        private utilsService: UtilsService,
        private audioService: AudioService,
        public homeFeedService: HomeFeedService,
        private awsService: AwsS3BucketService,
        private analyticsService: AnalyticsService
    ) {
        this.audioService.getState().subscribe((allStates) => {
            let state = allStates[this.audioId];
            if (state) {
                if (state['playing']) {
                    this.audioState = state;
                }
            } else {
                this.audioState = {
                    audioId: null,
                    playing: false,
                    readableCurrentTime: '',
                    readableDuration: '',
                    duration: undefined,
                    currentTime: 0,
                    volume: 1,
                    canplay: false,
                    error: false,
                };
                //console.log("2 : ", this.audioState);
            }
            this.cdr.markForCheck();
        });
    }

    ngOnInit(): void {
        this.audioName = this.audioAttachement?.name;
        this.audioUrl = this.audioAttachement?.url;
        // this.audioId = `audio${this.messageId?.toString() + this.index?.toString()}`;
        this.audioId = Math.random().toString().substring(2, 7);

        if (this.audioAttachement?.meta?.duration < 1) {
            this.audioDuration = this.utilsService.secondsTo_HH_MM_SS_converter(1);
            this.displayTime = this.audioDuration;
        } else {
            this.audioDuration = this.utilsService.secondsTo_HH_MM_SS_converter(this.audioAttachement?.meta?.duration);
            this.displayTime = this.audioDuration;
        }

        this.audVal = 0;
        this.audMax = this.audioAttachement?.meta?.duration;

        this.chatroomService.sendImageFilesEmitted$$.subscribe((res) => {
            this.sendImageFilesEmitted = res;
        });
        this.homeFeedService.currentlyLoadingMediaIds$$.subscribe((val) => {
            this.showAudioFrames = val[this.messageId];
        });
        this.awsService.totalBytesUploadedObject$$.subscribe((res) => {
            if (!this.message?.attachments_uploaded && this.message?.id != null && this.message.totalFileSize && res[this.uniqueId]) {
                // console.log(`bytes uploaded ->`, res[this.uniqueId], ` out of ${this.message.totalFileSize}`);
                this.progress = ((res[this.uniqueId][0] || 0) / this.message.totalFileSize) * 100;
                this.onSliderChangeEnd(0);
            }
        });
        this.audioService.isAudioRecording$$.pipe(takeUntil(this.destroy$$)).subscribe((val) => {
            if (val) this.pause();
        });

        this.audioService.isAudioRecordedPreviewPlaying$$.pipe(takeUntil(this.destroy$$)).subscribe((val) => {
            if (val) this.stop();
        });
    }

    addAllBytes(bytesArray) {
        let totalBytes = 0;
        bytesArray?.forEach((val) => {
            totalBytes += val;
        });
        return this.utilsService.bytesToSize(totalBytes);
    }

    onSliderChangeStart(event) {
        // this.pause();
    }

    onSliderChangeEnd(value) {
        this.removeAnimation();
        setTimeout(() => {
            this.audioState['currentTime'] = value;
            this.audioService.seekTo(value, this.audioId);
            this.addAnimation();
        });
    }

    onVolumeChange(volume) {
        this.audioService.setVolume(volume.value);
    }

    playStream(url) {
        this.audioService.playStream(url, this.audioId).subscribe((events: any) => {
            if (events.type == 'ended') {
                this.audioState['currentTime'] = 0;
                this.audVal = 0;
                this.pause();
                this.displayTime = this.audioDuration;
                this.sendAnalytics(MIXPANEL.VOICE_MESSAGE_SENT, null, 0, true, this.message.id);
                setTimeout(() => {
                    this.removeAnimation();
                });
            }
            if (events.type == 'timeupdate') {
                // console.log("TIME IS UPDATING ", events)
                this.displayTime = this.utilsService.secondsTo_HH_MM_SS_converter(this.audioState?.currentTime);
            }
        });
    }

    sendAnalytics(eventType, textMsg?, fileCount = 0, voice_note_event?, message_id?): void {
        let payload: any = {
            chatroom_id: this.message.chatroom_id,
            community_id: this.message.community_id,
            chatroom_type: CHATROOM_TYPE_MAP[this.chatroom.type],
        };
        if (message_id) {
            payload = {
                message_id,
                ...payload,
            };
        }
        this.analyticsService.sendEvent(eventType, payload);
    }

    slideEvent(event) {}

    openFile(url) {
        //this.audioService.stop();
        this.playStream(url);
    }

    pause() {
        this.audioService.pause();
        this.audioService.isAudioPlaying$$.next(false);
    }

    addAnimation() {
        this.sliderTrackHigh = document.getElementById(`${this.messageId}`).getElementsByClassName('slider-track-high')[0] as HTMLElement;
        this.sliderTrackHigh.style.setProperty('transition', 'width 1s linear 0s');
        this.sliderTrackSelected = document
            .getElementById(`${this.messageId}`)
            .getElementsByClassName('slider-selection')[0] as HTMLElement;
        this.sliderTrackSelected.style.setProperty('transition', 'width 1s linear 0s');

        this.sliderTrackThumb = document
            .getElementById(`${this.messageId}`)
            .getElementsByClassName('slider-handle min-slider-handle round')[0] as HTMLElement;
        this.sliderTrackThumb.style.setProperty('transition', 'left 1s linear 0s');
    }

    removeAnimation() {
        this.sliderTrackHigh.style.removeProperty('transition');
        this.sliderTrackSelected.style.removeProperty('transition');
        this.sliderTrackThumb.style.removeProperty('transition');
    }

    play() {
        let timer;
        // this.chatroomService.scrollToBottom$$.next(true);
        timer = setTimeout(() => {
            let id = this.audioService.currentlyPlayingAudioID$$.value;
            if (!id) {
                this.openFile(this.audioUrl);
                this.audioService.play();
                this.addAnimation();
                this.audioService.isAudioPlaying$$.next(true);
                this.audioService.currentlyPlayingAudioID$$.next(this.audioId);
            } else {
                if (id == this.audioId) {
                    this.openFile(this.audioUrl);
                    this.audioService.play();
                    this.addAnimation();

                    this.audioService.isAudioPlaying$$.next(true);
                } else {
                    this.audioService.stop();
                    this.openFile(this.audioUrl);
                    this.audioService.play();
                    this.addAnimation();

                    this.audioService.isAudioPlaying$$.next(true);
                }
                this.audioService.currentlyPlayingAudioID$$.next(this.audioId);
            }
            clearTimeout(timer);
        }, 0);
    }

    formatCurrentTime() {
        return this.utilsService.secondsTo_HH_MM_SS_converter(this.audioState['currentTime']);
    }

    stop() {
        this.audioService.stop();
        this.displayTime = this.audioDuration;
        this.audioService.isAudioPlaying$$.next(false);
    }

    setCurrentTime(event: Event) {}

    ngOnChanges() {}

    ngAfterViewInit() {}

    ngOnDestroy(): void {
        this.destroy$$.next(null);
        this.destroy$$.complete();
        this.pause();
    }
}

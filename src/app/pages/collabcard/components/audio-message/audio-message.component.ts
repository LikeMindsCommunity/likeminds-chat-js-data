import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { AudioService } from 'src/app/core/services/audio.service';

import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { UtilsService } from 'src/app/core/services/utils.service';
@Component({
    selector: 'app-audio-message',
    templateUrl: './audio-message.component.html',
    styleUrls: ['./audio-message.component.scss'],
})
export class AudioMessageComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() audioAttachement: any;
    @Input() index;
    @Input() messageId;
    @Input() message;
    @Input() audioAttachmentsUploaded: boolean;
    @Input() isMyMsg;

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

    constructor(
        private chatroomService: ChatroomService,
        private cdr: ChangeDetectorRef,
        private utilsService: UtilsService,
        private audioService: AudioService,
        public homeFeedService: HomeFeedService
    ) {
        this.audioService.getState().subscribe((allStates) => {
            let state = allStates[this.audioId];
            if (state) {
                if (state['playing']) {
                    this.audioState = state;
                }
                //this.audVal = state?.currentTime ? state?.currentTime : 0;
                //console.log("1 : ", allStates);
                // this.audMax = state?.duration;
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
        this.audioId = `audio${this.messageId?.toString() + this.index?.toString()}`;
        this.audioDuration = this.utilsService.secondsTo_HH_MM_SS_converter(this.audioAttachement?.meta?.duration);
        this.audVal = 0;
        this.audMax = this.audioAttachement?.meta?.duration;

        this.chatroomService.sendImageFilesEmitted$$.subscribe((res) => {
            this.sendImageFilesEmitted = res;
        });
        this.homeFeedService.currentlyLoadingMediaIds$$.subscribe((val) => {
            this.showAudioFrames = val[this.messageId];
        });
    }

    onSliderChangeStart() {
        // this.pause();
    }

    onSliderChangeEnd(value) {
        this.audioState['currentTime'] = value;
        this.audioService.seekTo(value, this.audioId);
        // this.play();
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
            }
            if (events.type == 'timeupdate') {
                //console.log("TIME IS UPDATING ")
            }
        });
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

    play() {
        let id = this.audioService.currentlyPlayingAudioID$$.value;
        if (!id) {
            this.openFile(this.audioUrl);
            this.audioService.play();
            this.audioService.isAudioPlaying$$.next(true);
            this.audioService.currentlyPlayingAudioID$$.next(this.audioId);
        } else {
            if (id == this.audioId) {
                this.openFile(this.audioUrl);
                this.audioService.play();
                this.audioService.isAudioPlaying$$.next(true);
            } else {
                this.audioService.stop();
                this.openFile(this.audioUrl);
                this.audioService.play();
                this.audioService.isAudioPlaying$$.next(true);
            }
            this.audioService.currentlyPlayingAudioID$$.next(this.audioId);
        }
    }

    formatCurrentTime() {
        return this.utilsService.secondsTo_HH_MM_SS_converter(this.audioState['currentTime']);
    }

    stop() {
        this.audioService.stop();
        this.audioService.isAudioPlaying$$.next(false);
    }

    setCurrentTime(event: Event) {}

    ngOnChanges() {
        // if (this.dontPauseAudioId != null && this.dontPauseAudioId != this.audioId) {
        //     if (this.track) {
        //         this.track.pause();
        //         if (this.dontPauseAudioId == 'stop-audio') {
        //             return;
        //         } else this.track.currentTime = 0;
        //     }
        // }
    }

    ngAfterViewInit() {
        // this.track = <HTMLAudioElement>document.getElementById(this.audioId);
        // let progressbar = <HTMLDivElement>document.getElementById(this.progressBarId);
        // this.track?.addEventListener('play', () => {
        //     this.pauseOtherAudio.emit(this.audioId);
        //     this.audioWasPlaying = true;
        //     this.showPauseButton = true;
        //     this.timer = setInterval(() => {
        //         this.position = this.track.currentTime * (100 / this.track.duration);
        //         progressbar.style.width = `${(this.position * 136) / 100 + 1}px`;
        //         if (this.cdr && !(this.cdr as ViewRef).destroyed) {
        //             this.cdr.detectChanges();
        //         }
        //     }, 500);
        // });
        // this.track?.addEventListener('pause', () => {
        //     this.showPauseButton = false;
        //     //clearInterval(this.timer);
        // });
        // this.track?.addEventListener('click', () => {
        //     this.audioWasPlaying = false;
        // });
        // this.rangeInput = <HTMLInputElement>document.getElementById(this.rangeInputId);
        // this.rangeInput?.addEventListener('input', () => {
        //     this.track.pause();
        //     this.track.currentTime = this.rangeInput.valueAsNumber * (this.track.duration / 100);
        //     progressbar.style.width = `${(this.rangeInput.valueAsNumber * 136) / 100 + 4}px`;
        //     if (this.track.currentTime == this.track.duration) {
        //         this.position = 0;
        //         this.rangeInput.value = 0;
        //         //clearInterval(this.timer);
        //     }
        // });
        // this.track?.addEventListener('ended', () => {
        //     this.position = 0;
        //     this.track.currentTime = 0;
        //     progressbar.style.width = '0px';
        //     let i = 0;
        //     //clearInterval(this.timer);
        // });
        // this.rangeInput?.addEventListener('mouseup', () => {
        //     this.track.play();
        //     // if(this.audioWasPlaying){
        //     //   this.track.play();
        //     // }
        // });
    }

    ngOnDestroy(): void {
        this.pause();
    }
}

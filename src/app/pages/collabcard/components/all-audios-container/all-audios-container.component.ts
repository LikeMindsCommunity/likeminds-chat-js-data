import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
@Component({
    selector: 'app-all-audios-container',
    templateUrl: './all-audios-container.component.html',
    styleUrls: ['./all-audios-container.component.scss'],
})
export class AllAudiosContainerComponent implements OnInit, OnChanges {
    @Input() message;
    @Input() chatroom;
    @Input() playingAudioId;
    @Input() isMyMsg;
    @Input() uniqueId;
    @Output() playingAudioIdEvent: EventEmitter<any> = new EventEmitter();
    pauseAudio = false;
    dontPauseAudioId: any = null;
    audioAttachmentsUploaded: boolean;
    showAllAudios: boolean = false;

    constructor() {}

    ngOnInit(): void {
        if (this.message?.id == null) {
            this.audioAttachmentsUploaded = true;
        } else this.audioAttachmentsUploaded = this.message.attachments_uploaded;

        this.dontPauseAudioId = this.playingAudioId;
    }

    ngOnChanges(): void {
        this.dontPauseAudioId = this.playingAudioId;
    }

    pauseOtherAudio(event) {
        //this.dontPauseAudioId = event;
        this.playingAudioIdEvent.emit(event);
    }
}

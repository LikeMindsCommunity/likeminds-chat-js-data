import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { AudioStreamState } from '../../shared/models/audio-stream.model';

@Injectable({
    providedIn: 'root',
})
export class AudioService {
    private state: AudioStreamState = {
        audioId: null,
        playing: false,
        readableCurrentTime: '',
        readableDuration: '',
        duration: undefined,
        currentTime: undefined,
        volume: 1,
        canplay: false,
        error: false,
    };
    private stop$ = new Subject();
    private audioObj = new Audio();
    audioEvents = ['ended', 'error', 'play', 'playing', 'pause', 'timeupdate', 'canplay', 'loadedmetadata', 'loadstart'];

    ///// NEW VARIABLES:
    private allAudiosState$$ = new BehaviorSubject<{}>({});
    public currentlyPlayingAudioID$$ = new BehaviorSubject<string>('');
    public isAudioPlaying$$ = new BehaviorSubject<boolean>(false);
    public isAudioRecording$$ = new BehaviorSubject<boolean>(false);
    public isAudioRecorded$$ = new BehaviorSubject<boolean>(false);
    public isAudioRecordedPreviewPlaying$$ = new BehaviorSubject<boolean>(false);
    /////

    constructor() {}

    private updateStateEvents(event: Event, id): void {
        let allAudiosState = this.allAudiosState$$.value;
        let state = allAudiosState[id] ? allAudiosState[id] : {};
        state['audioId'] = id;

        switch (event.type) {
            case 'canplay':
                state['duration'] = this.audioObj.duration;
                state['readableDuration'] = this.formatTime(this.state.duration);
                state['canplay'] = true;
                // console.log('canplay');
                break;
            case 'playing':
                state['playing'] = true;
                break;
            case 'pause':
                state['playing'] = false;
                break;
            case 'timeupdate':
                state['currentTime'] = this.audioObj.currentTime;
                break;
            case 'error':
                this.resetState();
                this.state.error = true;
                break;
        }
        allAudiosState[id] = state;
        this.allAudiosState$$.next(allAudiosState);
    }

    resetState() {
        this.state = {
            audioId: null,
            playing: false,
            readableCurrentTime: '',
            readableDuration: '',
            duration: undefined,
            currentTime: undefined,
            volume: 0.5,
            canplay: false,
            error: false,
        };
    }

    getState(): Observable<{}> {
        return this.allAudiosState$$.asObservable();
    }

    private streamObservable(url, id) {
        let allAudiosState = this.allAudiosState$$.value;
        return new Observable((observer) => {
            // Play audio
            this.audioObj.src = url;
            this.audioObj.currentTime = allAudiosState[id]?.currentTime ? allAudiosState[id]?.currentTime : 0;
            this.audioObj.load();
            this.audioObj.play();

            const handler = (event: Event) => {
                this.updateStateEvents(event, id);
                observer.next(event);
            };

            this.addEvents(this.audioObj, this.audioEvents, handler);
            return () => {
                //Stop Playing
                this.audioObj.pause();
                let allAudiosState = this.allAudiosState$$.value;
                allAudiosState[id]['currentTime'] = 0;
                allAudiosState[id]['playing'] = false;
                this.audioObj.currentTime = 0;
                this.allAudiosState$$.next(allAudiosState);
                // remove event listeners
                this.removeEvents(this.audioObj, this.audioEvents, handler);
                // reset state
            };
        });
    }

    private addEvents(obj, events, handler) {
        events.forEach((event) => {
            obj.addEventListener(event, handler);
        });
    }

    private removeEvents(obj, events, handler) {
        events.forEach((event) => {
            obj.removeEventListener(event, handler);
        });
    }

    playStream(url, id) {
        return this.streamObservable(url, id).pipe(takeUntil(this.stop$));
    }

    play() {
        this.audioObj.play();
    }

    pause() {
        this.audioObj.pause();
    }

    stop() {
        this.stop$.next();
    }

    seekTo(seconds, audioId) {
        let allAudiosState = this.allAudiosState$$.value;
        // console.log("THIS IS THE AUDIO ID : ", audioId);
        // console.log(this.allAudiosState$$.value)
        if (allAudiosState[audioId]) {
            allAudiosState[audioId]['currentTime'] = seconds;
        } else {
            allAudiosState[audioId] = {};
            allAudiosState[audioId]['currentTime'] = seconds;
        }

        if (audioId == this.currentlyPlayingAudioID$$.value) {
            this.audioObj.currentTime = seconds;
        }

        this.allAudiosState$$.next(allAudiosState);
    }

    setVolume(volume) {
        this.audioObj.volume = volume;
    }

    formatTime(time: number, format: string = 'mm:ss') {
        const momentTime = time * 1000;
        return moment.utc(momentTime).format(format);
    }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    closeMatBottomSheet$$ = new BehaviorSubject<any>(0);
    closeMatDialogBox$$ = new BehaviorSubject<any>(false);
    openSideDrawer$$ = new BehaviorSubject<any>(false);
    openShareUrlPopup$$ = new BehaviorSubject<boolean>(false);
    showAccountHeader$$ = new BehaviorSubject<boolean>(false);

    constructor() {}

    secondsTo_HH_MM_SS_converter(seconds) {
        let date = new Date(null);
        date.setSeconds(seconds);
        let time;

        if (seconds >= 3600) {
            time = date.toISOString().substr(12, 7);
        } else if (seconds < 3600 && seconds >= 600) {
            time = date.toISOString().substr(14, 5);
        } else if (seconds < 600 && seconds >= 60) {
            time = date.toISOString().substr(14, 5);
        } else if (seconds >= 0 && seconds < 60) {
            time = date.toISOString().substr(15, 4);
        }

        return time;
    }

    bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
        return Math.round(bytes / Math.pow(1000, i)) + ' ' + sizes[i];
    }

    fetchDuration(path) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.src = path;
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration);
            });
        });
    }

    fetchAllAudioFilesDuration(files: any[]) {
        return Promise.all(
            Array.from(files).map(async (file) => {
                let url = URL.createObjectURL(file);
                return { duration: await this.fetchDuration(url), file: file };
            })
        );
    }
}

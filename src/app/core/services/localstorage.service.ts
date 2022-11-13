import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LocalStorageService {

    $$pendingUserObject =  new BehaviorSubject({});

    constructor(@Inject(PLATFORM_ID) private platformId: object) { }

    setSavedState(state: any, localStorageKey: string) {
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    }

    getSavedState(localStorageKey: string): any {
        if (!isPlatformBrowser(this.platformId)) return;
        return JSON.parse(localStorage.getItem(localStorageKey));
    }

    removedSavedState(localStorageKey: string) {
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.removeItem(localStorageKey);
    }
}
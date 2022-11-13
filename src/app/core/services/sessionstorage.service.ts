import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class SessionstorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }
  setSessionState(sessionStorageKey: string, state: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(state));
    }

    getSessionState(sessionStorageKey: string): any {
        if (!isPlatformBrowser(this.platformId)) return;
        return JSON.parse(sessionStorage.getItem(sessionStorageKey));
    }

    removeSessionState(sessionStorageKey: string) {
        if (!isPlatformBrowser(this.platformId)) return;
        sessionStorage.removeItem(sessionStorageKey);
    }
}

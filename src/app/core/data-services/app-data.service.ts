import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AppDataService {

    private userJoinedCommunity = new BehaviorSubject(false);
    userJoinedState = this.userJoinedCommunity.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    setUserJoinedState(userJoined: boolean) {
        this.userJoinedCommunity.next(userJoined);
    }
}
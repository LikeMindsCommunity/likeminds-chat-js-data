import { Injectable } from '@angular/core';
import * as mixpanel from 'mixpanel-browser';

@Injectable({
    providedIn: 'root'
})
export class MixpanelService {

    constructor() {}

    track(id: string, action: any = {}): void {
        mixpanel.track(id, action);
    }

    setPeople(userConfig): void {
      mixpanel.people.set(userConfig);
    }

    aliasMixpanel(userId: string): void {
      mixpanel.alias(userId);
    }

    identify(userId): void {
      mixpanel.identify(userId);
    }

}

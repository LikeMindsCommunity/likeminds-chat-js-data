import { Injectable } from '@angular/core';
import { SegmentService } from 'ngx-segment-analytics';

@Injectable({
    providedIn: 'root',
})
export class SegmentAnalyticService {
    constructor(private segment: SegmentService) {}

    track(id: string, action: any = {}): void {
        this.segment.track(id, action);
    }

    // setPeople(userConfig): void {
    //   // this.segment.people.set(userConfig);
    // }

    setPeople(userConfig): void {
        // window.analytics.people.set(userConfig);
    }

    aliasMixpanel(userId: string): void {
        this.segment.alias(userId);
    }

    identify(userId): void {
        this.segment.identify(userId);
    }
}

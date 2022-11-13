import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { STORAGE_KEY } from '../../shared/enums/storage-keys.enum';
import { LocalStorageService } from './localstorage.service';
import { MixpanelService } from './mixpanel.service';
import { SegmentAnalyticService } from './segment-analytic.service';

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {
    public segMentConfig$$ = new BehaviorSubject<any>(null);

    constructor(
        private localStorageService: LocalStorageService,
        private mixPanelService: MixpanelService,
        private segmentAnalyticService: SegmentAnalyticService
    ) {}

    aliasUserID(userId): void {
        this.mixPanelService.aliasMixpanel(userId);
        this.segmentAnalyticService.aliasMixpanel(userId);
    }

    identifyUser(userId): void {
        this.mixPanelService.identify(userId);
        this.segmentAnalyticService.identify(userId);
    }

    setUserConfig(userConfig): void {
        this.mixPanelService.setPeople(userConfig);
        this.segmentAnalyticService.setPeople(userConfig);
    }

    sendEvent(eventName: string, payload: any = {}): void {
        const user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        if (!user) {
            this.segMentConfig$$.subscribe((res) => {
                this.segmentAnalyticService.track(eventName, { ...payload, is_logged_in: false });
            });
        } else {
            this.segMentConfig$$.subscribe((res) => {
                this.segmentAnalyticService.track(eventName, { ...payload, distinct_id: user.id, is_logged_in: true });
            });
        }
    }
}

import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toInteger } from 'lodash';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommunityService } from 'src/app/core/services/community.service';
import { EventsService } from 'src/app/core/services/events.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { ResizeService } from 'src/app/core/services/resize.service';
import { ROOT_PATH, BLOCKER } from 'src/app/shared/constants/routes.constant';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';

@Component({
    selector: 'app-view-participants',
    templateUrl: './view-participants.component.html',
    styleUrls: ['./view-participants.component.scss'],
})
export class ViewParticipantsComponent implements OnInit {
    screenType: any;
    showCommunityDetailToPendingMembers = false;
    currentCommunityData: any = null;
    private destroy$$ = new Subject();

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private resizeService: ResizeService,
        private router: Router,
        private localStorageService: LocalStorageService,
        private activatedRoute: ActivatedRoute,
        private eventService: EventsService,
        private communityService: CommunityService
    ) {}

    ngOnInit(): void {
        this.onGetChatroomDetails(toInteger(this.activatedRoute.snapshot.paramMap.get('chatroomId')));

        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        }

        this.resizeService.onResize$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        });

        const regex = /\d+/g;
        const matches = this.router.url.match(regex); // creates array from matches

        let access = this.localStorageService.getSavedState(STORAGE_KEY.ACCESS);
        if (access && window.location.pathname.split('/')[1] === 'community_detail') {
            this.router.navigate([`${ROOT_PATH}`]);
        } else if (!access && window.location.pathname.split('/')[1] === 'community_feed') {
            this.router.navigate([`${BLOCKER}`]);
        } else if (access && window.location.pathname.split('/')[1] === 'community_feed') {
            this.showCommunityDetailToPendingMembers = false;
        } else if (access && window.location.pathname.split('/')[1] === 'event_feed') {
            this.showCommunityDetailToPendingMembers = false;
        } else {
            this.showCommunityDetailToPendingMembers = true;
        }

        this.communityService.currentCommunityData$$.subscribe((data) => {
            if (data !== this.currentCommunityData) this.currentCommunityData = data;
        });
    }

    goBack() {
        this.router.navigateByUrl(
            `/${this.currentCommunityData?.id}/collabcard/${this.activatedRoute.snapshot.paramMap.get('chatroomId')}`
        );
    }

    chatroom: any;
    onGetChatroomDetails(chatroomId: number) {
        this.eventService.chatroomDetails({ chatroom_id: chatroomId }).subscribe((res) => {
            this.chatroom = res.chatroom;
        });
    }

    ngOnDestroy(): void {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { IUser } from '../../../../shared/models/user.model';
import { IChatroom } from '../../../../shared/models/chatroom.model';
import { ICommunity } from '../../../../shared/models/community.model';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { LocalStorageService } from '../../../../core/services/localstorage.service';
import { StartLoading, StopLoading } from '../../../../shared/store/actions/app.action';

import { State } from '../../../../shared/store/reducers';
import { CommunityService } from 'src/app/core/services/community.service';

@Component({
    selector: 'app-pinned-list',
    templateUrl: './pinned-list.component.html',
    styleUrls: ['./pinned-list.component.scss'],
})
export class PinnedListComponent implements OnInit, OnDestroy {
    user: IUser;
    communityId: number;
    community: ICommunity;
    chatrooms: IChatroom[] = [];
    communityFeedRoute: string = '';
    private destroy$$ = new Subject();

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private store: Store<State>,
        private localStorageService: LocalStorageService,
        private homeFeedService: HomeFeedService,
        private communityService: CommunityService
    ) {}

    ngOnInit(): void {
        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((route) => {
                if (!this.communityId || (this.communityId && this.communityId != route.params.communityId)) {
                    this.store.dispatch(StartLoading());
                    this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
                    this.communityId = parseInt(route.params.communityId);
                    if (!this.user && this.router.url === `/community/${this.communityId}/pinned`) this.router.navigateByUrl('/auth');
                    this.chatrooms = [];
                    this.fetchCommunityDetails(this.communityId.toString());
                }

                this.getCurrentCommunityData();
            });

        this.communityFeedRoute = `/community_feed/${this.activatedRoute.snapshot.params.communityId}`;
        this.communityService.showCommunityHeader$$.next({ status: true, headerValue: 'PinnedView' });
    }

    getCurrentCommunityData() {
        this.homeFeedService.communityGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            const currentCommunity = response.findIndex((community) => community?.id === this.communityId);
            if (currentCommunity >= 0) {
                const currentCommunityData = response[currentCommunity];
                this.communityService?.currentCommunityData$$?.next(currentCommunityData);
            }
        });
    }

    fetchCommunityDetails(communityId: string) {
        this.homeFeedService.communityDetailGroup$.pipe(takeUntil(this.destroy$$)).subscribe((communityList) => {
            if (communityList[communityId]) {
                this.community = communityList[communityId]?.community;
                if (communityList[communityId]?.pinned_top_bar) {
                    this.getPinnedChatrooms(communityId);
                    // this.homeFeedService.getInitialCommunityFeedPinnedChatrooms(this.communityId);
                }
            } else {
                if (this.user) this.homeFeedService.getCommunityDetail(communityId);
            }
        });
    }

    getPinnedChatrooms(communityId: string) {
        this.homeFeedService.communityPinnedChatroomGroup$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            if (response[communityId]) {
                this.chatrooms = response[communityId];
            }
            this.store.dispatch(StopLoading());
        });
    }

    onScroll() {
        // if (this.chatrooms.length)
        // this.homeFeedService.getCommunityFeedPinnedChatrooms(this.communityId, this.chatrooms[this.chatrooms.length - 1].id);
    }

    ngOnDestroy() {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { IUser } from '../../../../shared/models/user.model';
import { MyCommunity } from '../../../../shared/models/community.model';
import { STORAGE_KEY } from '../../../../shared/enums/storage-keys.enum';
import { HomeFeedService } from '../../../../core/services/home-feed.service';
import { LocalStorageService } from '../../../../core/services/localstorage.service';
import { ACTIONS_MAP, ALLOWED_COMMUNITY_ACTIONS } from '../../../../shared/constants/app-constant';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { IChatroom } from 'src/app/shared/models/chatroom.model';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { BLOCKER, COMMUNITY_FEED_PATH, MEMBER_DIRECTORY, PINNED } from 'src/app/shared/constants/routes.constant';
import { StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { CommunityService } from 'src/app/core/services/community.service';

@Component({
    selector: 'app-community-feed-header',
    templateUrl: './community-feed-header.component.html',
    styleUrls: ['./community-feed-header.component.scss'],
})
export class CommunityFeedHeaderComponent implements OnInit, OnDestroy {
    @Input() chatroom: IChatroom;
    @Input() chatrooms;
    private destroy$$ = new Subject();
    community: MyCommunity;
    actions = [];
    user: IUser;
    state: number;

    constructor(
        private homeFeedService: HomeFeedService,
        private router: Router,
        private snackbar: MatSnackBar,
        private activatedRoute: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private analyticsService: AnalyticsService,
        private subscriptionService: SubscriptionService,
        private store: Store<State>,
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
                this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
                this.fetchCommunityDetails(parseInt(route.params.communityId));
            });

        this.communityService.memberStateObj$$.subscribe((state) => {
            this.state = state.state;
        });
    }

    fetchCommunityDetails(communityId: number) {
        this.homeFeedService.communityDetailGroup$.pipe(takeUntil(this.destroy$$)).subscribe((communityList) => {
            if (communityList[communityId]) {
                this.community = communityList[communityId]?.community;
                this.actions = [...communityList[communityId]?.actions.filter((action) => ALLOWED_COMMUNITY_ACTIONS.includes(action.id))];
            } else {
                if (this.user) this.homeFeedService.getCommunityDetail(communityId);
            }
        });
    }

    takeAction(action): void {
        switch (action.id) {
            case ACTIONS_MAP.VIEW_COMMUNTIY:
                this.activatedRoute.params.subscribe((param) => {
                    this.router.navigate([`${COMMUNITY_FEED_PATH}/${param.communityId}/detail`]);
                });
                this.analyticsService.sendEvent(MIXPANEL.VIEW_COMMUNITY, {
                    chatroom_id: this.chatroom?.id,
                    community_id: this.community.id,
                    source1: COMMUNITY_FEED_PATH,
                    source2: 'chatroom_overflow_menu',
                });
                break;
            case ACTIONS_MAP.VIEW_PINNED_CHATROOMS:
                this.router.navigate([COMMUNITY_FEED_PATH, this.community.id, PINNED]);
                break;
            case ACTIONS_MAP.MEMBER_DIRECTORY:
                this.router.navigate([COMMUNITY_FEED_PATH, this.community.id, MEMBER_DIRECTORY]);
                break;
            default:
                this.snackbar.open('Coming Soon', null, {
                    duration: 4000,
                    panelClass: ['snackbar'],
                });
        }
    }

    leaveCommunity() {
        this.store.dispatch(StartLoading());
        this.subscriptionService.cancelSubscription({ community_id: this.community.id }).subscribe((res) => {
            this.subscriptionService.leaveCommunity(`community_id=${this.community.id}`).subscribe((res) => {
                this.store.dispatch(StopLoading());
                console.log(2);
                this.router.navigate([`${BLOCKER}`]);
            });
        });
    }

    ngOnDestroy(): void {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

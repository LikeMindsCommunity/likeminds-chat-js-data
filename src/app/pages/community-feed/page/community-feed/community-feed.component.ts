import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { CommunityService } from 'src/app/core/services/community.service';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { CookieService } from 'ngx-cookie-service';
import { COMMMUNITY_OPENED } from 'src/app/shared/constants/app-constant';

@Component({
    selector: 'app-community-feed',
    templateUrl: './community-feed.component.html',
    styleUrls: ['./community-feed.component.scss'],
})
export class CommunityFeedComponent implements OnInit, OnDestroy {
    isChatroom: boolean = false;
    communityId: number;
    private destroy$$ = new Subject();
    showPendingStateMessage: boolean;
    notAMemberFlag: boolean = false;
    communityName: string;
    screenType: string;
    drawerOpened: boolean = false;
    user;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private communityService: CommunityService,
        private cookieService: CookieService,
        private homeFeedService: HomeFeedService,
        private localStorageService: LocalStorageService,
        private chatroomService: ChatroomService
    ) {}

    ngOnInit(): void {
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);

        if (window.location.pathname.split('/').length == 3) {
            this.checkMemberState(window.location.pathname.split('/')[2] || this.cookieService.get(COMMMUNITY_OPENED), this.user?.id);
        }

        if (localStorage.getItem('__show_detail_page__')) {
            let communityId = localStorage.getItem('__show_detail_page__');
            window.localStorage.removeItem('__show_detail_page__');
        }

        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';

        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((route) => {
                this.chatroomService?.showNewChatroomCommunityDetail$$.next(false);
                if (route.children.length) this.isChatroom = true;
                else this.isChatroom = false;

                this.communityService.showPendingStateMessage$$.subscribe((res) => {
                    this.showPendingStateMessage = res;
                    let url = window.location.pathname;
                    if (url.split('/')[3] === 'detail') {
                        this.showPendingStateMessage = false;
                    }
                });
                if (this.drawerOpened) this.chatroomService.openHomePageProfileDrawer$$.next(false);
            });

        this.chatroomService.openHomePageProfileDrawer$$.subscribe((res) => {
            if (this.drawerOpened !== res) this.drawerOpened = res;
        });
    }

    checkMemberState(community_id, member_id) {
        this.communityService.getMemberState({ community_id, member_id }).subscribe(
            (response) => {
                if (response?.state == 0) {
                    this.router.navigate(['/']);
                }
            },
            (err) => {
                this.router.navigate(['/']);
            }
        );
    }

    showNotAMemberFlag($event) {
        if ($event.show === 'true') {
            this.notAMemberFlag = true;
            this.communityName = $event.communityName;
        } else {
            this.notAMemberFlag = false;
        }
    }

    ngOnDestroy() {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

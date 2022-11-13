import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { getDevice } from 'src/app/shared/utils';

@Component({
    selector: 'app-pinned-feed',
    templateUrl: './pinned-feed.component.html',
    styleUrls: ['./pinned-feed.component.scss'],
})
export class PinnedFeedComponent implements OnInit, OnDestroy {
    isChatroom: boolean = false;
    communityId: number;
    drawerOpened: boolean = false;
    screenType: string;
    private destroy$$ = new Subject();

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private chatroomService: ChatroomService) {}

    ngOnInit(): void {
        this.screenType = getDevice();
        this.router.events
            .pipe(
                takeUntil(this.destroy$$),
                filter((event) => event instanceof NavigationEnd),
                startWith(this.router),
                map((_) => this.activatedRoute.snapshot)
            )
            .subscribe((route) => {
                if (route.children.length) this.isChatroom = true;
                else this.isChatroom = false;
                if (this.drawerOpened) this.chatroomService.openHomePageProfileDrawer$$.next(false);
            });

        this.chatroomService.openHomePageProfileDrawer$$.subscribe((res) => {
            if (this.drawerOpened !== res) this.drawerOpened = res;
        });
    }

    ngOnDestroy() {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

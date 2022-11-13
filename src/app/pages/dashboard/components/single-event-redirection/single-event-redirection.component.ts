import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { COLLABCARD_PATH, EVENT_DETAIL, EVENT_FEED_PATH } from 'src/app/shared/constants/routes.constant';

@Component({
    selector: 'app-single-event-redirection',
    templateUrl: './single-event-redirection.component.html',
    styleUrls: ['./single-event-redirection.component.scss'],
})
export class SingleEventRedirectionComponent implements OnInit, OnDestroy {
    destroy$$ = new Subject();

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private chatroomService: ChatroomService) {}

    ngOnInit(): void {
        console.log(this.activatedRoute.snapshot, 'single ev');
        let chatroomId;
        if (this.activatedRoute.snapshot.params.chatroomId) {
            chatroomId = +this.activatedRoute.snapshot.params.chatroomId;
        } else if (this.activatedRoute.snapshot.queryParams.chatroom_id) {
            chatroomId = +this.activatedRoute.snapshot.queryParams.chatroom_id;
        }

        let ctaText;
        if (this.activatedRoute.snapshot.queryParams.cta) ctaText = this.activatedRoute.snapshot.queryParams.cta;

        this.chatroomService
            .getChatroomDetail(chatroomId, null)
            .pipe(takeUntil(this.destroy$$))
            .subscribe((res) => {
                if (ctaText)
                    this.router.navigateByUrl(
                        `/${EVENT_FEED_PATH}/${res.chatroom.community_id}/${COLLABCARD_PATH}/${chatroomId}/${EVENT_DETAIL}?cta=${ctaText}`
                    );
                else
                    this.router.navigateByUrl(
                        `/${EVENT_FEED_PATH}/${res.chatroom.community_id}/${COLLABCARD_PATH}/${chatroomId}/${EVENT_DETAIL}`
                    );
            });
    }

    ngOnDestroy() {
        this.destroy$$.next();
        this.destroy$$.complete();
    }
}

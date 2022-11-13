import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { IChatroom } from '../../../../shared/models/chatroom.model';
import { COLLABCARD_PATH, COMMUNITY_FEED_PATH } from '../../../../shared/constants/routes.constant';
import { ChatroomService } from 'src/app/core/services/chatroom.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CHATROOM_FOLLOW_SOURCE, MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { CHATROOM_TYPE_MAP } from 'src/app/shared/constants/app-constant';
import { Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getDevice } from 'src/app/shared/utils';
import { CustomSnackbarComponent } from 'src/app/shared/entryComponents/custom-snackbar/custom-snackbar.component';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-community-feed-chatroom-card',
    templateUrl: './community-feed-chatroom-card.component.html',
    styleUrls: ['./community-feed-chatroom-card.component.scss'],
})
export class CommunityFeedChatroomCardComponent implements OnInit, OnDestroy {
    @Input() chatroom: any;
    @Input() isPinnedList: boolean;
    @Input() isPinnedChatroom: boolean;
    @Input() indexOfElementProp: number;
    @Input() membershipState: any;
    url: string;
    user: any;
    screenType: string;
    chatroomFollowStatus: boolean;
    newChatroomBtn: boolean = false;
    private destroy$$ = new Subject();
    guestUser: any;
    constructor(
        private chatroomService: ChatroomService,
        private localStorageService: LocalStorageService,
        private analyticsService: AnalyticsService,
        private router: Router,
        private homeFeedService: HomeFeedService,
        private snackbar: MatSnackBar,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.screenType = getDevice();
        this.newChatroomBtn = this.chatroom.external_seen;
        this.chatroomFollowStatus = this.chatroom?.follow_status;
        this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
        this.guestUser = this.localStorageService.getSavedState('__is_guest__');
        if (this.isPinnedList)
            this.url = `/${COMMUNITY_FEED_PATH}/${this.chatroom?.community_id}/pinned/${COLLABCARD_PATH}/${this.chatroom?.id}`;
        else this.url = `/${COMMUNITY_FEED_PATH}/${this.chatroom?.community_id}/${COLLABCARD_PATH}/${this.chatroom?.id}`;

        this.chatroomService.hideChatroomFollowButton$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            if (res.status === null) return;
            if (this.chatroom?.id === res.chatroom_id) {
                this.chatroomFollowStatus = res.status;
                this.cdr.detectChanges();
            }
        });
    }

    getDate(data: string) {
        let date = new Date(data);
        return date.toLocaleDateString();
    }

    hideMediaPopup(): void {
        this.newChatroomBtn = true;
        this.chatroomService.closeMediaPopup$$.next(false);
    }

    openSnackbar(msg): void {
        if (this.screenType === 'mobile')
            this.snackbar.open(msg, null, {
                duration: 3000,
                panelClass: ['black-bottom-event-attachment-snackbar'],
            });
        else
            this.snackbar.openFromComponent(CustomSnackbarComponent, {
                duration: 3000,
                panelClass: ['black-bottom-left-snackbar'],
                data: msg,
            });
    }

    sdkGuestUser() {
        alert('Guest user');
    }

    followChatroom(event, followStatus: boolean): void {
        event.stopPropagation();
        if (!this.user) {
            this.analyticsService.sendEvent(MIXPANEL.CHATROOM_FOLLOW_BEFORE_LOGIN, {
                chatroom_id: this.chatroom?.id,
                community_id: this.chatroom?.community_id,
                chatroom_type: CHATROOM_TYPE_MAP[this.chatroom?.type],
            });
            this.router.navigateByUrl('/auth');
            return;
        }

        if (!followStatus && this.chatroom?.member?.id === this.user.id) {
            this.openSnackbar('The creator of a chatroom cannot leave the chatroom');
            return;
        }

        this.chatroomService
            .followChatroom(this.chatroom?.id, this.user.id, followStatus)
            .pipe(
                takeUntil(this.destroy$$),
                filter((res) => !!res && res.success)
            )
            .subscribe(
                (response) => {
                    if (response) this.homeFeedService.getHomeFeedUpdate(this.chatroom?.id);

                    let chatroomType: string;
                    if (this.chatroom.type === 0) chatroomType = 'normal';
                    else if (this.chatroom.type === 1) chatroomType = 'poll';
                    else chatroomType = 'event';
                    this.analyticsService.sendEvent(MIXPANEL.CHATROOM_FOLLOWED, {
                        chatroom_id: this.chatroom?.id,
                        community_id: this.chatroom?.community_id,
                        chatroom_type: chatroomType,
                        source: CHATROOM_FOLLOW_SOURCE.CHATROOM_TELESCOPE,
                    });

                    this.chatroomFollowStatus = !this.chatroomFollowStatus;
                    this.openSnackbar(followStatus ? 'Added to home' : 'You unfollowed this chatroom');
                    this.chatroomService.hideChatroomFollowButton$$.next({ chatroom_id: this.chatroom?.id, status: followStatus });
                },
                (error) => {
                    this.openSnackbar('Something went wrong');
                }
            );
    }

    ngOnDestroy() {
        this.destroy$$.next(null);
        this.destroy$$.complete();
    }
}

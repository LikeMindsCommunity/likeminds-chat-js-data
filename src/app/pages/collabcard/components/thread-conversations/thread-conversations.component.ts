import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    PLATFORM_ID,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { IUser } from 'src/app/shared/models/user.model';
import { IMemberState } from 'src/app/shared/models/member.model';
import { IChatroom } from 'src/app/shared/models/chatroom.model';
import { ICommunity } from 'src/app/shared/models/community.model';
import { combineLatest, Observable, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ResizeService } from 'src/app/core/services/resize.service';
import * as _ from 'lodash';
import { ChatroomService } from '../../../../core/services/chatroom.service';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { GALLERY_CONF, GALLERY_IMAGE, NgxImageGalleryComponent } from 'ngx-image-gallery';
import { CHATROOM_TYPE_CODE, MESSAGE_STATE } from 'src/app/shared/enums/chatroom-type.enum';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';

@Component({
    selector: 'app-thread-conversations',
    templateUrl: './thread-conversations.component.html',
    styleUrls: ['./thread-conversations.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadConversationsComponent implements OnInit {
    destroy = new Subject();

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private cdr: ChangeDetectorRef,
        private resizeService: ResizeService,
        private chatroomService: ChatroomService,
        private homeFeedService: HomeFeedService,
        private router: Router,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private analyticsService: AnalyticsService
    ) {}

    @Input() isLoading: boolean;
    @Input() totalResponseCount = 0;
    @Input() conversations: any[] = [];
    @Input() user: IUser;
    @Input() memberState: IMemberState;
    @Input() chatroom: IChatroom;
    @Input() community: ICommunity;
    @Input() preventScrollToBottom: boolean;
    @Output() followChatroom: EventEmitter<any> = new EventEmitter();
    @Output() changeActive = new EventEmitter();
    @Output() muteChatroom = new EventEmitter();
    @Output() showMediaPopup: EventEmitter<any> = new EventEmitter();
    @Output() preventScrollToBottomEvent: EventEmitter<any> = new EventEmitter();
    screenType: string;
    introThreadConv = null;
    hideRetryButton = {};
    introData: any;
    showIntroThreadView = false;
    introRoomThreadConvCount: number = 0;

    destroy$$ = new Subject();
    isNewMessage = false;
    selectedMsgs = {};
    selectedMsgsLength = 0;
    showFollowTelescope = false;
    showFollowAutoTag = false;
    showActive = false;
    playGifFile: any = {};
    playingAudioId: string | number;

    galleryImages: GALLERY_IMAGE[] = [];

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        }
        this.resizeService.onResize$.pipe(takeUntil(this.destroy$$)).subscribe((response) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        });

        this.chatroomService.markActiveChatroom$$.subscribe((res) => {
            this.showActive = !res;
        });

        this.chatroomService.playGifFile$$.subscribe((res) => {
            this.playGifFile = res;
        });

        this.chatroomService.hideRetryButton$$.subscribe((res) => {
            this.hideRetryButton = res;
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((val) => {
            this.homeFeedService.showIntroThreadView$$.next(false);
        });

        this.homeFeedService.introRoomThreadConvCount$$.subscribe((res) => {
            this.introRoomThreadConvCount = res;
            this.cdr.detectChanges();
        });

        this.homeFeedService.introRoomThreadConv$.subscribe((res) => {
            this.introData = res;
            this.cdr.detectChanges();
        });

        this.analyticsService.sendEvent(MIXPANEL.ACTIVE_THREADS_OPENED, { community_id: this.chatroom?.community_id });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getUnreadPreviews();
        if ((changes.conversations && changes.conversations.currentValue) || (changes.chatroom && changes.chatroom.currentValue)) {
            this.isNewMessage = true;
        }
    }

    getUnreadPreviews = (): void => {
        const chatroomId = this.activatedRoute.snapshot.params.chatroomId;
        this.homeFeedService.fetchIntitialUnreadPreviews(chatroomId);
    };

    ngOnDestroy(): void {
        this.chatroomService.updateConversations([]);
        this.homeFeedService.showIntroThreadView$$.next(false);
        this.homeFeedService.introThreadPageCount$$.next(2);
        this.destroy$$.next();
        this.destroy$$.complete();
    }
}

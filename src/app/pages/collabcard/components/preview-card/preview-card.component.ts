import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DEFAULT_PROFILE_PHOTO_LINK } from '../../../../shared/constants/api.constant';
import { PREVIEW_TYPE } from '../../../../shared/enums/message-type.enum';
import { CHATROOM_TYPE_CODE } from '../../../../shared/enums/chatroom-type.enum';
import { createMixPanelPayload, createWebUrl } from '../../../../shared/utils';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { MIXPANEL } from '../../../../shared/enums/mixpanel.enum';
import { ICommunity } from '../../../../shared/models/community.model';
import { IChatroom } from '../../../../shared/models/chatroom.model';
import { HomeFeedService } from 'src/app/core/services/home-feed.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
    selector: 'app-preview-card',
    templateUrl: './preview-card.component.html',
    styleUrls: ['./preview-card.component.scss'],
})
export class PreviewCardComponent implements OnInit {
    @Input() preview: any;
    @Input() communityId = 0;
    @Input() chatroomId = 0;
    readonly PREVIEW_TYPE = PREVIEW_TYPE;
    readonly defaultProfileLink = DEFAULT_PROFILE_PHOTO_LINK;
    readonly CHATROOM_TYPE = CHATROOM_TYPE_CODE;
    now = new Date().getTime();
    imgInitShow: boolean = true;
    imgInit1: any;
    public circleColor: string;
    private colors = [
        '#B71C1C', //red
        '#880E4F', //pink
        '#4A148C', //Purple
        '#311B92', //Deep Purple
        '#1A237E', //Indigo
        '#0D47A1', //Blue
        '#01579B', //Light Blue
        '#006064', //Cyan
        '#004D40', //Teal
        '#1B5E20', //Green
        '#33691E', //Light Green
        '#827717', //Lime
        '#F57F17', //Yellow
        '#FF6F00', //Amber
        '#E65100', //Orange
        '#BF360C', //Deep Orange
        '#3E2723', //Brown
    ];
    showIntroThreadView: boolean = false;

    constructor(
        private router: Router,
        private analyticsService: AnalyticsService,
        private homeFeedService: HomeFeedService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.homeFeedService.showIntroThreadView$$.subscribe((res) => {
            if (this.showIntroThreadView !== res) {
                this.showIntroThreadView = res;
                this.cdr.detectChanges();
            }
        });
    }

    onImgError(event): void {
        if (event) {
            event.target.src = this.defaultProfileLink;
        }
    }

    onImgErrorInit(event, name): void {
        this.imgInit1 = this.userInit(name);
        this.imgInitShow = false;
    }
    userInit(name) {
        this.circleColor = this.colors[Math.floor(Math.random() * Math.floor(this.colors.length))];
        let initials = '';
        let namesList = name.split(' ');
        for (let name of namesList) {
            if (name[0] !== ' ' && name[0]) {
                initials += name[0]?.toUpperCase();
                if (initials.length === 2) break;
            }
        }
        return initials;
    }

    redirectUrl(event): void {
        event.stopPropagation();
        let source_analytics, intro_source_analytics;
        if (this.showIntroThreadView) {
            source_analytics = 'active_threads';
            intro_source_analytics = 'active_threads';
        } else {
            source_analytics = 'introduction_rooms';
            intro_source_analytics = 'introductions';
        }
        const route = createWebUrl(
            this.preview.action_route,
            this.preview.preview_type,
            this.chatroomId,
            this.communityId,
            source_analytics,
            intro_source_analytics
        );
        if (route) {
            this.trackLinkClick();
            this.router.navigate(route.path, { queryParams: route.queryParams }).then((_) => {
                if (this.preview.preview_type === PREVIEW_TYPE.CHATROOM) {
                    window.location.reload();
                }
            });
        } else {
            console.log('Route not found');
        }
    }

    trackLinkClick() {
        const mixpanelPayload = createMixPanelPayload(this.preview);
        this.analyticsService.sendEvent(mixpanelPayload.eventName, {
            ...mixpanelPayload.payload,
            community_id: this.communityId,
        });
    }
}

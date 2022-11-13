import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { AnalyticsService } from '../../../../core/services/analytics.service';
import { COMMUNITY_FEED_PATH, PROFILE } from '../../../../shared/constants/routes.constant';
import { MIXPANEL, SOURCE } from '../../../../shared/enums/mixpanel.enum';
import { QUESTION_STATE } from '../../../../shared/enums/questions-state.enum';
import { ProfileNotExistPopupComponent } from '../../../../shared/entryComponents/profile-not-exist-popup/profile-not-exist-popup.component';

@Component({
    selector: 'hosts-section',
    templateUrl: './host-section.component.html',
    styleUrls: ['./host-section.component.scss'],
})
export class HostsSectionComponent implements OnInit, OnChanges {
    @Input() hosts: any[];

    customOptionsWeb: OwlOptions = {
        loop: true,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        navSpeed: 700,
        autoplay: true,
        autoplaySpeed: 2000,
        navText: [
            `<img src="https://web.likeminds.community/assets/images/svg/left-arrow-grey.svg"/>`,
            `<img src="https://web.likeminds.community/assets/images/svg/right-arrow-grey.svg"/>`,
        ],
        responsive: {
            0: {
                items: 1,
            },
            400: {
                items: 1,
            },
            740: {
                items: 1,
            },
            940: {
                items: 1,
            },
        },
        nav: true,
    };

    hostList: any;

    constructor(private analyticsService: AnalyticsService, private router: Router, private dialog: MatDialog) {}
    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hosts && changes.hosts.currentValue) {
            if (this.hosts.length === 1)
                this.customOptionsWeb = {
                    ...this.customOptionsWeb,
                    nav: false,
                    navText: ['', ''],
                };
        }
    }

    getIntro(host: any) {
        if (host.question_answers) {
            let intro = host.question_answers.find((question) => question.state === QUESTION_STATE.INTRODUCTION);
            return intro && intro.value;
        }
        return host.custom_intro_text;
    }

    openProfile(host: any) {
        if (host) {
            if (host.custom_click_text) {
                this.dialog.open(ProfileNotExistPopupComponent, {
                    data: {
                        message: host.custom_intro_text,
                    },
                });
            } else {
                this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_VIEW, {
                    community_id: host.community_id,
                    viewed_member_id: host.id,
                    viewed_member_state: host.state,
                    source: SOURCE.CHATROOM,
                });
                this.router.navigate([`/${COMMUNITY_FEED_PATH}/${host.question_answers[0].community_id}/${PROFILE}/${host.id}`]);
            }
        }
    }
}

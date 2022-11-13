import { Component, Input, OnInit } from '@angular/core';
import { IMember } from 'src/app/shared/models/member.model';
import { MatDialog } from '@angular/material/dialog';
import {
    MEMBER_PROFILE_HEADING,
    MEMBER_PROFILE_HEADING1,
    DOWNLOAD_APP_TEXT,
    MEMBER_DIRECTORY_HEADING,
    MEMBER_DIRECTORY_HEADING1,
} from 'src/app/shared/constants/app-constant';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Router } from '@angular/router';
import { MIXPANEL, SOURCE } from '../../enums/mixpanel.enum';
import { COMMUNITY_FEED_PATH, MEMBER_DIRECTORY, MEMBER_DIRECTORY_PATH, PROFILE } from '../../constants/routes.constant';
import { ProfileNotExistPopupComponent } from '../../entryComponents/profile-not-exist-popup/profile-not-exist-popup.component';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.scss'],
})
export class MembersCardComponent implements OnInit {
    @Input() member: IMember;
    @Input() userState: number;
    @Input() totalMembers: number;
    @Input() remainingMembersCount: number;
    @Input() communityId: number;

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
    imgInitShow: boolean = true;
    imgInit1;

    constructor(private dialog: MatDialog, private analyticsService: AnalyticsService, private router: Router) {}

    ngOnInit() {}

    onImgError(event, name): void {
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

    viewMemberProfile() {
        if (this.member.custom_click_text) {
            this.dialog.open(ProfileNotExistPopupComponent, {
                data: {
                    message: this.member.custom_intro_text,
                },
            });
        } else {
            this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_VIEW, {
                community_id: this.communityId,
                viewed_member_id: this.member.id,
                viewed_member_state: this.member.state,
                source: this.member?.community_id ? SOURCE.CHATROOM : SOURCE.COMMUNITY_DETAIL,
            });
            this.router.navigate([`/${COMMUNITY_FEED_PATH}/${this.communityId}/${PROFILE}/${this.member.id}`]);
        }
    }

    viewMemberDirectory() {
        this.router.navigate([`/${COMMUNITY_FEED_PATH}/${this.communityId}/${MEMBER_DIRECTORY_PATH}`]);
    }

    // downloadApp() {
    //     const data = {
    //         heading: 'Download app',
    //         subHeading1: 'Please download the app to see member directory and member details and connect with the community.',
    //     };
    //     const dialog = this.dialog.open(DownloadAppComponent, {
    //         panelClass: 'download-app-modal',
    //         data,
    //     });
    //     dialog.afterClosed().subscribe((response) => {
    //         // close dialog action to be handled here
    //     });
    // }
}

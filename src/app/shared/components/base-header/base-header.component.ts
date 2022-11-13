import { Component, Input, Inject, PLATFORM_ID, OnInit } from '@angular/core';

import { BaseHeaderData } from '../../models/header.model';
import { environment } from 'src/environments/environment';
import { MIXPANEL, DOWNLOAD_BUTTON_SOURCE, DOWNLOAD_BUTTON_TYPE } from '../../enums/mixpanel.enum';
import { PLAYSTORE, APPSTORE, LEAVE_WITHOUT_JOINING, LEAVE_WITHOUT_JOIN_TEXT, OPEN_DOWNLOAD_POPUP } from '../../constants/app-constant';
import { Store, select } from '@ngrx/store';
import { State } from '../../store/reducers';
import { getUserSelector, getAuthSelector } from '../../store/selectors/auth.selector';
import { IUser } from '../../models/user.model';
import { Location, isPlatformBrowser } from '@angular/common';
import { combineLatest } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { COMMUNITY_DETAIL_PATH } from '../../constants/routes.constant';
import { MatDialog } from '@angular/material/dialog';
import { LeavePageComponent } from '../../entryComponents/leave-page/leave-page.component';
import { ResizeService } from 'src/app/core/services/resize.service';
import { IUrlParams } from '../../models/auth.model';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
    selector: 'app-base-header',
    templateUrl: './base-header.component.html',
    styleUrls: ['./base-header.component.scss'],
})
export class BaseHeaderComponent implements OnInit {
    @Input() data: BaseHeaderData;
    user: IUser;
    communityId: number | string;
    environment = environment;
    screenType: string;
    urlParams: IUrlParams;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private analyticsService: AnalyticsService,
        private store: Store<State>,
        private location: Location,
        private router: Router,
        private dialog: MatDialog,
        private resizeService: ResizeService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        }
        this.resizeService.onResize$.subscribe((response) => {
            this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        });

        this.activatedRoute.queryParams.subscribe((params) => (this.urlParams = params));

        combineLatest(this.store.pipe(select(getUserSelector)), this.store.pipe(select(getAuthSelector))).subscribe((response) => {
            this.user = response[0];
            if (response[1]) this.communityId = response[1].communityId;
        });
    }

    openLink(key): void {
        if (!key) return;
        this.analyticsService.sendEvent(MIXPANEL.DOWNLOAD_APP, {
            source: DOWNLOAD_BUTTON_SOURCE.TOP_BAR,
            type:
                key === PLAYSTORE
                    ? DOWNLOAD_BUTTON_TYPE.ANDROID
                    : key == APPSTORE
                    ? DOWNLOAD_BUTTON_TYPE.IOS
                    : DOWNLOAD_BUTTON_TYPE.GENERAL,
            distinct_id: this.user?.id,
        });
        if (key === PLAYSTORE) window.open(environment.playstoreLink, '_blank');
        else if (key === APPSTORE) window.open(environment.appstoreLink, '_blank');
    }

    goBack(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        if (this.data.backLink === OPEN_DOWNLOAD_POPUP) {
            if (this.user && window.history.length > 1) {
                this.location.back();
                return;
            } else {
                const data = {
                    heading: 'Download app',
                    subHeading1:
                        'You cannot go back to the previous page but if you want to edit your profile, please download the LikeMinds app and edit your profile',
                };
                // const dialog = this.dialog.open(DownloadAppComponent, {
                //   panelClass: 'download-app-modal',
                //   data
                // });
                return;
            }
        }

        if (this.data.title === 'Basic profile') {
            this.openLoginBackConfirmation();
            return;
        }
        if (this.data.title === 'One last step' || this.data.title === 'Join Community') {
            this.openCommunityQuestionBackConfirmation();
            return;
        }

        if (window.history.length > 1) this.location.back();
        else if (this.communityId) this.router.navigate([`/${COMMUNITY_DETAIL_PATH}/${this.communityId}`], { queryParams: this.urlParams });
        else this.router.navigateByUrl('/');
    }

    openLoginBackConfirmation() {
        const data = {
            heading: 'Leave without account creation?',
            content:
                'Are you sure, you want to move away from this screen? Your login details with your mobile number would be lost and you would have to re-do the same.',
            successBtnText: 'Leave',
            cancelBtnText: 'Stay',
        };
        this.dialog
            .open(LeavePageComponent, {
                data,
                panelClass: 'leave-page-modal',
                disableClose: true,
            })
            .afterClosed()
            .subscribe((res) => {
                if (res && this.communityId) {
                    this.router.navigate([`/${COMMUNITY_DETAIL_PATH}/${this.communityId}`], { queryParams: this.urlParams });
                }
            });
    }

    openCommunityQuestionBackConfirmation() {
        this.analyticsService.sendEvent(MIXPANEL.COMMUNITY_JOIN_BACK_BUTTON, {
            community_id: this.communityId,
            distinct_id: this.user?.id,
        });
        const data = {
            heading: LEAVE_WITHOUT_JOINING,
            content: LEAVE_WITHOUT_JOIN_TEXT,
            successBtnText: 'Leave',
            cancelBtnText: 'Stay',
        };
        this.dialog
            .open(LeavePageComponent, {
                data,
                panelClass: 'leave-page-modal',
            })
            .afterClosed()
            .subscribe((res) => {
                let id = res ? MIXPANEL.LEAVE_WITHOUT_JOINING : MIXPANEL.STAY;
                this.analyticsService.sendEvent(id, {
                    community_id: this.communityId,
                    distinct_id: this.user?.id,
                });
                if (res && this.communityId) {
                    this.router.navigate([`/${COMMUNITY_DETAIL_PATH}/${this.communityId}`], { queryParams: this.urlParams });
                }
            });
    }

    redirectBack(): void {
        this.router.navigate([this.data.backLink]);
    }

    logout() {
        localStorage.clear();
        this.router.navigateByUrl('/');
    }
}

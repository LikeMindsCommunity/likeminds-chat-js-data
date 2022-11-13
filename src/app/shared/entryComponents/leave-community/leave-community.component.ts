import { Component, Output, EventEmitter, Input, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunityService } from 'src/app/core/services/community.service';
import { Router } from '@angular/router';
import { BLOCKER, ROOT_PATH } from 'src/app/shared/constants/routes.constant';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from 'src/app/core/services/utils.service';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { RENEWAL_FLOW } from '../../enums/mixpanel.enum';
import { CookieService } from 'ngx-cookie-service';
import { COMMMUNITY_OPENED } from '../../constants/app-constant';

@Component({
    selector: 'app-leave-community',
    templateUrl: './leave-community.component.html',
    styleUrls: ['./leave-community.component.scss'],
})
export class LeaveCommunityComponent implements OnInit {
    @Output() closeModal: EventEmitter<any> = new EventEmitter();
    @Output() closeSheet: EventEmitter<any> = new EventEmitter();
    // @Input() user: any;
    @Input() isSheet = false;
    @Input() isModal = false;
    toggle1: boolean = false;
    toggle2: boolean = false;
    showInfo1: boolean = false;
    showInfo2: boolean = false;
    screenType: string;
    confirmLeaveCommunityPopup: boolean = false;
    LMuser: any;

    choice = false;
    constructor(
        private communityService: CommunityService,
        private router: Router,
        private subscriptionService: SubscriptionService,
        private snackBar: MatSnackBar,
        private utilsService: UtilsService,
        @Inject(MAT_DIALOG_DATA) public user: any,
        private localStorageService: LocalStorageService,
        private analyticsService: AnalyticsService,
        private cookieService: CookieService
    ) {}

    ngOnInit() {
        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        this.LMuser = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
    }

    openCopiedToClipboard(message, action) {
        this.snackBar.open(message, action, {
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            panelClass: 'success-dialog',
            duration: 2000,
        });
    }

    leaveCommunity(communityId) {
        let subscriptionStatus = '';
        if (this.user?.membershipState == 1) {
            subscriptionStatus = 'expired';
        }

        if (this.user?.membershipState == 2) {
            subscriptionStatus = 'grace';
        }

        if (this.user?.membershipState == 3 || this.user?.membership_state == 0) {
            subscriptionStatus = 'active';
        }

        this.analyticsService.sendEvent(RENEWAL_FLOW.LEAVE_COMMUNITY, {
            community_id: communityId,
            community_name: this.user?.community_name,
            subscription_status: subscriptionStatus,
        });

        this.communityService.leaveCommunity(`community_id=${communityId}`).subscribe((res) => {
            if (res.success) {
                this.localStorageService.setSavedState(true, STORAGE_KEY.HAS_LEFT_COMMUNITY);
                this.cookieService.delete(COMMMUNITY_OPENED);
                this.router.navigate([`${ROOT_PATH}`]);
            }
        });
    }

    cancelSubscription(communityId) {
        this.closeModalBox();
        this.subscriptionService.cancelSubscription({ community_id: communityId }).subscribe((res) => {
            this.communityService.leaveCommunity(`community_id=${communityId}`).subscribe((res) => {
                if (res.success) {
                    this.localStorageService.setSavedState(true, STORAGE_KEY.HAS_LEFT_COMMUNITY);
                    this.cookieService.delete(COMMMUNITY_OPENED);
                    this.router.navigate([`${ROOT_PATH}`]);
                }
            });
        });
    }

    openLeaveCommunityPopup() {
        this.confirmLeaveCommunityPopup = true;
    }

    closeModalBox() {
        this.utilsService.closeMatDialogBox$$.next(true);
    }

    openRenewal(communityId) {
        this.closeModalBox();
        this.router.navigate(['/renewal/' + communityId], { queryParams: { renew: true, user_id: this.LMuser.id } });
    }

    openShareInfo(index) {
        if (index == '1') {
            this.utilsService.closeMatBottomSheet$$.next(1);
        } else if (index == '2') {
            this.utilsService.closeMatBottomSheet$$.next(2);
        }
    }

    closeShareInfoPopup() {
        this.utilsService.closeMatBottomSheet$$.next(0);
    }
}

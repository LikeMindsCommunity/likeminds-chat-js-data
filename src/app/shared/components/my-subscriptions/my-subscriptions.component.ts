import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { COMMUNITY_FEED_PATH, HISTORY_PATH, RENEWAL_PATH } from '../../constants/routes.constant';
import { ReferralComponent } from '../../entryComponents/referral/referral.component';
import { Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { StartLoading, StopLoading } from '../../store/actions/app.action';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ReferralMobileComponent } from '../../entryComponents/referral-mobile/referral-mobile.component';
import { Observable } from 'rxjs';
import { CommunityService } from 'src/app/core/services/community.service';
import { ShareUrlComponent } from '../../entryComponents/share-url/share-url.component';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ShareUrlMobileComponent } from '../../entryComponents/share-url-mobile/share-url-mobile.component';
import { PaymentModalDialogComponent } from '../../entryComponents/payment-modal-dialog/payment-modal-dialog.component';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';
import { RENEWAL_FLOW } from '../../enums/mixpanel.enum';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

@Component({
    selector: 'app-my-subscriptions',
    templateUrl: './my-subscriptions.component.html',
    styleUrls: ['./my-subscriptions.component.scss'],
})
export class MySubscriptionsComponent implements OnInit {
    @Input() mySubscription;
    @Input() user;
    validTillDate: any;
    remainingTime: any;
    screenType: string;
    showAns1 = false;
    showAns2 = false;
    showAns3 = false;

    constructor(
        private router: Router,
        private subscriptionService: SubscriptionService,
        private dialog: MatDialog,
        private bottomSheet: MatBottomSheet,
        private store: Store<State>,
        private communityService: CommunityService,
        private utilsService: UtilsService,
        private localStorageService: LocalStorageService,
        private analyticsService: AnalyticsService
    ) { }

    ngOnInit(): void {
        this.screenType = window.innerWidth <= 470 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        this.subscriptionService.showSubscriptionHeader$$.next(true);
        this.localStorageService.setSavedState(true, STORAGE_KEY.MY_SUBSCRIPTION_IS_OPENED);
    }

    fetchSubscriptionHistory(communityId) {
        // console.log(, 919);
        // const communityId = this.communityService.currentCommunityData$$.value.id;
        this.subscriptionService.showSubscriptionHeader$$.next(true);
        setTimeout(() => this.router.navigate([`${communityId}/${HISTORY_PATH}`], { queryParams: { community_id: communityId } }), 100);
    }

    formatDate(validTill): string {
        let valid_till = new Date(validTill);
        this.validTillDate =
            valid_till.toLocaleDateString('default', { month: 'short' }) + ' ' + valid_till.getDate() + ', ' + valid_till.getFullYear();
        return this.validTillDate;
    }

    formatRemainingTime(validTill): any {
        let valid_till = new Date(validTill);
        let currentTime = new Date();
        return { days: valid_till.getDate() - currentTime.getDate(), hours: Math.abs(valid_till.getHours() - currentTime.getHours()) };
    }

    openRenewal(communityID, name, membershipState, upgrade?: boolean) {
        let membership_state;

        if (membershipState == 3 || membershipState == 0) {
            membershipState = 'active';
        } else if (membershipState == 2) {
            membershipState = 'grace_period';
        } else if (membershipState === 1) {
            membershipState = 'expired';
        }

        this.analyticsService.sendEvent(RENEWAL_FLOW.RENEWAL_BUTTON_CLICKED, {
            community_id: communityID,
            community_name: name,
            source: 'community_feed',
            membership_state: membership_state,
        });

        if (upgrade) {
            if (this.screenType === 'mobile') {
                this.router.navigate([`/${RENEWAL_PATH}/${communityID}`], { queryParams: { upgrade } });
            } else {
                this.router.navigate([`/${COMMUNITY_FEED_PATH}/${communityID}/${RENEWAL_PATH}/${communityID}`], {
                    queryParams: { upgrade },
                });
            }
            return;
        }

        if (this.screenType === 'mobile') {
            this.router.navigate([`/${RENEWAL_PATH}/${communityID}`], { queryParams: { renew: true, user_id: this.user.id } });
        } else {
            this.router.navigate([`/${COMMUNITY_FEED_PATH}/${communityID}/${RENEWAL_PATH}/${communityID}`], {
                queryParams: { renew: 'true', user_id: this.user.id },
            });
        }
    }

    getShareURL(communityId): Observable<any> {
        return this.communityService.getCommunityShareURL(parseInt(communityId));
    }

    openShareUrlPopup(communityId) {
        this.store.dispatch(StartLoading());
        let dialog;
        this.getShareURL(communityId).subscribe((res) => {
            this.store.dispatch(StopLoading());
            if (this.screenType != 'mobile') {
                dialog = this.dialog.open(ShareUrlComponent, {
                    panelClass: 'send-response-modal',
                    data: { data: this.user, task: 'shareUrlPopup', url: res },
                });
                this.utilsService.closeMatDialogBox$$.subscribe((res) => {
                    if (res) {
                        dialog.close();
                        dialog.afterClosed().subscribe((_) => {
                            this.utilsService.closeMatDialogBox$$.next(false);
                        });
                    }
                });
            } else {
                let sheet = this.bottomSheet.open(ShareUrlMobileComponent, {
                    panelClass: 'send-response-modal',
                    data: { data: this.user, task: 'shareUrlPopup', url: res },
                });
                this.utilsService.closeMatBottomSheet$$.subscribe((res) => {
                    if (res) {
                        sheet.dismiss();
                        sheet.afterDismissed().subscribe((_) => {
                            this.utilsService.closeMatBottomSheet$$.next(false);
                        });
                    }
                });
            }
        });
    }

    openReferral(communityId) {
        this.store.dispatch(StartLoading());
        this.subscriptionService.fetchSubscriptionPlans(communityId).subscribe((plans) => {
            this.store.dispatch(StopLoading());
            if (plans.success) {
                if (this.screenType != 'mobile') {
                    let dialog = this.dialog.open(ReferralComponent, {
                        data: {
                            plans: plans?.plans,
                            communityId: communityId,
                        },
                    });

                    this.utilsService.closeMatDialogBox$$.subscribe((res) => {
                        if (res) {
                            dialog.close();
                            dialog.afterClosed().subscribe((_) => {
                                this.utilsService.closeMatDialogBox$$.next(false);
                                this.openShareUrlPopup(communityId);
                            });
                        }
                    });
                } else {
                    const sheet = this.bottomSheet.open(ReferralMobileComponent, {
                        data: {
                            plans: plans?.plans,
                            communityId: communityId,
                        },
                    });

                    this.utilsService.closeMatBottomSheet$$.subscribe((res) => {
                        if (res) {
                            sheet.dismiss();
                            sheet.afterDismissed().subscribe((_) => {
                                this.utilsService.closeMatBottomSheet$$.next(false);
                                this.openShareUrlPopup(communityId);
                            });
                        }
                    });
                }
            }
        });
    }

    openPaymentModal() {
        this.dialog.open(PaymentModalDialogComponent, {
            data: {
                showExpiredCommunityPopup: false,
            },
        });
    }

    toggle(i) {
        if (i == 1) this.showAns1 = !this.showAns1;
        if (i == 2) this.showAns2 = !this.showAns2;
        if (i == 3) this.showAns3 = !this.showAns3;
    }

    ngOnDestroy() {
        this.subscriptionService.showSubscriptionHeader$$.next(false);
        this.localStorageService.setSavedState(false, STORAGE_KEY.MY_SUBSCRIPTION_IS_OPENED);
    }
}

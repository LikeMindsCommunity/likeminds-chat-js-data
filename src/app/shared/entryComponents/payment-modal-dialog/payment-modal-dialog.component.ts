import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommunityService } from 'src/app/core/services/community.service';
import { ResizeService } from 'src/app/core/services/resize.service';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { BLOCKER } from '../../constants/routes.constant';
import { JOIN_FLOW } from '../../enums/mixpanel.enum';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-payment-modal-dialog',
    templateUrl: './payment-modal-dialog.component.html',
    styleUrls: ['./payment-modal-dialog.component.scss'],
})
export class PaymentModalDialogComponent implements OnInit {
    paymentID = '';
    displayError;
    errorMessage: string = '';
    communityID: string;
    private destroy$$ = new Subject();
    screenType: string;
    showExpiredCommunityPopup: boolean;
    leaveCommunityFlag = false;
    community: any;

    joiningCode: string = '';

    constructor(
        private subscriptionService: SubscriptionService,
        private resizeService: ResizeService,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private authService: AuthService,
        public dialogRef: MatDialogRef<any>,
        private analyticsService: AnalyticsService,
        private communityService: CommunityService,
        private store: Store<State>,
        private snackbar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.screenType = window.innerWidth <= 465 ? 'mobile' : window.innerWidth <= 768 ? 'tab' : 'desktop';
        this.showExpiredCommunityPopup = this.data.showExpiredCommunityPopup;
        this.community = this.data.community;
    }

    openLeaveCommunityPopup() {
        this.showExpiredCommunityPopup = false;
        this.leaveCommunityFlag = true;
    }

    leaveCommunity() {
        this.subscriptionService.leaveCommunity(`community_id=${this.community.id}`).subscribe((res) => {
            console.log(6);
            this.router.navigate([`${BLOCKER}`]);
        });
    }

    openRenewMembership() {
        this.authService.openRenewMembership$$.next(true);
    }

    submitPaymentID() {
        this.paymentID = this.paymentID.trim();
        this.subscriptionService.fetchCommunityMeta({ payment_id: this.paymentID }).subscribe(
            (res) => {
                if (!res.success) {
                    this.errorMessage = res.error_message;

                    this.analyticsService.sendEvent(JOIN_FLOW.MANUAL_OTL_VERIFICATION_TRIED, {
                        payment_id: this.paymentID,
                        status: 'failure',
                    });
                } else {
                    this.analyticsService.sendEvent(JOIN_FLOW.MANUAL_OTL_VERIFICATION_TRIED, {
                        payment_id: this.paymentID,
                        status: 'success',
                    });
                    console.log(7);
                    this.router.navigate([`${BLOCKER}`]);
                    this.dialogRef.close();
                    this.communityID = res.community_id;
                    this.router.navigate([`/community/${this.communityID}`], { queryParams: { payment_id: this.paymentID } });
                }
            },
            (err) => {
                this.errorMessage = 'Something went wrong!';
            }
        );
    }

    showSnackbar() {
        if (this.screenType === 'mobile') {
            this.snackbar.open(this.errorMessage, undefined, {
                duration: 3000,
                panelClass: ['black-bottom-snackbar'],
            });
        }
    }

    closeModal() {
        this.dialogRef.close();
    }

    submitCode() {
        this.joiningCode = this.joiningCode.trim();

        if (this.joiningCode === '') {
            this.errorMessage = 'Invalid invite code or already used!';
            this.showSnackbar();
            return;
        }

        this.store.dispatch(StartLoading());

        this.subscriptionService.fetchCommunityMeta({ payment_id: this.joiningCode }).subscribe(
            (res) => {
                if (!res.success) {
                    this.communityService.postAjToGetCommunityIdAndSharedBy(`?aj=${this.joiningCode}`).subscribe(
                        (res) => {
                            if (res.success) {
                                this.store.dispatch(StopLoading());
                                this.router.navigate([`/community/${res?.community_id}`], {
                                    queryParams: { aj: this.joiningCode, shared_by: res?.shared_by },
                                });
                                this.dialogRef.close();
                            }
                        },
                        (err) => {
                            this.subscriptionService.fetchCommunity({ community_id: this.joiningCode }).subscribe(
                                (res) => {
                                    if (res) {
                                        this.store.dispatch(StopLoading());
                                        this.router.navigate([`/community/${this.joiningCode}`]);
                                        this.dialogRef.close();
                                    } else {
                                        this.errorMessage = 'Invalid invite code or already used!';
                                        this.showSnackbar();
                                    }
                                },
                                (err) => {
                                    this.store.dispatch(StopLoading());
                                    this.errorMessage = 'Invalid invite code or already used!';
                                    this.showSnackbar();
                                }
                            );
                        }
                    );
                } else {
                    this.store.dispatch(StopLoading());
                    this.dialogRef.close();
                    this.router.navigate([`/community/${res?.community_id}`], { queryParams: { payment_id: this.joiningCode } });
                }
            },
            (err) => {
                this.errorMessage = 'Something went wrong!';
                this.showSnackbar();
            }
        );
    }
}

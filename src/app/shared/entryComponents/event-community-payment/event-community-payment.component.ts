import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';
import { UtilsService } from 'src/app/core/services/utils.service';
import { SubscriptionService } from 'src/app/core/services/subscription.service';

@Component({
    selector: 'app-event-community-payment',
    templateUrl: './event-community-payment.component.html',
    styleUrls: ['./event-community-payment.component.scss'],
})
export class EventCommunityPaymentComponent implements OnInit {
    event_cost;
    eventStrikeCost;
    communityPlanObj;
    showPlansDropDown: boolean = false;
    selectedCommunityPlan;
    user;
    eventId;
    totalCost;
    eventIsChecked: boolean = true;
    communityIsChecked: boolean = true;
    chatroomId: string;
    isCheckable;
    memberState;
    membershipState;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private router: Router,
        private localStorageService: LocalStorageService,
        public utilsService: UtilsService,
        private subscriptionService: SubscriptionService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.subscriptionService.broadcastSubscriptionPlans$$.subscribe((res) => {
            if (res) {
                this.communityPlanObj = res;
                this.selectedCommunityPlan = this.communityPlanObj?.plans[0];
                this.cdr.detectChanges();
                this.handleTotalCost();
            }
        });
        if (this.data) {
            this.event_cost = this.data?.eventCost?.event_cost;
            this.eventStrikeCost = this.data?.eventCost?.strike_cost;
            this.communityPlanObj = this?.data?.communityPlanObj;
            this.selectedCommunityPlan = this.communityPlanObj?.plans[0];
            this.user = this.localStorageService.getSavedState(STORAGE_KEY.LIKEMINDS_USER);
            this.eventId = this.data?.eventCost?.event_plan_id;
            this.chatroomId = this.data?.chatroomId;
            this.isCheckable = this.data?.isCheckable;
            this.memberState = this.data?.memberState?.state;
            this.membershipState = this.data?.membershipState;
            this.handleTotalCost();
        }
    }

    handleCheckBox(): boolean {
        return this.isCheckable;
    }

    dismissModal() {
        this.utilsService.closeMatDialogBox$$.next(true);
    }

    changeSelectedPlan(i) {
        this.selectedCommunityPlan = this.communityPlanObj?.plans[i];
        this.showPlansDropDown = false;
        this.handleTotalCost();
    }

    handleEventCheckbox(event) {
        this.eventIsChecked = event?.target?.checked;
        this.handleTotalCost();
    }

    handleCommunityCheckbox(event) {
        this.communityIsChecked = event?.target?.checked;
        this.handleTotalCost();
    }

    handleTotalCost() {
        if (this.communityIsChecked && this.eventIsChecked) {
            this.totalCost = this.selectedCommunityPlan?.cost + this.event_cost;
            if (this.event_cost == 'FREE') {
                this.totalCost = this.selectedCommunityPlan?.cost;
            }
        } else if (!this.communityIsChecked && this.eventIsChecked) {
            this.totalCost = this.eventStrikeCost;
        } else if (this.communityIsChecked && !this.eventIsChecked) {
            this.totalCost = this.selectedCommunityPlan?.cost;
            if (this.event_cost == 'FREE') {
                this.totalCost = this.selectedCommunityPlan?.cost;
            }
        }
    }

    redirectToPaymentPage() {
        if (!this.eventIsChecked && !this.communityIsChecked) {
            return;
        } else if (this.event_cost == 'FREE') {
            if (this.data?.membershipState === 1) {
                window.location.href =
                    window.location.origin +
                    '/community_pay?' +
                    `&plan_id=${this.selectedCommunityPlan?.plan_id}` +
                    `&user_id=${this.user?.id}` +
                    '&renew=true' +
                    '&free_event=true' +
                    `&chatroom_id=${this.chatroomId}`;
            } else if (this.data?.membershipState !== 1) {
                window.location.href =
                    window.location.origin +
                    '/community_pay?' +
                    `&plan_id=${this.selectedCommunityPlan?.plan_id}` +
                    `&user_id=${this.user?.id}` +
                    '&free_event=true' +
                    `&chatroom_id=${this.chatroomId}`;
            }
            return;
        } else if (this.data?.isCheckable) {
            // IF BOTH COMMUNITY AND EVENT ARE CHECKED
            if (this.eventIsChecked && this.communityIsChecked) {
                if (this.data?.memberState?.state === 0) {
                    window.location.href =
                        window.location.origin +
                        '/community_pay?' +
                        `event_plan_id=${this.eventId}` +
                        `&plan_id=${this.selectedCommunityPlan?.plan_id}` +
                        `&user_id=${this.user?.id}`;
                } else if (this.data?.membershipState === 1) {
                    window.location.href =
                        window.location.origin +
                        '/community_pay?' +
                        `event_plan_id=${this.eventId}` +
                        `&plan_id=${this.selectedCommunityPlan?.plan_id}` +
                        '&renew=true' +
                        `&user_id=${this.user?.id}`;
                }
            }

            // IF ONLY COMMUNITY IS CHECKED
            else if (!this.eventIsChecked && this.communityIsChecked) {
                if (this.data?.memberState?.state === 0) {
                    window.location.href =
                        window.location.origin +
                        '/community_pay?' +
                        `&plan_id=${this.selectedCommunityPlan?.plan_id}` +
                        `&user_id=${this.user?.id}`;
                } else if (this.data?.membershipState === 1) {
                    window.location.href =
                        window.location.origin +
                        '/community_pay?' +
                        `&plan_id=${this.selectedCommunityPlan?.plan_id}` +
                        '&renew=true' +
                        `&user_id=${this.user?.id}`;
                }
            }

            // IF ONLY EVENT IS CHECKED
            else if (this.eventIsChecked && !this.communityIsChecked) {
                if (this.data?.memberState?.state === 0) {
                    window.location.href =
                        window.location.origin + '/community_pay?' + `event_plan_id=${this.eventId}` + `&user_id=${this.user?.id}`;
                } else if (this.data?.membershipState === 1) {
                    window.location.href =
                        window.location.origin + '/community_pay?' + `event_plan_id=${this.eventId}` + `&user_id=${this.user?.id}`;
                }
            }
        } else if (!this.data?.isCheckable) {
            if (this.data?.memberState?.state === 0) {
                window.location.href =
                    window.location.origin +
                    '/community_pay?' +
                    `event_plan_id=${this.eventId}` +
                    `&plan_id=${this.selectedCommunityPlan?.plan_id}` +
                    `&user_id=${this.user?.id}`;
            } else if (this.data?.membershipState === 1) {
                window.location.href =
                    window.location.origin +
                    '/community_pay?' +
                    `event_plan_id=${this.eventId}` +
                    `&plan_id=${this.selectedCommunityPlan?.plan_id}` +
                    '&renew=true' +
                    `&user_id=${this.user?.id}`;
            }
        }
    }

    mouseEnter() {
        document.getElementById('allPlans').style.overflow = 'inherit';
    }

    mouseLeave() {
        document.getElementById('allPlans').style.overflow = 'auto';
    }
}

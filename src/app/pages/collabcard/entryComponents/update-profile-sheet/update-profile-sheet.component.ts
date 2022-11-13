import { Component, OnInit, Input, Inject } from "@angular/core";
import { IUser } from 'src/app/shared/models/user.model';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { COMMUNITY_FEED_PATH, PROFILE } from "src/app/shared/constants/routes.constant";
import { Router } from "@angular/router";
import { AnalyticsService } from "src/app/core/services/analytics.service";
import { MIXPANEL, SOURCE } from "src/app/shared/enums/mixpanel.enum";
import { MEMBER_STATE } from "src/app/shared/enums/member-state.enum";

@Component({
    selector: 'update-profile-sheet',
    templateUrl: './update-profile-sheet.component.html',
    styleUrls: ['./update-profile-sheet.component.scss']
})

export class UpdateProfileSheetComponent implements OnInit {

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: { user: IUser, community_id: number },
        private bottomSheetRef: MatBottomSheetRef<any>,
        private router: Router,
        private analyticsService: AnalyticsService
    ) { }

    ngOnInit() { }

    close(value) {
        this.bottomSheetRef.dismiss(value);
    }

    updateProfile(value) {
        this.analyticsService.sendEvent(
            MIXPANEL.MEMBER_PROFILE_VIEW, {
              community_id: this.data.community_id,
              member_state: MEMBER_STATE.SKIPPED,
              source: SOURCE.MEMBER_PENDING
            });
        this.router.navigate([`${COMMUNITY_FEED_PATH}/${this.data.community_id}/${PROFILE}/${this.data.user.id}/edit`]);
        this.bottomSheetRef.dismiss();
    }
}
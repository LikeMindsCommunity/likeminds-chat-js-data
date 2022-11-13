import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { COMMUNITY_DETAIL_PATH, COMMUNITY_FEED_PATH, PROFILE } from '../../constants/routes.constant';
import { MEMBER_STATE } from '../../enums/member-state.enum';
import { MIXPANEL, SOURCE } from '../../enums/mixpanel.enum';
import { IUser } from '../../models/user.model';

@Component({
  selector: 'app-update-profile-sheet',
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

  ngOnInit(): void {
  }

  close(value) {
    this.router.navigate([`${COMMUNITY_DETAIL_PATH}/${this.data.community_id}`]);
    this.bottomSheetRef.dismiss();
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

import { Component, OnInit, Inject } from '@angular/core';
import { IUser } from 'src/app/shared/models/user.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { COMMUNITY_DETAIL_PATH, COMMUNITY_FEED_PATH, PROFILE } from '../../constants/routes.constant';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { MIXPANEL, SOURCE } from '../../enums/mixpanel.enum';
import { MEMBER_STATE } from '../../enums/member-state.enum';

@Component({
  selector: 'app-update-profile-popup',
  templateUrl: './update-profile-popup.component.html',
  styleUrls: ['./update-profile-popup.component.scss']
})
export class UpdateProfilePopupComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: IUser, community_id: number },
    private dialogRef: MatDialogRef<any>,
    private router: Router,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
  }

  close(value) {
    this.router.navigate([`${COMMUNITY_DETAIL_PATH}/${this.data.community_id}`]);
    this.dialogRef.close();
  }

  updateProfile(value) {
    this.analyticsService.sendEvent(
      MIXPANEL.MEMBER_PROFILE_EDIT, {
        community_id: this.data.community_id,
        member_state: MEMBER_STATE.SKIPPED,
        source: SOURCE.MEMBER_PENDING
      });
    this.router.navigate([`${COMMUNITY_FEED_PATH}/${this.data.community_id}/${PROFILE}/${this.data.user.id}/edit`]);
    this.dialogRef.close();
  }

}

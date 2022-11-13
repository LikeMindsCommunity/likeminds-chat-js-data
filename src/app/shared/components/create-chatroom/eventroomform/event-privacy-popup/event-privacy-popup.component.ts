import { Component, OnInit, Inject } from '@angular/core';
import { IUser } from 'src/app/shared/models/user.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { COMMUNITY_DETAIL_PATH, COMMUNITY_FEED_PATH, PROFILE } from '../../../../constants/routes.constant';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { MIXPANEL, SOURCE } from '../../../../enums/mixpanel.enum';
import { MEMBER_STATE } from '../../../../enums/member-state.enum';


@Component({
  selector: 'app-event-privacy-popup',
  templateUrl: './event-privacy-popup.component.html',
  styleUrls: ['./event-privacy-popup.component.scss']
})
export class EventPrivacyPopupComponent implements OnInit {

  constructor( 
    private dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
  }

  close() { 
    this.dialogRef.close();
  }

}

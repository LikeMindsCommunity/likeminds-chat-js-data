import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProfileService } from 'src/app/core/services/profile.service';
import { IReportTag } from 'src/app/shared/models/app.model';
import { MatDialog } from '@angular/material/dialog';
import { MemberReportedPopupComponent } from '../../../entryComponents/member-reported-popup/member-reported-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StopLoading } from 'src/app/shared/store/actions/app.action';
import { Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent implements OnInit {

  clickedTag: IReportTag;
  othersValue: string = '';
  submitActive: boolean = false;
  allowReport: boolean = true;
  reportTagsList: IReportTag[] = [];
  @Input() community_id: number;
  @Input() member_id: number;
  @Input() viewed_member_state: number;
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor(
    private profileService: ProfileService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private store: Store<State>,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    this.clickedTag = {id: null, name: null};
    this.getTags();
  }
  
  getTags() {
    this.profileService.getReportTags().subscribe(response => {
      this.reportTagsList = response.report_tags;
      this.store.dispatch(StopLoading());
    })
  }

  onTextChange(updatedValue: string): void {
    this.othersValue = updatedValue;
    if (this.clickedTag.name === 'Others' && this.othersValue != '') this.submitActive = true;
    else this.submitActive = false;
  }

  clickButton(tag: IReportTag) {
    if (this.clickedTag.id === tag.id) this.clickedTag = {id: null, name: null};
    else this.clickedTag = tag;

    if (this.reportTagsList.filter(tag => tag.name != 'Others').includes(this.clickedTag)) this.submitActive = true;
    else this.submitActive = false;
  }

  report() {
    if (!this.clickedTag?.id) return;
    if (this.clickedTag?.name === 'Others') {
      let data = {
        "tag_id": this.clickedTag?.id,
        "reported_member_id": this.member_id,
        "community_id": this.community_id,
        "reason": this.othersValue
      }
      this.pushReport(data);
      return;
    }
    else {
      let data = {
        "tag_id": this.clickedTag?.id,
        "reported_member_id": this.member_id,
        "community_id": this.community_id,
        "reason": this.clickedTag?.name
      }
      this.pushReport(data);
      return;
    }
  }

  pushReport(data: any) {
      if (!this.allowReport) return;
      this.allowReport = false;
      this.profileService.pushReport(data).subscribe(response => {
        if (response.success) {
          this.analyticsService.sendEvent(
            MIXPANEL.MEMBER_PROFILE_REPORT_CONFIRMED, {
              community_id: this.community_id,
              viewed_member_id: this.member_id,
              viewed_member_state: this.viewed_member_state,
              issues: this.clickedTag?.name
            });
          this.close.emit();
          this.dialog.open(MemberReportedPopupComponent)
          .afterClosed().subscribe(_ => {this.allowReport = true});
        } else {
          this.snackbar.open(response.error_message, undefined, {
            panelClass: ['snackbar'],
            duration: 3000
          });
          this.close.emit();
        }
      })
  }  

}

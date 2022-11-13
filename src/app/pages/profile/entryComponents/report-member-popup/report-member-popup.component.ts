import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { IReportTag } from 'src/app/shared/models/app.model';
import { StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { State } from 'src/app/shared/store/reducers';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { MemberReportedPopupComponent } from '../member-reported-popup/member-reported-popup.component';

@Component({
    selector: 'app-report-member-popup',
    templateUrl: './report-member-popup.component.html',
    styleUrls: ['./report-member-popup.component.scss'],
})
export class ReportMemberPopupComponent implements OnInit {
    clickedTag: IReportTag;
    othersValue: string = '';
    allowReport: boolean = true;
    submitActive: boolean = false;
    reportTagsList: IReportTag[] = [];

    constructor(
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<ProfileComponent>,
        private dialogRefthis: MatDialogRef<ReportMemberPopupComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            member_id: number;
            community_id: number;
            viewed_member_state: number;
            collabcard_id: number;
        },
        private profileService: ProfileService,
        private snackbar: MatSnackBar,
        private store: Store<State>,
        private analyticsService: AnalyticsService
    ) {}

    ngOnInit(): void {
        this.clickedTag = { id: null, name: null };
        this.getTags();
    }

    getTags() {
        console.log('report member popup');
        this.profileService.getReportTags().subscribe((response) => {
            this.reportTagsList = response.report_tags;
            this.store.dispatch(StopLoading());
        });
    }

    onTextChange(updatedValue: string): void {
        this.othersValue = updatedValue;
        if (this.clickedTag.name === 'Others' && this.othersValue != '') this.submitActive = true;
        else this.submitActive = false;
    }

    clickButton(tag: IReportTag) {
        if (this.clickedTag.id === tag.id) this.clickedTag = { id: null, name: null };
        else this.clickedTag = tag;

        if (this.reportTagsList.filter((tag) => tag.name != 'Others').includes(this.clickedTag)) this.submitActive = true;
        else this.submitActive = false;
    }

    close() {
        this.dialogRef.close();
    }

    report() {
        if (!this.clickedTag?.id) return;
        if (this.clickedTag?.name === 'Others') {
            let data = {
                tag_id: this.clickedTag?.id,
                reported_member_id: this.data.member_id,
                community_id: this.data.community_id,
                reason: this.othersValue,
                collabcard_id: this.data.collabcard_id,
            };
            this.pushReport(data);
            return;
        } else {
            let data = {
                tag_id: this.clickedTag?.id,
                reported_member_id: this.data.member_id,
                community_id: this.data.community_id,
                reason: this.clickedTag?.name,
                collabcard_id: this.data.collabcard_id,
            };
            this.pushReport(data);
            return;
        }
    }

    pushReport(data: any) {
        if (!this.allowReport) return;
        this.allowReport = false;
        this.profileService.pushReport(data).subscribe((response) => {
            if (response.success) {
                this.analyticsService.sendEvent(MIXPANEL.MEMBER_PROFILE_REPORT_CONFIRMED, {
                    community_id: this.data.community_id,
                    viewed_member_id: this.data.member_id,
                    viewed_member_state: this.data.viewed_member_state,
                    issues: this.clickedTag?.name,
                });
                this.dialogRefthis.close('reported');
                this.dialog
                    .open(MemberReportedPopupComponent, { disableClose: true })
                    .afterClosed()
                    .subscribe((_) => {
                        this.allowReport = true;
                    });
            } else {
                this.snackbar.open(response.error_message, undefined, {
                    panelClass: ['snackbar'],
                    duration: 3000,
                });
                this.dialogRef.close();
            }
        });
    }
}

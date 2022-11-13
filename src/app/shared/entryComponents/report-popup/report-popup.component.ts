import { Component, Inject, OnInit } from '@angular/core';
import { IReportTag } from '../../models/app.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../../../core/services/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { State } from '../../store/reducers';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { StopLoading } from '../../store/actions/app.action';
import { MIXPANEL } from '../../enums/mixpanel.enum';

@Component({
    selector: 'app-report-popup',
    templateUrl: './report-popup.component.html',
    styleUrls: ['./report-popup.component.scss'],
})
export class ReportPopupComponent implements OnInit {
    clickedTag: IReportTag;
    othersValue = '';
    submitActive = false;
    reportTagsList: IReportTag[] = [];

    constructor(
        private dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: string;
            desc: string;
            label: string;
        },
        private profileService: ProfileService,
        private store: Store<State>,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private analyticsService: AnalyticsService
    ) {}

    ngOnInit(): void {
        console.log(this.data);
        this.clickedTag = { id: null, name: null };
        this.getTags();
    }

    getTags() {
        this.profileService.getReportTags().subscribe((response) => {
            this.reportTagsList = response.report_tags;
            this.store.dispatch(StopLoading());
        });
    }

    onTextChange(updatedValue: string): void {
        this.othersValue = updatedValue;
        if (this.clickedTag.name === 'Others' && this.othersValue != '') {
            this.submitActive = true;
        } else {
            this.submitActive = false;
        }
    }

    clickButton(tag: IReportTag) {
        if (this.clickedTag.id === tag.id) {
            this.clickedTag = { id: null, name: null };
        } else {
            this.clickedTag = tag;
        }

        if (this.reportTagsList.filter((tag) => tag.name != 'Others').includes(this.clickedTag)) {
            this.submitActive = true;
        } else {
            this.submitActive = false;
        }
    }

    close() {
        this.dialogRef.close();
    }

    report() {
        if (!this.clickedTag?.id) {
            return;
        }
        if (this.clickedTag?.name === 'Others') {
            const data = {
                tag_id: this.clickedTag?.id,
                reason: this.othersValue,
            };

            this.dialogRef.close(data);
        } else {
            const data = {
                tag_id: this.clickedTag?.id,
                reason: this.clickedTag?.name,
            };
            this.dialogRef.close(data);
        }
    }
}

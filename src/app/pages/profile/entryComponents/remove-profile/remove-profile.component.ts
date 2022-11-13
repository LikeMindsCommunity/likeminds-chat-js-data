import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ModerationService } from 'src/app/core/services/moderation.service';
import { COMMUNITY_FEED_PATH, MEMBER_DIRECTORY_PATH } from 'src/app/shared/constants/routes.constant';
import { IUser } from 'src/app/shared/models/user.model';

@Component({
    selector: 'app-remove-profile',
    templateUrl: './remove-profile.component.html',
    styleUrls: ['./remove-profile.component.scss'],
})
export class RemoveProfileComponent implements OnInit {
    @Input() user: IUser;

    other: any = '';
    reasonRemoval: any;
    otherReason: boolean = false;

    reasons: any;
    selectedOption: any;

    constructor(
        private router: Router,
        private snackbar: MatSnackBar,
        private moderationService: ModerationService,
        private dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            user: any;
            community_id: any;
        }
    ) {}

    ngOnInit(): void {
        this.reportTags();
    }

    reportTags() {
        this.moderationService.getReportTags().subscribe((res) => {
            this.reasons = res.report_tags;
        });
    }

    onOptionsSelected(value: string) {
        if (value === 'Others') {
            this.otherReason = true;
            this.other = '';
        } else {
            this.otherReason = false;
            this.other = value;
        }
    }

    close() {
        this.dialogRef.close();
    }

    confirm() {
        if (this.other.trim() && this.other !== 'Select reason for removal*') {
            const params = `community_id= ${this.data.community_id}&member_ids= [${this.data.user.id}]&reason= ${this.other},`;
            this.moderationService.removeCommunityMember(params).subscribe((res) => {
                this.snackbar.open(`${this.data.user.name} removed from the community`, undefined, {
                    panelClass: ['snackbar'],
                    duration: 3000,
                    horizontalPosition: 'left',
                });

                const redirectURL = `/${COMMUNITY_FEED_PATH}/${this.data.community_id}/${MEMBER_DIRECTORY_PATH}`;
                this.router.navigateByUrl(redirectURL);
                this.dialogRef.close('confirm');
            });
        } else {
            this.snackbar.open(`Please select a reason for removal`, undefined, {
                panelClass: ['snackbar'],
                duration: 3000,
            });
        }
    }
}

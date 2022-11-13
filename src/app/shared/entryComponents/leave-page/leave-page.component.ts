import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'leave-page-modal',
    templateUrl: './leave-page.component.html',
    styleUrls: ['./leave-page.component.scss']
})

export class LeavePageComponent {
    heading: string;
    content: string;
    successBtnText: string;
    cancelBtnText: string;

    constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    leave() {
        this.dialogRef.close(true);
    }

    stay() {
        this.dialogRef.close(false);
    }
}
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-allow-notification-dialog',
    templateUrl: './allow-notification-dialog.component.html',
    styleUrls: ['./allow-notification-dialog.component.scss'],
})
export class AllowNotificationDialogComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {}

    sure(data) {
        this.dialogRef.close(data);
    }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-secret-chatroom-dialog',
    templateUrl: './secret-chatroom-dialog.component.html',
    styleUrls: ['./secret-chatroom-dialog.component.scss'],
})
export class SecretChatroomDialogComponent implements OnInit {
    crType: any;
    constructor(
        private dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: any;
        }
    ) {}

    ngOnInit(): void {
        this.crType = this.data.title;
    }

    close() {
        this.dialogRef.close();
    }
    /*########### Template Driven Form ###########*/
    templateForm(value: any) {
        this.dialogRef.close({ action: value.crType });
    }
}

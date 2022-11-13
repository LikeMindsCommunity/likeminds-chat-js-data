import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-remove-participants-dialog',
    templateUrl: './remove-participants-dialog.component.html',
    styleUrls: ['./remove-participants-dialog.component.scss'],
})
export class RemoveParticipantsDialogComponent implements OnInit {
    constructor(
        private dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            name: any;
        }
    ) {}

    ngOnInit(): void {
        console.log(this.data);
    }

    close() {
        this.dialogRef.close();
    }

    confirm() {
        this.dialogRef.close({ action: 'confirm' });
    }
}

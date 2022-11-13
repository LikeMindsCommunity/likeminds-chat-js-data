import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-profile-not-exist-popup',
    templateUrl: './profile-not-exist-popup.component.html',
    styleUrls: ['./profile-not-exist-popup.component.scss'],
})
export class ProfileNotExistPopupComponent implements OnInit {
    constructor(
        private dialog: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            message: string;
            user_obj: any;
        }
    ) {}

    ngOnInit(): void {}

    close() {
        this.dialog.close();
    }
}

import { Component, Inject } from "@angular/core";
import { IUserMobile } from 'src/app/shared/models/user.model';
import { maskNumber } from 'src/app/shared/utils';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginComponent } from '../../page/login.component';

export enum ACTION_TYPE {
    MERGE = 'MERGE',
    RESET = 'RESET'
};

@Component({
    selector: 'merge-account-confirmation',
    templateUrl: './merge-account-confirmation.component.html',
    styleUrls: ['./merge-account-confirmation.component.scss']
})

export class MergeAccountConfirmationComponent {
    constructor(
        public dialogRef: MatDialogRef<LoginComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IUserMobile[],
    ) { }

    mergeAccount() {
        this.dialogRef.close(ACTION_TYPE.MERGE);
    }

    useAnotherEmail() {
        this.dialogRef.close(ACTION_TYPE.RESET);
    }

    get content(): string {
        const maskedMobiles = this.data && this.data.reduce((items, { mobile_no, country_code }, index) => {
            return `${items}${index !== 0 ? ',' : ''} +${country_code}${maskNumber(mobile_no)}`;
        }, '');
        let text = `The email you entered is already linked to an account created with mobile number ${maskedMobiles}. In case this is your number, you can login with the same or merge it with this new account. Otherwise, you can provide other email ID.`;

        return text;
    }
}
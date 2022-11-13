import { Component, ViewChild, OnInit, Inject } from "@angular/core";
import { IUserMobile, IUser } from 'src/app/shared/models/user.model';
import { maskNumber, maskEmail } from 'src/app/shared/utils';
import { timer, Subscription } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { VerifyOtpAction, GenerateOtpForMergeAccountAction, SetUserAction } from 'src/app/shared/store/actions/auth.action';
import { Payload } from 'src/app/shared/models/app.model';
import { IOtpInfo, GenerateOtpForMergeAccountModel, VerifyOtpForMergeAccountModel } from 'src/app/shared/models/auth.model';
import { StoreService } from 'src/app/core/services/store.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginComponent } from '../../page/login.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MESSAGE } from 'src/app/shared/constants/app-constant';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { Store } from '@ngrx/store';
import { State } from 'src/app/shared/store/reducers';
import { AuthService } from 'src/app/core/services/auth.service';
import {AnalyticsService} from '../../../../../core/services/analytics.service';

export interface Data {
    user: IUser,
    otpInfo: IOtpInfo
}

@Component({
    selector: 'verify-merge-account',
    templateUrl: './verify-merge-account.component.html',
    styleUrls: ['./verify-merge-account.component.scss']
})

export class VerifyMergeAccountComponent implements OnInit {

    isLoading = false;
    isMergingAccount = true;
    otp: any;
    subscriptions: Subscription[] = [];
    counter: number;
    mobiles: IUserMobile[];
    invalidOtp = false;
    message: string;
    showOtpComponent = true;
    resendOtpCount = 0;

    @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;

    config = {
        allowNumbersOnly: true,
        length: 4,
        isPasswordInput: false,
        disableAutoFocus: false,
        placeholder: '',
        inputStyles: {
            'width': '46px',
            'height': '46px',
            'margin-right': '8px',
            'margin-left': '8px',
            'font-size': '20px'
        }
    };
    constructor(
        public dialogRef: MatDialogRef<LoginComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Data,
        private snackBar: MatSnackBar,
        private storeService: StoreService,
        private store: Store<State>,
        private analyticsService: AnalyticsService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.startCounter();
    }

    get content(): string {
        const { user } = this.data;
        if (!this.data) return;
        const maskedMobiles: string = user && user.mobiles && user.mobiles.reduce((items, { mobile_no, country_code }, index) => {
            return `${items}${index !== 0 ? ',' : ''} +${country_code}${maskNumber(mobile_no)}`;
        }, '');
        const emails: string = user && user.emails && user.emails.reduce((items, { email }, index) => {
            return `${items}${index !== 0 ? ',' : ''} ${maskEmail(email)}`;
        }, '');
        let text = `A 4-digit verification OTP (one time password) has been sent to ${user.mobiles && user.mobiles.length ? `mobile number <b>${maskedMobiles}</b> and` : ''} email id <b>${emails}</b>.`;

        return text;
    }

    /**
     * @function verifyOtp
     * @description This function is used to verify mobile_no and otp
     */
    verifyOtp(): void {
        if (this.isLoading) return;
        if (!this.otp || (this.otp && this.otp.length !== 4)) return;
        this.isLoading = true;
        const { otpInfo } = this.data;
        this.subscriptions.push(
            this.storeService.waitForEffectSuccess(VerifyOtpAction(new Payload(new VerifyOtpForMergeAccountModel(this.otp, this.data.user.id))))
                .subscribe((response: any) => {
                    const { success, user, error_message } = response;
                    this.isLoading = false;
                    if (!success) {
                        this.setMessage(success, error_message);
                        return;
                    } else {
                        this.store.dispatch(SetUserAction({ payload: user }));
                        this.mergeAccount();
                    }
                }, error => {
                    // Handle error here
                    this.isLoading = false;
                })
        );
    }

    /**
     * @function resendOtp
     * @description This function is used to resend otp in case if it is not received in last step
     */
    resendOtp(): void {
        this.startCounter();
        const { user, otpInfo } = this.data;
        this.subscriptions.push(
            this.storeService.waitForEffectSuccess(GenerateOtpForMergeAccountAction(new Payload(new GenerateOtpForMergeAccountModel(
                user.id
            )))).subscribe(({ success }) => {
                if (success) {
                    this.resendOtpCount += 1;
                    this.analyticsService.sendEvent(
                        MIXPANEL.RESEND_VERIFICATION_CODE, {
                        type: 'merge_account',
                        count: this.resendOtpCount
                    });
                    this.setMessage(success, MESSAGE.OTP_RESENT);
                }
            })
        );
    }

    mergeAccount(): void {
        this.isMergingAccount = true;
        const { user, otpInfo } = this.data;
        this.analyticsService.sendEvent(MIXPANEL.ACCOUNT_MERGED_STARTED);
        this.authService.mergeAccount(`user_id=${user.id}&country_code=${otpInfo.country_code}&mobile_no=${otpInfo.mobile_no}`).subscribe(({ success }) => {
            this.analyticsService.sendEvent(MIXPANEL.ACCOUNT_MERGED_COMPLETED);
            this.isMergingAccount = false;
            if (success) this.dialogRef.close(true);
        }, error => {
            // Handle error here
            this.isMergingAccount = false;
        });
    }

    startCounter(): void {
        this.counter = 30;
        timer(1000, 1000) //Initial delay 1 seconds and interval countdown also 1 second
            .pipe(
                takeWhile(() => this.counter > 0),
                tap(() => this.counter--)
            ).subscribe();
    }

    onOtpChange(otp) {
        this.otp = otp;
        if (String(otp).length === 0) this.invalidOtp = false;
    }

    setMessage(success: boolean, message: string) {
        this.invalidOtp = !success;
        this.message = message;
        let config = new MatSnackBarConfig();
        config.panelClass = ['snackbar'];
        config.duration = 3000;
        this.snackBar.open(message, undefined, config);
    }
}

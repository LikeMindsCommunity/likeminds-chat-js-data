import { Component, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { takeWhile, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { timer, Subscription, combineLatest } from 'rxjs';

import { getOtpInfoSelector, getCommunityIdSelector } from 'src/app/shared/store/selectors/auth.selector';
import { VerifyOtpAction, GenerateOtpAction, SetUserAction } from 'src/app/shared/store/actions/auth.action';
import { VerifyOtpModel, GenerateOtpModel, IOtpInfo } from 'src/app/shared/models/auth.model';
import { SetHeaderAction, ClearRedirectUrl, StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { getHeader, getRedirectUrl } from 'src/app/shared/store/selectors/app.selector';
import { HEADER_TYPE } from 'src/app/shared/enums/header-type.enum';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { StoreService } from 'src/app/core/services/store.service';
import { BaseHeaderData } from '../../models/header.model';
import { Payload } from 'src/app/shared/models/app.model';
import { State } from 'src/app/shared/store/reducers';
import { Router } from '@angular/router';
import { MESSAGE } from 'src/app/shared/constants/app-constant';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-verify-otp-component',
    templateUrl: './verify-otp.component.html',
    styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit {
    subscriptions: Subscription[] = [];
    otp: string;
    otpInfo: IOtpInfo;
    showOtpComponent = true;
    counter: number;
    header: BaseHeaderData;
    invalidOtp: boolean;
    communityInfo: any;
    message: string;
    resendOtpCount = 0;
    @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
    @Input() page: string;
    @Input() community: any;

    @Output() successfulLogin = new EventEmitter();

    config = {
        allowNumbersOnly: true,
        length: 4,
        isPasswordInput: false,
        disableAutoFocus: false,
        placeholder: '',
        inputStyles: {
            width: '48px',
            height: '48px',
            'margin-right': '10px',
            'margin-left': '10px',
            'font-size': '20px',
        },
    };

    constructor(
        private store: Store<State>,
        private storeService: StoreService,
        private snackBar: MatSnackBar,
        private analyticsService: AnalyticsService,
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.startCounter();
        this.getPageData();
    }

    /**
     * @function getPageData
     * @description get header data, otpInfo and community ID
     */
    getPageData() {
        this.subscriptions.push(
            combineLatest(
                this.store.pipe(select(getHeader, { type: HEADER_TYPE.VERIFY_OTP })),
                this.store.pipe(select(getOtpInfoSelector)),
                this.store.pipe(select(getCommunityIdSelector))
            ).subscribe((response) => {
                this.header = response[0];
                this.store.dispatch(SetHeaderAction({ payload: this.header }));
                this.otpInfo = response[1];
                this.communityInfo = response[2];
            })
        );
    }

    /**
     * @function submitVerifyOtpForm
     * @description This function is used to verify mobile_no and otp
     */
    submitVerifyOtpForm(): void {
        if (!this.otp || (this.otp && this.otp.length !== 4)) return;
        this.store.dispatch(StartLoading());
        this.subscriptions.push(
            this.storeService
                .waitForEffectSuccess(
                    VerifyOtpAction(new Payload(new VerifyOtpModel(this.otp, this.otpInfo.country_code, this.otpInfo.mobile_no)))
                )
                .subscribe(
                    (response) => {
                        this.store.dispatch(StopLoading());
                        const { success, error_message, profile_exists, user } = response;
                        if (!success) {
                            this.showMessage(success, error_message);
                            return;
                        }

                        const { mobile_no, country_code } = this.otpInfo;
                        let redirectUrl: string;
                        this.store.pipe(select(getRedirectUrl)).subscribe((url) => (redirectUrl = url));
                        if (profile_exists) {
                            localStorage.removeItem(STORAGE_KEY.LOGIN_LINK);
                            this.store.dispatch(SetUserAction({ payload: user }));
                            if (user && user.id) {
                                this.analyticsService.aliasUserID(user.id);
                                this.analyticsService.identifyUser(user.id);
                                this.authService.setConfig();
                            }
                            this.successfulLogin.emit({ user });
                            this.store.dispatch(ClearRedirectUrl()); // Clear saved redirect url
                            this.analyticsService.sendEvent(MIXPANEL.LOGGED_IN, {
                                mobile_no,
                                country_code,
                                user_id: user.id,
                                distinct_id: user.id,
                            });
                            // this.facebookPixelService.registerPixelEvent(
                            //   'trackCustom',
                            //   'UserRegistered',
                            //   {community_id: this.communityInfo.communityId}
                            // );
                        } else {
                            if (redirectUrl.includes('?')) redirectUrl = `${redirectUrl}&page=login`;
                            else redirectUrl = `${redirectUrl}?page=login`;
                        }
                        this.analyticsService.sendEvent(MIXPANEL.OTP_VERIFIED, {
                            mobile_no,
                            country_code,
                            distinct_id: user && user.id,
                        });
                        const joinCommunity = localStorage.getItem(STORAGE_KEY.JOIN_COMMUNITY);
                        if (joinCommunity && JSON.parse(joinCommunity) && profile_exists) {
                            localStorage.removeItem(STORAGE_KEY.JOIN_COMMUNITY);
                            this.router.navigate(['community_questions', this.community.id]);
                        } else {
                            if (joinCommunity) {
                                localStorage.removeItem(STORAGE_KEY.JOIN_COMMUNITY);
                            }
                            this.router.navigateByUrl(redirectUrl); // Redirect to the page from where user started login process
                        }
                    },
                    (error) => {
                        // Handle error here
                        this.store.dispatch(StopLoading());
                    }
                )
        );
    }

    /**
     * @function resendOtp
     * @description This function is used to resend otp in case if it is not received in last step
     */
    resendOtp(): void {
        this.startCounter();
        this.store.dispatch(StartLoading());
        this.subscriptions.push(
            this.storeService
                .waitForEffectSuccess(
                    GenerateOtpAction(new Payload(new GenerateOtpModel(this.otpInfo.country_code, this.otpInfo.mobile_no, 1)))
                )
                .subscribe(
                    ({ success }) => {
                        this.store.dispatch(StopLoading());
                        if (success) {
                            this.resendOtpCount += 1;

                            this.analyticsService.sendEvent(MIXPANEL.RESEND_VERIFICATION_CODE, {
                                type: 'login',
                                count: this.resendOtpCount,
                            });

                            this.showMessage(success, MESSAGE.OTP_RESENT);
                            this.setOtpValue(null);
                        }
                    },
                    (error) => {
                        this.store.dispatch(StopLoading());
                    }
                )
        );
    }

    /**
     * @function startCounter
     * @description to start or restart 30 seconds counter
     */
    startCounter(): void {
        this.counter = 30;
        this.subscriptions.push(
            timer(1000, 1000) //Initial delay 1 seconds and interval countdown also 1 second
                .pipe(
                    takeWhile(() => this.counter > 0),
                    tap(() => this.counter--)
                )
                .subscribe()
        );
    }

    /**
     * @function onOtpChange
     * @param otp
     * @description update otp value entered by user
     */
    onOtpChange(otp) {
        this.otp = otp;
        if (String(otp).length === 0) this.invalidOtp = false;
        if (this.otp.length === 4) this.submitVerifyOtpForm();
    }

    /**
     * @function showMessage
     * @param success
     * @param message
     * @description Show snackbar message
     */
    showMessage(success: boolean, message: string) {
        this.invalidOtp = !success;
        this.message = message;
        let config = new MatSnackBarConfig();
        config.panelClass = ['snackbar', 'text-capitalize'];
        config.duration = 3000;
        this.snackBar.open(message, undefined, config);
    }

    setOtpValue(val) {
        this.ngOtpInput.setValue(val);
    }

    ngOnDestroy(): void {
        this.store.dispatch(StopLoading());
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
}

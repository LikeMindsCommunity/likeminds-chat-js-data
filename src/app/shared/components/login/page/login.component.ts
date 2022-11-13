import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { SocialAuthService } from 'angularx-social-login';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { SetHeaderAction, StartLoading, StopLoading, ClearRedirectUrl } from 'src/app/shared/store/actions/app.action';
import { getOtpInfoSelector, getCommunityIdSelector, getUrlParamsSelector } from 'src/app/shared/store/selectors/auth.selector';
import { getHeader, getRedirectUrl } from 'src/app/shared/store/selectors/app.selector';
import { getAuthSelector } from 'src/app/shared/store/selectors/auth.selector';
import { BaseHeaderData } from 'src/app/shared/models/header.model';
import { HEADER_TYPE } from 'src/app/shared/enums/header-type.enum';
import { StoreService } from 'src/app/core/services/store.service';
import { Payload } from 'src/app/shared/models/app.model';
import { LoginModel, IUserAcquired } from 'src/app/shared/models/login.model';
import { LoginAction, SetUserAction, GenerateOtpForMergeAccountAction } from 'src/app/shared/store/actions/auth.action';
import { LocalStorageService } from 'src/app/core/services/localstorage.service';
import { MergeAccountConfirmationComponent } from '../entryComponents/merge-account-confirmation/merge-account-confirmation.component';
import { IUser } from 'src/app/shared/models/user.model';
import { noWhitespaceValidator, trimSpace, emailPattern } from 'src/app/shared/utils';
import { IOtpInfo, GenerateOtpForMergeAccountModel, IUrlParams } from 'src/app/shared/models/auth.model';
import { VerifyMergeAccountComponent } from '../entryComponents/verify-merge-account/verify-merge-account.component';
import { CanComponentDeactivate } from 'src/app/shared/guards/leave-page.guard';
import { LeavePageComponent } from 'src/app/shared/entryComponents/leave-page/leave-page.component';
import { COMMUNITY_QUESTION_PATH, COMMUNITY_DETAIL_PATH, BLOCKER, PAGE_NOT_FOUND_PATH } from 'src/app/shared/constants/routes.constant';
import { MatDialog } from '@angular/material/dialog';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import { AuthState } from 'src/app/shared/store/reducers/auth.reducer';
import { environment } from 'src/environments/environment';
import { CommunityService } from 'src/app/core/services/community.service';
import { IMemberState } from 'src/app/shared/models/member.model';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ChoiceDialogData } from '../../../models/choice.model';
import { ChoiceSheetComponent } from '../../../entryComponents/choice-sheet/choice-sheet.component';
import { ChoiceDialogComponent } from '../../../entryComponents/choice-dialog/choice-dialog.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, CanComponentDeactivate {
    header: BaseHeaderData;
    subscriptions: Subscription[] = [];
    formSubmitted = false;
    formEdited = false;
    headerData: BaseHeaderData;
    form: FormGroup;
    communityInfo: any;
    user: IUser;
    otpInfo: IOtpInfo;
    imageUrl: string;
    isSocialLogin: boolean;
    socialLoginType: string;
    authState: AuthState;
    urlParams: IUrlParams;
    lnUserDataObj: any;

    @Output() linkedInUserData = new EventEmitter();
    @ViewChild('emailInput') emailInput: ElementRef;
    constructor(
        private formBuilder: FormBuilder,
        private store: Store,
        private storeService: StoreService,
        private socialAuthService: SocialAuthService,
        private router: Router,
        private storage: AngularFireStorage,
        private dialog: MatDialog,
        private analyticsService: AnalyticsService,
        private communityService: CommunityService,
        private authService: AuthService,
        private sheet: MatBottomSheet
    ) {}

    ngOnInit(): void {
        this.buildForm();
        // this.getHeader();
        this.getOtpInfo();
        this.getCommunityInfo();
        this.setEmailValidation();
        this.getApp();
        this.socialAuthService.authState.subscribe((user) => this.socialLogin(user));
        this.form.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => (this.formEdited = true));
        this.store.pipe(select(getUrlParamsSelector)).subscribe((response) => (this.urlParams = response));
    }

    linkedInFn(event) {
        this.linkedInSocialLogin(event.user);
    }

    getApp(): void {
        this.store.pipe(select(getAuthSelector)).subscribe((authState: AuthState) => {
            this.authState = authState;
        });
    }

    /**
     * @function createForm
     * @description This function is used to create forms
     */
    buildForm(): void {
        const emailReg =
            '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/';
        this.form = this.formBuilder.group({
            type: ['custom'],
            mobile_no: [null, [Validators.required, Validators.minLength(10)]],
            country_code: [null, Validators.required],
            user: this.formBuilder.group({
                name: [null, [Validators.required, noWhitespaceValidator, Validators.pattern(/([A-Za-z0-9_.]+\s?)/g)]],
                image_url: null,
                email: null,
            }),
        });
    }

    /**
     * @function setEmailValidation
     * @description If user enters value then adds validation else clears validation
     */
    setEmailValidation(): void {
        const email = this.form.get('user.email');
        this.subscriptions.push(
            email.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
                if (trimSpace(value)) email.setValidators(Validators.pattern(emailPattern()));
                else email.clearValidators();
            })
        );
    }

    /**
     * @function getHeader
     * @description This function is used to get header for login page
     */
    getHeader(): void {
        this.subscriptions.push(
            this.store.pipe(select(getHeader, { type: HEADER_TYPE.LOGIN })).subscribe((header) => {
                this.header = header;
                this.store.dispatch(SetHeaderAction({ payload: header }));
            })
        );
    }

    /**
     * @function getOtpInfo
     * @description This function is used to get otp info
     */
    getOtpInfo(): void {
        this.subscriptions.push(
            this.store.pipe(select(getOtpInfoSelector)).subscribe((response) => {
                this.otpInfo = response;
                const { mobile_no, country_code } = response;
                this.form.patchValue({ mobile_no, country_code });
            })
        );
    }

    /**
     * @function getCommunityInfo
     * @description This function fetches community info from store
     */
    getCommunityInfo(): void {
        this.subscriptions.push(this.store.pipe(select(getCommunityIdSelector)).subscribe((response) => (this.communityInfo = response)));
    }

    /**
     * @function uploadImage
     * @description This function is used to upload image
     */
    uploadImage() {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e: any) => {
            const file = e.target.files[0];
            const metadata = { contentType: file.type };
            const storageRef = this.storage.storage.ref();
            const uploadTask = storageRef.child(`files/profile/${this.form.value.mobile_no}/`).put(file, metadata);
            this.store.dispatch(StartLoading());
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    // Handle unsuccessful uploads
                    this.store.dispatch(StopLoading());
                },
                () => {
                    // Handle successful uploads on complete
                    this.store.dispatch(StopLoading());
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => (this.imageUrl = downloadURL));
                }
            );
        };
        input.click();
    }

    showAddPhotoPopup(): void {
        const data: ChoiceDialogData = {
            title: 'Add Profile Pic',
            subTitle: 'LikeMinds is a real identity network. Confirm your real identity by adding a profile photo.',
            choices: ['Ok'],
        };
        if (window.innerWidth <= 470) {
            const sheetRef = this.sheet.open(ChoiceSheetComponent, {
                data,
            });
        } else {
            const dialogRef = this.dialog.open(ChoiceDialogComponent, {
                panelClass: 'attend-event-modal',
                data,
            });
        }
    }

    /**
     * @function submitLoginForm
     * @description This form is used to login
     */
    submitLoginForm(): void {
        this.formSubmitted = true;
        if (this.form.invalid) return;
        if (!this.imageUrl) {
            this.showAddPhotoPopup();
            return;
        }
        this.store.dispatch(StartLoading());
        this.form.value.user['image_url'] = this.imageUrl;
        if (!this.form.value.user.email) delete this.form.value.user.email;
        let { type, mobile_no, country_code, user } = this.form.value;

        let user_acquired: IUserAcquired = {
            landing_type: this.authState.landingType,
            link_type: this.authState.linkType,
            community_id: this.communityInfo?.communityId,
            utm_source: this.authState.urlParams?.utm_source,
            utm_campaign: this.authState.urlParams?.utm_campaign,
            utm_content: this.authState.urlParams?.utm_content,
            utm_medium: this.authState.urlParams?.utm_medium,
            shared_by: this.authState.urlParams?.source || this.authState.urlParams?.shared_by,
            platform: environment.platformCode,
        };
        let urlPattern = JSON.parse(localStorage.getItem(STORAGE_KEY.URL_PATTERN));
        let user_acquisition_url = window.location.href;
        if (urlPattern !== null && urlPattern?.fullUrl) {
            user_acquisition_url = urlPattern?.fullUrl;
        }

        this.storeService
            .waitForEffectSuccess(
                LoginAction(new Payload(new LoginModel(type, mobile_no, country_code, user, user_acquired, user_acquisition_url)))
            )
            .subscribe(
                (response) => {
                    this.store.dispatch(StopLoading());
                    const { email_exists } = response;
                    this.user = response.user;

                    if (!email_exists) {
                        this.formEdited = false;

                        this.store.dispatch(SetUserAction({ payload: this.user }));

                        if (this.user && this.user.id) {
                            this.analyticsService.aliasUserID(this.user.id);
                            this.analyticsService.identifyUser(this.user.id);
                            this.authService.setConfig();
                        }

                        this.analyticsService.sendEvent(MIXPANEL.SIGNED_UP, {
                            mobile_no,
                            country_code,
                            email_provided: user.email ? true : false,
                            name: user.name,
                            user_id: this.user.id,
                            used_social_login: this.isSocialLogin,
                            social_login_type: this.socialLoginType,
                            distinct_id: this.user?.id,
                        });
                        // this.navigateAfterLoginSuccess(this.communityInfo.id, this.user.id);
                        this.navigateAfterLoginSuccess(this.communityInfo.communityId, this.user.id, response?.access);
                        return;
                    } else this.openMergeAccountConfirmation();
                },
                (error) => {
                    // Handle error here
                    this.store.dispatch(StopLoading());
                }
            );
    }

    generateOtp(): void {
        this.subscriptions.push(
            this.storeService
                .waitForEffectSuccess(GenerateOtpForMergeAccountAction(new Payload(new GenerateOtpForMergeAccountModel(this.user.id))))
                .subscribe()
        );
    }

    openMergeAccountConfirmation() {
        const dialog = this.dialog.open(MergeAccountConfirmationComponent, {
            data: this.user.mobiles,
            panelClass: 'merge-account-modal',
            disableClose: true,
        });

        dialog.afterClosed().subscribe((response) => {
            if (response === 'RESET') {
                this.form.get('user').patchValue({ email: null });
                this.emailInput.nativeElement.focus();
                this.analyticsService.sendEvent(MIXPANEL.ENTERED_NEW_EMAIL, {
                    distinct_id: this.user && this.user.id,
                });
            } else {
                this.generateOtp();
                this.openVerifyMergeAccount();
            }
        });
    }

    openVerifyMergeAccount() {
        const data = {
            user: this.user,
            otpInfo: this.otpInfo,
        };
        const dialog = this.dialog.open(VerifyMergeAccountComponent, {
            data,
            panelClass: 'verify-otp-modal',
            disableClose: true,
        });
        dialog.afterClosed().subscribe((response) => {
            if (response) {
                this.formEdited = false;
                this.navigateAfterLoginSuccess(this.communityInfo.communityId, this.user.id, response?.access);
            }
        });
    }

    socialLogin(event): void {
        if (!event) return;
        this.isSocialLogin = true;
        this.socialLoginType = String(event.provider).toLocaleLowerCase();
        const { name, email, photoUrl } = event;
        this.imageUrl = photoUrl;
        this.form.get('user').patchValue({
            name,
            email,
            image_url: photoUrl,
        });
        this.submitLoginForm();
    }

    linkedInSocialLogin(event): void {
        if (!event) return;
        this.isSocialLogin = true;
        this.socialLoginType = String(event.provider).toLocaleLowerCase();
        const { name, emails, image_url } = event;
        this.imageUrl = image_url;
        const email = emails[0].email;
        this.form.get('user').patchValue({
            name,
            email,
            image_url: image_url,
        });
        this.submitLoginForm();
    }

    /**
     * @function formControls
     * @description Getter function to get form controls
     */
    get formControls() {
        return this.form.controls;
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this.formEdited) {
            const data = {
                heading: 'Leave without account creation?',
                content:
                    'Are you sure, you want to move away from this screen? Your login details with your mobile number would be lost and you would have to re-do the same.',
                successBtnText: 'Leave',
                cancelBtnText: 'Stay',
            };
            return this.dialog
                .open(LeavePageComponent, {
                    data,
                    panelClass: 'leave-page-modal',
                    disableClose: true,
                })
                .afterClosed()
                .pipe(map((res) => res));
        } else return true;
    }

    isNumeric(value) {
        return /^-?\d+$/.test(value);
    }

    // To match urlPath to /collabcard/<number>
    checkUrlPathExactMatch(urlPath: string): boolean {
        if (!urlPath) return false;
        const splitValues = urlPath.split('/');
        return splitValues[2] === 'collabcard' && !isNaN(+splitValues[3]) && !splitValues[4];
    }

    navigateAfterLoginSuccess(community_id, member_id, access?: boolean) {
        if (!access) {
            let urlPattern = JSON.parse(localStorage.getItem(STORAGE_KEY.URL_PATTERN));

            if (urlPattern !== null && Object.keys(urlPattern)?.length !== 0) {
                let path = urlPattern.path;
                let qparams = urlPattern.queryParams;
                if (path.includes('/renewal/') && qparams.renew === 'true') {
                    this.router.navigate([`${path}`], { queryParams: qparams });
                    return;
                }
                // paid event page
                if (urlPattern.path === '/event_pay') {
                    this.router.navigate([`${urlPattern.path}`], { queryParams: urlPattern.queryParams });
                } else if (this.checkUrlPathExactMatch(urlPattern?.path)) {
                    this.router.navigate([`${urlPattern.path}`], { queryParams: urlPattern.queryParams });
                }

                // community path
                if (path.split('/')[1] === 'community') {
                    if (this.isNumeric(path.split('/')[2])) {
                        this.store.dispatch(StartLoading());
                        if (qparams.payment_id || qparams.shared_by || qparams.aj) {
                            this.router.navigate([`${COMMUNITY_QUESTION_PATH}` + '/' + path.split('/')[2]], { queryParams: qparams });
                            return;
                        } else {
                            this.store.dispatch(StartLoading());
                            this.router.navigate([`${PAGE_NOT_FOUND_PATH}`]);
                            return;
                        }
                    } else {
                        this.router.navigate([`${PAGE_NOT_FOUND_PATH}`]);
                        return;
                    }
                } else {
                    this.router.navigate(['/']);
                }
                this.store.dispatch(StopLoading());
                return;
            } else {
                console.log(5);
                this.router.navigate([`/${BLOCKER}`]);
                return;
            }
        }

        if (JSON.parse(localStorage.getItem(STORAGE_KEY.LOGIN_LINK))) {
            localStorage.removeItem(STORAGE_KEY.LOGIN_LINK);
            this.store.pipe(select(getRedirectUrl)).subscribe((url) => {
                this.router.navigateByUrl(url);
            });
        } else {
            if (!community_id) {
                this.router.navigate([`/`]);
            } else {
                this.communityService.getMemberState({ community_id, member_id }).subscribe((response: IMemberState) => {
                    if (response && response.state) {
                        this.store.dispatch(ClearRedirectUrl());
                        this.router.navigate([`/${COMMUNITY_DETAIL_PATH}/${this.communityInfo.communityId}`], {
                            queryParams: this.urlParams,
                        });
                    } else {
                        localStorage.setItem(STORAGE_KEY.NEW_ACCOUNT_CREATION, '1');
                        this.router.navigate([`/${COMMUNITY_QUESTION_PATH}/${this.communityInfo.communityId}`], {
                            queryParams: this.urlParams,
                        });
                    }
                });
            }
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
}

import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { GetCountryCodesAction, ClearCountryCodes, StartLoading, StopLoading } from 'src/app/shared/store/actions/app.action';
import { getDefaultCountryCode, getCountryCodes, getRedirectUrl } from 'src/app/shared/store/selectors/app.selector';
import { GenerateOtpAction } from 'src/app/shared/store/actions/auth.action';
import { ICountryCode, Payload } from 'src/app/shared/models/app.model';
import { HEADER_TYPE } from 'src/app/shared/enums/header-type.enum';
import { GenerateOtpModel } from 'src/app/shared/models/auth.model';
import { ICommunity } from 'src/app/shared/models/community.model';
import { StoreService } from 'src/app/core/services/store.service';
import { State } from 'src/app/shared/store/reducers';
import { CountryDropdownComponent } from 'src/app/shared/components/country-dropdown/country-dropdown.component';
import { MIXPANEL } from 'src/app/shared/enums/mixpanel.enum';
import {AnalyticsService} from '../../../core/services/analytics.service';
import { ERROR_906_TRY_AFTER_30_SECONDS } from 'src/app/shared/constants/app-constant';

@Component({
    selector: 'app-generate-otp-component',
    templateUrl: './generate-otp.component.html',
    styleUrls: ['./generate-otp.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class GenerateOtpComponent implements OnInit, OnDestroy {

    showFooter = true;
    buttonText = 'Generate Otp';
    readMoreCount = 60;
    headerType = HEADER_TYPE.GENERATE_OTP;
    form: FormGroup;
    formSubmitted = false;
    community: ICommunity;
    subscriptions: Subscription[] = [];
    selectedCountry: ICountryCode;
    countries: ICountryCode[];
    countryCodes: ICountryCode[];
    searchValue: FormControl;
    mobileNo: string;
    generateOtpClickCount = 0;
    otpGenerated: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private store: Store<State>,
        private storeService: StoreService,
        private router: Router,
        private bottomSheet: MatBottomSheet,
        private analyticsService: AnalyticsService
    ) { }

    ngOnInit(): void {
        this.buildForm();
        this.store.dispatch(GetCountryCodesAction());
        this.getDefaultCountry();
        this.getCountryCodes();
    }

    /**
     * @function buildForm
     * @description This function is used to build generate otp form
     */
    buildForm(): void {
        this.form = this.formBuilder.group({
            search: null,
            mobile_no: [null, [Validators.required, Validators.minLength(10)]],
            country_code: [null, Validators.required],
        });
    }

    /**
     * @function getDefaultCountry
     * @description This function is used to get default country code for mobile number
     */
    getDefaultCountry(): void {
        this.subscriptions.push(
            this.store.pipe(select(getDefaultCountryCode))
                .subscribe(country => {
                    if (!country) return;
                    this.selectedCountry = country;
                    this.controls['country_code'].setValue(country.dial_code);
                })
        );
    }

    /**
     * @function getCountryCodes
     * @description This function is used to get country codes from store
     */
    getCountryCodes(): void {
        this.subscriptions.push(
            this.store.pipe(select(getCountryCodes)).subscribe(countryCodes => {
                this.countries = countryCodes;
                this.countryCodes = countryCodes;
                setTimeout(() => {
                    let el = document && document.getElementById('+91');
                    if (el) el.scrollIntoView();
                }, 100);
            })
        );
    }

    openCountryList(): void {
        const ref = this.bottomSheet.open(CountryDropdownComponent, {
            panelClass: 'country-list'
        });
        ref.afterDismissed().subscribe(country => this.selectCountryCode(country));
    }

    /**
     * @function selectCountryCode
     * @param country
     * @description To change the country code
     */
    selectCountryCode(country: ICountryCode): void {
        this.analyticsService.sendEvent(MIXPANEL.COUNTRY_CODES_CLICKED);
        this.selectedCountry = country;
        this.controls['country_code'].setValue(country.dial_code);
    }

    getSelectedValue() {
        if (!this.selectedCountry) return;
        const { flag, dial_code } = this.selectedCountry;
        return `${flag} ${dial_code}`;
    }

    /**
     * @function validateMobileNumber
     * @param event
     * @description To set invalid error if mobile number is invalid
     */
    validateMobileNumber(event): void {
        if (!event) this.controls['mobile_no'].setErrors({ invalid: true });
        else this.controls['mobile_no'].setErrors(null);
    }

    /**
     * @function submit
     * @description Submit form to generate OTP
     */
    submitGenerateOtpForm(): void {
        this.formSubmitted = true;
        if (this.form.invalid) return;
        this.store.dispatch(StartLoading());
        this.generateOtpClickCount += 1;
        const { mobile_no, country_code } = this.form.value;

        this.subscriptions.push(
            this.storeService.waitForEffectSuccess(GenerateOtpAction(new Payload(new GenerateOtpModel(
                parseInt(country_code),
                parseInt(mobile_no)
            )))).subscribe((resData) => {
                this.store.dispatch(StopLoading());
                this.analyticsService.sendEvent(
                    MIXPANEL.OTP_GENERATED, {
                    mobile_no: parseInt(mobile_no),
                    country_code: parseInt(country_code),
                    count: this.generateOtpClickCount
                });

                if (resData.success) {
                    let redirectUrl: string;
                    this.store.pipe(select(getRedirectUrl)).subscribe(url => redirectUrl = url);
                    if (redirectUrl.includes('?')) redirectUrl = `${redirectUrl}&page=verify_otp`;
                    else redirectUrl = `${redirectUrl}?page=verify_otp`;
                    this.router.navigateByUrl(redirectUrl); // Redirect to the page from where user started login process
                }else if(!resData.success && resData.error_message === ERROR_906_TRY_AFTER_30_SECONDS){
                    let redirectUrl: string;
                    this.store.pipe(select(getRedirectUrl)).subscribe(url => redirectUrl = url);
                    if (redirectUrl.includes('?')) redirectUrl = `${redirectUrl}&page=verify_otp`;
                    else redirectUrl = `${redirectUrl}?page=verify_otp`;
                    this.router.navigateByUrl(redirectUrl); // Redirect to the page from where user started login process
                }
            }, error => {
                // Handle error here
                this.store.dispatch(StopLoading());
            })
        );
    }

    /**
     * @function controls
     * @description Getter function to get form controls
     */
    get controls() {
        return this.form.controls;
    }

    ngOnDestroy(): void {
        this.store.dispatch(StopLoading());
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.store.dispatch(ClearCountryCodes());
    }
}

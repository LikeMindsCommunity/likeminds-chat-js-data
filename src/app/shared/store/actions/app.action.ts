import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import {
    GET_TERMS_AND_CONDITIONS,
    GET_TERMS_AND_CONDITIONS_SUCCESS,
    GET_TERMS_AND_CONDITIONS_FAILURE,
    CLEAR_TERMS_AND_CONDITIONS,
    GET_HEADERS,
    GET_HEADERS_SUCCESS,
    GET_HEADERS_FAILURE,
    GET_COUNTRY_CODES,
    GET_COUNTRY_CODES_SUCCESS,
    GET_COUNTRY_CODES_FAILURE,
    CLEAR_COUNTRY_CODES,
    SET_HEADER,
    GET_PRIVACY_POLICY,
    GET_PRIVACY_POLICY_SUCCESS,
    GET_PRIVACY_POLICY_FAILURE,
    CLEAR_PRIVACY_POLICY,
    SET_MESSAGE,
    CLEAR_MESSAGE,
    CLEAR_HEADER,
    SET_REDIRECT_URL,
    CLEAR_REDIRECT_URL,
    START_LOADING,
    STOP_LOADING
} from '../types/app.types';
import { BaseHeaderData } from '../../models/header.model';
import { ICountryCode, ITerms, IPrivacy } from '../../models/app.model';

export const StartLoading = createAction(
    START_LOADING
);

export const StopLoading = createAction(
    STOP_LOADING
);

/**
 * @var GetTermsAndConditionsAction
 * @description Action to get list of terms and condition
 */
export const GetTermsAndConditionsAction = createAction(
    GET_TERMS_AND_CONDITIONS
);

/**
 * @var GetTermsAndConditionsSuccessAction
 * @description Action to store terms and conditions
 */
export const GetTermsAndConditionsSuccessAction = createAction(
    GET_TERMS_AND_CONDITIONS_SUCCESS,
    props<{ payload: ITerms[] }>()
);

/**
 * @var GetTermsAndConditionsFailureAction
 * @description Action on failure of terms and condition request
 */
export const GetTermsAndConditionsFailureAction = createAction(
    GET_TERMS_AND_CONDITIONS_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var ClearTermsAndConditionsAction
 * @description Action to clear terms and conditions
 */
export const ClearTermsAndConditionsAction = createAction(
    CLEAR_TERMS_AND_CONDITIONS
);

/**
 * @var GetPrivacyPolicyAction
 * @description Action to get list of privacy policy
 */
export const GetPrivacyPolicyAction = createAction(
    GET_PRIVACY_POLICY
);

/**
 * @var GetPrivacyPolicySuccessAction
 * @description Action to store privacy policy
 */
export const GetPrivacyPolicySuccessAction = createAction(
    GET_PRIVACY_POLICY_SUCCESS,
    props<{ payload: IPrivacy[] }>()
);

/**
 * @var GetPrivacyPolicyFailureAction
 * @description Action on failure of privacy policy request
 */
export const GetPrivacyPolicyFailureAction = createAction(
    GET_PRIVACY_POLICY_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var ClearPrivacyPolicyAction
 * @description Action to clear privacy policy
 */
export const ClearPrivacyPolicyAction = createAction(
    CLEAR_PRIVACY_POLICY
);

/**
 * @var GetHeaderDataAction
 * @description Action to get list of header data
 */
export const GetHeaderDataAction = createAction(
    GET_HEADERS
);

/**
 * @var GetHeaderDataSuccessAction
 * @description Action to store header data
 */
export const GetHeaderDataSuccessAction = createAction(
    GET_HEADERS_SUCCESS,
    props<{ payload: any }>()
);

/**
 * @var GetHeaderDataFailureAction
 * @description Action on failure of header data request
 */
export const GetHeaderDataFailureAction = createAction(
    GET_HEADERS_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var SetHeaderAction
 * @description Action to set header data
 */
export const SetHeaderAction = createAction(
    SET_HEADER,
    props<{ payload: BaseHeaderData }>()
);

/**
 * @var ClearHeaderAction
 * @description Action to set header data
 */
export const ClearHeaderAction = createAction(
    CLEAR_HEADER
);

/**
 * @var GetCountryCodesAction
 * @description Action to get list of country codes
 */
export const GetCountryCodesAction = createAction(
    GET_COUNTRY_CODES
);

/**
 * @var GetCountryCodesSuccessAction
 * @description Action to store country codes
 */
export const GetCountryCodesSuccessAction = createAction(
    GET_COUNTRY_CODES_SUCCESS,
    props<{ payload: ICountryCode[] }>()
);

/**
 * @var GetCountryCodesFailureAction
 * @description Action on failure of country code request
 */
export const GetCountryCodesFailureAction = createAction(
    GET_COUNTRY_CODES_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var ClearCountryCodes
 * @description Action to clear country codes in store
 */
export const ClearCountryCodes = createAction(
    CLEAR_COUNTRY_CODES
);

/**
 * @var SetMessage
 * @description Action to set message
 */
export const SetMessage = createAction(
    SET_MESSAGE,
    props<{ payload: { message: string, type: string } }>()
);

/**
 * @var SetRedirectUrl
 * @description Action to set redirect url
 */
export const SetRedirectUrl = createAction(
    SET_REDIRECT_URL,
    props<{ payload: { redirectUrl: string } }>()
);

/**
 * @var ClearRedirectUrl
 * @description Action to clear redirect url
 */
export const ClearRedirectUrl = createAction(
    CLEAR_REDIRECT_URL
);

/**
 * @var ClearMessage
 * @description Action to clear message
 */
export const ClearMessage = createAction(
    CLEAR_MESSAGE
);
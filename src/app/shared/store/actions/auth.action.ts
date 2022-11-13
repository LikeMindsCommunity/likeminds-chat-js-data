import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { GenerateOtpModel, IGenerateOtpResponse, IUrlParams, GenerateOtpForMergeAccountModel } from '../../models/auth.model';
import { VerifyOtpModel, IVerifyOtpResponse } from '../../models/auth.model';
import { AuthType } from '../types';
import { LoginModel, ILoginResponse } from '../../models/login.model';
import { MergeAccountModel, IMergeAccountResponse } from '../../models/merge-account.model';
import { SET_LINK_TYPE, SET_LANDING_TYPE } from '../types/auth.types';
import { IUser } from '../../models/user.model';


/**
 * @var SaveCommunityIdAction
 * @description Action to save community id and aj from url when user arrives
 */
export const SaveCommunityIdAction = createAction(
    AuthType.SAVE_COMMUNITY_ID,
    props<{ payload: any }>()
);

/**
 * @var SaveUrlParamsAction
 * @description Action to save url params when user arrives
 */
export const SaveUrlParamsAction = createAction(
    AuthType.SAVE_URL_PARAMS,
    props<{ payload: IUrlParams }>()
);

/**
 * @var SetLandingTypeAction
 * @description Action to set landing type
 */
export const SetLandingTypeAction = createAction(
    SET_LANDING_TYPE,
    props<{ payload: { landingType: string } }>()
);

/**
 * @var SetLinkTypeAction
 * @description Action to set link type
 */
export const SetLinkTypeAction = createAction(
    SET_LINK_TYPE,
    props<{ payload: { linkType: string } }>()
);

/**
 * @var SetUserAction
 * @description Action to save user
 */
export const SetUserAction = createAction(
    AuthType.SET_USER,
    props<{ payload: IUser }>()
);

/**
 * @var GenerateOtpAction
 * @description Action to generate otp
 */
export const GenerateOtpAction = createAction(
    AuthType.GENERATE_OTP,
    props<{ payload: GenerateOtpModel }>()
);

/**
 * @var GenerateOtpSuccessAction
 * @description Action on generate otp success
 */
export const GenerateOtpSuccessAction = createAction(
    AuthType.GENERATE_OTP_SUCCESS,
    props<{ payload: IGenerateOtpResponse }>()
);

/**
 * @var GenerateOtpFailureAction
 * @description Action on generate otp failure
 */
export const GenerateOtpFailureAction = createAction(
    AuthType.GENERATE_OTP_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var GenerateOtpForMergeAccountAction
 * @description Action to generate otp
 */
export const GenerateOtpForMergeAccountAction = createAction(
    AuthType.GENERATE_OTP_FOR_MERGE_ACCOUNT,
    props<{ payload: GenerateOtpForMergeAccountModel }>()
);

/**
 * @var GenerateOtpForMergeAccountSuccessAction
 * @description Action on generate otp success
 */
export const GenerateOtpForMergeAccountSuccessAction = createAction(
    AuthType.GENERATE_OTP_FOR_MERGE_ACCOUNT_SUCCESS,
    props<{ payload: any }>()
);

/**
 * @var GenerateOtpForMergeAccountFailureAction
 * @description Action on generate otp failure
 */
export const GenerateOtpForMergeAccountFailureAction = createAction(
    AuthType.GENERATE_OTP_FOR_MERGE_ACCOUNT_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var VerifyOtpAction
 * @description Action to verify otp
 */
export const VerifyOtpAction = createAction(
    AuthType.VERIFY_OTP,
    props<{ payload: VerifyOtpModel }>()
);

/**
 * @var VerifyOtpSuccessAction
 * @description Action on verify otp success
 */
export const VerifyOtpSuccessAction = createAction(
    AuthType.VERIFY_OTP_SUCCESS,
    props<{ payload: IVerifyOtpResponse }>()
);

/**
 * @var VerifyOtpFailureAction
 * @description Action on verify otp failure
 */
export const VerifyOtpFailureAction = createAction(
    AuthType.VERIFY_OTP_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var LoginAction
 * @description Action to login
 */
export const LoginAction = createAction(
    AuthType.LOGIN,
    props<{ payload: LoginModel }>()
);

/**
 * @var LoginSuccessAction
 * @description Action on login success
 */
export const LoginSuccessAction = createAction(
    AuthType.LOGIN_SUCCESS,
    props<{ payload: ILoginResponse }>()
);

/**
 * @var LoginFailureAction
 * @description Action on login failure
 */
export const LoginFailureAction = createAction(
    AuthType.LOGIN_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var MergeAccountAction
 * @description Action to merge account
 */
export const MergeAccountAction = createAction(
    AuthType.MERGE_ACCOUNT,
    props<{ payload: MergeAccountModel }>()
);

/**
 * @var MergeAccountSuccessAction
 * @description Action on merge account success
 */
export const MergeAccountSuccessAction = createAction(
    AuthType.MERGE_ACCOUNT_SUCCESS,
    props<{ payload: IMergeAccountResponse }>()
);

/**
 * @var MergeAccountFailureAction
 * @description Action on merge account failure
 */
export const MergeAccountFailureAction = createAction(
    AuthType.MERGE_ACCOUNT_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);
import { Action, createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions';
import { IUser } from '../../models/user.model';
import { IOtpInfo, IUrlParams } from '../../models/auth.model';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';

export interface AuthState {
    communityId: number | string;
    otpInfo: IOtpInfo;
    user: IUser;
    urlParams: IUrlParams;
    landingType: string;
    linkType: string;
}

const auth: AuthState = localStorage && localStorage.getItem(STORAGE_KEY.AUTH) && JSON.parse(localStorage.getItem(STORAGE_KEY.AUTH));
const likeMindsUser: IUser = localStorage && localStorage.getItem(STORAGE_KEY.LIKEMINDS_USER) && JSON.parse(localStorage.getItem(STORAGE_KEY.LIKEMINDS_USER));

export const initialState: AuthState = {
    communityId: auth && auth.communityId,
    otpInfo: auth && auth.otpInfo,
    user: likeMindsUser && likeMindsUser,
    urlParams: auth && auth.urlParams,
    landingType: auth && auth.landingType,
    linkType: auth && auth.linkType
}

const authReducer = createReducer(
    initialState,
    on(
        AuthActions.SaveCommunityIdAction,
        (state, { payload }) => {
            const result = { ...state, communityId: payload };
            localStorage.setItem(STORAGE_KEY.AUTH, JSON.stringify(result));
            return { ...result };
        }),
    on(
        AuthActions.SetUserAction,
        (state, { payload }) => {
            localStorage.setItem(STORAGE_KEY.LIKEMINDS_USER, JSON.stringify(payload));
            return { ...state, user: payload };
        }),
    on(
        AuthActions.GenerateOtpAction,
        (state, { payload }) => {
            const result = { ...state, otpInfo: { ...payload, success: false } };
            localStorage.setItem(STORAGE_KEY.AUTH, JSON.stringify(result));
            return { ...result };
        }),
    on(
        AuthActions.GenerateOtpSuccessAction,
        (state) => {
            const result = { ...state, otpInfo: { ...state.otpInfo, success: true } };
            localStorage.setItem(STORAGE_KEY.AUTH, JSON.stringify(result));
            return { ...result };
        }),
    on(
        AuthActions.GenerateOtpFailureAction,
        (state) => {
            // const result = { ...state, otpInfo: undefined };
            // localStorage.setItem(STORAGE_KEY.AUTH, JSON.stringify(result));
            return state;
        }),
    on(
        AuthActions.VerifyOtpAction,
        (state, { payload }) => {
            const result = { ...state, otpInfo: { ...state.otpInfo, otp: payload.otp } };
            localStorage.setItem(STORAGE_KEY.AUTH, JSON.stringify(result));
            return { ...result };
        }),
    on(
        AuthActions.VerifyOtpSuccessAction,
        (state, { payload }) => {
            const { profile_exists, access, success, user } = payload;
            return { ...state, access, user: success && profile_exists ? user : undefined };
        }),
    on(
        AuthActions.LoginSuccessAction,
        (state) => ({ ...state })
    ),
    on(
        AuthActions.SetLandingTypeAction,
        (state, { payload }) => ({ ...state, landingType: payload.landingType })
    ),
    on(
        AuthActions.SetLinkTypeAction,
        (state, { payload }) => ({ ...state, linkType: payload.linkType })
    ),
    on(
        AuthActions.SaveUrlParamsAction,
        (state, { payload }) => {
            const { page, ...rest } = payload;
            return { ...state, urlParams: rest };
        }
    )
);

export function reducer(state: AuthState, action: Action) {
    return authReducer(state, action);
}
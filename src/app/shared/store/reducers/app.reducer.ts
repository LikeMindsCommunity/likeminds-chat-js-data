import { BaseHeaderData } from '../../models/header.model';
import { Action, createReducer, on } from '@ngrx/store';
import { AppActions } from '../actions';
import { ICountryCode, IPrivacy, ITerms } from '../../models/app.model';
import { STORAGE_KEY } from '../../enums/storage-keys.enum';

export interface AppState {
    isLoading: boolean;
    defaultCountry: ICountryCode;
    terms: ITerms[];
    privacy: IPrivacy[];
    selectedHeader: BaseHeaderData;
    headers: BaseHeaderData[];
    countryCodes: ICountryCode[];
    message: string;
    type: string;
    redirectUrl: string;
}

const redirectUrl: string = localStorage.getItem(STORAGE_KEY.LIKEMINDS_REDIRECT_URL);

export const initialState: AppState = {
    isLoading: false,
    defaultCountry: undefined,
    terms: undefined,
    privacy: undefined,
    selectedHeader: undefined,
    headers: undefined,
    countryCodes: undefined,
    message: undefined,
    type: undefined,
    redirectUrl
}

export const appReducer = createReducer(
    initialState,
    on(
        AppActions.StartLoading,
        (state => ({ ...state, isLoading: true }))
    ),
    on(
        AppActions.StopLoading,
        (state => ({ ...state, isLoading: false }))
    ),
    on(
        AppActions.GetTermsAndConditionsSuccessAction,
        (state, { payload }) => ({ ...state, terms: payload })),
    on(
        AppActions.ClearTermsAndConditionsAction,
        state => ({ ...state, terms: undefined })
    ),
    on(
        AppActions.GetPrivacyPolicySuccessAction,
        (state, { payload }) => ({ ...state, privacy: payload })),
    on(
        AppActions.ClearPrivacyPolicyAction,
        state => ({ ...state, privacy: undefined })
    ),
    on(
        AppActions.GetHeaderDataSuccessAction,
        (state, { payload }) => ({ ...state, headers: payload })
    ),
    on(
        AppActions.SetHeaderAction,
        (state, { payload }) => ({ ...state, selectedHeader: payload })
    ),
    on(
        AppActions.ClearHeaderAction,
        state => ({ ...state, selectedHeader: undefined })
    ),
    on(
        AppActions.GetCountryCodesSuccessAction,
        (state, { payload }) => {
            let defaultCountry = payload && payload.find(item => item.dial_code === '+91');
            return { ...state, countryCodes: payload, defaultCountry };
        }
    ),
    on(
        AppActions.ClearCountryCodes,
        state => ({ ...state, countryCodes: undefined })
    ),
    on(
        AppActions.SetMessage,
        (state, { payload }) => ({ ...state, ...payload })
    ),
    on(
        AppActions.SetRedirectUrl,
        (state, { payload }) => {
            localStorage.setItem(STORAGE_KEY.LIKEMINDS_REDIRECT_URL, payload.redirectUrl);
            return { ...state, ...payload };
        }
    ),
    on(
        AppActions.ClearRedirectUrl,
        (state) => {
            localStorage.removeItem(STORAGE_KEY.LIKEMINDS_REDIRECT_URL);
            return { ...state };
        }
    ),
    on(
        AppActions.ClearMessage,
        state => ({ ...state, message: undefined, type: undefined })
    )
);

export function reducer(state: AppState, action: Action) {
    return appReducer(state, action);
}
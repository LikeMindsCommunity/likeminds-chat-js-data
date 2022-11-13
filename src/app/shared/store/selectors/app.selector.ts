import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppState } from '../reducers/app.reducer';

export const appState = createFeatureSelector<AppState>('app');

export const getApp = createSelector(
    appState,
    state => state
);

export const isLoading = createSelector(
    appState,
    state => state.isLoading
);

export const getDefaultCountryCode = createSelector(
    appState,
    state => state.defaultCountry
);

export const getCountryCodes = createSelector(
    appState,
    state => state.countryCodes
);

export const getTerms = createSelector(
    appState,
    state => state.terms
);

export const getPrivacy = createSelector(
    appState,
    state => state.privacy
);

export const getHeader = createSelector(
    appState,
    (state, props) => state.headers && state.headers[props.type]
);

export const getSelectedHeader = createSelector(
    appState,
    state => state.selectedHeader
);

export const getRedirectUrl = createSelector(
    appState,
    state => state.redirectUrl
);

export const getMessage = createSelector(
    appState,
    ({ message, type }) => ({ message, type })
);
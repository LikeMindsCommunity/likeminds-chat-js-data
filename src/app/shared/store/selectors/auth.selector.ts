import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from '../reducers/auth.reducer';
import { CommunityState } from '../reducers/community.reducer';

export const authState = createFeatureSelector<AuthState>('auth');

export const communityState = createFeatureSelector<CommunityState>('community');

export const getAuthSelector = createSelector(
    authState,
    state => state
);

export const getUrlParamsSelector = createSelector(
    authState,
    state => state.urlParams
);

export const getCommunityIdSelector = createSelector(
    authState,
    state => state && { communityId: state.communityId }
);

export const getUserSelector = createSelector(
    authState,
    state => state && state.user
);

export const getCommunityDetailSelector = createSelector(
    communityState,
    ({ community }) => ({ community })
);

export const getOtpInfoSelector = createSelector(
    authState,
    state => state && state.otpInfo
);
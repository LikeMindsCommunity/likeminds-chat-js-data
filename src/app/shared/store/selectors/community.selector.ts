import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CommunityState } from '../reducers/community.reducer';

export const communityState = createFeatureSelector<CommunityState>('community');

export const getCommunityDetails = createSelector(
    communityState,
    state => state && state.community
);

export const getAdmins = createSelector(
    communityState,
    state => state && state.admins
);

export const getMembers = createSelector(
    communityState,
    state => state && state.members
);

export const getMemberState = createSelector(
    communityState,
    state => state && state.memberState
);

export const getIntroExamples = createSelector(
    communityState,
    state => state && state.introExamples
);

export const getChatrooms = createSelector(
    communityState,
    state => state.chatrooms
);
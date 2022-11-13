import { Action, createReducer, on } from '@ngrx/store';
import { CommunityActions } from '../actions';
import { IMemberState, IMember } from '../../models/member.model';
import { ICommunityQuestion } from '../../models/question.model';
import { ICommunity } from '../../models/community.model';
import { IntroExample } from '../../models/user.model';
import { IChatroom } from '../../models/chatroom.model';

export interface CommunityState {
    memberState: IMemberState,
    questions: ICommunityQuestion,
    admins: IMember[],
    members: IMember[],
    introExamples: IntroExample[],
    community: ICommunity | any,
    chatrooms: IChatroom[]
}

export const initialState: CommunityState = {
    memberState: undefined,
    questions: undefined,
    admins: undefined,
    members: undefined,
    introExamples: undefined,
    community: undefined,
    chatrooms: undefined
}

const communityReducer = createReducer(
    initialState,
    on(
        CommunityActions.GetCommunityDetailsSuccessAction,
        (state, { payload }) => ({ ...state, community: payload.community })),
    on(
        CommunityActions.GetMemberStateSuccessAction,
        (state, { payload }) => ({ ...state, memberState: payload })),
    on(
        CommunityActions.GetQuestionsSuccessAction,
        (state, { payload }) => ({ ...state, questions: payload })),
    on(
        CommunityActions.GetCommunityAdminListSuccessAction,
        (state, { payload }) => ({ ...state, admins: payload.members })),
    on(
        CommunityActions.GetAllMemberSuccessAction,
        (state, { payload }) => ({ ...state, ...payload })),
    on(
        CommunityActions.GetIntroExamplesSuccessAction,
        (state, { payload }) => ({ ...state, introExamples: payload })),
    on(
        CommunityActions.GetCommunityChatroomFeedSuccessAction,
        (state, { payload }) => ({ ...state, chatrooms: payload }))
);

export function reducer(state: CommunityState, action: Action) {
    return communityReducer(state, action);
}
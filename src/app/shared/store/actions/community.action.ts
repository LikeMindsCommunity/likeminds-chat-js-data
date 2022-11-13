import { createAction, props } from '@ngrx/store';

import {
    GET_MEMBER_STATE,
    GET_MEMBER_STATE_SUCCESS,
    GET_MEMBER_STATE_FAILURE,
    GET_QUESTIONS,
    GET_QUESTIONS_SUCCESS,
    GET_QUESTIONS_FAILURE,
    JOIN_COMMUNITY,
    JOIN_COMMUNITY_SUCCESS,
    JOIN_COMMUNITY_FAILURE,
    GET_COMMUNITY_ADMIN_LIST,
    GET_COMMUNITY_ADMIN_LIST_SUCCESS,
    GET_COMMUNITY_ADMIN_LIST_FAILURE,
    GET_ALL_MEMBERS,
    GET_ALL_MEMBERS_SUCCESS,
    GET_ALL_MEMBERS_FAILURE,
    GET_COMMUNITY_DETAILS,
    GET_COMMUNITY_DETAILS_SUCCESS,
    GET_COMMUNITY_DETAILS_FAILURE,
    SKIP_COMMUNITY,
    SKIP_COMMUNITY_SUCCESS,
    SKIP_COMMUNITY_FAILURE,
    GET_INTRO_EXAMPLES,
    GET_INTRO_EXAMPLES_SUCCESS,
    GET_INTRO_EXAMPLES_FAILURE,
    GET_COMMUNITY_CHAT_ROOM_FEED,
    GET_COMMUNITY_CHAT_ROOM_FEED_SUCCESS,
    GET_COMMUNITY_CHAT_ROOM_FEED_FAILURE
} from '../types/community.types';
import { IMemberState, IMembers } from '../../models/member.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ICommunityQuestion } from '../../models/question.model';
import { IntroExample } from '../../models/user.model';
import { IChatroom } from '../../models/chatroom.model';

/**
 * @var GetMemberStateAction
 * @description Action to get members state
 */
export const GetMemberStateAction = createAction(
    GET_MEMBER_STATE,
    props<{ payload: any }>()
);

/**
 * @var GetMemberStateSuccessAction
 * @description Action on success of members state response
 */
export const GetMemberStateSuccessAction = createAction(
    GET_MEMBER_STATE_SUCCESS,
    props<{ payload: IMemberState }>()
);

/**
 * @var GetMemberStateFailureAction
 * @description Action on failure of members state response
 */
export const GetMemberStateFailureAction = createAction(
    GET_MEMBER_STATE_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var GetQuestionsAction
 * @description Action to get list of questions of a community
 */
export const GetQuestionsAction = createAction(
    GET_QUESTIONS,
    props<{ payload: any }>()
);

/**
 * @var GetQuestionsSuccessAction
 * @description Action on success of question list response
 */
export const GetQuestionsSuccessAction = createAction(
    GET_QUESTIONS_SUCCESS,
    props<{ payload: ICommunityQuestion }>()
);

/**
 * @var GetQuestionsFailureAction
 * @description Action on failure of question list response
 */
export const GetQuestionsFailureAction = createAction(
    GET_QUESTIONS_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var JoinCommunityAction
 * @description Action to join community
 */
export const JoinCommunityAction = createAction(
    JOIN_COMMUNITY,
    props<{ payload: any }>()
);

/**
 * @var JoinCommunitySuccessAction
 * @description Action on join community success response
 */
export const JoinCommunitySuccessAction = createAction(
    JOIN_COMMUNITY_SUCCESS,
    props<{ payload: any }>()
);

/**
 * @var JoinCommunityFailureAction
 * @description Action on join community failure response
 */
export const JoinCommunityFailureAction = createAction(
    JOIN_COMMUNITY_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var SkipCommunityAction
 * @description Action to skip community
 */
export const SkipCommunityAction = createAction(
    SKIP_COMMUNITY,
    props<{ payload: any }>()
);

/**
 * @var SkipCommunitySuccessAction
 * @description Action on skip community success response
 */
export const SkipCommunitySuccessAction = createAction(
    SKIP_COMMUNITY_SUCCESS,
    props<{ payload: any }>()
);

/**
 * @var SkipCommunityFailureAction
 * @description Action on skip community failure response
 */
export const SkipCommunityFailureAction = createAction(
    SKIP_COMMUNITY_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var GetCommunityAdminListAction
 * @description Action to get admin member list
 */
export const GetCommunityAdminListAction = createAction(
    GET_COMMUNITY_ADMIN_LIST,
    props<{ payload: any }>()
);

/**
 * @var GetCommunityAdminListSuccessAction
 * @description Action on admin member list response success
 */
export const GetCommunityAdminListSuccessAction = createAction(
    GET_COMMUNITY_ADMIN_LIST_SUCCESS,
    props<{ payload: IMembers }>()
);

/**
 * @var GetCommunityAdminListFailureAction
 * @description Action on admin member list response failure
 */
export const GetCommunityAdminListFailureAction = createAction(
    GET_COMMUNITY_ADMIN_LIST_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var GetAllMemberAction
 * @description Action to get all members list
 */
export const GetAllMemberAction = createAction(
    GET_ALL_MEMBERS,
    props<{ payload: any }>()
);

/**
 * @var GetAllMemberSuccessAction
 * @description Action on get all members response success
 */
export const GetAllMemberSuccessAction = createAction(
    GET_ALL_MEMBERS_SUCCESS,
    props<{ payload: IMembers }>()
);

/**
 * @var GetAllMemberFailureAction
 * @description Action on get all members response failure
 */
export const GetAllMemberFailureAction = createAction(
    GET_ALL_MEMBERS_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var GetCommunityDetailsAction
 * @description Action to get community details
 */
export const GetCommunityDetailsAction = createAction(
    GET_COMMUNITY_DETAILS,
    props<{ payload: any }>()
);

/**
 * @var GetCommunityDetailsSuccessAction
 * @description Action on community detail response success
 */
export const GetCommunityDetailsSuccessAction = createAction(
    GET_COMMUNITY_DETAILS_SUCCESS,
    props<{ payload: IMembers }>()
);

/**
 * @var GetCommunityDetailsFailureAction
 * @description Action on community detail response failure
 */
export const GetCommunityDetailsFailureAction = createAction(
    GET_COMMUNITY_DETAILS_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var GetIntroExamplesAction
 * @description Action to get intro examples
 */
export const GetIntroExamplesAction = createAction(
    GET_INTRO_EXAMPLES
);

/**
 * @var GetIntroExamplesSuccessAction
 * @description Action on intro example response success
 */
export const GetIntroExamplesSuccessAction = createAction(
    GET_INTRO_EXAMPLES_SUCCESS,
    props<{ payload: IntroExample[] }>()
);

/**
 * @var GetIntroExamplesFailureAction
 * @description Action on intro example response failure
 */
export const GetIntroExamplesFailureAction = createAction(
    GET_INTRO_EXAMPLES_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);

/**
 * @var GetCommunityChatroomFeedAction
 * @description Action to get community chat room feed
 */
export const GetCommunityChatroomFeedAction = createAction(
    GET_COMMUNITY_CHAT_ROOM_FEED,
    props<{ payload: any }>()
);

/**
 * @var GetCommunityChatroomFeedSuccessAction
 * @description Action on community chat room feed response success
 */
export const GetCommunityChatroomFeedSuccessAction = createAction(
    GET_COMMUNITY_CHAT_ROOM_FEED_SUCCESS,
    props<{ payload: IChatroom[] }>()
);

/**
 * @var GetCommunityChatroomFeedFailureAction
 * @description Action on community chat room feed response failure
 */
export const GetCommunityChatroomFeedFailureAction = createAction(
    GET_COMMUNITY_CHAT_ROOM_FEED_FAILURE,
    props<{ payload: HttpErrorResponse | any }>()
);
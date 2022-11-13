import { createAction, props } from '@ngrx/store';

import {
    GET_CHATROOM_DETAIL,
    GET_CHATROOM_DETAIL_SUCCESS,
    GET_CHATROOM_DETAIL_FAILURE
} from '../types/chatroom.types';
import { IChatroom } from '../../models/chatroom.model';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * @var GetChatroomDetailAction
 * @description Action to get chatroom detail
 */
export const GetChatroomDetailAction = createAction(
    GET_CHATROOM_DETAIL,
    props<{ payload: string }>()
);

/**
 * @var GetChatroomDetailSuccessAction
 * @description Action to get chatroom detail success
 */
export const GetChatroomDetailSuccessAction = createAction(
    GET_CHATROOM_DETAIL_SUCCESS,
    props<{ payload: IChatroom }>()
);

/**
 * @var GetChatroomDetailFailureAction
 * @description Action to get chatroom detail failure
 */
export const GetChatroomDetailFailureAction = createAction(
    GET_CHATROOM_DETAIL_FAILURE,
    props<{ payload: HttpErrorResponse }>()
);
import { Action, createReducer, on } from '@ngrx/store';
import { ChatroomActions } from '../actions';
import { IChatroom } from '../../models/chatroom.model';

export interface ChatroomState {
    chatroom: IChatroom;
}

export const initialState: ChatroomState = {
    chatroom: undefined
}

const chatroomReducer = createReducer(
    initialState,
    on(
        ChatroomActions.GetChatroomDetailSuccessAction,
        (state, { payload }) => ({ ...state, chatroom: payload }))
);

export function reducer(state: ChatroomState, action: Action) {
    return chatroomReducer(state, action);
}
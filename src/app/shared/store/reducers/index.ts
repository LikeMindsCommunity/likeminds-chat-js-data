import { ActionReducerMap } from '@ngrx/store';

import * as appReducer from './app.reducer';
import * as authReducer from './auth.reducer';
import * as communityReducer from './community.reducer';
import * as chatroomReducer from './chatroom.reducer';

export interface State {
    app: appReducer.AppState;
    auth: authReducer.AuthState;
    community: communityReducer.CommunityState;
    chatroom: chatroomReducer.ChatroomState;
}

export const reducers: ActionReducerMap<State> = {
    app: appReducer.reducer,
    auth: authReducer.reducer,
    community: communityReducer.reducer,
    chatroom: chatroomReducer.reducer
};
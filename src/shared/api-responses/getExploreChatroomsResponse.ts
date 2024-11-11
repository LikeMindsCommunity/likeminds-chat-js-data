/* eslint-disable @typescript-eslint/no-explicit-any */

import { Chatroom } from '../interfaces/Chatroom';

export interface GetExploreChatrooms {
    chatrooms: Chatroom[];
    pinnedChatroomsCount: number;
    // widgets: {};
}

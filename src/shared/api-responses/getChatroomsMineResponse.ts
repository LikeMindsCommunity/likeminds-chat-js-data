import { Chatroom } from '../interfaces/Chatroom';
import { Community } from '../interfaces/Community';
import { Conversation } from '../interfaces/Conversation';

/**
 * The Interface for fetching homefeed
 *
 * @deprecated Use the new {@link SyncChatroomResponse} base class instead.
 */

export interface GetChatroomMineResponse {
    success: boolean;
    data: {
        myChatrooms: ChatroomsData[];
        totalChatroomCount: number;
        totalPages: number;
        totalUnseenCount: number;
        unseenChatroomCount: number;
    };
}

/**
 * The Interface for current Chatrooms data
 *
 * @deprecated
 */

export interface ChatroomsData {
    chatroom: Chatroom;
    community: Community;
    customTag: string;
    isDraft: boolean;
    lastConversation: Conversation;
    lastConversationTime: string;
    memberRightStates: number[];
    memberState: number;
    secondLastConversation: Conversation;
    unseenConversationCount: number;
}

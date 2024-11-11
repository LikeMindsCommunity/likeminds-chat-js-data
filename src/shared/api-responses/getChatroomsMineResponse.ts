import { Chatroom } from '../interfaces/Chatroom';
import { Community } from '../interfaces/Community';
import { Conversation } from '../interfaces/Conversation';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GetChatroomMineResponse {
    success: boolean;
    data: {
        myChatrooms: ChatroomsData[];
        totalChatroomCount: number;
        totalPages: number;
        totalUnseenCount: number;
        unseenChatroomCount: number;
        //   widgets: Record<string, never>; // Assuming widgets is an empty object
    };
}

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

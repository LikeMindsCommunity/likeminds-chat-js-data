import { Chatroom } from '../interfaces/Chatroom';

export interface GetExploreFeedResponse {
    chatrooms: Chatroom[];
    pinnedChatroomsCount: number;
}

import { Chatroom } from '../interfaces/Chatroom';
import { ChatroomAction } from '../interfaces/ChatroomActions';
import { Community } from '../interfaces/Community';

export interface GetChatroomResponse {
    canAccessSecretChatroom: boolean | undefined;
    chatroom: Chatroom;
    chatroomActions: ChatroomAction[];
    community: Community;
    lastConversationId: number;
    participantCount: number;
    unreadMessages: number;
}

import { Chatroom } from '../interfaces/Chatroom';
import { ChatroomActions } from '../interfaces/ChatroomActions';
import { Community } from '../interfaces/Community';

export interface GetChatroom {
    canAccessSecretChatroom: boolean | undefined;
    chatroom: Chatroom;
    chatroomActions: ChatroomActions[];
    community: Community;
    lastConversationId: number;
    participantCount: number;
    unreadMessages: number;
    // widgets: any;
}

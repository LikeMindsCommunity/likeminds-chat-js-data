import { Conversation } from "src/shared/interfaces/Conversation";

export interface SubscribeChatroomResponse {
    conversation: Conversation;
    id: number;
    totalParticipantsCount: number;
    widgets: Record<string, any>;
}
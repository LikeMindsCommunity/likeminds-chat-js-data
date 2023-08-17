import { Chatroom } from 'src/shared/responseModels/Chatroom';

export interface CreateDMChatroomResponse {
    chatroom: Chatroom;
    chatroomLocal: Chatroom;
}

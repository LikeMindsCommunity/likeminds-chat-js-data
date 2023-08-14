import { ChatroomResponse } from 'src/shared/responseModels/Chatroom';

export interface CreateDMChatroomResponse {
    chatroom: ChatroomResponse;
    chatroomLocal: ChatroomResponse;
}

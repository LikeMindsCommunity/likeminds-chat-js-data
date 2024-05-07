// import { Chatroom } from 'src/shared/responseModels/Chatroom';
import { Chatroom } from '../../../shared/responseModels/Chatroom';

export interface CreateDMChatroomResponse {
    chatroom: Chatroom;
    chatroomLocal: Chatroom;
}

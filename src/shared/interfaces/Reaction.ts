import { Member } from './Member';

export interface Reaction {
    member?: Member;
    reaction: string;
    chatroomId: string;
    userId: string;
    id: string;
    conversationId: string;
}

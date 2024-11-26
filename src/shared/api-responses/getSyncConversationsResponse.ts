import { Attachment } from '../interfaces/Attachment';
import { Chatroom } from '../interfaces/Chatroom';
import { Community } from '../interfaces/Community';
import { Conversation } from '../interfaces/Conversation';
import { Member } from '../interfaces/Member';
import { Poll } from '../interfaces/Poll';
import { Reaction } from '../interfaces/Reaction';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GetConversation {
    chatroomMeta: Record<string, Chatroom>;
    chatroomReactionsMeta: Reaction[];
    communityMeta: Community;
    convAttachmentsMeta: Record<string, Attachment[]>;
    convPollsMeta: Record<string, Poll[]>;
    convReactionsMeta: Record<string, Reaction[]>;
    conversationsData: Conversation[];
    userMeta: Record<string, Member>;
    conversationMeta: Record<number | string, Conversation>;
    widgets: Record<string, any>;
}

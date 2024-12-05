/* eslint-disable @typescript-eslint/no-explicit-any */

import { AttachmentMeta } from '../interfaces/Attachment';
import { Chatroom } from '../interfaces/Chatroom';
import { Community } from '../interfaces/Community';
import { Conversation } from '../interfaces/Conversation';
import { Member } from '../interfaces/Member';
import { Widget } from '../interfaces/Widgets';

export interface SyncChatroomResponse {
    cardAttachmentsMeta: Record<string, AttachmentMeta[]>;
    chatroomsData: Chatroom[];
    communityMeta: Record<string, Community>;
    convAttachmentsMeta: Record<string, AttachmentMeta[]>;
    conversationMeta: Record<string, Conversation>;
    userMeta: Record<string, Member>;
    widgets: Record<string, Widget>;
}

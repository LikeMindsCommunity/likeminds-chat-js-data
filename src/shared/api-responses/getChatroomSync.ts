/* eslint-disable @typescript-eslint/no-explicit-any */

import { AttachmentMeta } from '../interfaces/Attachment';
import { Chatroom } from '../interfaces/Chatroom';
import { Community } from '../interfaces/Community';
import { Conversation } from '../interfaces/Conversation';
import { Member } from '../interfaces/Member';

export interface GetHomeFeed {
    cardAttachmentsMeta: Record<string, never>;
    chatroomsData: Chatroom[];
    communityMeta: Record<string, Community>;
    convAttachmentsMeta: Record<string, AttachmentMeta[]>;
    convPollsMeta: Record<string, never>;
    conversationMeta: Record<string, Conversation>;
    syncMeta: Record<string, never>;
    userMeta: Record<string, Member>;
    widgets: Record<string, never>;
}

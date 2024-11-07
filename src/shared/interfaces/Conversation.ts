import { Attachment } from './Attachment';
import { Member } from './Member';

// LinkOGTags Interface
export interface LinkOGTags {
    title?: string;
    image?: string;
    description?: string;
    url?: string;
}

// Poll Interface
export interface Poll {
    id: string;
    text: string;
    isSelected?: boolean;
    percentage?: number;
    subText?: string;
    noVotes?: number;
    member?: Member;
    userId?: string;
}

// Reaction Interface
export interface Reaction {
    member?: Member;
    reaction: string;
}

// Conversation Interface
export interface Conversation {
    id?: string;
    chatroomId?: string;
    communityId: string;
    member: Member;
    answer: string;
    createdAt?: string;
    state: number;
    attachments?: Attachment[];
    lastSeen: boolean;
    ogTags?: LinkOGTags;
    date?: string;
    isEdited: boolean;
    memberId?: string;
    replyConversation?: string;
    replyConversationId?: string;
    lastUpdatedAt: number;
    replyConversationObject?: Conversation;
    deletedBy: string;
    createdEpoch: number;
    attachmentCount?: number;
    attachmentUploaded: boolean;
    uploadWorkerUUID?: string;
    temporaryId?: string;
    localCreatedEpoch?: number;
    reactions?: Reaction[];
    isAnonymous: boolean;
    allowAddOption?: boolean;
    pollType?: number;
    pollTypeText?: string;
    submitTypeText?: string;
    expiryTime?: number;
    multipleSelectNo?: number;
    multipleSelectState?: number;
    polls?: Poll[];
    toShowResults?: boolean;
    pollAnswerText?: string;
    replyChatroomId?: string;
    replyId?: string;
    deviceId?: string;
    hasFiles: boolean;
    hasReactions: boolean;
    lastUpdated?: number;
    deletedByMember?: Member;
    deletedByUserId?: string;
    userId?: string;
    cardId?: string;
    isInProgress?: string;
}

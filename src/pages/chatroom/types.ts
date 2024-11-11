import { Attachment } from '../../shared/interfaces/Attachment';

export declare type GetChatroomRequest = {
    chatroomId: any;
    page?: number;
    apiType?: number;
};

export declare type FollowChatroomRequest = {
    collabcardId: number;
    memberId: number;
    value: boolean;
};

export declare type FollowChatroomWithUuidRequest = {
    collabcardId: number;
    uuid: number | string;
    value: boolean;
};

export declare type MuteChatroomRequest = {
    chatroomId: number;
    value: boolean;
};

export declare type MarkReadRequest = {
    chatroomId: number;
};

export declare type ShareChatroomRequest = {
    chatroomId: number;
    domain: string;
};

export declare type SetChatroomRequest = {
    chatroomId: number;
    conversationId: number;
};

export declare type GetTaggingListRequest = {
    page: number;
    pageSize: number;
    searchName: string;
    chatroomId?: number;
    feedroomId?: number;
    isSecret?: boolean;
};

// Depriciated type
export declare type Conversation = {
    chatroomID: number;
    conversationID?: number;
    scrollDirection?: number;
    paginateBy: any;
    topNavigate: any;
    temporaryID?: any;
    include: boolean;
};
export declare type GetConversationsRequest = {
    page: number;
    pageSize: number;
    chatroomId: number;
    maxTimestamp: number;
    minTimestamp: number;
    isLocalDb: boolean;
    conversationId?: number;
    excludedConversationStates?: [];
};

export declare type PostConversationRequest = {
    chatroomId: number;
    temporaryId?: number | string;
    text: string;
    hasFiles: boolean;
    repliedConversationId?: number | string;
    shareLink?: string;
    ogTags?: any;
    metadata?: Record<string, any> | string | null;
    attachments?: Attachment[];
    triggerBot?: boolean;
};
export declare type EditConversationRequest = {
    conversationId: number | string;
    text: string;
    shareLink?: string;
    ogTags?: any;
};

export declare type DeleteConversationRequest = {
    conversationIds: any;
    reason: any;
};

export declare type PutReactionRequest = {
    chatroomId?: number;
    conversationId: number;
    reaction: any;
};

export declare type DeleteReactionRequest = {
    chatroomId: number;
    conversationId: number;
    reaction: any;
};

export declare type Media = {
    messageId: number;
    chatroomId: number;
    file: any;
    index?: number;
};

export declare type PutMultimedia = {
    conversationId: number;
    url: string;
    type: string;
    filesCount: number;
    index: number | string;
    height?: any;
    width?: any;
    meta?: any;
    name?: string;
    thumbnailUrl?: string;
};

export declare type GetDecodeUrlRequest = {
    url: string;
};

export declare type PostPollConversationRequest = {
    chatroomId: number;
    state: number;
    repliedConversationId: number;
    polls: { text: string }[];
    pollType: number;
    multipleSelectState: number;
    multipleSelectNo: number;
    isAnonymous: boolean;
    allowAddOption: boolean;
    expiryTime: number;
};
// EditConversation ?????????

export declare type CHTYPE = {
    chatroom_id: number;
};

export declare type ConversationCreateData = {
    chatroom_id: any;
    created_at: Date;
    has_files: boolean;
    text: any;
    attachment_count?: any;
    replied_conversation_id?: string | number;
};

export declare type Action = {
    chatroom_id: string | number;
    conversation_id: string | number;
    reaction: any;
};

export declare type CmetaType = {
    chatroomId?: number;
    conversationId: number;
};

export declare type TaggingListOld = {
    chatroom_id: string | number;
};

export declare type GetReportTagsRequest = {
    type: number;
};

export declare type PushReportRequest = {
    tagId: number;
    reason?: string;
    conversationId?: number;
    reportedMemberId?: number;
};

export declare type LeaveCR = {
    collabcard_id: number;
    member_id: number;
    value: boolean;
};
export declare type LeaveSC = {
    chatroom_id: number;
    member_id: number;
};

export declare type LeaveSecretChatroomRequest = {
    chatroomId: number;
    isSecret: boolean;
};

export declare type Profile = {
    community_id: number;
    member_id: number;
};

export declare type GetParticipantsRequest = {
    chatroomID: number;
    isSecret: boolean;
    page?: number;
    pageSize?: number;
    searchKey?: string;
};

export declare type ViewParticipantsRequest = {
    chatroomId: number;
    isSecret: boolean;
    page?: number;
    pageSize?: number;
    participantName?: string;
};

export declare type CRSeen = {
    collabcardId: number;
    memberId: number;
    collabcardType: any;
};

export declare type ChatroomSeen = {
    collabcardId: number;
    memberId: number;
    collabcardType: any;
};

export declare type ChatroomSeenWithUuid = {
    collabcardId: number;
    uuid: number | string;
    collabcardType: any;
};

export declare type DMSG = {
    conversation_ids: any;
    reason?: string;
};

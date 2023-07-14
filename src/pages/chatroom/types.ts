export declare type Chatroom = {
    chatroomId: any;
    page?: number;
    apiType?: number;
};

export declare type FollowChatroom = {
    collabcardId: number;
    memberId: number;
    value: boolean;
};

export declare type MuteChatroom = {
    chatroomId: number;
    value: boolean;
};

export declare type MarkRead = {
    chatroomId: number;
};

export declare type ShareChatroom = {
    chatroomId: number;
    domain: string;
};

export declare type SetChatroom = {
    chatroomId: number;
    conversationId: number;
};

export declare type TaggingList = {
    page: number;
    pageSize: number;
    searchName: string;
    chatroomId?: number;
    feedroomId?: number;
    isSecret?: boolean;
};

export declare type Conversation = {
    chatroomID: number;
    conversationID?: number;
    scrollDirection?: number;
    paginateBy: any;
    topNavigate: any;
    temporaryID?: any;
    include: boolean;
};

export declare type PostConversation = {
    chatroomId: number;
    temporaryId?: number | string;
    text: string;
    hasFiles: boolean;
    attachmentCount?: number;
    repliedConversationId?: number | string;
    shareLink?: string;
    ogTags?: any;
};
export declare type EditConversation = {
    conversationId: number | string;
    text: string;
    shareLink?: string;
    ogTags?: any;
};

export declare type DeleteConversation = {
    conversationIds: any;
    reason: any;
};

export declare type PutReaction = {
    chatroomId?: number;
    conversationId: number;
    reaction: any;
};

export declare type DeleteReaction = {
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

export declare type DecodeUrl = {
    url: string;
};

export declare type PostPollConversation = {
    chatroomId: number;
    state: number;
    repliedConversationId: number;
    polls: any;
    pollType: any;
    multipleSelectState: any;
    multipleSelectNo: any;
    isAnonymous: any;
    allowAddOption: any;
    expiryTime: any;
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

export declare type GetReportTags = {
    type: number;
};

export declare type PushReport = {
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

export declare type LeaveSecretChatroom = {
    chatroomId: number;
    isSecret: boolean;
};

export declare type Profile = {
    community_id: number;
    member_id: number;
};

export declare type ParticipantsType = {
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

export declare type DMSG = {
    conversation_ids: any;
    reason?: string;
};

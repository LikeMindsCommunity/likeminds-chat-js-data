export declare type Chatroom = {
    chatroomId: any;
    page?: number;
    api_type?: number;
};

export declare type FollowChatroom = {
    collabcard_id: number;
    member_id: number;
    value: boolean;
};

export declare type MuteChatroom = {
    chatroom_id: number;
    value: boolean;
};

export declare type MarkRead = {
    chatroom_id: number;
};

export declare type ShareChatroom = {
    chatroomId: number;
    domain: string;
};

export declare type SetChatroom = {
    chatroom_id: number;
    conversation_id: number;
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
};

export declare type PostConversation = {
    chatroom_id: number;
    temporary_id?: number;
    text: string;
    has_files: boolean;
    attachment_count?: number;
    replied_conversation_id?: number;
    share_link?: string;
    og_tags?: any;
};
export declare type EditConversation = {
    conversation_id: number;
    text: string;
    share_link?: string;
    og_tags?: any;
};

export declare type DeleteConversation = {
    conversation_ids: any;
    reason: any;
};

export declare type PutReaction = {
    chatroom_id: number;
    conversation_id: number;
    reaction: any;
};

export declare type DeleteReaction = {
    chatroom_id: number;
    conversation_id: number;
    reaction: any;
};

export declare type Media = {
    messageId: number;
    chatroomId: number;
    file: any;
    index?: number;
};

export declare type PutMultimedia = {
    conversation_id: number;
    url: string;
    type: string;
    files_count: number;
    index: number | string;
    height?: any;
    width?: any;
    meta?: any;
    name?: string;
    thumbnail_url?: string;
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

export declare type CMETATYPE = {
    chatroom_id?: number;
    conversation_id: number;
};

export declare type TaggingListOld = {
    chatroom_id: string | number;
};

export declare type GetReportTags = {
    type: number;
};

export declare type PushReport = {
    conversation_id: number;
    tag_id: number;
    reason?: string;
    reported_Member_id: number;
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
    chatroom_id: number;
    member_id: number;
};

export declare type Profile = {
    community_id: number;
    member_id: number;
};

export declare type ParticipantsType = {
    chatroom_id: number;
    is_secret: boolean;
    page?: number;
    page_size?: number;
};

export declare type CRSeen = {
    collabcard_id: number;
    community_id: number;
    member_id: number;
    collabcard_type: any;
};

export declare type DMSG = {
    conversation_ids: any;
    reason?: string;
};

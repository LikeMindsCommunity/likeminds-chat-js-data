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

export declare type conversation = {
    chatroomID: string | number;
    page: number;
    scroll_direction?: number;
    conversation_id?: number;
};

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

export declare type TAG = {
    type: number;
};

export declare type PushReportType = {
    conversation_id: number;
    tag_id: number;
    reason?: string;
};

export declare type Upload = {
    conversation_id: number;
    files_count: number;
    index: number | string;
    meta?: any;
    name: string;
    thumbnail_url?: string;
    type: string;
    url: string;
};

export declare type Media = {
    messageId: number;
    chatroomId: number;
    file: any;
    index?: number;
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

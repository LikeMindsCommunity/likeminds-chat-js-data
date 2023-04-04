export declare type CHATROOMTYPE = {
    chatroom_id: any;
    page?: number;
    api_type?: number;
};
export declare type ChatroomType = {
    chatroom_id: number;
    page?: number;
};

export declare type CHTYPE = {
    chatroom_id: number;
};

export declare type ConversationData = {
    chatroomID: string | number;
    page: number;
    scroll_direction?: number;
    conversation_id?: number;
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

export declare type MUTE = {
    chatroom_id: number;
    value: boolean;
};

export declare type CMETATYPE = {
    chatroom_id?: number;
    conversation_id: number;
};

export declare type TaggingListOld = {
    chatroom_id: string | number;
};

export declare type TaggingList = {
    page: number;
    pageSize: number;
    searchName: string;
    chatroomId?: number;
    feedroomId?: number;
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

export declare type Read = {
    chatroom_id: any;
};

export declare type FeedData = {
    community_id: number;
    order_type: number;
    page: number;
};

export declare type FollowCRType = {
    collabcard_id: number;
    member_id: number;
    value: boolean;
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

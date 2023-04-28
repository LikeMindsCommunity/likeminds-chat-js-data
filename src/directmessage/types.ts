export declare type FetchDMFeed = {
    page: number;
};

export declare type CheckDMStatus = {
    requestFrom: any;
};

export declare type GetAllMembers = {
    chatroomId?: number;
    memberState?: any;
    page: number;
};

export declare type CheckDMLimit = {
    memberId: number;
};

export declare type CreateDMChatroom = {
    member_id: number;
};

export declare type SendDMRequest = {
    chatroom_id: number;
    chat_request_state: number;
    text?: string;
};

export declare type BlockMember = {
    chatroom_id: number;
    status: number;
};

// *****************************

export declare type CID = {
    community_id: number;
};

export declare type DMTYPE = {
    community_id: number;
};

export declare type CANDM = {
    community_id: number;
    req_from: string;
    member_id?: number;
    chatroom_id?: number;
};

export declare type FetchDMFeed = {
    page: number;
};

export declare type CheckDMStatus = {
    requestFrom: any;
};

export declare type CheckDMLimit = {
    memberId: number;
};

export declare type CreateDMChatroom = {
    memberId: number;
};

export declare type SendDMRequest = {
    chatroomId: number;
    chatRequestState: number;
    text?: string;
};

export declare type BlockMember = {
    chatroomId: number;
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
    reqFrom: string;
    memberId?: number;
    chatroomId?: number;
};

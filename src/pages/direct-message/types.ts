export declare type FetchDMFeedRequest = {
    page: number;
    pageSize: number;
    chatroomTypes: number[];
    maxTimestamp: number;
    minTimestamp: number;
};

export declare type CheckDMStatus = {
    requestFrom: any;
    uuid?: string;
};

export declare type CheckDMLimit = {
    memberId: number;
};

export declare type CheckDMLimitWithUuid = {
    uuid: string | number;
};

export declare type CreateDMChatroom = {
    memberId: number;
};

export declare type CreateDMChatroomWithUuid = {
    uuid: number | string;
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

export declare type CANDMWithUuid = {
    reqFrom: string;
    uuid?: number | string;
    chatroomId?: number;
};

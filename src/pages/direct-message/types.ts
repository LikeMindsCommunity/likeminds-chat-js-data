export declare type FetchDMFeedRequest = {
    page: number;
    pageSize: number;
    chatroomTypes: number[];
    maxTimestamp: number;
    minTimestamp: number;
};

export declare type CheckDMStatusRequest = {
    requestFrom: string;
    uuid?: string;
};

export declare type CheckDMLimitRequest = {
    memberId: number;
};

export declare type CheckDMLimitWithUuidRequest = {
    uuid: string | number;
};

export declare type CreateDMChatroomRequest = {
    memberId: number;
};

export declare type CreateDMChatroomWithUuidRequest = {
    uuid: number | string;
};

export declare type SendDMRequest = {
    chatroomId: number;
    chatRequestState: number;
    text?: string;
};

export declare type BlockMemberRequest = {
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

export declare type CID = {
    community_id: number;
};

export declare type DMTYPE = {
    community_id: number;
};

export declare type DMCTYPE = {
    community_id: number;
    page: number;
};

export declare type REQDMTYPE = {
    community_id: number;
    member_id: number;
};
export declare type CANDM = {
    community_id: number;
    req_from: string;
    member_id?: number;
    chatroom_id?: number;
};

export declare type CREATDMTYPE = {
    community_id: number;
    member_id: number;
};

export declare type REQDM = {
    chatroom_id: number;
    chat_request_state: number;
    text?: string;
};

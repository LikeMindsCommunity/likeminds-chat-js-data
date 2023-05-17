export declare type HomeFeed = {
    page: number;
};

export declare type CRid = {
    chatroom_id: number;
};

export declare type INVITE = {
    channel_type: number;
    page: number;
    page_size: number;
};

export declare type IAType = {
    channel_id: number | string;
    invite_status: number;
};

export declare type Device = {
    token: string;
};

export declare type Participant = {
    chatroom_id: number;
    is_secret: boolean;
    chatroom_participants: any;
};

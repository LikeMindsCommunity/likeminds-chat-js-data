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

export declare type IaType = {
    channelId: number | string;
    inviteStatus: number;
};

export declare type Device = {
    token: string;
};

export declare type Participant = {
    chatroomId: number;
    isSecret: boolean;
    chatroomParticipants: any;
};

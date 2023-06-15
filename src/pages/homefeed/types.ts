export declare type HomeFeed = {
    page: number;
};

export declare type CRid = {
    chatroomId: number;
};

export declare type INVITE = {
    channelType: number;
    page: number;
    pageSize: number;
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

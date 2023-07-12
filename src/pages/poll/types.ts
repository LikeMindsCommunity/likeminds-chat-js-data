export declare type PostPollConversationRequest = {
    chatroomId: number;
    temporaryId?: number;
    state: number;
    repliedConversationId?: number;
    polls?: any;
    pollType?: any;
    multipleSelectState?: any;
    multipleSelectNo?: any;
    isAnonymous?: any;
    allowAddOption?: any;
    expiryTime?: any;
};

export declare type GetPollUsersRequest = {
    pollId: number;
    conversationId?: number;
};

export declare type AddPollOptionRequest = {
    poll: any;
    conversationId?: number;
};

export declare type SubmitPollRequest = {
    polls: any;
    conversationId?: number;
};

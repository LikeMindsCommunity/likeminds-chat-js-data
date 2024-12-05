export declare type SearchType = {
    followStatus: boolean;
    page: number;
    pageSize: number;
    search: string;
    searchType: string;
};

export declare type SearchConversation = {
    chatroomId: number | string;
    search: string;
    followStatus: boolean;
    page?: number;
    pageSize?: number;
};

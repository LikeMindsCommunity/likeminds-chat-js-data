export declare type InitUser = {
    isGuest: boolean;
    userUniqueId: string;
    userName?: string;
    apiKey: string;
    tokenExpiryBeta?: number;
    rtmTokenExpiryBeta?: number;
};

export declare type ValidateUser = {
    accessToken: string;
    refreshToken: string;
    tokenExpiryBeta?: number;
    rtmTokenExpiryBeta?: number;
};

export declare type InitUserWithUuid = {
    imageUrl?: string;
    isGuest: boolean;
    uuid: string;
    userName?: string;
    apiKey: string;
    tokenExpiryBeta?: number;
    rtmTokenExpiryBeta?: number;
};

export declare type GetProfile = {
    userId: number;
};
export declare type GetMemberChatroom = {
    userId: number;
    state: number;
    page: number;
};

export declare type EditProfile = {
    userUniqueId: string;
    userName: string;
    imageUrl: string;
    name?: string;
};

export declare type GetAllMembers = {
    chatroomId?: number;
    memberState?: number;
    page: number;
};
export declare type Logout = {
    refreshToken: string;
};

export declare type LeaveCommunity = {
    uuids: string[];
};

export declare type MemberState = {
    memberId: string;
};

export declare type USERTYPE = {
    community_id: number;
    page: number;
    chatroom_id?: number;
    member_state?: number;
};
export declare type PROFILE = {
    user_id: number;
};

export declare type Members = {
    page: number;
};

export declare type Search = {
    search: string;
    searchType: string;
    page: number;
    pageSize: number;
    memberStates?: string[] | string;
};

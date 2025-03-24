export declare type InitiateUserRequest = {
    isGuest: boolean;
    userUniqueId: string;
    userName?: string;
    apiKey: string;
    deviceId?: string;
    tokenExpiryBeta?: number;
    rtmTokenExpiryBeta?: number;
};

export declare type ValidateUserRequest = {
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
    deviceId?: string;
    tokenExpiryBeta?: number;
    rtmTokenExpiryBeta?: number;
};

export declare type GetProfileRequest = {
    userId: number;
};
export declare type GetMemberChatroomRequest = {
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

export declare type GetAllMembersRequest = {
    chatroomId?: number;
    memberState?: number;
    page: number;
};
export declare type LogoutRequest = {
    deviceId?: string
};

export declare type LeaveCommunityRequest = {
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

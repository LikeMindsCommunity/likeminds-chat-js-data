export declare type InitUser = {
    isGuest: boolean;
    userUniqueId: string;
    userName?: string;
};

export declare type GetProfile = {
    userId: any;
};
export declare type GetMemberChatroom = {
    userId: any;
    state: any;
    page: number;
};

export declare type EditProfile = {
    userUniqueId: string;
    userName: string;
    imageUrl: string;
};

export declare type GetAllMembers = {
    chatroomId?: number;
    memberState?: any;
    page: number;
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
    search_type: string;
    page: number;
    page_size: number;
};

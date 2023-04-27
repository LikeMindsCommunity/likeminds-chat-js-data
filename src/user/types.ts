export declare type InitUser = {
    is_guest: boolean;
    user_unique_id: string;
    user_name: string;
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

export interface IMembers {
    members: IMember[];
    community: object;
}

export interface IMember {
    id: number;
    name: string;
    image_url: string;
    state: number;
    route: string | null;
    member_since: string | null;
    attending_status: boolean;
    custom_title?: string;
    show?: boolean;
    isLastTile?: boolean;
    is_owner?: boolean;
    community_id?: number;
    custom_intro_text?: string;
    custom_click_text?: string;
    question_answers?: any;
}

export interface Member {
    id: number;
    image: string;
    name: string;
    emails: string[];
    mobiles: string[];
    membership_state: string;
    state: number;
    valid_till: string;
    not_joined_yet: boolean;
    txn_details: any;
}

export interface IMemberProfile {
    id: number;
    name: string;
    image_url: string;
    state: number;
    question_answers: any[];
    member_since: string;
    community_id: number;
    community_name: string;
    is_owner: boolean;
    custom_title?: string;
    custom_intro_text?: string;
}

export interface IMemberState {
    state: number;
    tool_state: number;
    edit_required: boolean;
    created_at: string;
    community_toast: string | null;
    community_levels: ICommunityLevel | null;
    member: any;
    member_rights?: IMemberRight[];
    manager_rights?: IMemberRight[];
}

export interface IMemberRight {
    id: number;
    is_locked: boolean;
    is_selected: boolean;
    state: number;
    title: string;
}

export interface ICommunityLevel {
    header: string;
    header_image: string;
    sub_header: string;
    levels: any[];
}

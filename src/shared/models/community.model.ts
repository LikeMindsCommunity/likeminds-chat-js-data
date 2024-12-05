/**
 * @interface ICommunity
 * @description This interface is to define community object
 */
export interface ICommunity {
    about: string;
    date: string;
    id: number;
    image_url: string;
    image_url_round: string;
    is_member: string | number;
    location: string;
    managed_by: string;
    members_count: number;
    min_referrer_member: number;
    name: string;
    purpose: string;
    share_text_admin: string;
    share_text_anonymous: string;
    share_text_member: string;
    share_url: string;
    state: number;
    is_paid: boolean;
    website_url?: string;
}

export class MyCommunity {
    actions: any[];
    click_state: number;
    collabcard_unseen: number;
    id: number;
    image_url: string;
    member_right_states: number[];
    member_state: number;
    members_count: number;
    name: string;
    new_chatroom_users: any[];
    purpose: string;
    sub_type: number;
    type: number;
}

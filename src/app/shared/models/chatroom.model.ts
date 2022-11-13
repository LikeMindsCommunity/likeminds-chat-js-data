import { MyCommunity } from './community.model';
import { IMember } from './member.model';

export interface IChatroom {
    chat_requested_by: any;
    chat_request_state: any;
    is_private_member: boolean;
    id: number;
    title: string;
    community_id: number;
    answer_text: string;
    share_link: string;
    image_count: number;
    pdf_count: number;
    type: number;
    date_time: any;
    duration: number;
    answers_count: number;
    attending_count: number;
    attending_status: boolean;
    polls_count: number;
    card_creation_time: number | string;
    community_name: string;
    date: string;
    created_at: string;
    image_url_round: string;
    header: string;
    share_url: string;
    creator_share_url: string;
    link_created_at: string | number;
    chatroom_category: string;
    state: number;
    mute_status: string;
    online_link: string;
    follow_status: boolean;
    is_guest: boolean;
    is_deleted: boolean;
    deleted_by: any; // Type to be changed later
    images: any;
    pdf: any;
    member: IMember;
    end_date?: any;
    start_date?: any;
    location?: string;
    location_lat?: string;
    location_long?: string;
    about?: string;
    co_hosts?: any[];
    poll_type?: number;
    poll_type_text?: string;
    polls?: IPoll[];
    is_anonymous?: boolean;
    multiple_select_no?: number;
    multiple_select_state?: number;
    allow_add_option?: boolean;
    is_pending?: boolean;
    is_paid?: boolean;
    expiry_time?: number;
    active?: boolean;
    attachment_count?: number;
    attachments?: any[];
    attachments_uploaded?: boolean;
    audio_count?: number;
    audios?: any[];
    date_epoch?: number;
    has_been_named?: boolean;
    is_tagged?: boolean;
    member_id?: number;
    video_count?: number;
    videos?: any;
    event_payment_link?: any;
    about_recording?: string;
    recordings_attachments?: any[];
    recordings_attachments_view?: number;
    recording_url_og_tags?: any;
    member_can_message?: any;
    is_secret?: any;
    access_without_subscription? : boolean;
    chatroom_with_user?: any
}

export class IChatrooms {
    chatrooms: IChatroom[];
    total_chatrooms_created?: number;
    total_chatrooms_followed?: number;
}

export class ConversationModel {
    chatroom_id: number;
    text: string;
    has_files: boolean;
    created_at?: number;
    aj?: string | number;
    source_id?: string;
    replied_conversation_id?: string;
    attachment_count?: number;

    constructor(
        chatroom_id: number,
        text: string,
        has_files: boolean,
        created_at: number,
        aj: string | number,
        source_id: string,
        replied_conversation_id: string,
        attachment_count: number
    ) {
        this.chatroom_id = chatroom_id;
        this.text = text;
        this.has_files = has_files;
        this.created_at = created_at;
        this.aj = aj;
        this.source_id = source_id;
        this.replied_conversation_id = replied_conversation_id;
        this.attachment_count = attachment_count;
    }
}

export interface IPoll {
    id: number;
    is_selected: boolean;
    member: IMember;
    no_votes: number;
    percentage: number;
    poll_count: number;
    text: string;
}

export interface IMessage {
    answer: string;
    answer_text?: string;
    attachment_count?: number;
    attachments_uploaded?: boolean;
    created_epoch?: any;
    has_files?: boolean;
    deleted_by?: number;
    answer_bubble: string;
    chatroom_id: number;
    community_id: number;
    created_at: string;
    date: string;
    id: number;
    images: Array<any>;
    is_edited: false;
    member: IMember;
    member_id: number;
    pdf: Array<any>;
    state: number;
    polls_count?: number;
    poll_type?: number;
    poll_type_text?: string;
    polls?: IPoll[];
    poll_is_answered?: boolean;
    is_anonymous?: boolean;
    multiple_select_no?: number;
    multiple_select_state?: number;
    allow_add_option: boolean;
    is_pending?: boolean;
    expiry_time?: number;
    text?: string;
    poll_answer_text?: string;
    to_show_results?: boolean;
}

export interface MyChatroom {
    chatroom: IChatroom;
    community: MyCommunity;
    conversation_users: IMember[];
    is_draft: boolean;
    last_conversation: IMessage;
    last_conversation_time: any;
    member_right_states: number[];
    member_state: number;
    unseen_conversation_count: number;
}

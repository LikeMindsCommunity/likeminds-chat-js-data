/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GetChatroomMineResponse {
  success: boolean;
  data: {
    my_chatrooms: ChatroomsData[];
    total_chatroom_count: number;
    total_pages: number;
    total_unseen_count: number;
    unseen_chatroom_count: number;
    //   widgets: Record<string, never>; // Assuming widgets is an empty object
  };
}

export interface ChatroomsData {
  chatroom: Chatroom;
  community: Community;
  conversation_users: ConversationUser[];
  custom_tag: string;
  is_draft: boolean;
  last_conversation: Conversation;
  last_conversation_time: string;
  member_right_states: number[];
  member_state: number;
  second_last_conversation: Conversation;
  unseen_conversation_count: number;
}

export interface Chatroom {
  access: null;
  answer_text: string;
  answers_count: number;
  attachment_count: number;
  attachments: Attachment[];
  attachments_uploaded: boolean;
  attending_count: number;
  attending_status: boolean;
  audio_count: number;
  audios: any[];
  auto_follow_done: boolean;
  card_creation_time: string;
  chatroom_image_url?: string;
  community_id: number;
  community_name: string;
  created_at: string;
  custom_tag: string;
  date: string;
  date_epoch: number;
  date_time: number;
  duration: number;
  follow_status: boolean;
  has_event_recording: boolean;
  header: string;
  id: number;
  image_count: number;
  images: any[];
  include_members_later: boolean;
  is_edited: boolean;
  is_guest: boolean;
  is_paid: boolean;
  is_pending: boolean;
  is_private: boolean;
  is_private_member: boolean;
  is_secret: boolean;
  is_tagged: boolean;
  member: Member;
  mute_status: boolean;
  online_link_enable_before: number;
  online_link_type: null;
  pdf: any[];
  pdf_count: number;
  polls_count: number;
  reactions: any[];
  secret_chatroom_left: boolean;
  share_link: string;
  state: number;
  title: string;
  type: number;
  video_count: number;
  videos: any[];
}

export interface Member {
  custom_intro_text: string;
  custom_title: string;
  id: number;
  image_url: string;
  is_guest: boolean;
  is_owner: boolean;
  member_since: string;
  member_since_epoch: number;
  name: string;
  organisation_name: null;
  route: string;
  sdk_client_info: SdkClientInfo;
  state: number;
  updated_at: number;
  user_unique_id: string;
  uuid: string;
}

export interface SdkClientInfo {
  community: number;
  user: number;
  user_unique_id: string;
  uuid: string;
  widget_id: string;
}

export interface Attachment {
  height?: number;
  index: number;
  meta: {
    size: number;
    duration?: number;
  };
  name: string;
  type: string;
  url: string;
  width?: number;
}

export interface Conversation {
  answer: string;
  attachment_count: number;
  attachments: Attachment[];
  attachments_uploaded: boolean;
  audios: any[];
  chatroom_id: number;
  community_id: number;
  created_at: number;
  created_epoch: number;
  date: string;
  has_files: boolean;
  id: number;
  images: Image[];
  is_edited: boolean;
  member: Member;
  pdf: any[];
  reactions: any[];
  state: number;
  temporary_id?: string;
  videos: any[];
  widget_id: string;
}

export interface Image {
  height: number;
  image_url: string;
  index: number;
  meta: {
    size: number;
  };
  name: string;
  type: string;
  width: number;
}

export interface Community {
  auto_approval: boolean;
  branding: Branding;
  community_setting_rights: CommunitySettingRight[];
  fee_event: number;
  fee_membership: number;
  fee_payment_pages: number;
  grace_period: number;
  hide_dm_tab: boolean;
  id: number;
  image_url: string;
  is_discoverable: boolean;
  is_freemium_community: boolean;
  is_paid: boolean;
  is_whitelabel: boolean;
  members_count: number;
  name: string;
  purpose: string;
  referral_enabled: boolean;
  sub_type: number;
  type: number;
  updated_at: number;
}

export interface Branding {
  advanced: {
    buttons_icons_colour: string;
    header_colour: string;
    text_links_colour: string;
  };
  basic: {
    primary_colour: string;
  };
}

export interface CommunitySettingRight {
  id: number;
  is_locked: boolean;
  is_selected: boolean;
  state: number;
  title: string;
  sub_title?: string;
}

export interface ConversationUser {
  id: number;
  image_url: string;
  name: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ChatRequestCreatedBy {
  custom_title: string;
  id: number;
  image_url: string;
  is_guest: boolean;
  is_owner: boolean;
  member_since: string;
  member_since_epoch: number;
  name: string;
  organisation_name: null | string;
  route: string;
  sdk_client_info: SDKClientInfo;
  state: number;
  updated_at: number;
  user_unique_id: string;
  uuid: string;
}

interface SDKClientInfo {
  community: number;
  user: number;
  user_unique_id: string;
  uuid: string;
  widget_id: string;
}

interface Chatroom {
  access: null | string;
  answer_text: string;
  answers_count: number;
  attachment_count: number;
  attachments: any[];
  attachments_uploaded: boolean;
  attending_count: number;
  attending_status: boolean;
  audio_count: number;
  audios: any[];
  auto_follow_done: boolean;
  card_creation_time: string;
  chatroom_with_user: ChatRequestCreatedBy;
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
  member: ChatRequestCreatedBy;
  mute_status: boolean;
  online_link_enable_before: number;
  online_link_type: null | string;
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
  topic_id: any;
}

interface Community {
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

interface Branding {
  advanced: AdvancedBranding;
  basic: BasicBranding;
}

interface AdvancedBranding {
  buttons_icons_colour: string;
  header_colour: string;
  text_links_colour: string;
}

interface BasicBranding {
  primary_colour: string;
}

interface CommunitySettingRight {
  id: number;
  is_locked: boolean;
  is_selected: boolean;
  state: number;
  title: string;
  sub_title?: string;
}

interface LastConversation {
  answer: string;
  attachment_count: number;
  attachments_uploaded: boolean;
  chatroom_id: number;
  community_id: number;
  created_at: number;
  created_epoch: number;
  date: string;
  has_files: boolean;
  id: number;
  is_edited: boolean;
  member: ChatRequestCreatedBy;
  reactions: any[];
  state: number;
  temporary_id: string;
  widget_id: string;
}

export interface DMChannel {
  chat_request_created_at: number;
  chat_request_state: number;
  chat_requested_by: ChatRequestCreatedBy[];
  chatroom: Chatroom;
  community: Community;
  custom_tag: string;
  is_draft: boolean;
  is_private_member: boolean;
  last_conversation: LastConversation;
  last_conversation_time: string;
  member_right_states: number[];
  member_state: number;
  unseen_conversation_count: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Profile {
  name: string;
}

interface SDKClientInfo {
  community: number;
  user: number;
  user_unique_id: string;
  uuid: string;
  widget_id: string;
}

interface Member {
  id: number;
  image_url: string;
  is_guest: boolean;
  name: string;
  organisation_name: null | string;
  profile: Profile;
  sdk_client_info: SDKClientInfo;
  updated_at: number;
  user_unique_id: string;
  uuid: string;
}

interface Chatroom {
  attachment_count: number;
  attachments_uploaded: boolean;
  audio_count: number;
  chatroom_id_string: string;
  chatroom_image_url: string;
  chatroom_with_user: null;
  created_at: number;
  date: string;
  device_id: string;
  header: string;
  id: number;
  image_count: number;
  is_deleted: boolean;
  is_pending: boolean;
  is_pinned: boolean;
  is_private: boolean;
  is_secret: boolean;
  member: Member;
  participants_count: number;
  pdf_count: number;
  platform: string;
  title: string;
  type: number;
  video_count: number;
}

interface Community {
  id: number;
  name: string;
}

export interface SearchedChatroom {
  attachments: any[];
  attending_status: boolean;
  chatroom: Chatroom;
  community: Community;
  follow_status: boolean;
  id: number;
  is_guest: boolean;
  is_tagged: boolean;
  member: Member;
  mute_status: boolean;
  secret_chatroom_left: boolean;
  state: number;
  updated_at: number;
}

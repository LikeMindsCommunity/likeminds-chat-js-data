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
  chatroom_image_url: string;
  created_at: number;
  device_id: string;
  header: string;
  id: number;
  image_count: number;
  is_deleted: boolean;
  is_pending: boolean;
  is_pinned: boolean;
  is_secret: boolean;
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

export interface SearchedConversation {
  answer: string;
  attachment_count: number;
  attachments: any[];
  attachments_uploaded: boolean;
  chatroom: Chatroom;
  community: Community;
  created_at: number;
  id: number;
  is_deleted: boolean;
  is_edited: boolean;
  last_updated: number;
  member: Member;
  state: number;
}

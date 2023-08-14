import { MemberAction } from "./MemberAction";
import { Question } from "./Questions";
import { SDKClientInfo } from "./SDKClientInfo";

export interface Member {
  id: string;
  userUniqueId: string;
  name: string;
  imageUrl?: string | null;
  questionAnswers?: Question[] | null;
  state?: number | null;
  isGuest: boolean;
  customIntroText?: string | null;
  customClickText?: string | null;
  memberSince?: string | null;
  communityName?: string | null;
  isOwner: boolean;
  customTitle?: string | null;
  menu?: MemberAction[] | null;
  communityId?: number | null;
  chatroomId?: number | null;
  route?: string | null;
  attendingStatus?: boolean | null;
  hasProfileImage?: boolean | null;
  updatedAt?: number | null;
  sdkClientInfo?: SDKClientInfo | null;
  uuid: string;
}

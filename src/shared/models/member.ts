export default interface Member {
  customTitle: string;
  id: number;
  imageUrl: string;
  isGuest: boolean;
  isOwner: boolean;
  memberSince: string;
  memberSinceEpoch: number;
  name: string;
  organisationName: string | null;
  route: string;
  sdkClientInfo: SdkClientInfo;
  state: number;
  updatedAt: number;
  userUniqueId: string;
  uuid: string;
  memberRights: MemberRight[];
}
interface MemberRight {
  id: number;
  is_locked: boolean;
  is_selected: boolean;
  state: number;
  title: string;
  sub_title?: string;
}

export interface SdkClientInfo {
  community: number;
  user: number;
  userUniqueId: string;
  uuid: string;
  widgetId: string;
}

import { SDKClientInfo } from "./SDKClientInfo";

export interface User {
  id: string;
  imageUrl: string;
  isGuest: boolean;
  name: string;
  organisation_name: string | null;
  sdkClientInfo: SDKClientInfo | null;
  isDeleted?: boolean | null;
  customTitle?: string | null;
  updatedAt?: number | null;
  userUniqueId: string;
  uuid: string;
  isOwner?: boolean | null;
}
